import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IGroupeComportementRepository} from "@/app/domains/groupes/repositories/IGroupeComportementRepository";
import {mapEntityToGroupeComportementDTO} from "@/app/domains/groupes/mappers/groupe-comportement.mapper";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";

export async function getGroupeComportementUseCase(
    repository: IGroupeComportementRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeComportementDTO, "ERROR">> {

    const entity = await repository.getGroupeComportementLegislature(groupeCode, legislature);

    if (!entity) {
        return err("ERROR")
    }

    const dto = mapEntityToGroupeComportementDTO(entity);
    return ok(dto);
}