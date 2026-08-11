import { searchActeursUseCase } from "@/app/domains/acteurs/use-cases/search-acteurs.use-case";
import { IActeursRepository } from "@/app/domains/acteurs/repositories/IActeursRepository";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";
import { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";

function makeEntity(overrides: Partial<ActeurEntity> = {}): ActeurEntity {
    return {
        uid: "PA1",
        prenom: "Jean",
        nom: "Dupont",
        profession_categorie: "Parlementaire",
        date_naissance: new Date("1970-01-01"),
        ...overrides,
    };
}

function makeRepository(overrides: Partial<IActeursRepository> = {}): IActeursRepository {
    return {
        search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
        getById: jest.fn().mockResolvedValue(null),
        findManyForExport: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("searchActeursUseCase", () => {
    it("maps repository entities to DTOs and computes pagination", async () => {
        const repository = makeRepository({
            search: jest.fn().mockResolvedValue({
                items: [makeEntity({ uid: "PA1" }), makeEntity({ uid: "PA2", nom: "Martin" })],
                total: 42,
            }),
        });

        const result = await searchActeursUseCase(repository, { orderBy: [], where: {} }, 2, 20);

        expect(result.success).toBe(true);
        if (!result.success) throw new Error("expected success");

        expect(result.data.items).toHaveLength(2);
        expect(result.data.items[0]).toEqual({
            id: "PA1",
            prenom: "Jean",
            nom: "Dupont",
            professionCategorie: "Parlementaire",
            dateNaissance: "1970-01-01",
        });
        expect(result.data.total).toBe(42);
        expect(result.data.page).toBe(2);
        expect(result.data.pageSize).toBe(20);
        // 42 items / 20 per page => 3 pages
        expect(result.data.pageCount).toBe(3);
    });

    it("defaults to page 1 / pageSize 20 when not provided", async () => {
        const repository = makeRepository();

        await searchActeursUseCase(repository, { orderBy: [], where: {} });

        expect(repository.search).toHaveBeenCalledWith(expect.anything(), 1, 20);
    });

    it("never returns a pageCount below 1, even with zero results", async () => {
        const repository = makeRepository({
            search: jest.fn().mockResolvedValue({ items: [], total: 0 }),
        });

        const result = await searchActeursUseCase(repository, { orderBy: [], where: {} }, 1, 20);

        if (!result.success) throw new Error("expected success");
        expect(result.data.pageCount).toBe(1);
    });

    it("strips filter/sort fields that are not in the acteurs whitelist before hitting the repository", async () => {
        const repository = makeRepository();
        const rawQuery: FilterBarQuery = {
            orderBy: [{ not_a_real_field: "asc" }, { nom: "asc" }],
            where: { AND: [{ not_a_real_field: { contains: "x" } }, { nom: { contains: "a" } }] },
        };

        await searchActeursUseCase(repository, rawQuery, 1, 20);

        expect(repository.search).toHaveBeenCalledWith(
            { orderBy: [{ nom: "asc" }], where: { nom: { contains: "a" } } },
            1,
            20
        );
    });
});
