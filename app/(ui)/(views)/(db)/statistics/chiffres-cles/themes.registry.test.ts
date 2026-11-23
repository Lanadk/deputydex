import {
    KEY_FIGURE_CATEGORIES,
    KEY_FIGURE_THEMES,
    KeyFigureTheme,
    themesDeCategorie,
    themesDisponibles,
} from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

const theme = (slug: string, category: KeyFigureTheme["category"], pret: boolean): KeyFigureTheme => ({
    slug, title: slug, teaser: "", icon: (() => null) as unknown as KeyFigureTheme["icon"],
    color: "bleu", category, sections: pret ? [{} as KeyFigureTheme["sections"][number]] : [],
});

describe("registre des Chiffres clés", () => {
    it("chaque thème a un des trois types de la palette P1 (blanc, rouge, bleu)", () => {
        for (const t of KEY_FIGURE_THEMES) expect(["blanc", "rouge", "bleu"]).toContain(t.color);
    });

    it("deux thèmes voisins d'une même catégorie (parmi ceux qui ont une page) n'ont pas la même couleur", () => {
        for (const { id } of KEY_FIGURE_CATEGORIES) {
            const couleurs = themesDeCategorie(id).disponibles.map((t) => t.color);
            couleurs.slice(1).forEach((c, i) => expect(c).not.toBe(couleurs[i]));
        }
    });

    it("thèmes disponibles : ceux qui ont au moins une section, dans l'ordre", () => {
        const themes = [theme("a", "humain", true), theme("b", "humain", false), theme("c", "votes", true)];

        expect(themesDisponibles(themes).map((t) => t.slug)).toEqual(["a", "c"]);
    });

    it("thèmes d'une catégorie : séparés entre disponibles et à venir", () => {
        const themes = [theme("a", "humain", true), theme("b", "humain", false), theme("c", "votes", true)];

        const { disponibles, aVenir } = themesDeCategorie("humain", themes);
        expect(disponibles.map((t) => t.slug)).toEqual(["a"]);
        expect(aVenir.map((t) => t.slug)).toEqual(["b"]);
    });
});
