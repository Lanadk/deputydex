import { getGroupeLegislaturesUseCase } from "@/app/domains/groupes/use-cases/get-groupe-legislatures.use-case";
import { IGroupeLegislaturesRepository } from "@/app/domains/groupes/repositories/IGroupeLegislaturesRepository";

describe("getGroupeLegislaturesUseCase", () => {
    it("returns ok([...]) with the legislature numbers where the code exists", async () => {
        const repository: IGroupeLegislaturesRepository = {
            getGroupeLegislatures: jest.fn().mockResolvedValue([{ legislature: 16 }, { legislature: 17 }]),
        };

        const result = await getGroupeLegislaturesUseCase(repository, "RE");

        expect(repository.getGroupeLegislatures).toHaveBeenCalledWith("RE");
        expect(result).toEqual({ success: true, data: [16, 17] });
    });

    it("returns ok([]) when the code doesn't exist in any legislature", async () => {
        const repository: IGroupeLegislaturesRepository = {
            getGroupeLegislatures: jest.fn().mockResolvedValue([]),
        };

        const result = await getGroupeLegislaturesUseCase(repository, "UNKNOWN");

        expect(result).toEqual({ success: true, data: [] });
    });
});
