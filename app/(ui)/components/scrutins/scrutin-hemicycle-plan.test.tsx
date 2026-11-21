import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScrutinHemicyclePlan } from "./scrutin-hemicycle-plan";
import { HemicycleLegendItem, HemicycleSeatData } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";

const SEATS: HemicycleSeatData[] = [
    { id: "PA1", key: "pour", color: "#2563eb", label: "Alice Martin", sublabel: "SOC · Pour", href: "/deputes/PA1", image: "/tribun/17/photos/PA1.jpg" },
    { id: "PA2", key: "contre", color: "#dc2626", label: "Bruno Petit", sublabel: "RN · Contre", href: "/deputes/PA2" },
    { id: "PA3", key: "absent", color: "#d1d5db", label: "Chloé Roux" },
];

const LEGEND: HemicycleLegendItem[] = [
    { key: "pour", label: "Pour", color: "#2563eb", count: 1 },
    { key: "contre", label: "Contre", color: "#dc2626", count: 1 },
    { key: "absent", label: "Absent", color: "#d1d5db", count: 1 },
];

function seatElements(container: HTMLElement) {
    return Array.from(container.querySelectorAll<HTMLElement>(".hemicycle-seat"));
}

describe("ScrutinHemicyclePlan", () => {
    it("dessine un siège par député, dans l'ordre reçu, avec la couleur de son vote", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="1 pour, 1 contre, 1 absent" seats={SEATS} />);
        const seats = seatElements(container);

        expect(seats).toHaveLength(3);
        expect(seats.map((s) => s.style.background)).toEqual(["rgb(37, 99, 235)", "rgb(220, 38, 38)", "rgb(209, 213, 219)"]);
        expect(screen.getByRole("img", { name: "1 pour, 1 contre, 1 absent" })).toBeInTheDocument();
    });

    it("affiche une info-bulle avec le député et son vote au survol, sans soulever le siège par défaut", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} />);
        const [first] = seatElements(container);

        fireEvent.mouseEnter(first, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("tooltip")).toHaveTextContent("Alice Martin");
        expect(screen.getByRole("tooltip")).toHaveTextContent("SOC · Pour");
        expect(first.style.transform).not.toContain("translateZ");

        fireEvent.mouseLeave(first);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("affiche la photo du député dans l'info-bulle, ou ses initiales s'il n'en a pas", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} />);
        const [first, second] = seatElements(container);

        fireEvent.mouseEnter(first, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("img", { name: "Alice Martin" })).toBeInTheDocument();

        fireEvent.mouseLeave(first);
        fireEvent.mouseEnter(second, { clientX: 10, clientY: 10 });
        expect(screen.queryByRole("img", { name: "Bruno Petit" })).not.toBeInTheDocument();
        expect(screen.getByRole("tooltip")).toHaveTextContent("BP");
    });

    it("colore l'info-bulle avec le thème du siège, et garde les couleurs du site sans thème", () => {
        const themed: HemicycleSeatData[] = [
            { ...SEATS[0], tooltipTheme: { background: "rgb(0, 49, 137)", text: "rgb(255, 255, 255)", border: "rgb(0, 49, 137)" } },
            SEATS[1],
        ];
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={themed} />);
        const [first, second] = seatElements(container);

        fireEvent.mouseEnter(first, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("tooltip")).toHaveStyle({ background: "rgb(0, 49, 137)", color: "rgb(255, 255, 255)" });

        fireEvent.mouseLeave(first);
        fireEvent.mouseEnter(second, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("tooltip")).toHaveClass("bg-surface-1");
    });

    it("règle la taille des sièges (1.3 par défaut, paramétrable)", () => {
        const { container, rerender } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} />);
        const stage = () => container.querySelector<HTMLElement>(".hemicycle-stage")!;

        expect(stage().style.getPropertyValue("--hemi-seat-scale")).toBe("1.3");

        rerender(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} seatScale={1.1} />);
        expect(stage().style.getPropertyValue("--hemi-seat-scale")).toBe("1.1");
        expect(seatElements(container).every((s) => s.classList.contains("hemicycle-seat--hoverable"))).toBe(true);
    });

    it("soulève le siège survolé quand liftOnHover est activé", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} liftOnHover />);
        const [first] = seatElements(container);

        fireEvent.mouseEnter(first, { clientX: 10, clientY: 10 });
        expect(first.style.transform).toContain("translateZ");
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("fait d'un siège avec href un lien vers la fiche, hors tabulation", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} />);
        const links = container.querySelectorAll("a.hemicycle-seat");

        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/deputes/PA1");
        expect(links[0]).toHaveAttribute("tabindex", "-1");
    });

    it("affiche la légende avec nombre et part, et met une position en avant au clic", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} legend={LEGEND} />);
        const contre = screen.getByRole("button", { name: /Contre/ });

        expect(contre).toHaveTextContent("1 · 33 %");

        fireEvent.click(contre);
        expect(contre).toHaveAttribute("aria-pressed", "true");
        expect(seatElements(container).map((s) => s.style.opacity)).toEqual(["0.16", "1", "0.16"]);

        fireEvent.click(contre);
        expect(seatElements(container).map((s) => s.style.opacity)).toEqual(["1", "1", "1"]);
    });

    it("ne réagit plus au survol des sièges grisés quand une position est mise en avant", () => {
        const { container } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} legend={LEGEND} />);
        const [first, second] = seatElements(container);

        fireEvent.mouseEnter(first, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("tooltip")).toHaveTextContent("Alice Martin");

        // Mise en avant de « Contre » : Alice (Pour) est grisée, son info-bulle disparaît.
        fireEvent.click(screen.getByRole("button", { name: /Contre/ }));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        expect(first.style.pointerEvents).toBe("none");

        fireEvent.mouseEnter(second, { clientX: 10, clientY: 10 });
        expect(screen.getByRole("tooltip")).toHaveTextContent("Bruno Petit");
        expect(second.style.pointerEvents).toBe("");
    });

    it("affiche un titre et un sous-titre optionnels", () => {
        const { rerender } = render(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} />);
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();

        rerender(<ScrutinHemicyclePlan ariaLabel="hémicycle" seats={SEATS} title="Qui a voté quoi" subtitle="Chaque député à son siège" />);
        expect(screen.getByRole("heading", { name: "Qui a voté quoi" })).toBeInTheDocument();
        expect(screen.getByText("Chaque député à son siège")).toBeInTheDocument();
    });
});
