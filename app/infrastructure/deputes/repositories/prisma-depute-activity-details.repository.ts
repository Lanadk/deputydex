"server-only";

import { IDeputeActivityDetailsRepository } from "@/app/domains/deputes/repositories/IDeputeActivityDetailsRepository";
import { DeputeActivityDetailsEntity } from "@/app/domains/deputes/entities/depute-activity-details.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeActivityDetailsRepository: IDeputeActivityDetailsRepository = {
    async getDeputeActivityDetails(
        uid: string,
        legislature: number,
        date: Date
    ): Promise<DeputeActivityDetailsEntity[]> {
        try {
            return await prisma.$queryRaw<DeputeActivityDetailsEntity[]>`
                SELECT
                    acd.activity_date,
                    acd.domain,
                    acd.ref_id,
                    CASE
                        WHEN acd.domain IN ('amendement', 'amendement_co')
                            THEN acd.meta || jsonb_build_object('titre', am.division_titre)
                        ELSE acd.meta
                    END AS meta,
                    s.numero                AS scrutin_numero,
                    dp.uid                  AS dossier_uid,
                    dp.titre                AS dossier_titre,
                    dp.legislature::int     AS dossier_legislature
                FROM agg_activity_calendar_details_mv acd
                LEFT JOIN public.amendements am
                    ON am.uid = acd.ref_id
                   AND acd.domain IN ('amendement', 'amendement_co')
                LEFT JOIN documents_parlementaires d
                    ON d.uid = am.texte_leg_ref
                LEFT JOIN scrutins s
                    ON s.uid = acd.ref_id
                   AND acd.domain IN ('vote', 'scrutin')
                -- un scrutin n'est rattaché à son dossier que dans ~3 % des cas (acte_vote)
                LEFT JOIN LATERAL (
                    SELECT al.dossier_uid
                    FROM acte_vote av
                    JOIN acte_legislatif al ON al.uid = av.acte_uid
                    WHERE av.vote_ref = s.uid
                    LIMIT 1
                ) sd ON true
                LEFT JOIN dossier_parlementaire dp
                    ON dp.uid = COALESCE(d.dossier_ref, sd.dossier_uid)
                WHERE acd.entity_type = 'depute'
                  AND acd.entity_id = ${uid}
                  AND acd.legislature = ${legislature}
                  AND acd.activity_date = ${date}
                ORDER BY acd.domain ASC
            `;
        } catch (error) {
            console.error("Error fetching depute activity details:", error);
            throw new Error("Failed to fetch depute activity details");
        }
    },
};
