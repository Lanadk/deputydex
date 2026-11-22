import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { Prisma } from "@/app/infrastructure/db/generated/prisma";
import { ILegislatureOrganisationRepository } from "@/app/domains/legislatures/repositories/ILegislatureOrganisationRepository";
import {
    EntreeEnCoursRow,
    EvenementInstitutionnelRow,
    FonctionAssembleeRow,
    LegislatureChiffresRow,
    LegislaturePeriodeRow,
    MandatPresidentielRow,
    MembreGouvernementRow,
    PremierMinistreRow,
    PresidentAssembleeRow,
} from "@/app/domains/legislatures/entities/legislature-organisation.entity";

/*
 * Organisation institutionnelle lue dans `mandats` (types d'organe MINISTERE,
 * BUREAU, GP, COMPER, ASSEMBLEE). Dates formatées en SQL (AAAA-MM-JJ) : aucune
 * conversion de fuseau horaire entre Postgres et le navigateur.
 * L'ordre des lignes n'a pas d'importance : les use-cases trient.
 */

/**
 * Photo de la personne du mandat `m` : sa photo de député la plus récente, sinon
 * son portrait du référentiel `ref_portraits` (personnalités non députées).
 */
const PHOTO = Prisma.sql`
    LEFT JOIN LATERAL (
        SELECT NULLIF(photo_path, 'null') AS photo_path
        FROM ref_acteurs_photos
        WHERE acteur_uid = m.acteur_uid
        ORDER BY legislature DESC
        LIMIT 1
    ) rap ON true
    LEFT JOIN ref_portraits rp ON rp.acteur_uid = m.acteur_uid AND rap.photo_path IS NULL`;

/** Colonnes de photo (cf. PhotoRow) : le crédit n'est renseigné que pour un portrait du référentiel. */
const PHOTO_COLONNES = Prisma.sql`
    COALESCE(rap.photo_path, rp.photo_path) AS photo_path,
    rp.auteur AS photo_auteur, rp.licence AS photo_licence, rp.licence_url AS photo_licence_url`;

/**
 * Groupe politique de la personne du mandat `m` à la date `date` : son groupe
 * à cette date, sinon le dernier avant (un ministre ancien député garde le
 * groupe qu'il avait en entrant au gouvernement).
 */
const appartenance = (date: Prisma.Sql) => Prisma.sql`
    LEFT JOIN LATERAL (
        SELECT rg.code, rg.libelle
        FROM acteurs_groupes ag
        JOIN ref_groupes rg ON rg.groupe_id = ag.groupe_id AND rg.groupe_legislature = ag.groupe_legislature
        WHERE ag.acteur_uid = m.acteur_uid AND ag.date_debut <= ${date}
        ORDER BY (ag.date_fin IS NULL OR ag.date_fin >= ${date}) DESC, ag.date_debut DESC
        LIMIT 1
    ) grp ON true`;

