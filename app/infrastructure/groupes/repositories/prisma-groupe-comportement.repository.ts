import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeComportementRepository} from "@/app/domains/groupes/repositories/IGroupeComportementRepository";
import {GroupeComportementEntity} from "@/app/domains/groupes/entities/groupe-comportement.entity";

export type GroupeParticipationLegislatureRow = {
    mois: Date;
    taux_participation_moyen_deputes: number | null;
}

const prismaGroupeComportementRepository: IGroupeComportementRepository = {

    async getGroupeComportementLegislature(code: string, legislature: number): Promise<GroupeComportementEntity> {
        try {
            const participationLegislature = await prisma.$queryRaw<GroupeParticipationLegislatureRow[]>`
                SELECT mois, taux_participation_moyen_deputes
                FROM agg_groupes_stats_participation_mensuelle
                WHERE code = ${code}
                  AND legislature = ${legislature}
                ORDER BY mois ASC
            `;

            return { participationLegislature };

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}
export default prismaGroupeComportementRepository