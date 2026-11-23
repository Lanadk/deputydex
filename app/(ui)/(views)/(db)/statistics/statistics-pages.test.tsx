import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

// Registres réduits : les vrais tirent les configurations de toutes les pages.
jest.mock("@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry", () => {
    const icon = () => null;
    const section = (label: string) => [{ id: label, label, icon, cols: 1, blocks: [] }];
    const KEY_FIGURE_THEMES = [
        { slug: "femmes-assemblee", title: "Les femmes", teaser: "Parité", icon, color: "bleu", category: "humain", sections: section("La parité") },
        { slug: "age-des-deputes", title: "L'âge", teaser: "Âges", icon, color: "rouge", category: "humain", sections: section("Les âges") },
        { slug: "origines", title: "Les origines", teaser: "Bientôt", icon, color: "blanc", category: "humain", sections: [] },
        { slug: "textes-de-loi", title: "Les textes de loi", teaser: "Bientôt", icon, color: "bleu", category: "activite", sections: [] },
    ];
    const KEY_FIGURE_CATEGORIES = [
        { id: "humain", label: "Qui sont les député·es ?", icon, color: "bleu" },
        { id: "activite", label: "Activité législative", icon, color: "bleu" },
    ];
    const pret = (t: { sections: unknown[] }) => t.sections.length > 0;
    return {
        KEY_FIGURE_THEMES,
        KEY_FIGURE_CATEGORIES,
        themesDisponibles: () => KEY_FIGURE_THEMES.filter(pret),
        themesDeCategorie: (id: string) => {
            const ceux = KEY_FIGURE_THEMES.filter((t) => t.category === id);
            return { disponibles: ceux.filter(pret), aVenir: ceux.filter((t) => !pret(t)) };
        },
    };
});
jest.mock("@/app/(ui)/_shared/statistics/catalog/stats-catalog", () => ({
    STATS_CATALOG: [
        { id: "acteurs", label: "Députés", icon: () => null, stats: [{}, {}, {}] },
        { id: "votes", label: "Votes", icon: () => null, stats: [{}, {}] },
    ],
}));

import StatisticsHubClient from "@/app/(ui)/(views)/(db)/statistics/statistics-hub-client";
import ChiffresClesPageClient, { categoriesGrandeADroite } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/chiffres-cles-page-client";

describe("categoriesGrandeADroite", () => {
    it("une catégorie sur deux parmi celles qui ont une grande tuile 2 × 2 (bandeau et vides ne comptent pas)", () => {
        const aDroite = categoriesGrandeADroite([
            { id: "humain", disponibles: 5 },  // grande à gauche
            { id: "groupes", disponibles: 1 }, // bandeau : ne compte pas
            { id: "votes", disponibles: 5 },   // grande à droite
            { id: "activite", disponibles: 0 },
        ]);

        expect([...aDroite]).toEqual(["votes"]);
    });
});

describe("hub Statistiques", () => {
    it("deux entrées, avec les nombres comptés dans les registres", () => {
        render(<StatisticsHubClient />);

        const chiffres = screen.getByRole("link", { name: /Chiffres clés/ });
        expect(chiffres).toHaveAttribute("href", "/statistics/chiffres-cles");
        expect(chiffres).toHaveTextContent("2thèmes expliqués en graphiques");

        const avance = screen.getByRole("link", { name: /Mode avancé/ });
        expect(avance).toHaveAttribute("href", "/statistics/avance");
        expect(avance).toHaveTextContent("5statistiques à explorer");
        expect(within(avance).getByText("Députés")).toBeInTheDocument();
    });

    it("une tuile par catégorie : lien vers sa section, sauf sans thème prêt", () => {
        render(<StatisticsHubClient />);

        expect(screen.getByRole("link", { name: /Qui sont les député·es \?/ }))
            .toHaveAttribute("href", "/statistics/chiffres-cles#categorie-humain");
        expect(screen.getByText("Activité législative").closest("a")).toBeNull();
        expect(screen.getByText("Bientôt")).toBeInTheDocument();
    });
});

describe("page Chiffres clés", () => {
    it("une section par catégorie (ancre #categorie-…), ses thèmes prêts en tuiles-liens", () => {
        const { container } = render(<ChiffresClesPageClient />);

        const humain = container.querySelector("#categorie-humain") as HTMLElement;
        expect(within(humain).getByRole("heading", { name: "Qui sont les député·es ?" })).toBeInTheDocument();
        expect(within(humain).getByText("2 thèmes")).toBeInTheDocument();
        expect(within(humain).getByRole("link", { name: /Les femmes/ })).toHaveAttribute("href", "/statistics/chiffres-cles/femmes-assemblee");
        expect(within(humain).getByRole("link", { name: /L'âge/ })).toBeInTheDocument();
        // 2 thèmes : deux tuiles larges qui listent les sections de leur page.
        expect(within(humain).getByRole("link", { name: /Les femmes/ })).toHaveTextContent("La parité");
    });

    it("thèmes à venir : listés sans lien ; une catégorie sans thème prêt n'a que cette liste", () => {
        const { container } = render(<ChiffresClesPageClient />);

        const humain = container.querySelector("#categorie-humain") as HTMLElement;
        expect(within(humain).getByText("Les origines").closest("a")).toBeNull();

        const activite = container.querySelector("#categorie-activite") as HTMLElement;
        expect(within(activite).queryByRole("link")).not.toBeInTheDocument();
        expect(within(activite).getByRole("listitem")).toHaveTextContent("Les textes de loi");
    });
});