const IDENTITE = Prisma.sql`${PHOTO_COLONNES}, grp.code AS appartenance_code, grp.libelle AS appartenance_libelle`;
export const prismaLegislatureOrganisationRepository: ILegislatureOrganisationRepository = {
    async getLegislatures(): Promise<LegislaturePeriodeRow[]> {
        return prisma.$queryRaw<LegislaturePeriodeRow[]>`
            SELECT number,
                   to_char(start_date, 'YYYY-MM-DD') AS debut,
                   to_char(end_date, 'YYYY-MM-DD')   AS fin
            FROM param_legislatures
            WHERE start_date IS NOT NULL
        `;
    },

    async getPremiersMinistres(): Promise<PremierMinistreRow[]> {
        // Un mandat de Premier ministre par gouvernement, chronologique (nécessaire pour numéroter « Lecornu I / II »).
        return prisma.$queryRaw<PremierMinistreRow[]>`
            SELECT m.acteur_uid, a.prenom, a.nom,
                   to_char(m.date_debut, 'YYYY-MM-DD') AS debut,
                   to_char(m.date_fin, 'YYYY-MM-DD')   AS fin,
                   ${IDENTITE}
            FROM mandats m
            JOIN acteurs a ON a.uid = m.acteur_uid
            ${PHOTO}
            ${appartenance(Prisma.sql`m.date_debut`)}
            WHERE m.type_organe = 'MINISTERE' AND m.code_qualite = 'Premier ministre'
            ORDER BY m.date_debut
        `;
    },

    async getPresidentsAssemblee(): Promise<PresidentAssembleeRow[]> {
        return prisma.$queryRaw<PresidentAssembleeRow[]>`
            SELECT m.legislature, m.acteur_uid, a.prenom, a.nom,
                   to_char(m.date_debut, 'YYYY-MM-DD') AS debut,
                   to_char(m.date_fin, 'YYYY-MM-DD')   AS fin
            FROM mandats m
            JOIN acteurs a ON a.uid = m.acteur_uid
            WHERE m.type_organe = 'BUREAU' AND m.code_qualite = 'Président'
        `;
    },

    async getMembresGouvernement(debut: string, fin: string): Promise<MembreGouvernementRow[]> {
        return prisma.$queryRaw<MembreGouvernementRow[]>`
            SELECT m.acteur_uid, a.prenom, a.nom, m.code_qualite, m.lib_qualite,
                   to_char(m.date_debut, 'YYYY-MM-DD') AS debut,
                   to_char(m.date_fin, 'YYYY-MM-DD')   AS fin,
                   EXISTS (
                       SELECT 1 FROM mandats d
                       WHERE d.acteur_uid = m.acteur_uid AND d.type_organe = 'ASSEMBLEE'
                   ) AS est_depute,
                   ${IDENTITE}
            FROM mandats m
            JOIN acteurs a ON a.uid = m.acteur_uid
            ${PHOTO}
            ${appartenance(Prisma.sql`m.date_debut`)}
            WHERE m.type_organe = 'MINISTERE'
              AND m.date_debut BETWEEN ${debut}::date AND ${fin}::date
        `;
    },

    async getFonctionsAssemblee(legislature: number, dateReference: string): Promise<FonctionAssembleeRow[]> {
        return prisma.$queryRaw<FonctionAssembleeRow[]>`
            SELECT m.acteur_uid, a.prenom, a.nom, m.type_organe, m.code_qualite, m.organe_uid,
                   rg.code AS groupe_code, rg.libelle AS groupe_libelle,
                   ${IDENTITE}
            FROM mandats m
            JOIN acteurs a ON a.uid = m.acteur_uid
            LEFT JOIN ref_groupes rg ON rg.groupe_id = m.organe_uid AND rg.groupe_legislature = m.legislature
            ${PHOTO}
            ${appartenance(Prisma.sql`${dateReference}::date`)}
            WHERE m.legislature = ${legislature}
              AND (m.type_organe = 'BUREAU' OR (m.type_organe IN ('GP', 'COMPER') AND m.code_qualite = 'Président'))
              AND m.date_debut <= ${dateReference}::date
              AND (m.date_fin IS NULL OR m.date_fin >= ${dateReference}::date)
        `;
    },

    async getChiffres(legislature: number): Promise<LegislatureChiffresRow | null> {
        const rows = await prisma.$queryRaw<LegislatureChiffresRow[]>`
            SELECT (SELECT count(*) FROM scrutins WHERE legislature = ${String(legislature)})::int AS scrutins,
                   (SELECT count(DISTINCT acteur_uid) FROM mandats
                    WHERE type_organe = 'ASSEMBLEE' AND legislature = ${legislature})::int AS deputes_ayant_siege
        `;
        return rows[0] ?? null;
    },

    async getEntreesEnCours(legislature: number): Promise<EntreeEnCoursRow[]> {
        return prisma.$queryRaw<EntreeEnCoursRow[]>`
            SELECT election_cause_mandat AS cause, count(*)::int AS nombre
            FROM mandats
            WHERE type_organe = 'ASSEMBLEE' AND legislature = ${legislature}
              AND election_cause_mandat IS NOT NULL
              AND election_cause_mandat <> 'élections générales'
            GROUP BY election_cause_mandat
        `;
    },

    async getMandatsPresidentiels(): Promise<MandatPresidentielRow[]> {
        return prisma.$queryRaw<MandatPresidentielRow[]>`
            SELECT mp.president, mp.mandat_numero,
                   to_char(mp.debut, 'YYYY-MM-DD') AS debut,
                   to_char(mp.fin, 'YYYY-MM-DD')   AS fin,
                   rp.photo_path, rp.auteur AS photo_auteur, rp.licence AS photo_licence, rp.licence_url AS photo_licence_url
            FROM ref_mandats_presidentiels mp
            LEFT JOIN ref_portraits rp ON rp.slug = mp.portrait_slug
            ORDER BY mp.debut
        `;
    },

    async getEvenementsInstitutionnels(): Promise<EvenementInstitutionnelRow[]> {
        return prisma.$queryRaw<EvenementInstitutionnelRow[]>`
            SELECT to_char(date, 'YYYY-MM-DD') AS date, type, libelle
            FROM ref_evenements_institutionnels
            ORDER BY date
        `;
    },
};
