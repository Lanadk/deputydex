import { getScrutinDetailUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-detail.use-case";
import { getScrutinGroupesUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-groupes.use-case";
import { getScrutinVotesUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-votes.use-case";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";
import { isErr, isOk } from "@/app/_shared/result-pattern/result";

function repository(overrides: Partial<IScrutinDetailRepository> = {}): IScrutinDetailRepository {
    return {
        getScrutin: jest.fn().mockResolvedValue(null),
        getScrutinGroupes: jest.fn().mockResolvedValue([]),
        getScrutinVotes: jest.fn().mockResolvedValue([]),
        getScrutinSieges: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

const groupe = (code: string, membres: number | null): ScrutinGroupeVoteEntity => ({
    groupe_code: code, groupe_label: code, nombre_membres: membres, position_majoritaire: "pour",
    pour: 1, contre: 0, abstentions: 0, non_votants: 0,
});

const vote = (uid: string, prenom: string, nom: string): ScrutinDeputeVoteEntity => ({
    depute_uid: uid, prenom, nom, groupe_code: "SOC", groupe_label: "SOC",
    position: "pour", groupe_position: "pour", par_delegation: null,
});

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("getScrutinDetailUseCase", () => {
    it("renvoie NOT_FOUND quand le scrutin n'existe pas", async () => {
        const result = await getScrutinDetailUseCase(repository(), "VTX");
        expect(!isOk(result) && result.error).toBe("NOT_FOUND");
    });

    it("renvoie DB_ERROR quand le repository échoue", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const result = await getScrutinDetailUseCase(repository({ getScrutin: jest.fn().mockRejectedValue(new Error("boom")) }), "VTX");
        expect(!isOk(result) && result.error).toBe("DB_ERROR");
    });
});

describe("getScrutinGroupesUseCase", () => {
    it("classe les groupes du plus nombreux au moins nombreux, sans effectif en dernier", async () => {
        const result = await getScrutinGroupesUseCase(
            repository({ getScrutinGroupes: jest.fn().mockResolvedValue([groupe("SOC", 66), groupe("NI", null), groupe("RN", 121)]) }),
            "VTX"
        );
        expect(isOk(result) && result.data.map((g) => g.groupeCode)).toEqual(["RN", "SOC", "NI"]);
    });
});

describe("getScrutinVotesUseCase", () => {
    it("classe les votes par nom puis prénom, en ignorant accents et casse", async () => {
        const result = await getScrutinVotesUseCase(
            repository({ getScrutinVotes: jest.fn().mockResolvedValue([vote("3", "Zoé", "Martin"), vote("1", "Éric", "Abad"), vote("2", "Anne", "martin")]) }),
            "VTX"
        );
        expect(isOk(result) && result.data.map((v) => v.deputeUid)).toEqual(["1", "2", "3"]);
    });

    it("renvoie ERROR quand le repository échoue", async () => {
        const result = await getScrutinVotesUseCase(repository({ getScrutinVotes: jest.fn().mockRejectedValue(new Error("boom")) }), "VTX");
        expect(isErr(result)).toBe(true);
    });
});
