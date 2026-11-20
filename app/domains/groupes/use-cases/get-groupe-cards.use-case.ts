import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {isErr, ok, Result} from "@/app/_shared/result-pattern/result"
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {mapEntityToDTO} from "@/app/domains/groupes/mappers/groupes-cards.mapper";


export async function getGroupeCardsUseCase(
    groupesCardsRepository: IGroupesCardsRepository,
    legislature: number
): Promise<Result<GroupeCardDTO[], "DB_ERROR">> {

    const read = await fromRepository(() => groupesCardsRepository.getGroupesCards(legislature));
    if (isErr(read)) return read;

    return ok(mapEntityToDTO(legislature, read.data));
}
