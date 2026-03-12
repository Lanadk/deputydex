import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {ILegislaturesGateway} from "@/app/domains/legislatures/gateways/ILegislaturesGateway";


export const legislaturesGateway: ILegislaturesGateway = {
    async getCurrent(): Promise<LegislatureDTO | null> {
        const res = await fetch("/api/legislatures/current");
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get current legislature");
        return res.json() as Promise<LegislatureDTO>;
    },

    async getAll(): Promise<LegislatureDTO[]> {
        const res = await fetch("/api/legislatures/");
        if (!res.ok) throw new Error("Failed to get legislatures");
        return res.json() as Promise<LegislatureDTO[]>;
    }
}