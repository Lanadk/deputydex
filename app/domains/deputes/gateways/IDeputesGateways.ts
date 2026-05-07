import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";

export interface IDeputesGateways {
    getDeputesCards(legislature: number): Promise<DeputesCardDTO[]>;
}