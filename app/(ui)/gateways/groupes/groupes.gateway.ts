import {IGroupesGateways} from "@/app/domains/groupes/gateways/IGroupes.gateways";
import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";

export const groupesGateways: IGroupesGateways = {
    async getGroupesCards(legislature: number): Promise<GroupeCardDTO[]> {
        const res = await fetch(`/api/groupes/cards/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupes cards");
        }

        return res.json();
    }
};