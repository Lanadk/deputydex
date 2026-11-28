import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AccordionLib } from "@/app/(ui)/component-library/molecules/accordion/accordion-lib";

const ITEMS = [
    { id: "a", title: "Premier", content: <p>Contenu A</p> },
    { id: "b", title: "Second", hint: "2 formules", content: <p>Contenu B</p> },
];

describe("AccordionLib", () => {
    it("fermé par défaut, ouvre et referme au clic", () => {
        render(<AccordionLib items={ITEMS} />);
        const header = screen.getByRole("button", { name: "Premier" });

        expect(header).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("Contenu A")).not.toBeInTheDocument();

        fireEvent.click(header);
        expect(header).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("region", { name: "Premier" })).toHaveTextContent("Contenu A");

        fireEvent.click(header);
        expect(header).toHaveAttribute("aria-expanded", "false");
    });

    it("plusieurs panneaux ouverts par défaut ; un seul avec multiple={false}", () => {
        const { unmount } = render(<AccordionLib items={ITEMS} />);
        fireEvent.click(screen.getByRole("button", { name: "Premier" }));
        fireEvent.click(screen.getByRole("button", { name: /Second/ }));
        expect(screen.getByText("Contenu A")).toBeInTheDocument();
        expect(screen.getByText("Contenu B")).toBeInTheDocument();
        unmount();

        render(<AccordionLib items={ITEMS} multiple={false} defaultOpenIds={["a"]} />);
        expect(screen.getByText("Contenu A")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: /Second/ }));
        expect(screen.queryByText("Contenu A")).not.toBeInTheDocument();
        expect(screen.getByText("Contenu B")).toBeInTheDocument();
    });

    it("flèches haut / bas déplacent le focus entre les en-têtes", () => {
        render(<AccordionLib items={ITEMS} />);
        const premier = screen.getByRole("button", { name: "Premier" });
        premier.focus();

        fireEvent.keyDown(premier, { key: "ArrowDown" });
        expect(screen.getByRole("button", { name: /Second/ })).toHaveFocus();

        fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
        expect(premier).toHaveFocus();
    });
});
