jest.mock("@/app/(ui)/gateways/statistics/statistics.gateway", () => ({
    statisticsGateway: { fetchStat: jest.fn() },
}));

import { groupesPariteInsight } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insights/groupes-parite.insight";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

const fetchStat = statisticsGateway.fetchStat as jest.Mock;

const DEFINITION: StatDefinition = {
    id: "groupes.parite",
    slug: "parite",
    domain: "groupes",
    scope: "entity",
    title: "Parité au sein du groupe",
    category: "Composition",
    keywords: [],
    methodology: "",
    dataShape: "distribution",
};

const CURRENT: RawStatData = {
    shape: "distribution",
    items: [
        { label: "Hommes", value: 54 },
        { label: "Femmes", value: 46 },
    ],
};

describe("groupesPariteInsight", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns null for an aggregate context (no entity to comment on)", async () => {
        const result = await groupesPariteInsight(DEFINITION, { filters: { legislature: 17 } }, CURRENT);
        expect(result).toBeNull();
        expect(fetchStat).not.toHaveBeenCalled();
    });

    it("returns null when no legislature is chosen", async () => {
        const result = await groupesPariteInsight(DEFINITION, { entityId: "RN" }, CURRENT);
        expect(result).toBeNull();
    });

    it("combines the previous-legislature and domain-average comparisons when both succeed", async () => {
        fetchStat.mockImplementation((domain: string, slug: string) => {
            if (slug === "parite") {
                // législature précédente : 44% de femmes
                return Promise.resolve({ shape: "distribution", items: [{ label: "Hommes", value: 56 }, { label: "Femmes", value: 44 }] });
            }
            // moyenne des groupes : 35% de femmes
            return Promise.resolve({ shape: "distribution", items: [{ label: "Hommes", value: 65 }, { label: "Femmes", value: 35 }] });
        });

        const result = await groupesPariteInsight(
            DEFINITION,
            { entityId: "RN", filters: { legislature: 17, entityLabel: "RN" } },
            CURRENT
        );

        expect(fetchStat).toHaveBeenCalledWith("groupes", "parite", { entityId: "RN", filters: { legislature: 16 } });
        expect(fetchStat).toHaveBeenCalledWith("groupes", "parite-moyenne", { filters: { legislature: 17 } });
        expect(result).toBe(
            "RN a un taux de femmes de 46%, c'est au-dessus de la législature précédente, qui était de 44%, " +
                "c'est au-dessus de la moyenne des groupes, qui est de 35%."
        );
    });

    it("does not fetch the previous legislature when already on the first one", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [{ label: "Hommes", value: 65 }, { label: "Femmes", value: 35 }] });

        await groupesPariteInsight(DEFINITION, { entityId: "RN", filters: { legislature: 1 } }, CURRENT);

        expect(fetchStat).not.toHaveBeenCalledWith("groupes", "parite", expect.anything());
    });

    it("still returns a phrase when only the domain average succeeds", async () => {
        fetchStat.mockImplementation((_domain: string, slug: string) => {
            if (slug === "parite") return Promise.reject(new Error("no previous legislature"));
            return Promise.resolve({ shape: "distribution", items: [{ label: "Hommes", value: 65 }, { label: "Femmes", value: 35 }] });
        });

        const result = await groupesPariteInsight(DEFINITION, { entityId: "RN", filters: { legislature: 17 } }, CURRENT);

        expect(result).toBe("RN a un taux de femmes de 46%, c'est au-dessus de la moyenne des groupes, qui est de 35%.");
    });

    it("returns null when neither comparison is available", async () => {
        fetchStat.mockRejectedValue(new Error("boom"));

        const result = await groupesPariteInsight(DEFINITION, { entityId: "RN", filters: { legislature: 17 } }, CURRENT);

        expect(result).toBeNull();
    });
});
