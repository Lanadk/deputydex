import {IDeputesCardsRepository} from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";
import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {mapDeputesCardsToDTOs} from "@/app/domains/deputes/mapper/deputes-cards.mapper";


export async function getDeputesCardsUseCase(
    repository: IDeputesCardsRepository,
    legislature: number
): Promise<Result<DeputesCardDTO[], "ERROR">> {

    const entities = await repository.getDeputeCards(legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dtos = mapDeputesCardsToDTOs(entities);
    return ok(dtos);
}