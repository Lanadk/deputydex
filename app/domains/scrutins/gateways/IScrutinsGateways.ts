import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";
import { ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { ScrutinListRawParams } from "@/app/domains/scrutins/filters/scrutin-list.filters";

export interface IScrutinsGateways {
    /** Liste filtrée et paginée côté serveur */
    getScrutinsList(legislature: number, params: ScrutinListRawParams, signal?: AbortSignal): Promise<ScrutinListPageDTO>;

    getScrutin(uid: string): Promise<ScrutinDetailDTO>;

    getScrutinGroupes(uid: string): Promise<ScrutinGroupeVoteDTO[]>;

    getScrutinVotes(uid: string): Promise<ScrutinDeputeVoteDTO[]>;
}
