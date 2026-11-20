import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {IGroupeCohesionRepository} from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";
import {mapEntityToGroupeCohesionDTO} from "@/app/domains/groupes/mappers/groupe-cohesion.mapper";


export async function getGroupeCohesionUseCase(
    repository: IGroupeCohesionRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeCohesionDTO, "DB_ERROR">> {

    const read = await fromRepository(() => repository.getGroupeCohesionLegislature(groupeCode, legislature));
    if (isErr(read)) return read;

    return ok(mapEntityToGroupeCohesionDTO(read.data));
}
