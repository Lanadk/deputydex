import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { Prisma } from "@/app/infrastructure/db/generated/prisma";
import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import {
    AssembleePresenceJourRow,
    AssembleePresenceJourSemaineRow,
    AssembleePresenceLegislatureRow,
    AssembleePresenceMoisRow,
    DeputePresenceLegislatureRow,
    DeputePresenceMoisRow,
    GroupePresenceAnneeRow,
    GroupePresenceMoisRow,
    GroupePresenceRow,
    PresenceAnneeRow,
    PresenceTypePeriode,
} from "@/app/domains/presence/entities/presence-stats.entity";

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

export const prismaPresenceStatsRepository: IPresenceStatsRepository = {
    async getDeputeParLegislature(acteurUid: string): Promise<DeputePresenceLegislatureRow[]> {
        return prisma.$queryRaw<DeputePresenceLegislatureRow[]>`
            SELECT legislature,
                   taux_presence::float, taux_presence_seance::float, taux_presence_commission::float,
                   taux_participation_scrutins::float,
                   jours_presence, jours_vote, jours_debat, jours_commission,
                   jours_presence_par_mois::float
            FROM agg_deputes_presence
            WHERE acteur_uid = ${acteurUid}
        `;
    },

    async getDeputeMensuelle(acteurUid: string): Promise<DeputePresenceMoisRow[]> {
        return prisma.$queryRaw<DeputePresenceMoisRow[]>`
            SELECT legislature, mois, taux_presence::float, jours_presence
            FROM agg_deputes_presence_mensuelle
            WHERE acteur_uid = ${acteurUid}
        `;
    },

    async getDeputeAnnuelle(acteurUid: string, type: PresenceTypePeriode): Promise<PresenceAnneeRow[]> {
        return prisma.$queryRaw<PresenceAnneeRow[]>`
            SELECT legislature, periode, jours_presence_par_mois::float, taux_presence::float
            FROM agg_deputes_presence_annuelle
            WHERE acteur_uid = ${acteurUid}
              AND type_periode = ${type}
        `;
    },

    async getGroupes(legislature: number): Promise<GroupePresenceRow[]> {
        return prisma.$queryRaw<GroupePresenceRow[]>`
            SELECT rg.code AS groupe_code, rg.libelle AS groupe_label,
                   g.taux_presence::float, g.jours_presence_par_mois::float
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

    async getAssemblee(legislature?: number): Promise<AssembleePresenceLegislatureRow[]> {
        return prisma.$queryRaw<AssembleePresenceLegislatureRow[]>`
            SELECT legislature,
                   taux_presence::float, taux_presence_seance::float, taux_presence_commission::float,
                   taux_excuses_commission::float, taux_participation_scrutins::float,
                   jours_presence_par_mois::float, effectif_moyen::float
            FROM agg_assemblee_presence
            WHERE TRUE ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getAssembleeMensuelle(legislature?: number): Promise<AssembleePresenceMoisRow[]> {
        return prisma.$queryRaw<AssembleePresenceMoisRow[]>`
            SELECT legislature, mois, taux_presence::float, jours_presence_par_depute::float
            FROM agg_assemblee_presence_mensuelle
            WHERE TRUE ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getAssembleeAnnuelle(type: Exclude<PresenceTypePeriode, "mandat">, legislature?: number): Promise<PresenceAnneeRow[]> {
        return prisma.$queryRaw<PresenceAnneeRow[]>`
            SELECT legislature, periode, jours_presence_par_mois::float, taux_presence::float
            FROM agg_assemblee_presence_annuelle
            WHERE type_periode = ${type}
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getAssembleeJournaliere(legislature?: number): Promise<AssembleePresenceJourRow[]> {
        // Séances observables seulement : les jours de commission seule
        // n'attendent qu'une poignée de députés, leur taux n'est pas comparable.
        return prisma.$queryRaw<AssembleePresenceJourRow[]>`
            SELECT jour, taux_presence_seance::float
            FROM agg_assemblee_presence_jour
            WHERE seance_observable
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },

    async getAssembleeJourSemaine(legislature?: number): Promise<AssembleePresenceJourSemaineRow[]> {
        return prisma.$queryRaw<AssembleePresenceJourSemaineRow[]>`
            SELECT legislature, jour_semaine, taux_presence::float
            FROM agg_assemblee_presence_jour_semaine
            WHERE jours > 0
              ${legislatureFiltre(Prisma.sql`legislature`, legislature)}
        `;
    },
};
