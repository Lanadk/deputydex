import {IGroupesGateways} from "@/app/domains/groupes/gateways/IGroupes.gateways";
import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";

export const groupesGateways: IGroupesGateways = {
    async getGroupesCards(legislature: number): Promise<GroupeCardDTO[]> {
        const res = await fetch(`/api/groupes/cards/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupes cards");
        }

        return res.json();
    },

    async getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosDTO> {
        const res = await fetch(`/api/groupes/infos/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    }
};