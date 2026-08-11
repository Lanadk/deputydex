import { getAllLegislaturesUseCase } from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import { LegislatureEntity } from "@/app/domains/legislatures/entities/legislature.entity";

function makeRepository(overrides: Partial<ILegislaturesRepository> = {}): ILegislaturesRepository {
    return {
        getCurrent: jest.fn().mockResolvedValue(null),
        getAll: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getAllLegislaturesUseCase", () => {
    it("always returns ok(...), mapping every entity to a DTO", async () => {
        const entities: LegislatureEntity[] = [
            { id: 1, number: 16, startDate: new Date("2022-06-22"), endDate: new Date("2024-06-09") },
            { id: 2, number: 17, startDate: new Date("2024-07-08"), endDate: null },
        ];
        const repository = makeRepository({ getAll: jest.fn().mockResolvedValue(entities) });

        const result = await getAllLegislaturesUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data).toHaveLength(2);
        expect(result.data[1]).toEqual({
            id: 2,
            number: 17,
            startDate: "2024-07-08T00:00:00.000Z",
            endDate: null,
        });
    });

    it("returns ok([]) when there are no legislatures", async () => {
        const repository = makeRepository();

        const result = await getAllLegislaturesUseCase(repository);

        expect(result).toEqual({ success: true, data: [] });
    });
});
