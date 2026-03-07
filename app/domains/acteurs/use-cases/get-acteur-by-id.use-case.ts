import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";
import {mapActeurToDTO} from "@/app/domains/acteurs/mappers/acteur.mapper";
import {Result, ok, err} from "@/app/_shared/result-pattern/result"

export async function getActeurByIdUseCase(
    repository: IActeursRepository,
    id: string,
): Promise<Result<ActeurDTO, "NOT_FOUND">> {
    const entity = await repository.getById(id);
    if (!entity) {
        return err("NOT_FOUND");
    }
    return ok(mapActeurToDTO(entity));
}