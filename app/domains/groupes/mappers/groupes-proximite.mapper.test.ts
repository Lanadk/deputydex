import { mapEntitiesToGroupesProximiteDTO } from "@/app/domains/groupes/mappers/groupes-proximite.mapper";
import { GroupeProximitePaireRow } from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

function row(a: string, b: string, taux: number | null, communs = 100): GroupeProximitePaireRow {
    return { groupe_a_code: a, groupe_a_label: `Groupe ${a}`, groupe_b_code: b, groupe_b_label: `Groupe ${b}`, nb_scrutins_communs: communs, taux_proximite: taux };
}

describe("mapEntitiesToGroupesProximiteDTO", () => {
    it("converts the 0-1 scale to a % rounded to 1 decimal and sorts pairs by proximity, descending", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("LFI", "RN", 0.1234), row("EPR", "DEM", 0.9567)], null);

        expect(dto.paires.map((p) => [p.groupeACode, p.groupeBCode, p.tauxProximite])).toEqual([
            ["EPR", "DEM", 95.7],
            ["LFI", "RN", 12.3],
        ]);
        expect(dto.plusProches?.groupeACode).toBe("EPR");
        expect(dto.plusEloignes?.groupeACode).toBe("LFI");
    });

    it("drops pairs with a null proximity instead of ranking them as the most distant", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("A", "B", 0.5), row("C", "D", null)], null);

        expect(dto.paires).toHaveLength(1);
        expect(dto.plusEloignes?.groupeACode).toBe("A");
    });

    it("falls back to the code when a label is missing", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([{ ...row("A", "B", 0.5), groupe_a_label: null }], null);
        expect(dto.paires[0].groupeALabel).toBe("A");
    });

    it("extracts the other group of each pair involving the government reference group, whichever side it is on", () => {
        const dto = mapEntitiesToGroupesProximiteDTO(
            [row("DEM", "EPR", 0.95, 80), row("EPR", "RN", 0.4, 90), row("LFI", "RN", 0.3)],
            "EPR"
        );

        expect(dto.gouvernementReference).toEqual({ code: "EPR", label: "Groupe EPR" });
        expect(dto.proximiteGouvernement).toEqual([
            { groupeCode: "DEM", groupeLabel: "Groupe DEM", tauxProximite: 95, nbScrutinsCommuns: 80 },
            { groupeCode: "RN", groupeLabel: "Groupe RN", tauxProximite: 40, nbScrutinsCommuns: 90 },
        ]);
    });

    it("has no government section when there is no reference group for the legislature", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("DEM", "EPR", 0.95)], null);
        expect(dto.gouvernementReference).toBeNull();
        expect(dto.proximiteGouvernement).toEqual([]);
    });

    it("returns empty results when there are no rows", () => {
        expect(mapEntitiesToGroupesProximiteDTO([], "EPR")).toEqual({
            paires: [],
            plusProches: null,
            plusEloignes: null,
            gouvernementReference: { code: "EPR", label: "EPR" },
            proximiteGouvernement: [],
        });
    });
});
