import {err, isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupeCompositionRepository} from "@/app/domains/groupes/repositories/IGroupeCompositionRepository";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";
import {mapEntityToGroupeCompositionDTO} from "@/app/domains/groupes/mappers/groupe-composition.mapper";


export async function getGroupeCompositionUseCase(
    repository: IGroupeCompositionRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeCompositionDTO, "NOT_FOUND" | "DB_ERROR">> {

    const result = await fromRepository(() => repository.getGroupeComposition(groupeCode, legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    // null : le groupe n'existe pas dans cette législature.
    if (!entity) {
        return err("NOT_FOUND")
    }

    const dto = mapEntityToGroupeCompositionDTO(entity);
    return ok(dto);
}
