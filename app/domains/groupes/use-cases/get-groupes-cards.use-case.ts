import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {Result, ok, err} from "@/app/_shared/result-pattern/result"
import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {mapEntityToDTO} from "@/app/domains/groupes/mappers/groupes-cards.mapper";


export async function getGroupesCardsUseCase(
    groupesCardsRepository: IGroupesCardsRepository,
    legislature: number
): Promise<Result<GroupeCardDTO[] , "ERROR">> {

    const entities = await groupesCardsRepository.getGroupesCards(legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dtos = mapEntityToDTO(legislature, entities);
    return ok(dtos);
}