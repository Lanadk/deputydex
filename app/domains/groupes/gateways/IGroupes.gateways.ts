import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";

export interface IGroupesGateways {
    getGroupesCards(legislature?: number): Promise<GroupeCardDTO[]>;
}