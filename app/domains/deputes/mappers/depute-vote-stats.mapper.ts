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
        // Une décimale : la participation est souvent faible (des centaines de scrutins par jour).
        tauxParticipation: entity.taux_participation !== null ? Math.round(Number(entity.taux_participation) * 10) / 10 : null,
        scrutinsVotables: Number(entity.scrutins_mandat) - Number(entity.non_votants_statutaires),
        votesExprimes: Number(entity.votes_exprimes),
        votesParDelegation: Number(entity.votes_par_delegation),
    };
}
