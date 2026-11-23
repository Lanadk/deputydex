import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScrollHintLib } from "@/app/(ui)/component-library/molecules/scroll-hint/scroll-hint-lib";

describe("ScrollHintLib", () => {
    const matchMedia = (reduit: boolean) => {
        window.matchMedia = jest.fn().mockReturnValue({ matches: reduit }) as unknown as typeof window.matchMedia;
    };

    it("lien nommé par son libellé vers l'ancre de la cible", () => {
        render(<ScrollHintLib target="suite" label="Défiler pour l'actu" />);

        expect(screen.getByRole("link", { name: "Défiler pour l'actu" })).toHaveAttribute("href", "#suite");
    });

    it("au clic : défilement doux jusqu'à la cible, instantané si les animations sont refusées", () => {
        const cible = document.createElement("section");
        cible.id = "suite";
        cible.scrollIntoView = jest.fn();
        document.body.appendChild(cible);
        render(<ScrollHintLib target="suite" label="Défiler" />);

        matchMedia(false);
        fireEvent.click(screen.getByRole("link", { name: "Défiler" }));
        expect(cible.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });

        matchMedia(true);
        fireEvent.click(screen.getByRole("link", { name: "Défiler" }));
        expect(cible.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "auto", block: "start" });

        cible.remove();
    });
});
