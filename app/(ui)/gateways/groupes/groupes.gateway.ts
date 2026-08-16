import {IGroupesGateways} from "@/app/domains/groupes/gateways/IGroupes.gateways";
import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";
import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";
import {GroupeActivityDTO} from "@/app/domains/groupes/dto/groupe-activity.dto";
import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {GroupesFeminisationDTO} from "@/app/domains/groupes/dto/groupes-feminisation.dto";
import {GroupesAgeDTO} from "@/app/domains/groupes/dto/groupes-age.dto";
import {GroupeListDTO} from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";

export const groupesGateways: IGroupesGateways = {
    async getGroupesCards(legislature: number): Promise<GroupeCardDTO[]> {
        const res = await fetch(`/api/groupes/cards/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupes cards");
        }

        return res.json();
    },

    async getGroupesList(legislature: number): Promise<GroupeListDTO> {
        const res = await fetch(`/api/groupes/list/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupes list");
        }

        return res.json();
    },

    async getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosDTO> {
        const res = await fetch(`/api/groupes/infos/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    },

    async getGroupeLegislatures(code: string): Promise<number[]> {
        const res = await fetch(`/api/groupes/legislatures/${code}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe legislatures");
        }

        return res.json();
    },

    async getGroupeMembers(code:string, legislature: number): Promise<GroupeMembersDTO[]> {
        const res = await fetch(`/api/groupes/members/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    },

    async getGroupeComposition(code: string, legislature: number): Promise<GroupeCompositionDTO> {
        const res = await fetch(`/api/groupes/composition/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    },

    async getGroupeCohesion(code: string, legislature: number): Promise<GroupeCohesionDTO> {
        const res = await fetch(`/api/groupes/cohesion/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    },

    async getGroupeComportement(code: string, legislature: number): Promise<GroupeComportementDTO> {
        const res = await fetch(`/api/groupes/comportement/${code}/${legislature}`);

        if (!res.ok) {
            throw new Error("Failed to get groupe infos");
        }

        return res.json();
    },

    async getGroupeActivityCalendar(code: string, legislature: number): Promise<GroupeActivityDTO> {
        const res = await fetch(`/api/groupes/activity/${code}/${legislature}`);

        if (!res.ok) throw new Error("Failed to get activity");

        return res.json();
    },

    async getGroupeActivityCalendarDetails(code: string, legislature: number, date: string): Promise<GroupeActivityDetailsDTO[]> {
        const res = await fetch(`/api/groupes/activity/${code}/${legislature}/details?date=${date}`);

        if (!res.ok) throw new Error("Failed to get activity");

        return res.json();
    },

    async getGroupesFeminisation(legislature: number): Promise<GroupesFeminisationDTO> {
        const res = await fetch(`/api/groupes/feminisation/${legislature}`);

        if (!res.ok) throw new Error("Failed to get groupes feminisation");

        return res.json();
    },

    async getGroupesAge(legislature: number): Promise<GroupesAgeDTO> {
        const res = await fetch(`/api/groupes/age/${legislature}`);

        if (!res.ok) throw new Error("Failed to get groupes age");

        return res.json();
    }
};