import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
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
): Promise<Result<ScrutinGroupeVoteDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getScrutinGroupes(uid));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(sortScrutinGroupes(mapScrutinGroupeVotesEntitiesToDTOs(entities)));
}
