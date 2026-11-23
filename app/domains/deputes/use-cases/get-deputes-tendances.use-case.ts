import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { toISODateOnly } from "@/app/_shared/utils/date";
import { IDeputesTendancesRepository } from "@/app/domains/deputes/repositories/IDeputesTendancesRepository";
import { DeputesTendancesDTO, DeputeTendanceDTO, DeputeTendanceLigneDTO } from "@/app/domains/deputes/dto/deputes-tendances.dto";
import { mapDeputeTendanceEntityToDTO } from "@/app/domains/deputes/mappers/deputes-tendances.mapper";

type Critere = "votesExprimes" | "votesRebelles" | "amendementsDeposes";

/**
 * Le député en tête sur un critère : la plus grande valeur, à condition
 * qu'elle soit non nulle ; à égalité, l'ordre alphabétique du nom.
 */
export function deputeEnTete(lignes: DeputeTendanceLigneDTO[], critere: Critere): DeputeTendanceDTO | null {
    const [premier] = [...lignes]
        .filter((l) => l[critere] > 0)
        .sort((a, b) => b[critere] - a[critere] || a.depute.deputeFullName.localeCompare(b.depute.deputeFullName, "fr"));
    return premier ? { depute: premier.depute, valeur: premier[critere] } : null;
}

/**
 * « Ce mois-ci » d'une législature : le député le plus assidu aux scrutins, le
 * plus « rebelle » à son groupe et celui qui a déposé le plus d'amendements,
 * sur les 30 jours qui finissent au dernier scrutin. Aucune activité : tous
 * les classements à null (pas une erreur).
 */
export async function getDeputesTendancesUseCase(
    repository: IDeputesTendancesRepository,
    legislature: number
): Promise<Result<DeputesTendancesDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputesTendances(legislature));
    if (isErr(result)) return result;
    const entities = result.data;
    const lignes = entities.map(mapDeputeTendanceEntityToDTO);
    const [premiere] = entities;

    return ok({
        periode: premiere
            ? { debut: toISODateOnly(premiere.periode_debut) ?? "", fin: toISODateOnly(premiere.periode_fin) ?? "" }
            : null,
        scrutins: premiere ? Number(premiere.scrutins_periode) : 0,
        assidu: deputeEnTete(lignes, "votesExprimes"),
        rebelle: deputeEnTete(lignes, "votesRebelles"),
        amendements: deputeEnTete(lignes, "amendementsDeposes"),
    });
}
