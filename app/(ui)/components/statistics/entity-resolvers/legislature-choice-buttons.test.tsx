import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LegislatureChoiceButtons, libelleToutesLegislatures } from "@/app/(ui)/components/statistics/entity-resolvers/legislature-choice-buttons";

jest.mock("@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list", () => ({
    useLegislaturesList: () => [
        { id: 1, number: 16 },
        { id: 2, number: 17 },
    ],
}));

describe("libelleToutesLegislatures", () => {
    it("se construit depuis la liste, une nouvelle législature y entre d'elle-même", () => {
        expect(libelleToutesLegislatures([17, 16])).toBe("Toutes (16ᵉ + 17ᵉ)");
        expect(libelleToutesLegislatures([16, 17, 18])).toBe("Toutes (16ᵉ + 17ᵉ + 18ᵉ)");
    });
});

describe("LegislatureChoiceButtons", () => {
    it("sans allowAll : une législature par bouton, pas de « Toutes »", () => {
        render(<LegislatureChoiceButtons value={null} onSelect={jest.fn()} />);
        expect(screen.getByRole("button", { name: "16ᵉ législature" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Toutes/ })).not.toBeInTheDocument();
    });

    it("avec allowAll : « Toutes (16ᵉ + 17ᵉ) » pose le périmètre « toutes »", () => {
        const onSelect = jest.fn();
        render(<LegislatureChoiceButtons value={17} onSelect={onSelect} allowAll />);
        fireEvent.click(screen.getByRole("button", { name: "Toutes (16ᵉ + 17ᵉ)" }));
        expect(onSelect).toHaveBeenCalledWith("toutes");
    });
});
