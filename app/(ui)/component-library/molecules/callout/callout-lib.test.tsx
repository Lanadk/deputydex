import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CalloutLib } from "@/app/(ui)/component-library/molecules/callout/callout-lib";

describe("CalloutLib", () => {
    it.each([
        ["note", "Remarque"],
        ["info", "Info"],
        ["warning", "Attention"],
    ] as const)("variante %s : titre par défaut « %s »", (variant, label) => {
        render(<CalloutLib variant={variant}>Texte</CalloutLib>);
        const note = screen.getByRole("note", { name: label });
        expect(note).toHaveTextContent(label);
        expect(note).toHaveTextContent("Texte");
    });

    it("titre personnalisé", () => {
        render(<CalloutLib variant="warning" title="Des estimations, pas un pointage">Contenu</CalloutLib>);
        expect(screen.getByRole("note", { name: "Des estimations, pas un pointage" })).toBeInTheDocument();
    });

    it("n'interrompt pas les lecteurs d'écran (pas de role alert)", () => {
        render(<CalloutLib variant="warning">Contenu</CalloutLib>);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
