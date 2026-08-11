import { getLastUpdateUseCase } from "@/app/domains/datasets/use-cases/get-last-update.use-case";
import { IDataSetsRepository } from "@/app/domains/datasets/repositories/IDataSetsRepository";

describe("getLastUpdateUseCase", () => {
    it("returns ok(date) when the repository resolves a date", async () => {
        const date = new Date("2026-08-10T03:00:00Z");
        const repository: IDataSetsRepository = { getLastUpdate: jest.fn().mockResolvedValue(date) };

        const result = await getLastUpdateUseCase(repository);

        expect(result).toEqual({ success: true, data: date });
    });

    it("returns err('ERROR') when the repository resolves null", async () => {
        const repository: IDataSetsRepository = { getLastUpdate: jest.fn().mockResolvedValue(null) };

        const result = await getLastUpdateUseCase(repository);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });
});
