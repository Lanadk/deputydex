import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { mapScrutinGroupeVotesEntitiesToDTOs } from "@/app/domains/scrutins/mappers/scrutin-groupe-vote.mapper";

/** Ordre d'affichage : du groupe le plus nombreux au moins nombreux, puis par libellé. */
export function sortScrutinGroupes(groupes: ScrutinGroupeVoteDTO[]): ScrutinGroupeVoteDTO[] {
    return [...groupes].sort(
        (a, b) =>
            (b.nombreMembres ?? -1) - (a.nombreMembres ?? -1) ||
            a.groupeLabel.localeCompare(b.groupeLabel, "fr")
    );
}

export async function getScrutinGroupesUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinGroupeVoteDTO[], "ERROR">> {
    try {
        const entities = await repository.getScrutinGroupes(uid);
        return ok(sortScrutinGroupes(mapScrutinGroupeVotesEntitiesToDTOs(entities)));
    } catch (e) {
        console.error(e);
        return err("ERROR");
    }
}
