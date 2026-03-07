import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";
import {mapActeurToDTO} from "@/app/domains/acteurs/mappers/acteur.mapper";


export async function getActeurByIdUseCase(
    repository: IActeursRepository,
    id: string,
): Promise<ActeurDTO> {
    const row = await repository.getById(id);
    if (!row) {
        throw new Error("Acteur not found");
    }
    return mapActeurToDTO(row);
}