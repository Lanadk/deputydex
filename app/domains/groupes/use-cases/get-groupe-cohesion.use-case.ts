import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {IGroupeCohesionRepository} from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";
import {mapEntityToGroupeCohesionDTO} from "@/app/domains/groupes/mappers/groupe-cohesion.mapper";


export async function getGroupeCohesionUseCase(
    repository: IGroupeCohesionRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeCohesionDTO, "ERROR">> {

    const entities = await repository.getGroupeCohesionLegislature(groupeCode, legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dto = mapEntityToGroupeCohesionDTO(entities);
    return ok(dto);
}