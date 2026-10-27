import { mapEntitiesToGroupesProximiteDTO } from "@/app/domains/groupes/mappers/groupes-proximite.mapper";
import { GroupeProximitePaireRow } from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

function row(a: string, b: string, alignes: number, communs = 1000, labels: { a?: string; b?: string } = {}): GroupeProximitePaireRow {
    return {
        groupe_a_code: a,
        groupe_a_label: labels.a ?? `Groupe ${a}`,
        groupe_b_code: b,
        groupe_b_label: labels.b ?? `Groupe ${b}`,
        nb_scrutins_communs: communs,
        nb_scrutins_alignes: alignes,
        taux_proximite: communs > 0 ? alignes / communs : null,
    };
}

describe("mapEntitiesToGroupesProximiteDTO", () => {
    it("computes the % from aligned/common counts (1 decimal) and sorts pairs by proximity, descending", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("LFI", "RN", 123), row("DEM", "EPR", 957)], null);

        expect(dto.paires.map((p) => [p.groupeACode, p.groupeBCode, p.tauxProximite])).toEqual([
            ["DEM", "EPR", 95.7],
            ["LFI", "RN", 12.3],
        ]);
        expect(dto.plusProches?.groupeACode).toBe("DEM");
        expect(dto.plusEloignes?.groupeACode).toBe("LFI");
    });

    it("drops pairs with no common scrutin instead of ranking them as the most distant", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("A", "B", 500), row("C", "D", 0, 0)], null);

        expect(dto.paires).toHaveLength(1);
        expect(dto.plusEloignes?.groupeACode).toBe("A");
    });

    it("falls back to the code when a label is missing", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([{ ...row("A", "B", 500), groupe_a_label: null }], null);
        expect(dto.paires[0].groupeALabel).toBe("A");
    });

    describe("renamed groups (lineage)", () => {
        const lineage = { UDR: "UDDPLR" };

        it("sums the counts of the old and new code into one pair under the current code (weighted, not an average of rates)", () => {
            const dto = mapEntitiesToGroupesProximiteDTO(
                [
                    row("RN", "UDR", 900, 1000), // 90% sur 1000 scrutins
                    row("RN", "UDDPLR", 100, 500), // 20% sur 500 scrutins
                ],
                null,
                lineage
            );

            expect(dto.paires).toEqual([
                { groupeACode: "RN", groupeALabel: "Groupe RN", groupeBCode: "UDDPLR", groupeBLabel: "Groupe UDDPLR", tauxProximite: 66.7, nbScrutinsCommuns: 1500 },
            ]);
        });

        it("merges regardless of which side of the pair the renamed group is on", () => {
            const dto = mapEntitiesToGroupesProximiteDTO([row("UDR", "DR", 300, 400), row("DR", "UDDPLR", 100, 100)], null, lineage);

            expect(dto.paires).toHaveLength(1);
            expect(dto.paires[0]).toEqual(expect.objectContaining({ tauxProximite: 80, nbScrutinsCommuns: 500 }));
            expect([dto.paires[0].groupeACode, dto.paires[0].groupeBCode].sort()).toEqual(["DR", "UDDPLR"]);
        });

        it("drops the pair made of the old and new code of the same group", () => {
            const dto = mapEntitiesToGroupesProximiteDTO([row("UDR", "UDDPLR", 5, 5), row("RN", "UDDPLR", 50, 100)], null, lineage);

            expect(dto.paires.map((p) => [p.groupeACode, p.groupeBCode])).toEqual([["RN", "UDDPLR"]]);
        });

        it("labels the merged group with the current code's label, even when the old code comes first", () => {
            const dto = mapEntitiesToGroupesProximiteDTO(
                [
                    row("RN", "SOC-NUPES", 10, 100, { b: "Socialistes et apparentés - NUPES" }),
                    row("RN", "SOC", 10, 100, { b: "Socialistes et apparentés" }),
                ],
                null,
                { "SOC-NUPES": "SOC" }
            );

            expect(dto.paires[0].groupeBLabel).toBe("Socialistes et apparentés");
        });
    });

    it("extracts the other group of each pair involving the government reference group, whichever side it is on", () => {
        const dto = mapEntitiesToGroupesProximiteDTO(
            [row("DEM", "EPR", 76, 80), row("EPR", "RN", 36, 90), row("LFI", "RN", 300)],
            "EPR"
        );

        expect(dto.gouvernementReference).toEqual({ code: "EPR", label: "Groupe EPR" });
        expect(dto.proximiteGouvernement).toEqual([
            { groupeCode: "DEM", groupeLabel: "Groupe DEM", tauxProximite: 95, nbScrutinsCommuns: 80 },
            { groupeCode: "RN", groupeLabel: "Groupe RN", tauxProximite: 40, nbScrutinsCommuns: 90 },
        ]);
    });

    it("has no government section when there is no reference group for the legislature", () => {
        const dto = mapEntitiesToGroupesProximiteDTO([row("DEM", "EPR", 950)], null);
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
