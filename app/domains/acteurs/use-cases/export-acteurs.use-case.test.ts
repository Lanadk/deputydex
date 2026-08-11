import { exportActeursUseCase } from "@/app/domains/acteurs/use-cases/export-acteurs.use-case";
import { IActeursRepository } from "@/app/domains/acteurs/repositories/IActeursRepository";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";

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

describe("exportActeursUseCase", () => {
    it("builds a CSV body with a header row, BOM, and the default ';' delimiter", async () => {
        const repository = makeRepository({
            findManyForExport: jest.fn().mockResolvedValue([makeEntity()]),
        });

        const result = await exportActeursUseCase(
            repository,
            { orderBy: [], where: {} },
            { format: "csv" }
        );

        if (!result.success) throw new Error("expected success");
        expect(result.data.contentType).toBe("text/csv; charset=utf-8");
        expect(result.data.body.startsWith("﻿")).toBe(true);

        const [header, row] = result.data.body.replace("﻿", "").split("\n");
        expect(header).toBe("id;prenom;nom;profession_categorie;date_naissance");
        expect(row).toBe("PA1;Jean;Dupont;Parlementaire;1970-01-01");
    });

    it("respects a custom delimiter", async () => {
        const repository = makeRepository({
            findManyForExport: jest.fn().mockResolvedValue([makeEntity()]),
        });

        const result = await exportActeursUseCase(
            repository,
            { orderBy: [], where: {} },
            { format: "csv", delimiter: "," }
        );

        if (!result.success) throw new Error("expected success");
        const [header] = result.data.body.replace("﻿", "").split("\n");
        expect(header).toBe("id,prenom,nom,profession_categorie,date_naissance");
    });

    it("returns a JSON body of the mapped DTOs when format is 'json'", async () => {
        const repository = makeRepository({
            findManyForExport: jest.fn().mockResolvedValue([makeEntity({ uid: "PA1" })]),
        });

        const result = await exportActeursUseCase(
            repository,
            { orderBy: [], where: {} },
            { format: "json" }
        );

        if (!result.success) throw new Error("expected success");
        expect(result.data.contentType).toBe("application/json; charset=utf-8");
        expect(JSON.parse(result.data.body)).toEqual([
            {
                id: "PA1",
                prenom: "Jean",
                nom: "Dupont",
                professionCategorie: "Parlementaire",
                dateNaissance: "1970-01-01",
            },
        ]);
    });

    it.each([
        [0, 1],
        [-5, 1],
        [5000, 5000],
        [20000, 20000],
        [50000, 20000],
    ])("clamps maxRows=%d to %d before hitting the repository", async (input, expected) => {
        const repository = makeRepository();

        await exportActeursUseCase(
            repository,
            { orderBy: [], where: {} },
            { format: "csv", maxRows: input }
        );

        expect(repository.findManyForExport).toHaveBeenCalledWith(expect.anything(), expected);
    });

    it("defaults maxRows to 5000 when not provided", async () => {
        const repository = makeRepository();

        await exportActeursUseCase(repository, { orderBy: [], where: {} }, { format: "csv" });

        expect(repository.findManyForExport).toHaveBeenCalledWith(expect.anything(), 5000);
    });
});
