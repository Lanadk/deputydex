jest.mock("@/app/(ui)/gateways/statistics/statistics.gateway", () => ({
    statisticsGateway: { fetchStat: jest.fn() },
}));

import { GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/groupes/[code]/config";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { ParagraphItem } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";

const fetchStat = statisticsGateway.fetchStat as jest.Mock;

const STATS: Record<string, unknown> = {
    "groupes/presence": { shape: "distribution", items: [{ label: "LFI-NFP", value: 62.3 }, { label: "RN", value: 58.7 }, { label: "EPR", value: 55.5 }] },
    "groupes/presence-composantes": {
        shape: "multi-series",
        series: [
            { name: "1 · En séance", items: [{ label: "RN", value: 55.1 }] },
            { name: "2 · En commission", items: [{ label: "RN", value: 40.2 }] },
            { name: "4 · Participation aux scrutins", items: [{ label: "RN", value: 21 }] },
        ],
    },
    "groupes/presence-evolution": { shape: "timeseries", points: [{ label: "2024-09", value: 63.1 }] },
    "groupes/presence-annee-parlementaire": {
        shape: "multi-series",
        series: [{ name: "EPR", items: [{ label: "2024-2025", value: 6 }] }, { name: "RN", items: [{ label: "2024-2025", value: 7.4 }] }],
    },
    "acteurs/presence-moyenne": {
        shape: "multi-series",
        series: [{ name: "17ᵉ législature", items: [{ label: "0 · Présence (tous jours attendus)", value: 57 }, { label: "1 · En séance", value: 50.2 }] }],
    },
};

const section = () => {
    const found = GROUPES_SECTIONS.find((s) => s.id === "presence");
    if (!found) throw new Error("section presence absente");
    return found;
};

describe("Fiche groupe — ordre des sections", () => {
    it("composition et présence avant la liste des membres", () => {
        expect(GROUPES_SECTIONS.map((s) => s.id)).toEqual([
            "groupe-activity", "groupe-composition", "presence", "groupe-members", "votes-cohesion", "comportement-politique",
        ]);
    });
});

describe("Fiche groupe — section Présence", () => {
    beforeEach(() => {
        fetchStat.mockReset();
        fetchStat.mockImplementation(async (domain: string, statId: string) => STATS[`${domain}/${statId}`]);
    });

    it("lit les stats de présence de la législature et les met en forme pour le groupe", async () => {
        const data = (await section().gatewayFn!({ code: "RN", legislature: 17 })) as unknown as Record<string, { data?: unknown }>;

        expect(fetchStat).toHaveBeenCalledWith("groupes", "presence-evolution", { entityId: "RN", filters: { legislature: 17 } });
        expect(data["kpi-presence-taux"].data).toEqual({ label: "taux de présence · 2ᵉ groupe sur 3", value: "58.7%" });
        expect(data["kpi-presence-seance"].data).toEqual({ label: "présence en séance", value: "55.1%" });
        expect(data["kpi-presence-scrutins"].data).toEqual({ label: "participation aux scrutins", value: "21%" });
        expect(data["chart-presence-comparaison"]).toEqual(expect.objectContaining({
            series: [{ dataKey: "s0", label: "Groupe RN" }, { dataKey: "s1", label: "Assemblée" }],
        }));
        expect(data["chart-presence-evolution"].data).toEqual([{ label: "2024-09", value: 63.1 }]);
        expect(data["chart-presence-annee-parlementaire"].data).toEqual([{ label: "2024-2025", value: 7.4 }]);
    });

    it("une stat en échec laisse les autres s'afficher", async () => {
        fetchStat.mockImplementation(async (domain: string, statId: string) => {
            if (statId === "presence-composantes") throw new Error("500");
            return STATS[`${domain}/${statId}`];
        });

        const data = (await section().gatewayFn!({ code: "RN", legislature: 17 })) as unknown as Record<string, { data?: unknown }>;

        expect(data["kpi-presence-taux"].data).toEqual({ label: "taux de présence · 2ᵉ groupe sur 3", value: "58.7%" });
        expect(data["kpi-presence-seance"].data).toEqual({ label: "présence en séance", value: "—" });
    });

    it("non-inscrits : pas de classement, avertissement dédié", async () => {
        const data = (await section().gatewayFn!({ code: "NI-17", legislature: 17 })) as unknown as Record<string, { data?: unknown }>;
        expect(data["kpi-presence-taux"].data).toEqual({ label: "taux de présence", value: "—" });

        const bloc = section().blocks.find((b) => b.type === "paragraph");
        if (!bloc || bloc.type !== "paragraph" || !("render" in bloc) || !bloc.render) throw new Error("bloc avertissement absent");
        const [callout] = bloc.render(data["presence-avertissement"] as Parameters<typeof bloc.render>[0]) as ParagraphItem[];
        expect(callout).toEqual(expect.objectContaining({
            type: "callout",
            paragraphs: expect.arrayContaining([expect.stringMatching(/^Les non-inscrits ne forment pas un groupe politique/)]),
        }));
    });
});
