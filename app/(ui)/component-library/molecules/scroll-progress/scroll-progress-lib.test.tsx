import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    indexSectionActive,
    positionsSections,
    progressionDefilement,
    ScrollProgressLib,
} from "@/app/(ui)/component-library/molecules/scroll-progress/scroll-progress-lib";

describe("ScrollProgressLib — calculs", () => {
    it("progression bornée entre 0 et 1 ; 0 si la page ne défile pas", () => {
        expect(progressionDefilement(500, 1000)).toBe(0.5);
        expect(progressionDefilement(-20, 1000)).toBe(0);
        expect(progressionDefilement(1200, 1000)).toBe(1);
        expect(progressionDefilement(0, 0)).toBe(0);
    });

    it("une section est placée là où elle arrive en haut de l'écran", () => {
        expect(positionsSections([0, 900, 2000], 1800)).toEqual([0, 0.5, 1]);
        expect(positionsSections([0, 400], 0)).toEqual([0, 0]);
    });

    it("section active : la dernière dont le début a passé le repère", () => {
        expect(indexSectionActive([0, 900, 1800], 450)).toBe(0);
        expect(indexSectionActive([0, 900, 1800], 900)).toBe(1);
        expect(indexSectionActive([0, 900, 1800], 2300)).toBe(2);
    });
});

describe("ScrollProgressLib", () => {
    const SECTIONS = [{ id: "a", label: "Accueil" }, { id: "b", label: "L'actu" }];

    it("navigation : un lien par section vers son ancre, une seule section courante", () => {
        render(<ScrollProgressLib sections={SECTIONS} />);

        expect(screen.getByRole("navigation", { name: "Progression dans la page" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "#a");
        expect(screen.getByRole("link", { name: "L'actu" })).toHaveAttribute("href", "#b");
        // jsdom ne fait pas de mise en page (tout est à 0) : on vérifie seulement l'unicité.
        expect(screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "location")).toHaveLength(1);
    });

    it("au clic : défilement doux jusqu'à la section, instantané si les animations sont refusées", () => {
        const cible = document.createElement("section");
        cible.id = "b";
        cible.scrollIntoView = jest.fn();
        document.body.appendChild(cible);
        render(<ScrollProgressLib sections={SECTIONS} />);

        window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
        fireEvent.click(screen.getByRole("link", { name: "L'actu" }));
        expect(cible.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });

        window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
        fireEvent.click(screen.getByRole("link", { name: "L'actu" }));
        expect(cible.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "auto", block: "start" });

        cible.remove();
    });
});
