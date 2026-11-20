import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinHemicycleDTO } from "@/app/domains/scrutins/dto/scrutin-hemicycle.dto";
import { buildScrutinHemicycle } from "@/app/domains/scrutins/scrutin-hemicycle";

export async function getScrutinHemicycleUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinHemicycleDTO, "ERROR">> {
    try {
        return ok(buildScrutinHemicycle(await repository.getScrutinSieges(uid)));
    } catch (e) {
        console.error(e);
        return err("ERROR");
    }
}
