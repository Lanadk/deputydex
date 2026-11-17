import {
    getDeputesCardsSampleUseCase,
    sampleDeputesCards,
} from "@/app/domains/deputes/use-cases/get-deputes-cards-sample.use-case";
import { IDeputesCardsRepository } from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputesCardEntity } from "@/app/domains/deputes/entities/deputes-cards.entity";

function cards(groupe: string, count: number): DeputesCardDTO[] {
    return Array.from({ length: count }, (_, i) => ({
        deputeUID: `${groupe}-${i}`,
        deputeFullName: `${groupe} ${i}`,
        deputeGroupeCode: groupe,
        deputeImage: "",
    }));
}

function countByGroupe(list: DeputesCardDTO[]): Record<string, number> {
    return list.reduce<Record<string, number>>((acc, c) => {
        acc[c.deputeGroupeCode] = (acc[c.deputeGroupeCode] ?? 0) + 1;
        return acc;
    }, {});
}

describe("sampleDeputesCards", () => {
    const population = [...cards("RN", 120), ...cards("EPR", 90), ...cards("LFI-NFP", 70), ...cards("NI-17", 10), ...cards("", 5)];

    it("returns exactly `size` cards, proportional to each group", () => {
        const sample = sampleDeputesCards(population, 29, "17");

        expect(sample).toHaveLength(29);
        expect(countByGroupe(sample)).toEqual({ RN: 12, EPR: 9, "LFI-NFP": 7, "NI-17": 1 });
    });

    it("is deterministic for a given seed and changes with the seed", () => {
        const ids = (seed: string) => sampleDeputesCards(population, 20, seed).map((c) => c.deputeUID);

        expect(ids("17")).toEqual(ids("17"));
        expect(ids("16")).not.toEqual(ids("17"));
    });

    it("never returns a card without a group nor duplicates", () => {
        const sample = sampleDeputesCards(population, 56, "17");

        expect(sample.every((c) => c.deputeGroupeCode)).toBe(true);
        expect(new Set(sample.map((c) => c.deputeUID)).size).toBe(sample.length);
    });

    it("returns every eligible card when the population is smaller than size", () => {
        expect(sampleDeputesCards(cards("RN", 3), 10, "17")).toHaveLength(3);
        expect(sampleDeputesCards([], 10, "17")).toEqual([]);
    });
});

describe("getDeputesCardsSampleUseCase", () => {
    it("samples the repository cards of the given legislature", async () => {
        const entities: DeputesCardEntity[] = Array.from({ length: 10 }, (_, i) => ({
            depute_uid: `PA${i}`,
            depute_full_name: `Député ${i}`,
            depute_groupe_code: i % 2 ? "RN" : "SOC",
            depute_image: null,
            depute_role: "membre",
        }));
        const repository: IDeputesCardsRepository = { getDeputeCards: jest.fn().mockResolvedValue(entities) };

        const result = await getDeputesCardsSampleUseCase(repository, 17, 4);

        expect(repository.getDeputeCards).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(countByGroupe(result.data)).toEqual({ RN: 2, SOC: 2 });
    });

    it("returns err('ERROR') when the repository throws", async () => {
        const repository: IDeputesCardsRepository = { getDeputeCards: jest.fn().mockRejectedValue(new Error("db")) };

        await expect(getDeputesCardsSampleUseCase(repository, 17)).resolves.toEqual({ success: false, error: "ERROR" });
    });
});
