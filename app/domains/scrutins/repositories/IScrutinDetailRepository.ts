import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";

export interface IScrutinDetailRepository {
    /** null si le scrutin n'existe pas */
    getScrutin(uid: string): Promise<ScrutinDetailEntity | null>;

    getScrutinGroupes(uid: string): Promise<ScrutinGroupeVoteEntity[]>;

    getScrutinVotes(uid: string): Promise<ScrutinDeputeVoteEntity[]>;
}
