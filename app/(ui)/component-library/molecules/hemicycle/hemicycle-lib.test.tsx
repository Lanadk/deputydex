import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { computeHemicyclePoints, HemicycleLib, HemicycleLibSeat } from "./hemicycle-lib";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const SEATS: HemicycleLibSeat[] = [
    { id: "PA1", key: "pour", color: "#2563eb", label: "Alice Martin", sublabel: "SOC · Pour", href: "/deputes/PA1" },
    { id: "PA2", key: "contre", color: "#dc2626", label: "Bruno Petit", sublabel: "RN · Contre" },
    { id: "PA3", key: "absent", color: "#d1d5db", label: "Chloé Roux" },
];

const LEGEND = [
    { key: "pour", label: "Pour", color: "#2563eb", count: 1 },
    { key: "contre", label: "Contre", color: "#dc2626", count: 1 },
];

function circles(container: HTMLElement) {
    return Array.from(container.querySelectorAll("circle"));
}

describe("computeHemicyclePoints", () => {
    it("place exactement le nombre de sièges demandé, de la gauche vers la droite", () => {
        const points = computeHemicyclePoints(577);

        expect(points).toHaveLength(577);
        expect(points[0].x).toBeLessThan(points[576].x);
    });

    it("ne place rien pour zéro siège", () => {
        expect(computeHemicyclePoints(0)).toEqual([]);
    });
});

describe("HemicycleLib", () => {
    beforeEach(() => push.mockClear());

    it("dessine un siège par député, avec un résumé pour les lecteurs d'écran", () => {
        const { container } = render(<HemicycleLib ariaLabel="1 pour, 1 contre, 1 absent" seats={SEATS} />);

        expect(circles(container)).toHaveLength(3);
        expect(screen.getByRole("img", { name: "1 pour, 1 contre, 1 absent" })).toBeInTheDocument();
    });

    it("affiche le député et son vote au survol d'un siège", () => {
        const { container } = render(<HemicycleLib ariaLabel="hémicycle" seats={SEATS} />);

        fireEvent.mouseEnter(circles(container)[0]);
        expect(screen.getByRole("tooltip")).toHaveTextContent("Alice Martin");
        expect(screen.getByRole("tooltip")).toHaveTextContent("SOC · Pour");

        fireEvent.mouseLeave(circles(container)[0]);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("ouvre la fiche du député au clic, et ne fait rien pour un siège sans lien", () => {
        const { container } = render(<HemicycleLib ariaLabel="hémicycle" seats={SEATS} />);

        fireEvent.click(circles(container)[0]);
        fireEvent.click(circles(container)[1]);
        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith("/deputes/PA1");
    });

    it("met une catégorie en avant depuis la légende, et la désélectionne au second clic", () => {
        const { container } = render(<HemicycleLib ariaLabel="hémicycle" seats={SEATS} legend={LEGEND} />);
        const contre = screen.getByRole("button", { name: /Contre/ });

        fireEvent.click(contre);
        expect(contre).toHaveAttribute("aria-pressed", "true");
        expect(circles(container).map((c) => c.getAttribute("opacity"))).toEqual(["0.15", "1", "0.15"]);

        fireEvent.click(contre);
        expect(circles(container).map((c) => c.getAttribute("opacity"))).toEqual(["1", "1", "1"]);
    });
});
