import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { Prisma } from "@/app/infrastructure/db/generated/prisma";
import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import {
    AssembleePresenceJourRow,
    AssembleePresenceJourSemaineRow,
    AssembleePresenceLegislatureRow,
    AssembleePresenceMoisRow,
    DebutLegislatureRow,
    DeputeDebutMandatRow,
    DeputePresenceLegislatureRow,
    DeputePresenceMoisRow,
    GroupePresenceAnneeRow,
    GroupePresenceMoisRow,
    GroupePresenceRow,
    PresenceAnneeRow,
    PresenceTypePeriode,
} from "@/app/domains/presence/entities/presence-stats.entity";
import { PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";

/**
 * Lookups sur les vues de présence de deputydex-data (`agg_*_presence*`). Les
 * taux sont des NUMERIC Postgres : `::float`, sinon `$queryRaw` les renvoie en
 * string (voir prisma-groupes-stats.repository.ts). L'ordre d'affichage est
 * fixé par les use-cases, pas ici.
 *
 * Groupes : code et libellé via `ref_groupes` (même législature). Le groupe
 * fantôme « toBeDefined » (code TBD) est exclu partout ; « Non inscrits » est
 * exclu du classement (pas un groupe politique, et tous les députés y passent
 * avant la formation des groupes) mais garde sa courbe mensuelle.
 */

const legislatureFiltre = (colonne: Prisma.Sql, legislature?: number) =>
    legislature == null ? Prisma.empty : Prisma.sql`AND ${colonne} = ${legislature}`;

/**
 * Vues de l'Assemblée, qui portent aussi des lignes legislature IS NULL
 * (toutes législatures) : absent → une ligne par législature (IS NOT NULL) ;
 * « toutes » → la ligne combinée (IS NULL) ; un numéro → cette législature.
 */
const perimetreFiltre = (perimetre?: PerimetreLegislature) =>
    perimetre == null
        ? Prisma.sql`AND legislature IS NOT NULL`
        : perimetre === TOUTES_LEGISLATURES
            ? Prisma.sql`AND legislature IS NULL`
            : Prisma.sql`AND legislature = ${perimetre}`;

export const prismaPresenceStatsRepository: IPresenceStatsRepository = {
    async getDeputeParLegislature(acteurUid: string, legislature?: number): Promise<DeputePresenceLegislatureRow[]> {
        return prisma.$queryRaw<DeputePresenceLegislatureRow[]>`
            SELECT legislature,
                   jours_attendus, jours_presents,
                   taux_presence::float, taux_presence_seance::float, taux_presence_commission::float,
                   taux_excuses_commission::float, taux_participation_scrutins::float,
                   jours_presence, jours_vote, jours_debat, jours_commission,
                   jours_presence_par_mois::float
            FROM agg_deputes_presence
            WHERE acteur_uid = ${acteurUid}
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getDeputeMensuelle(acteurUid: string, legislature?: number): Promise<DeputePresenceMoisRow[]> {
        return prisma.$queryRaw<DeputePresenceMoisRow[]>`
            SELECT legislature, mois, taux_presence::float, jours_presence
            FROM agg_deputes_presence_mensuelle
            WHERE acteur_uid = ${acteurUid}
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getDeputeAnnuelle(acteurUid: string, type: PresenceTypePeriode, legislature?: number): Promise<PresenceAnneeRow[]> {
        return prisma.$queryRaw<PresenceAnneeRow[]>`
            SELECT legislature, periode, jours_presence_par_mois::float, taux_presence::float
            FROM agg_deputes_presence_annuelle
            WHERE acteur_uid = ${acteurUid}
              AND type_periode = ${type}
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getDeputeDebutsMandat(acteurUid: string, legislature?: number): Promise<DeputeDebutMandatRow[]> {
        // « Année de mandat 1 » commence à la première prise de fonction du
        // député dans la législature (debut_mandat de mv_deputes_presence_jour).
        return prisma.$queryRaw<DeputeDebutMandatRow[]>`
            SELECT legislature, periode_debut AS debut_mandat
            FROM agg_deputes_presence_annuelle
            WHERE acteur_uid = ${acteurUid}
              AND type_periode = 'mandat'
              AND periode = '1'
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getGroupes(legislature: number): Promise<GroupePresenceRow[]> {
        return prisma.$queryRaw<GroupePresenceRow[]>`
            SELECT rg.code AS groupe_code, rg.libelle AS groupe_label,
                   g.taux_presence::float,
                   g.taux_presence_seance::float, g.taux_presence_commission::float,
                   g.taux_excuses_commission::float, g.taux_participation_scrutins::float,
                   g.jours_presence_par_mois::float
            FROM agg_groupes_presence g
            JOIN ref_groupes rg
                ON rg.groupe_id = g.groupe_uid
               AND rg.groupe_legislature = g.legislature
            WHERE g.legislature = ${legislature}
              AND rg.code <> 'TBD'
              AND rg.code NOT LIKE 'NI%'
        `;
    },

    async getGroupesMensuelle(legislature: number): Promise<GroupePresenceMoisRow[]> {
        return prisma.$queryRaw<GroupePresenceMoisRow[]>`
            SELECT rg.code AS groupe_code, rg.libelle AS groupe_label, g.mois, g.taux_presence::float
            FROM agg_groupes_presence_mensuelle g
            JOIN ref_groupes rg
                ON rg.groupe_id = g.groupe_uid
               AND rg.groupe_legislature = g.legislature
            WHERE g.legislature = ${legislature}
              AND rg.code <> 'TBD'
        `;
    },

    async getGroupeMensuelle(code: string, legislature: number): Promise<GroupePresenceMoisRow[]> {
        return prisma.$queryRaw<GroupePresenceMoisRow[]>`
            SELECT rg.code AS groupe_code, rg.libelle AS groupe_label, g.mois, g.taux_presence::float
            FROM agg_groupes_presence_mensuelle g
            JOIN ref_groupes rg
                ON rg.groupe_id = g.groupe_uid
               AND rg.groupe_legislature = g.legislature
            WHERE g.legislature = ${legislature}
              AND rg.code = ${code}
        `;
    },

    async getGroupesAnnuelle(legislature: number, type: Exclude<PresenceTypePeriode, "mandat">): Promise<GroupePresenceAnneeRow[]> {
        return prisma.$queryRaw<GroupePresenceAnneeRow[]>`
            SELECT rg.code AS groupe_code, g.periode, g.jours_presence_par_mois::float
            FROM agg_groupes_presence_annuelle g
            JOIN ref_groupes rg
                ON rg.groupe_id = g.groupe_uid
               AND rg.groupe_legislature = g.legislature
            WHERE g.legislature = ${legislature}
              AND g.type_periode = ${type}
              AND rg.code <> 'TBD'
              AND rg.code NOT LIKE 'NI%'
        `;
    },

    async getAssemblee(perimetre?: PerimetreLegislature): Promise<AssembleePresenceLegislatureRow[]> {
        return prisma.$queryRaw<AssembleePresenceLegislatureRow[]>`
            SELECT legislature,
                   taux_presence::float, taux_presence_seance::float, taux_presence_commission::float,
                   taux_excuses_commission::float, taux_participation_scrutins::float,
                   jours_presence_par_mois::float, effectif_moyen::float
            FROM agg_assemblee_presence
            WHERE TRUE ${perimetreFiltre(perimetre)}
        `;
    },

    async getAssembleeMensuelle(perimetre?: PerimetreLegislature): Promise<AssembleePresenceMoisRow[]> {
        return prisma.$queryRaw<AssembleePresenceMoisRow[]>`
            SELECT legislature, mois, taux_presence::float, jours_presence_par_depute::float
            FROM agg_assemblee_presence_mensuelle
            WHERE TRUE ${perimetreFiltre(perimetre)}
        `;
    },

    async getAssembleeAnnuelle(type: PresenceTypePeriode, perimetre?: PerimetreLegislature): Promise<PresenceAnneeRow[]> {
        return prisma.$queryRaw<PresenceAnneeRow[]>`
            SELECT legislature, periode, jours_presence_par_mois::float, taux_presence::float
            FROM agg_assemblee_presence_annuelle
            WHERE type_periode = ${type}
              ${perimetreFiltre(perimetre)}
        `;
    },

    async getAssembleeJournaliere(perimetre?: PerimetreLegislature): Promise<AssembleePresenceJourRow[]> {
        // Séances observables seulement : les jours de commission seule
        // n'attendent qu'une poignée de députés, leur taux n'est pas comparable.
        return prisma.$queryRaw<AssembleePresenceJourRow[]>`
            SELECT jour, taux_presence_seance::float, taux_presence::float, deputes_presents_total
            FROM agg_assemblee_presence_jour
            WHERE seance_observable
              ${perimetreFiltre(perimetre)}
        `;
    },

    async getAssembleeJourSemaine(perimetre?: PerimetreLegislature): Promise<AssembleePresenceJourSemaineRow[]> {
        return prisma.$queryRaw<AssembleePresenceJourSemaineRow[]>`
            SELECT legislature, jour_semaine, taux_presence::float
            FROM agg_assemblee_presence_jour_semaine
            WHERE jours > 0
              ${perimetreFiltre(perimetre)}
        `;
    },

    async getDebutsLegislatures(): Promise<DebutLegislatureRow[]> {
        return prisma.$queryRaw<DebutLegislatureRow[]>`
            SELECT number AS legislature, start_date AS debut
            FROM param_legislatures
            WHERE start_date IS NOT NULL
        `;
    },
};
