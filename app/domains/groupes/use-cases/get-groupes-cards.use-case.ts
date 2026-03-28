import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {Result, ok, err} from "@/app/_shared/result-pattern/result"
import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {mapRowsToDTO} from "@/app/domains/groupes/mappers/groupes-cards.mapper";


export async function getGroupesCardsUseCase(
    groupesCardsRepository: IGroupesCardsRepository,
    legislature: number
): Promise<Result<GroupeCardDTO[] , "ERROR">> {

    const entity = await groupesCardsRepository.getGroupeCardsUseCase(legislature);

    if (!entity) {
        return err("ERROR")
    }

    const dto = mapRowsToDTO(legislature, entity);
    return ok(dto);
}