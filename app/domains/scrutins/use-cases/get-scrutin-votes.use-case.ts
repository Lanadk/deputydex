import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";
import { mapScrutinDeputeVotesEntitiesToDTOs } from "@/app/domains/scrutins/mappers/scrutin-depute-vote.mapper";

/** Ordre d'affichage : alphabétique par nom puis prénom (accents et casse ignorés). */
export function sortScrutinVotes(votes: ScrutinDeputeVoteDTO[]): ScrutinDeputeVoteDTO[] {
    const compare = (a: string, b: string) => a.localeCompare(b, "fr", { sensitivity: "base" });
    return [...votes].sort((a, b) => compare(a.nom, b.nom) || compare(a.nomComplet, b.nomComplet));
}

export async function getScrutinVotesUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinDeputeVoteDTO[], "ERROR">> {
    try {
        const entities = await repository.getScrutinVotes(uid);
        return ok(sortScrutinVotes(mapScrutinDeputeVotesEntitiesToDTOs(entities)));
    } catch (e) {
        console.error(e);
        return err("ERROR");
    }
}
