import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {Result, ok, isErr} from "@/app/_shared/result-pattern/result"
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {mapEntityToDTO} from "@/app/domains/groupes/mappers/groupes-cards.mapper";


export async function getGroupeCardsUseCase(
    groupesCardsRepository: IGroupesCardsRepository,
    legislature: number
): Promise<Result<GroupeCardDTO[] , "DB_ERROR">> {

    const result = await fromRepository(() => groupesCardsRepository.getGroupesCards(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    const dtos = mapEntityToDTO(legislature, entities);
    return ok(dtos);
}
