import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";

const TABS = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Bêta", badge: 3 },
    { id: "c", label: "Gamma" },
];

function Harness() {
    const [active, setActive] = useState("a");
    return (
        <>
            <TabsLib tabs={TABS} activeId={active} onChange={setActive} ariaLabel="Vues" idPrefix="t" />
            <div {...tabPanelProps("t", active)}>Contenu {active}</div>
        </>
    );
}

describe("TabsLib", () => {
    it("expose une liste d'onglets accessible, un seul dans l'ordre de tabulation", () => {
        render(<Harness />);

        expect(screen.getByRole("tablist", { name: "Vues" })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("tabindex", "0");
        expect(screen.getByRole("tab", { name: /Bêta/ })).toHaveAttribute("tabindex", "-1");
        expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "t-tab-a");
    });

    it("change d'onglet au clic", () => {
        render(<Harness />);

        fireEvent.click(screen.getByRole("tab", { name: /Bêta/ }));

        expect(screen.getByRole("tab", { name: /Bêta/ })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("tabpanel")).toHaveTextContent("Contenu b");
    });

    it("se pilote au clavier : flèches (en boucle), Début et Fin", () => {
        render(<Harness />);
        const alpha = screen.getByRole("tab", { name: "Alpha" });

        fireEvent.keyDown(alpha, { key: "ArrowLeft" });
        expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("tab", { name: "Gamma" })).toHaveFocus();

        fireEvent.keyDown(screen.getByRole("tab", { name: "Gamma" }), { key: "Home" });
        expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");

        fireEvent.keyDown(screen.getByRole("tab", { name: "Alpha" }), { key: "End" });
        expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "true");
    });
});
