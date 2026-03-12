import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";
import {IFicheDeputeRepository} from "@/app/domains/acteurs/repositories/IFIcheDeputeRepository";
import {toFicheDeputeDTO} from "@/app/domains/acteurs/mappers/acteurs-mandats.mapper";


export const getFicheDeputeUseCase = async (
    repository: IFicheDeputeRepository,
    id: string,
    legislature: number
): Promise<Result<FicheDeputeDTO, "NOT_FOUND">> => {

    const fiche = await repository.findByIdAndLegislature(id, legislature);

    if (!fiche) {
        return err("NOT_FOUND")
    }

    return ok(toFicheDeputeDTO(fiche, legislature));
};
























