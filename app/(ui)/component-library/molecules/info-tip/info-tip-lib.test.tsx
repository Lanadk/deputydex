import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InfoTipLib } from "./info-tip-lib";

function renderTip() {
    render(
        <div>
            <InfoTipLib subject="Questure">Les questeurs gèrent le budget.</InfoTipLib>
            <button type="button">Ailleurs</button>
        </div>
    );
    return screen.getByRole("button", { name: "Définition : Questure" });
}

describe("InfoTipLib", () => {
    it("keeps the bubble closed until the button is pressed", () => {
        const button = renderTip();

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("Les questeurs gèrent le budget.")).not.toBeInTheDocument();
    });

    it("opens the bubble on click and closes it on a second click", () => {
        const button = renderTip();

        fireEvent.click(button);
        const bubble = screen.getByRole("note");
        expect(bubble).toHaveTextContent("Les questeurs gèrent le budget.");
        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(button).toHaveAttribute("aria-controls", bubble.id);

        fireEvent.click(button);
        expect(screen.queryByRole("note")).not.toBeInTheDocument();
    });

    it("closes with Escape and gives focus back to the button", () => {
        const button = renderTip();

        fireEvent.click(button);
        fireEvent.keyDown(document, { key: "Escape" });

        expect(screen.queryByRole("note")).not.toBeInTheDocument();
        expect(button).toHaveFocus();
    });

    it("closes when clicking elsewhere, not when clicking inside the bubble", () => {
        const button = renderTip();

        fireEvent.click(button);
        fireEvent.pointerDown(screen.getByRole("note"));
        expect(screen.getByRole("note")).toBeInTheDocument();

        fireEvent.pointerDown(screen.getByRole("button", { name: "Ailleurs" }));
        expect(screen.queryByRole("note")).not.toBeInTheDocument();
    });

    it("shows an optional label and a generic name without subject", () => {
        render(<InfoTipLib label="Qu'est-ce que c'est ?">Texte</InfoTipLib>);

        expect(screen.getByText("Qu'est-ce que c'est ?")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Plus d'informations" })).toBeInTheDocument();
    });
});
