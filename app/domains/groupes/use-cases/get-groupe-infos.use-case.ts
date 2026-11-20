import {IGroupeInfosRepository} from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {err, isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {mapEntityToGroupeInfosDTO} from "@/app/domains/groupes/mappers/groupe-infos.mapper";


export async function getGroupeInfosUseCase(
    repository: IGroupeInfosRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeInfosDTO, "NOT_FOUND" | "DB_ERROR">> {

    const read = await fromRepository(() => repository.getGroupeInfos(groupeCode, legislature));
    if (isErr(read)) return read;

    // Aucune ligne : le groupe n'existe pas dans cette législature.
    if (read.data.length === 0) return err("NOT_FOUND");

    return ok(mapEntityToGroupeInfosDTO(legislature, read.data));
}
