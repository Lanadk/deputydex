import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";
import {mapActeurToDTO} from "@/app/domains/acteurs/mappers/acteur.mapper";
import {Result, ok, err, isErr} from "@/app/_shared/result-pattern/result"
import {fromRepository} from "@/app/_shared/result-pattern/app-error";

export async function getActeurByIdUseCase(
    repository: IActeursRepository,
    id: string,
): Promise<Result<ActeurDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getById(id));
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) {
        return err("NOT_FOUND");
    }
    return ok(mapActeurToDTO(entity));
}
