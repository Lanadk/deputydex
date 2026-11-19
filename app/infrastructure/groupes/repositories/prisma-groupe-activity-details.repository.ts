import {GroupeActivityDetailsEntity} from "@/app/domains/groupes/entities/groupe-activity-details.entity";
import {IGroupeActivityDetailsRepository} from "@/app/domains/groupes/repositories/IGroupeActivityDetailsRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

export const prismaGroupeActivityDetailsRepository: IGroupeActivityDetailsRepository = {
    async getGroupeActivityDetails(
        code: string,
        legislature: number,
        date: string
    ): Promise<GroupeActivityDetailsEntity[]> {
        try {
            return await prisma.$queryRaw<GroupeActivityDetailsEntity[]>`
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
                JOIN ref_groupes rg
                    ON rg.groupe_id = acd.entity_id
                    AND rg.groupe_legislature = acd.legislature
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
                WHERE rg.code = ${code}
                  AND acd.entity_type = 'groupe'
                  AND acd.legislature = ${legislature}
                  AND acd.activity_date = ${new Date(date)}
                ORDER BY acd.activity_date ASC
            `;
        } catch (error) {
            console.error("Error fetching activity details:", error);
            throw new Error("Failed to fetch activity details");
        }
    }
};