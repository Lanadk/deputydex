import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinHemicycleDTO } from "@/app/domains/scrutins/dto/scrutin-hemicycle.dto";
import { buildScrutinHemicycle } from "@/app/domains/scrutins/scrutin-hemicycle";

export async function getScrutinHemicycleUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinHemicycleDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getScrutinSieges(uid));
    if (isErr(result)) return result;

    return ok(buildScrutinHemicycle(result.data));
}
