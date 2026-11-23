import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    dispositionThemes,
    KeyFigureThemesAVenir,
    KeyFigureThemeTile,
    libelleNombreThemes,
} from "@/app/(ui)/components/statistics/key-figure-tiles";
import { KeyFigureTheme } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

const Icone = () => <svg />;
const THEME: KeyFigureTheme = {
    slug: "femmes-assemblee", title: "Les femmes à l'Assemblée", teaser: "Part de femmes élues.",
    icon: Icone as unknown as KeyFigureTheme["icon"], color: "rouge", category: "humain", sections: [],
};

describe("dispositionThemes", () => {
    const cases = (n: number) => dispositionThemes(n).reduce((total, t) => total + t.colSpan * t.rowSpan, 0);

    it("une tuile par thème, et des rangées de 4 toujours pleines", () => {
        for (let n = 1; n <= 12; n++) {
            expect(dispositionThemes(n)).toHaveLength(n);
            expect(cases(n) % 4).toBe(0);
        }
        expect(dispositionThemes(0)).toEqual([]);
    });

    it("une disposition propre à chaque effectif", () => {
        expect(dispositionThemes(1)).toEqual([{ colSpan: 4, rowSpan: 1, sommaire: true }]); // bandeau
        expect(dispositionThemes(5)[0]).toEqual({ colSpan: 2, rowSpan: 2, sommaire: true }); // grande 2 × 2
        expect(dispositionThemes(5).slice(1).every((t) => t.colSpan === 1 && t.rowSpan === 1)).toBe(true);
        expect(dispositionThemes(6).some((t) => t.rowSpan === 2)).toBe(false);
    });
});

describe("libelleNombreThemes", () => {
    it("accorde, et annonce « Bientôt » sans thème prêt", () => {
        expect(libelleNombreThemes(0)).toBe("Bientôt");
        expect(libelleNombreThemes(1)).toBe("1 thème");
        expect(libelleNombreThemes(5)).toBe("5 thèmes");
    });
});

describe("KeyFigureThemeTile", () => {
    it("lien vers la page du thème, au type du thème (accent + encre)", () => {
        render(<KeyFigureThemeTile theme={THEME} />);

        const lien = screen.getByRole("link", { name: /Les femmes à l'Assemblée/ });
        expect(lien).toHaveAttribute("href", "/statistics/chiffres-cles/femmes-assemblee");
        expect(lien.style.getPropertyValue("--bento-tile-color")).toBe("var(--stat-type-rouge)");
        expect(lien.style.getPropertyValue("--bento-tile-ink")).toBe("var(--stat-type-rouge-ink)");
        expect(lien).toHaveTextContent("Part de femmes élues.");
        expect(lien).not.toHaveTextContent("Au sommaire");
    });

    it("grande tuile : liste les sections de la page du thème ; à droite si demandé", () => {
        const avecSections = {
            ...THEME,
            sections: [
                { id: "a", label: "La part de femmes", icon: Icone, cols: 1, blocks: [] },
                { id: "b", label: "L'évolution", icon: Icone, cols: 1, blocks: [] },
            ],
        } as unknown as KeyFigureTheme;
        render(<KeyFigureThemeTile theme={avecSections} taille={{ colSpan: 2, rowSpan: 2, sommaire: true }} aDroite />);

        const lien = screen.getByRole("link");
        expect(lien).toHaveTextContent("Au sommaire");
        expect(lien).toHaveTextContent("La part de femmes");
        expect(lien).toHaveTextContent("L'évolution");
        expect(lien).toHaveClass("stat-tile--vedette", "stat-tile--a-droite", "bento-tile--c2", "bento-tile--r2");
    });
});

describe("KeyFigureThemesAVenir", () => {
    it("liste les thèmes à venir, sans lien", () => {
        render(<KeyFigureThemesAVenir themes={[THEME]} />);

        expect(screen.getByText("Bientôt")).toBeInTheDocument();
        expect(screen.getByRole("listitem")).toHaveTextContent("Les femmes à l'Assemblée");
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("rien sans thème à venir", () => {
        const { container } = render(<KeyFigureThemesAVenir themes={[]} />);

        expect(container).toBeEmptyDOMElement();
    });
});
