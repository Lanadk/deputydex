import {GroupeCardEntity} from "@/app/domains/groupes/entities/groupe-card.entity";

export interface IGroupesCardsRepository {
    getGroupesCards(legislature: number): Promise<GroupeCardEntity[]>;
}