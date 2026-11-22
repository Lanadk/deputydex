import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProportionBarLib } from "@/app/(ui)/component-library/molecules/proportion-bar/proportion-bar-lib";

describe("ProportionBarLib", () => {
    const segments = [
        { id: "a", label: "Entrée au Gouvernement", value: 30, color: "var(--chart-1)" },
        { id: "b", label: "Élection partielle", value: 10, color: "var(--chart-2)" },
        { id: "c", label: "Décès", value: 0, color: "var(--chart-3)" },
    ];

    it("légende : libellé, valeur et part de chaque segment non vide", () => {
        render(<ProportionBarLib segments={segments} ariaLabel="Répartition des entrées" />);

        expect(screen.getByRole("figure", { name: "Répartition des entrées" })).toBeInTheDocument();
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent("Entrée au Gouvernement");
        expect(items[0]).toHaveTextContent("30");
        expect(items[0]).toHaveTextContent("75");
        expect(items[1]).toHaveTextContent("25");
    });

    it("rien quand le total est nul", () => {
        const { container } = render(<ProportionBarLib segments={[{ id: "a", label: "A", value: 0, color: "red" }]} ariaLabel="Vide" />);

        expect(container).toBeEmptyDOMElement();
    });
});
