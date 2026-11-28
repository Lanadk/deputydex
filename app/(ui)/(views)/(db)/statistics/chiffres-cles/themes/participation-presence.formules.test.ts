import { findKeyFigureTheme } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";
import { SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";

const blockId = (b: SectionBlock): string => (b.type === "table" ? b.id : "config" in b ? b.config.id : b.type);

describe("thème Participation & présence", () => {
    const theme = findKeyFigureTheme("participation-presence")!;
    const blocks = theme.sections.flatMap((s) => s.blocks as SectionBlock[]);

    it("contient le volet participation puis le volet présence", () => {
        expect(theme.sections.map((s) => s.id)).toEqual([
            "participation-presence-classement",
            "participation-presence-evolution",
            "participation-presence-evolution-groupe",
            "presence-vue-ensemble",
            "presence-rythme",
            "presence-groupes",
            "presence-annees",
        ]);
    });

    it.each(blocks.filter((b) => b.type === "chart" || b.type === "table" || b.type === "entity-chart").map((b) => [blockId(b), b] as const))(
        "%s a sa formule, juste sous lui",
        (_id, block) => {
            expect(block.formulas?.length ?? 0).toBeGreaterThan(0);
            for (const formula of block.formulas!) {
                expect(formula.label).toBeTruthy();
                expect(formula.legend.length).toBeGreaterThan(0);
            }
        }
    );

    it("une rangée de 4 KPI : pas de formule sous chaque KPI, un seul accordéon sur toute la largeur derrière la rangée", () => {
        const vue = theme.sections.find((s) => s.id === "presence-vue-ensemble")!.blocks as SectionBlock[];
        const kpis = vue.filter((b) => b.type === "card");
        expect(kpis).toHaveLength(4);
        expect(kpis.every((b) => !b.formulas)).toBe(true);

        const apres = vue[vue.indexOf(kpis[3]) + 1];
        expect(apres.type).toBe("formulas");
        expect(apres.colSpan).toBe(4);
        expect(apres.type === "formulas" && apres.formulas.map((f) => f.label)).toEqual([
            "taux de présence",
            "présence en séance",
            "présence en commission (et excusés)",
            "jours de présence d'un député, par mois",
        ]);
    });

    it("prévient en tête de page que les chiffres sont des approximations", () => {
        expect(theme.notices).toEqual([expect.objectContaining({ variant: "warning", title: "Des estimations, pas un pointage" })]);
        expect(theme.notices![0].paragraphs.join(" ")).toMatch(/approximation/);
    });

    it("le thème séparé « présence des député·es » n'existe plus", () => {
        expect(findKeyFigureTheme("presence-deputes")).toBeNull();
    });
});
