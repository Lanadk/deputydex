import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { toISODateOnly } from "@/app/_shared/utils/date";
import { IScrutinsPeriodeRepository } from "@/app/domains/scrutins/repositories/IScrutinsPeriodeRepository";
import { ScrutinPlusSerreDTO } from "@/app/domains/scrutins/dto/scrutin-plus-serre.dto";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { mapScrutinListItemsEntitiesToDTOs } from "@/app/domains/scrutins/mappers/scrutin-list-item.mapper";

/**
 * Voix « pour » + « contre » minimales pour qu'un scrutin compte : un 3 contre 3
 * en fin de séance n'est pas un scrutin serré, juste un scrutin peu suivi.
 */
export const SCRUTIN_SERRE_MIN_VOIX = 100;

const ecart = (s: ScrutinListItemDTO) => Math.abs((s.pour ?? 0) - (s.contre ?? 0));
const voix = (s: ScrutinListItemDTO) => (s.pour ?? 0) + (s.contre ?? 0);

/**
 * Le scrutin le plus serré : le plus petit écart entre pour et contre, parmi
 * ceux qui réunissent au moins SCRUTIN_SERRE_MIN_VOIX voix ; à égalité, celui
 * qui a réuni le plus de voix, puis le plus récent.
 */
export function scrutinLePlusSerre(scrutins: ScrutinListItemDTO[]): ScrutinListItemDTO | null {
    const [premier] = scrutins
        .filter((s) => s.pour !== null && s.contre !== null && voix(s) >= SCRUTIN_SERRE_MIN_VOIX)
        .sort((a, b) => ecart(a) - ecart(b) || voix(b) - voix(a) || (b.date ?? "").localeCompare(a.date ?? ""));
    return premier ?? null;
}

export async function getScrutinPlusSerreUseCase(
    repository: IScrutinsPeriodeRepository,
    legislature: number
): Promise<Result<ScrutinPlusSerreDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getScrutinsDernierMois(legislature));
    if (isErr(result)) return result;
    const periode = result.data;
    if (!periode) return ok({ periode: null, scrutin: null, ecart: null });

    const scrutin = scrutinLePlusSerre(mapScrutinListItemsEntitiesToDTOs(periode.rows));
    return ok({
        periode: { debut: toISODateOnly(periode.debut) ?? "", fin: toISODateOnly(periode.fin) ?? "" },
        scrutin,
        ecart: scrutin ? ecart(scrutin) : null,
    });
}
