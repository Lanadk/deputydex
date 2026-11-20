import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupeComportementRepository} from "@/app/domains/groupes/repositories/IGroupeComportementRepository";
import {mapEntityToGroupeComportementDTO} from "@/app/domains/groupes/mappers/groupe-comportement.mapper";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";

export async function getGroupeComportementUseCase(
    repository: IGroupeComportementRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeComportementDTO, "DB_ERROR">> {

    const result = await fromRepository(() => repository.getGroupeComportementLegislature(groupeCode, legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    const dto = mapEntityToGroupeComportementDTO(entity);
    return ok(dto);
}
