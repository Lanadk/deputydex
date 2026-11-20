import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";
import { ScrutinSiegeEntity } from "@/app/domains/scrutins/entities/scrutin-siege.entity";

export interface IScrutinDetailRepository {
    /** null si le scrutin n'existe pas */
    getScrutin(uid: string): Promise<ScrutinDetailEntity | null>;

    getScrutinGroupes(uid: string): Promise<ScrutinGroupeVoteEntity[]>;

    getScrutinVotes(uid: string): Promise<ScrutinDeputeVoteEntity[]>;

    /** Députés en mandat le jour du scrutin, avec leur siège et leur vote éventuel */
    getScrutinSieges(uid: string): Promise<ScrutinSiegeEntity[]>;
}
