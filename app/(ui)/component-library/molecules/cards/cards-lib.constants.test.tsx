import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getCardsSections } from "@/app/(ui)/component-library/molecules/cards/cards-lib.constants";

describe("bibliothèque — cartes", () => {
    it("chaque exemple affiche quelque chose et a son code d'usage", () => {
        for (const section of getCardsSections()) {
            const { container, unmount } = render(<>{section.component}</>);
            expect({ titre: section.title, vide: container.innerHTML === "" }).toEqual({ titre: section.title, vide: false });
            expect({ titre: section.title, code: section.code.trim().length > 0 }).toEqual({ titre: section.title, code: true });
            unmount();
        }
    });

    it("summary list card avec badges : un badge par ligne", () => {
        const section = getCardsSections().find((s) => s.title === "Summary list card badge usage")!;
        render(<>{section.component}</>);
        expect(screen.getAllByText("Pour")).toHaveLength(2);
        expect(screen.getByText("Contre")).toBeInTheDocument();
        expect(screen.getByText("Abstention")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Texte avec lien" })).toHaveAttribute("href", "https://www.assemblee-nationale.fr");
    });
});
