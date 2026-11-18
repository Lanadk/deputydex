"server-only";

import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeDossiersRepository: IDeputeDossiersRepository = {
    async getDeputeDossierContributions(uid: string, legislature: number): Promise<DeputeDossierContributionEntity[]> {
        // Rôles forts (initiateur / rapporteur) d'abord, puis volume d'amendements.
        return prisma.$queryRaw<DeputeDossierContributionEntity[]>`
            SELECT
                dossier_uid,
                dossier_titre,
                dossier_legislature,
                procedure_libelle,
                nb_deposes,
                nb_adoptes,
                nb_cosignes,
                is_initiateur,
                roles_rapporteur,
                derniere_activite
            FROM agg_deputes_dossiers_contributions
            WHERE depute_uid = ${uid}
              AND legislature = ${legislature}
            ORDER BY
                (is_initiateur OR cardinality(roles_rapporteur) > 0) DESC,
                nb_deposes DESC,
                nb_cosignes DESC,
                derniere_activite DESC NULLS LAST
        `;
    },

    async getDeputeDossierAmendements(uid: string, legislature: number, dossierUid: string): Promise<DeputeDossierAmendementEntity[]> {
        return prisma.$queryRaw<DeputeDossierAmendementEntity[]>`
            SELECT
                a.uid,
                a.legislature_snapshot,
                a.numero_long,
                a.division_titre,
                a.sort,
                a.etat_libelle,
                a.date_depot,
                a.expose_sommaire
            FROM amendements a
            JOIN documents_parlementaires d
                ON d.uid = a.texte_leg_ref
            WHERE a.acteur_uid = ${uid}
              AND a.legislature_snapshot = ${legislature}
              AND d.dossier_ref = ${dossierUid}
            ORDER BY a.date_depot DESC NULLS LAST, a.uid DESC
        `;
    },
};
