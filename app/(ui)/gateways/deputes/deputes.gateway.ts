import {IDeputesGateways} from "@/app/domains/deputes/gateways/IDeputesGateways";
import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";

export const deputesGateway: IDeputesGateways = {
    async getDeputesCards(legislature: number): Promise<DeputesCardDTO[]> {
        const res = await fetch(`/api/deputes/cards/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get deputes cards");
        }

        return res.json();
    },
}