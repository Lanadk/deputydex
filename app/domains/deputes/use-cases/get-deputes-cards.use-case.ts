import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputesCardsRepository } from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { mapDeputesCardsToDTOs } from "@/app/domains/deputes/mappers/deputes-cards.mapper";

export async function getDeputesCardsUseCase(
    repository: IDeputesCardsRepository,
    legislature: number
): Promise<Result<DeputesCardDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeCards(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapDeputesCardsToDTOs(entities));
}
