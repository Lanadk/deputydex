import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";

export interface IGroupesGateways {
    getGroupesCards(legislature: number): Promise<GroupeCardDTO[]>;

    getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosDTO>;
}