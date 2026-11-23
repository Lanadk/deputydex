import {
    getScrutinPlusSerreUseCase,
    scrutinLePlusSerre,
    SCRUTIN_SERRE_MIN_VOIX,
} from "@/app/domains/scrutins/use-cases/get-scrutin-plus-serre.use-case";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { IScrutinsPeriodeRepository, ScrutinsPeriodeEntity } from "@/app/domains/scrutins/repositories/IScrutinsPeriodeRepository";

const scrutin = (uid: string, pour: number | null, contre: number | null, date = "2026-11-01T00:00:00.000Z"): ScrutinListItemDTO => ({
    uid, numero: uid, date, titre: `scrutin ${uid}`,
    type: { code: "SPO", libelle: "scrutin public ordinaire" },
    resultat: { isAdopte: (pour ?? 0) > (contre ?? 0), libelle: null },
    objet: { code: "amendement", libelle: "Amendement" },
    pour, contre, abstentions: 0,
});

describe("scrutinLePlusSerre", () => {
    it("le plus petit écart parmi les scrutins assez suivis", () => {
        const peuSuivi = scrutin("peu", 3, 3);
        expect(3 + 3).toBeLessThan(SCRUTIN_SERRE_MIN_VOIX);
        expect(scrutinLePlusSerre([scrutin("large", 300, 100), peuSuivi, scrutin("serre", 70, 71)])?.uid).toBe("serre");
    });

    it("à écart égal : le plus de voix, puis le plus récent", () => {
        expect(scrutinLePlusSerre([scrutin("55", 55, 55), scrutin("72", 72, 72)])?.uid).toBe("72");
        expect(scrutinLePlusSerre([
            scrutin("ancien", 60, 60, "2026-10-25T00:00:00.000Z"),
            scrutin("recent", 60, 60, "2026-11-10T00:00:00.000Z"),
        ])?.uid).toBe("recent");
    });

    it("ignore les scrutins sans décompte ; aucun candidat : null", () => {
        expect(scrutinLePlusSerre([scrutin("sans", null, null)])).toBeNull();
        expect(scrutinLePlusSerre([])).toBeNull();
    });
});

const entity = (uid: string, pour: number, contre: number, resultat: string): ScrutinListItemEntity => ({
    uid, numero: uid, date_scrutin: new Date("2026-11-04T00:00:00Z"), titre: "l'amendement n° 710",
    type_scrutin_code: "SPO", type_scrutin_libelle: "scrutin public ordinaire", resultat_code: resultat,
    objet: "amendement", total_pour: pour, total_contre: contre, total_abstentions: 0,
});

const repository = (periode: ScrutinsPeriodeEntity | null): IScrutinsPeriodeRepository => ({
    getScrutinsDernierMois: jest.fn().mockResolvedValue(periode),
});

describe("getScrutinPlusSerreUseCase", () => {
    it("période et scrutin le plus serré, avec son écart", async () => {
        const result = await getScrutinPlusSerreUseCase(repository({
            debut: new Date("2026-10-21T00:00:00Z"),
            fin: new Date("2026-11-19T00:00:00Z"),
            rows: [entity("A", 300, 100, "adopté"), entity("B", 72, 72, "rejeté")],
        }), 17);

        expect(result).toEqual({
            success: true,
            data: {
                periode: { debut: "2026-10-21", fin: "2026-11-19" },
                scrutin: expect.objectContaining({ uid: "B", resultat: expect.objectContaining({ isAdopte: false }) }),
                ecart: 0,
            },
        });
    });

    it("législature sans scrutin daté : tout à null", async () => {
        await expect(getScrutinPlusSerreUseCase(repository(null), 17)).resolves.toEqual({
            success: true,
            data: { periode: null, scrutin: null, ecart: null },
        });
    });
});
