import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputesCardsRepository } from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { mapDeputesCardsToDTOs } from "@/app/domains/deputes/mappers/deputes-cards.mapper";

export async function getDeputesCardsUseCase(
    repository: IDeputesCardsRepository,
    legislature: number
): Promise<Result<DeputesCardDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeCards(legislature);
        return ok(mapDeputesCardsToDTOs(entities));
    } catch {
        return err("ERROR");
    }
}
