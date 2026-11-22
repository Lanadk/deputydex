import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {ILegislaturesGateway} from "@/app/domains/legislatures/gateways/ILegislaturesGateway";
import {PresidenceAssembleeDTO} from "@/app/domains/legislatures/dto/presidence-assemblee.dto";
import {LegislaturesFriseDTO} from "@/app/domains/legislatures/dto/legislatures-frise.dto";
import {LegislatureOrganisationDTO} from "@/app/domains/legislatures/dto/legislature-organisation.dto";
import {LegislatureChiffresDTO} from "@/app/domains/legislatures/dto/legislature-chiffres.dto";


export const legislaturesGateway: ILegislaturesGateway = {
    async getCurrent(): Promise<LegislatureDTO | null> {
        const res = await fetch("/api/legislatures/current");
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get current legislature");
        return res.json() as Promise<LegislatureDTO>;
    },

    async getAll(): Promise<LegislatureDTO[]> {
        const res = await fetch("/api/legislatures");
        if (!res.ok) throw new Error("Failed to get legislatures");
        return res.json() as Promise<LegislatureDTO[]>;
    },

    async getPresidenceAssemblee(legislature: number): Promise<PresidenceAssembleeDTO | null> {
        const res = await fetch(`/api/legislatures/${legislature}/presidence-assemblee`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get presidence of the Assemblee");
        return res.json() as Promise<PresidenceAssembleeDTO>;
    },

    async getFrise(): Promise<LegislaturesFriseDTO> {
        const res = await fetch("/api/legislatures/frise");
        if (!res.ok) throw new Error("Failed to get legislatures timeline");
        return res.json() as Promise<LegislaturesFriseDTO>;
    },

    async getOrganisation(legislature: number): Promise<LegislatureOrganisationDTO> {
        const res = await fetch(`/api/legislatures/${legislature}/organisation`);
        if (!res.ok) throw new Error(`Failed to get organisation of legislature ${legislature}`);
        return res.json() as Promise<LegislatureOrganisationDTO>;
    },

    async getChiffres(legislature: number): Promise<LegislatureChiffresDTO> {
        const res = await fetch(`/api/legislatures/${legislature}/chiffres`);
        if (!res.ok) throw new Error(`Failed to get figures of legislature ${legislature}`);
        return res.json() as Promise<LegislatureChiffresDTO>;
    },
}