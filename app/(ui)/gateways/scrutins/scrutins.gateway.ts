import { IScrutinsGateways } from "@/app/domains/scrutins/gateways/IScrutinsGateways";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";
import { ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { ScrutinHemicycleDTO } from "@/app/domains/scrutins/dto/scrutin-hemicycle.dto";
import { ScrutinListRawParams } from "@/app/domains/scrutins/filters/scrutin-list.filters";

export const scrutinsGateway: IScrutinsGateways = {
    async getScrutinsList(legislature: number, params: ScrutinListRawParams, signal?: AbortSignal): Promise<ScrutinListPageDTO> {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value) query.set(key, value);
        }
        const res = await fetch(`/api/scrutins/list/${legislature}?${query}`, { signal });
        if (!res.ok) throw new Error("Failed to get scrutins");
        return res.json();
    },

    async getScrutin(uid: string): Promise<ScrutinDetailDTO> {
        const res = await fetch(`/api/scrutins/${encodeURIComponent(uid)}`);
        if (!res.ok) throw new Error("Failed to get scrutin");
        return res.json();
    },

    async getScrutinGroupes(uid: string): Promise<ScrutinGroupeVoteDTO[]> {
        const res = await fetch(`/api/scrutins/${encodeURIComponent(uid)}/groupes`);
        if (!res.ok) throw new Error("Failed to get scrutin groupes");
        return res.json();
    },

    async getScrutinVotes(uid: string): Promise<ScrutinDeputeVoteDTO[]> {
        const res = await fetch(`/api/scrutins/${encodeURIComponent(uid)}/votes`);
        if (!res.ok) throw new Error("Failed to get scrutin votes");
        return res.json();
    },

    async getScrutinHemicycle(uid: string): Promise<ScrutinHemicycleDTO> {
        const res = await fetch(`/api/scrutins/${encodeURIComponent(uid)}/hemicycle`);
        if (!res.ok) throw new Error("Failed to get scrutin hemicycle");
        return res.json();
    },
};
