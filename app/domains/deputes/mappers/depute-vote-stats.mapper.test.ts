import { mapDeputeVoteStatsEntityToDTO } from "@/app/domains/deputes/mappers/depute-vote-stats.mapper";

describe("mapDeputeVoteStatsEntityToDTO", () => {
    it("convertit les COUNT (bigint) et garde une décimale à la participation", () => {
        expect(mapDeputeVoteStatsEntityToDTO({
            total_votes: BigInt(976),
            total_pour: BigInt(200),
            total_contre: BigInt(120),
            total_abstentions: BigInt(17),
            total_non_votants: BigInt(639),
            total_rebel: BigInt(12),
            taux_fidelite: "81.3",
            taux_participation: "11.04",
            scrutins_mandat: 3693,
            non_votants_statutaires: 639,
            votes_exprimes: 337,
            votes_par_delegation: 3,
        })).toEqual({
            totalVotes: 976,
            totalPour: 200,
            totalContre: 120,
            totalAbstentions: 17,
            totalNonVotants: 639,
            rebelVotesCount: 12,
            tauxFidelite: 81,
            tauxParticipation: 11,
            // Scrutins du mandat moins ceux où il ne pouvait pas voter (présidence, Gouvernement).
            scrutinsVotables: 3054,
            votesExprimes: 337,
            votesParDelegation: 3,
        });
    });

    it("sans taux (aucun scrutin votable) : null", () => {
        const dto = mapDeputeVoteStatsEntityToDTO({
            total_votes: 0, total_pour: 0, total_contre: 0, total_abstentions: 0, total_non_votants: 0, total_rebel: 0,
            taux_fidelite: null, taux_participation: null,
            scrutins_mandat: 0, non_votants_statutaires: 0, votes_exprimes: 0, votes_par_delegation: 0,
        });
        expect(dto.tauxParticipation).toBeNull();
        expect(dto.tauxFidelite).toBeNull();
    });
});
