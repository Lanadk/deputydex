import { getActeurByIdUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-by-id.use-case";
import { IActeursRepository } from "@/app/domains/acteurs/repositories/IActeursRepository";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";

function makeRepository(overrides: Partial<IActeursRepository> = {}): IActeursRepository {
    return {
        search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
        getById: jest.fn().mockResolvedValue(null),
        findManyForExport: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getActeurByIdUseCase", () => {
    it("returns ok(dto) when the repository finds the acteur", async () => {
        const entity: ActeurEntity = {
            uid: "PA1",
            prenom: "Jean",
            nom: "Dupont",
            profession_categorie: "Parlementaire",
            date_naissance: null,
        };
        const repository = makeRepository({ getById: jest.fn().mockResolvedValue(entity) });

        const result = await getActeurByIdUseCase(repository, "PA1");

        expect(repository.getById).toHaveBeenCalledWith("PA1");
        expect(result).toEqual({ success: true, data: expect.objectContaining({ id: "PA1" }) });
    });

    it("returns err('NOT_FOUND') when the repository resolves null", async () => {
        const repository = makeRepository({ getById: jest.fn().mockResolvedValue(null) });

        const result = await getActeurByIdUseCase(repository, "UNKNOWN");

        expect(result).toEqual({ success: false, error: "NOT_FOUND" });
    });
});
