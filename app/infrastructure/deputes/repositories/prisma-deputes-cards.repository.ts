import {IDeputesCardsRepository} from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import {DeputesCardEntity} from "@/app/domains/deputes/entities/deputes-cards.entity";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputesCardsRepository: IDeputesCardsRepository = {
    async getDeputeCards(legislature: number): Promise<DeputesCardEntity[]> {
        try {
            return await prisma.$queryRaw<DeputesCardEntity[]>`
                SELECT
                    depute_uid,
                    depute_full_name,
                    depute_groupe_code,
                    depute_image,
                    depute_role
                FROM agg_deputes_cards
                WHERE legislature = ${legislature}
                ORDER BY depute_groupe_code ASC, depute_full_name ASC
            `;
        } catch (error) {
            console.error("Error fetching deputes cards:", error);
            throw new Error("Failed to fetch deputes cards");
        }
    }
};