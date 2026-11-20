import { getDeputeDossierContributionsUseCase } from "@/app/domains/deputes/use-cases/get-depute-dossier-contributions.use-case";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { isErr, isOk } from "@/app/_shared/result-pattern/result";

function repository(contributions: Promise<never[]>): IDeputeDossiersRepository {
    return {
        getDeputeDossierContributions: jest.fn(() => contributions),
        getDeputeDossierAmendements: jest.fn(),
    };
}

describe("getDeputeDossierContributionsUseCase", () => {
    it("renvoie les contributions du député", async () => {
        const result = await getDeputeDossierContributionsUseCase(repository(Promise.resolve([])), "PA1", 17);

        expect(isOk(result) && result.data).toEqual([]);
    });

    it("renvoie une erreur si le repository échoue, et la logue côté serveur (ex. vue d'agrégation absente)", async () => {
        const log = jest.spyOn(console, "error").mockImplementation(() => {});
        const missingView = new Error('relation "agg_deputes_dossiers_contributions" does not exist');

        const result = await getDeputeDossierContributionsUseCase(repository(Promise.reject(missingView)), "PA1", 17);

        expect(isErr(result)).toBe(true);
        expect(log).toHaveBeenCalledWith(missingView);
        log.mockRestore();
    });
});
