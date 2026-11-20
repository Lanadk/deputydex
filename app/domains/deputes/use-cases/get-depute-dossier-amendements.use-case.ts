import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { mapDeputeDossierAmendementsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-dossier-amendement.mapper";

/** Timestamp de dépôt ; les amendements sans date passent après tous les autres. */
function depotTime(entity: DeputeDossierAmendementEntity): number {
    return entity.date_depot?.getTime() ?? Number.NEGATIVE_INFINITY;
}

/**
 * Ordre d'affichage des amendements d'un dossier, du plus récent au plus ancien :
 * - les amendements restent regroupés par texte amendé (l'UI affiche un titre par texte) ;
 * - les textes sont classés selon leur amendement le plus récent ;
 * - dans un texte, les amendements vont du plus récent au plus ancien (puis par uid, décroissant).
 */
export function sortDossierAmendements(entities: DeputeDossierAmendementEntity[]): DeputeDossierAmendementEntity[] {
    const byDateDesc = (a: DeputeDossierAmendementEntity, b: DeputeDossierAmendementEntity) =>
        depotTime(b) - depotTime(a) || b.uid.localeCompare(a.uid);

    const groups = new Map<string, DeputeDossierAmendementEntity[]>();
    for (const entity of entities) {
        const group = groups.get(entity.texte_uid);
        if (group) group.push(entity);
        else groups.set(entity.texte_uid, [entity]);
    }

    return [...groups.values()]
        .map((group) => group.sort(byDateDesc))
        .sort((a, b) => byDateDesc(a[0], b[0]))
        .flat();
}

export async function getDeputeDossierAmendementsUseCase(
    repository: IDeputeDossiersRepository,
    uid: string,
    legislature: number,
    dossierUid: string
): Promise<Result<DeputeDossierAmendementDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeDossierAmendements(uid, legislature, dossierUid));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapDeputeDossierAmendementsEntitiesToDTOs(sortDossierAmendements(entities)));
}
