import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// react-activity-calendar (importé par le renderer de section) est publié en ESM seul.
jest.mock("@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib", () => ({
    ActivityCalendarLib: () => null,
}));

import { ComingSoonLib } from "@/app/(ui)/component-library/molecules/coming-soon/coming-soon-lib";
import { BlockSectionRenderer } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";

describe("ComingSoonLib", () => {
    it("mention « Disponible bientôt » par défaut ; l'aperçu est flouté, hors lecture et hors clavier", () => {
        render(<ComingSoonLib><button>Action cachée</button></ComingSoonLib>);

        expect(screen.getByRole("status")).toHaveTextContent("Disponible bientôt");
        const apercu = screen.getByText("Action cachée").closest(".coming-soon__apercu")!;
        expect(apercu).toHaveAttribute("aria-hidden", "true");
        expect(apercu).toHaveAttribute("inert");
        expect(screen.queryByRole("button", { name: "Action cachée" })).not.toBeInTheDocument();
    });

    it("mention personnalisée", () => {
        render(<ComingSoonLib label="Calcul en préparation"><p>aperçu</p></ComingSoonLib>);
        expect(screen.getByRole("status")).toHaveTextContent("Calcul en préparation");
    });
});

describe("Bloc de section `bientot`", () => {
    const data = { "score": { data: { title: "Score", score: 60, verdict: "Actif" } } } as never;

    it("floute le bloc sous la mention, dans sa cellule de grille", () => {
        const { container } = render(
            <BlockSectionRenderer
                block={{ type: "card", colSpan: 1, rowSpan: 2, config: { id: "score", displayType: "score-card" }, bientot: true }}
                dataMap={data}
                loading={false}
                params={{}}
            />
        );

        expect(screen.getByRole("status")).toHaveTextContent("Disponible bientôt");
        expect(screen.getByText("Actif").closest(".coming-soon__apercu")).not.toBeNull();
        expect(container.firstElementChild).toHaveClass("xl:row-span-2");
    });

    it("sans l'option : rendu normal", () => {
        render(
            <BlockSectionRenderer
                block={{ type: "card", colSpan: 1, config: { id: "score", displayType: "score-card" } }}
                dataMap={data}
                loading={false}
                params={{}}
            />
        );

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.getByText("Actif").closest(".coming-soon__apercu")).toBeNull();
    });
});
