import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({ usePathname: () => "/groupes" }));

const mockToggle = jest.fn();
let mockIsOpen = true;
jest.mock("@/app/(ui)/providers/sidebar-provider", () => ({
    useSidebar: () => ({ isOpen: mockIsOpen, toggle: mockToggle, setOpen: jest.fn() }),
}));

import AppSidebar from "@/app/(ui)/components/sidebar/app-sidebar";

const setViewportWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
};

describe("AppSidebar — fond du menu mobile", () => {
    const originalWidth = window.innerWidth;

    beforeEach(() => {
        mockToggle.mockClear();
        mockIsOpen = true;
    });

    afterAll(() => setViewportWidth(originalWidth));

    it("en mobile, menu ouvert : un bouton « Fermer le menu » ferme le menu", () => {
        setViewportWidth(800);
        render(<AppSidebar />);

        fireEvent.click(screen.getByRole("button", { name: "Fermer le menu" }));

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it("pas de fond quand le menu est fermé", () => {
        setViewportWidth(800);
        mockIsOpen = false;
        render(<AppSidebar />);

        expect(screen.queryByRole("button", { name: "Fermer le menu" })).not.toBeInTheDocument();
    });

    it("pas de fond sur grand écran", () => {
        setViewportWidth(1440);
        render(<AppSidebar />);

        expect(screen.queryByRole("button", { name: "Fermer le menu" })).not.toBeInTheDocument();
    });
});

describe("AppSidebar — bulles du menu replié", () => {
    beforeEach(() => setViewportWidth(1440));

    it("replié : chaque lien est nommé par son libellé, la bulle s'ouvre au survol", async () => {
        mockIsOpen = false;
        render(<AppSidebar />);

        const lien = screen.getByRole("link", { name: "Groupes" });
        fireEvent.mouseEnter(lien);
        expect(await screen.findByRole("tooltip")).toHaveTextContent("Groupes");
        fireEvent.mouseLeave(lien);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        // L'entrée du menu et le « © » du bas, qui n'affiche que le symbole une fois replié.
        expect(screen.getAllByRole("link", { name: "Mentions légales" })).toHaveLength(2);
    });

    it("déplié : libellés visibles, pas de bulle", () => {
        mockIsOpen = true;
        render(<AppSidebar />);

        fireEvent.mouseEnter(screen.getByRole("link", { name: "Groupes" }));

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
});
