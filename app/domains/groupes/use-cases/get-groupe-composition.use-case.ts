import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IGroupeCompositionRepository} from "@/app/domains/groupes/repositories/IGroupeCompositionRepository";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";
import {mapEntityToGroupeCompositionDTO} from "@/app/domains/groupes/mappers/groupe-composition.mapper";


export async function getGroupeCompositionUseCase(
    repository: IGroupeCompositionRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeCompositionDTO, "ERROR">> {

    const entity = await repository.getGroupeComposition(groupeCode, legislature);

    if (!entity) {
        return err("ERROR")
    }

    const dto = mapEntityToGroupeCompositionDTO(entity);
    return ok(dto);
}