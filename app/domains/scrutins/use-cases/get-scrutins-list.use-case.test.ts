import { getScrutinsListUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-list.use-case";
import { IScrutinListRepository } from "@/app/domains/scrutins/repositories/IScrutinListRepository";
import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { parseScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { isErr, isOk } from "@/app/_shared/result-pattern/result";

const row = (uid: string): ScrutinListItemEntity => ({
    uid, numero: uid, date_scrutin: null, titre: null, type_scrutin_code: "SPO", type_scrutin_libelle: "scrutin public ordinaire",
    resultat_code: "rejeté", objet: "amendement", total_pour: 1, total_contre: 2, total_abstentions: 0,
});

function repository(result: Promise<{ rows: ScrutinListItemEntity[]; total: number }>): IScrutinListRepository {
    return { getScrutinsPage: jest.fn(() => result) };
}

describe("getScrutinsListUseCase", () => {
    it("transmet les filtres au repository et renvoie la page avec son nombre de pages", async () => {
        const repo = repository(Promise.resolve({ rows: [row("1"), row("2")], total: 45 }));
        const filters = parseScrutinListFilters(17, { page: "2", pageSize: "20", objet: "amendement" });

        const result = await getScrutinsListUseCase(repo, filters);

        expect(repo.getScrutinsPage).toHaveBeenCalledWith(filters);
        expect(isOk(result) && { ...result.data, items: result.data.items.map((i) => i.uid) }).toEqual({
            items: ["1", "2"], total: 45, page: 2, pageSize: 20, pageCount: 3,
        });
    });

    it("compte une page même sans aucun résultat", async () => {
        const result = await getScrutinsListUseCase(repository(Promise.resolve({ rows: [], total: 0 })), parseScrutinListFilters(17, {}));

        expect(isOk(result) && result.data.pageCount).toBe(1);
    });

    it("renvoie une erreur si le repository échoue, et la logue", async () => {
        const log = jest.spyOn(console, "error").mockImplementation(() => {});
        const boom = new Error("boom");

        const result = await getScrutinsListUseCase(repository(Promise.reject(boom)), parseScrutinListFilters(17, {}));

        expect(isErr(result)).toBe(true);
        expect(log).toHaveBeenCalledWith(boom);
        log.mockRestore();
    });
});
