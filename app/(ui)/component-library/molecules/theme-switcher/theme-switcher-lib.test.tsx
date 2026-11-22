import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: mockSetTheme }) }));

import { ThemeSwitcherLib } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib";

describe("ThemeSwitcherLib", () => {
    beforeEach(() => mockSetTheme.mockClear());

    it("ouvre le panneau et applique le thème choisi", () => {
        render(<ThemeSwitcherLib label="Thème" />);

        const trigger = screen.getByRole("button", { name: "Thème" });
        expect(trigger).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        fireEvent.click(screen.getByRole("button", { name: /Dark/ }));

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("icône seule : nommée « Thème » pour les lecteurs d'écran", () => {
        render(<ThemeSwitcherLib />);

        expect(screen.getByRole("button", { name: "Thème" })).toBeInTheDocument();
    });

    it("se ferme avec Échap, la croix ou un clic à l'extérieur", () => {
        render(<div><ThemeSwitcherLib label="Thème" /><p>Ailleurs</p></div>);
        const open = () => fireEvent.click(screen.getByRole("button", { name: "Thème" }));
        const panel = () => screen.queryByRole("group", { name: "Choix du thème" });

        open();
        fireEvent.keyDown(document, { key: "Escape" });
        expect(panel()).not.toBeInTheDocument();

        open();
        fireEvent.click(screen.getByRole("button", { name: "Fermer le choix du thème" }));
        expect(panel()).not.toBeInTheDocument();

        open();
        fireEvent.mouseDown(screen.getByText("Ailleurs"));
        expect(panel()).not.toBeInTheDocument();
    });
});
