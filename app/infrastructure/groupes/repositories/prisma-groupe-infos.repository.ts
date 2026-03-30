import {IGroupeInfosRepository} from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

export type GroupeInfosRow = {
        groupe_label: string;
        groupe_code: string;
        groupe_position: 'Droite' | 'Centre' | 'Gauche';
        groupe_count_members: number;
        groupe_rank: number;
        groupe_year_of_creation: string;
        groupe_web_site: string;
        groupe_president_full_name: string;
        groupe_label_type_sex: string;
        groupe_seats_share_percent: number;
}

export const  prismaGroupeInfosRepository: IGroupeInfosRepository = {

    async getGroupeInfos(code: string, legislature: number): Promise<any> {
        try {
            return await prisma.$queryRaw<GroupeInfosRow>`
                
            `;

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}