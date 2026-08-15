import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";
import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";
import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {GroupeActivityDTO} from "@/app/domains/groupes/dto/groupe-activity.dto";
import {GroupesFeminisationDTO} from "@/app/domains/groupes/dto/groupes-feminisation.dto";

export interface IGroupesGateways {
    getGroupesCards(legislature: number): Promise<GroupeCardDTO[]>;

    getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosDTO>;

    getGroupeLegislatures(code: string): Promise<number[]>;

    getGroupeMembers(code:string, legislature: number): Promise<GroupeMembersDTO[]>;

    getGroupeComposition(code: string, legislature: number): Promise<GroupeCompositionDTO>;

    getGroupeCohesion(code: string, legislature: number): Promise<GroupeCohesionDTO>;

    getGroupeComportement(code: string, legislature: number): Promise<GroupeComportementDTO>;

    getGroupeActivityCalendar(code: string, legislature: number): Promise<GroupeActivityDTO>;

    getGroupeActivityCalendarDetails(code: string, legislature: number, date: string): Promise<GroupeActivityDetailsDTO[]>

    getGroupesFeminisation(legislature: number): Promise<GroupesFeminisationDTO>;
}