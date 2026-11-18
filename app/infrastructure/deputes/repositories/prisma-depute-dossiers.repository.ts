"server-only";

import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeDossiersRepository: IDeputeDossiersRepository = {
    async getDeputeDossierContributions(uid: string, legislature: number): Promise<DeputeDossierContributionEntity[]> {
        // Ordre « Implication » (le tri par défaut de l'onglet s'appuie dessus) :
        // auteur ou rapporteur, puis amendements déposés, puis co-signatures.
        return prisma.$queryRaw<DeputeDossierContributionEntity[]>`
            SELECT
                dossier_uid,
                dossier_titre,
                dossier_legislature,
                procedure_libelle,
                nb_deposes,
                nb_adoptes,
                nb_cosignes,
                is_auteur_texte,
                is_cosignataire_texte,
                rapporteurs,
                derniere_activite
            FROM agg_deputes_dossiers_contributions
            WHERE depute_uid = ${uid}
              AND legislature = ${legislature}
            ORDER BY
                (is_auteur_texte OR jsonb_array_length(rapporteurs) > 0) DESC,
                nb_deposes DESC,
                is_cosignataire_texte DESC,
                nb_cosignes DESC,
                derniere_activite DESC NULLS LAST
        `;
    },

    async getDeputeDossierAmendements(uid: string, legislature: number, dossierUid: string): Promise<DeputeDossierAmendementEntity[]> {
        // Groupés par texte (dans l'ordre de dépôt des textes), puis du plus récent au plus ancien.
        return prisma.$queryRaw<DeputeDossierAmendementEntity[]>`
            SELECT
                a.uid,
                a.legislature_snapshot,
                a.numero_long,
                a.division_titre,
                a.sort,
                a.etat_libelle,
                a.date_depot,
                a.expose_sommaire,
                d.uid           AS texte_uid,
                c.type_libelle  AS texte_type,
                d.num_notice    AS texte_numero,
                etape.code      AS texte_etape
            FROM amendements a
            JOIN documents_parlementaires d
                ON d.uid = a.texte_leg_ref
            LEFT JOIN documents_classifications c
                ON c.document_uid = d.uid
            LEFT JOIN LATERAL (
                SELECT split_part(al.code_acte, '-', 1) AS code
                FROM acte_texte_associe ta
                JOIN acte_legislatif al ON al.uid = ta.acte_uid
                WHERE ta.reference_texte = d.uid
                ORDER BY al.date_acte NULLS LAST
                LIMIT 1
            ) etape ON TRUE
            WHERE a.acteur_uid = ${uid}
              AND a.legislature_snapshot = ${legislature}
              AND d.dossier_ref = ${dossierUid}
            ORDER BY d.date_depot NULLS LAST, d.uid, a.date_depot DESC NULLS LAST, a.uid DESC
        `;
    },
};
