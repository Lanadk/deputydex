import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";

function makeRepository(overrides: Partial<ILegislaturesRepository> = {}): ILegislaturesRepository {
    return {
        getCurrent: jest.fn().mockResolvedValue(null),
        getAll: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getCurrentLegislatureUseCase", () => {
    it("returns ok(dto) when the repository finds a current legislature", async () => {
        const repository = makeRepository({
            getCurrent: jest.fn().mockResolvedValue({
                id: 2,
                number: 17,
                startDate: new Date("2024-07-08"),
                endDate: null,
            }),
        });

        const result = await getCurrentLegislatureUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data.number).toBe(17);
        expect(result.data.endDate).toBeNull();
    });

    it("returns err('NOT_FOUND') when the repository resolves null", async () => {
        const repository = makeRepository({ getCurrent: jest.fn().mockResolvedValue(null) });

        const result = await getCurrentLegislatureUseCase(repository);

        expect(result).toEqual({ success: false, error: "NOT_FOUND" });
    });
});
