import { DeputeVoteStatsEntity } from "@/app/domains/deputes/entities/depute-vote-stats.entity";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";

export function mapDeputeVoteStatsEntityToDTO(entity: DeputeVoteStatsEntity): DeputeVoteStatsDTO {
    return {
        totalVotes: Number(entity.total_votes),
        totalPour: Number(entity.total_pour),
        totalContre: Number(entity.total_contre),
        totalAbstentions: Number(entity.total_abstentions),
        totalNonVotants: Number(entity.total_non_votants),
        rebelVotesCount: Number(entity.total_rebel),
        tauxFidelite: entity.taux_fidelite !== null ? Math.round(Number(entity.taux_fidelite)) : null,
        tauxParticipation: entity.taux_participation !== null ? Math.round(Number(entity.taux_participation)) : null,
    };
}
