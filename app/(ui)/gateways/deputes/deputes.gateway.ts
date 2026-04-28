import { IDeputesGateways } from "@/app/domains/deputes/gateways/IDeputes.gateways";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";

export const deputesGateway: IDeputesGateways = {
    async getDeputeIdentity(uid: string, legislature: number): Promise<DeputeIdentityDTO> {
        const res = await fetch(`/api/deputes/${uid}/identity/${legislature}`);
        if (!res.ok) throw new Error("Failed to get depute identity");
        return res.json();
    },

    async getDeputeMandats(uid: string): Promise<DeputeMandatDTO[]> {
        const res = await fetch(`/api/deputes/${uid}/mandats`);
        if (!res.ok) throw new Error("Failed to get depute mandats");
        return res.json();
    },

    async getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsDTO> {
        const res = await fetch(`/api/deputes/${uid}/vote-stats/${legislature}`);
        if (!res.ok) throw new Error("Failed to get depute vote stats");
        return res.json();
    },

    async getDeputeRecentVotes(uid: string, legislature: number): Promise<DeputeRecentVoteDTO[]> {
        const res = await fetch(`/api/deputes/${uid}/recent-votes/${legislature}`);
        if (!res.ok) throw new Error("Failed to get depute recent votes");
        return res.json();
    },

    async getDeputeAmendementStats(uid: string, legislature: number): Promise<DeputeAmendementStatsDTO> {
        const res = await fetch(`/api/deputes/${uid}/amendement-stats/${legislature}`);
        if (!res.ok) throw new Error("Failed to get depute amendement stats");
        return res.json();
    },
};
