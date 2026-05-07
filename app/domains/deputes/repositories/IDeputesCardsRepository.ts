import {DeputesCardEntity} from "@/app/domains/deputes/entities/deputes-cards.entity";


export interface IDeputesCardsRepository {
    getDeputeCards(legislature: number): Promise<DeputesCardEntity[]>;
}