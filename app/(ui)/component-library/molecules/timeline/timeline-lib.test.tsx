import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { eventMarkerRows, TimelineLib, timelinePosition, yearTicks } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib";

describe("TimelineLib — calculs", () => {
    it("position d'une date sur l'axe, bornée", () => {
        expect(timelinePosition("2022-01-01", "2022-01-01", "2024-01-01")).toBe(0);
        expect(timelinePosition("2024-01-01", "2022-01-01", "2024-01-01")).toBe(100);
        expect(timelinePosition("2023-01-01", "2022-01-01", "2024-01-01")).toBeCloseTo(49.9, 0);
        expect(timelinePosition("2010-01-01", "2022-01-01", "2024-01-01")).toBe(0);
    });

    it("repères d'années à l'intérieur de l'axe", () => {
        expect(yearTicks("2022-05-17", "2025-03-01")).toEqual(["2023-01-01", "2024-01-01", "2025-01-01"]);
    });
});

describe("TimelineLib — rendu", () => {
    const lanes = [
        {
            id: "g", label: "Gouvernements", color: "var(--chart-2)",
            periods: [
                { id: "a", label: "Équipe A", detail: "Responsable : X", start: "2022-05-17", end: "2024-01-08" },
                { id: "b", label: "Équipe B", start: "2024-01-09", end: null, href: "/b" },
            ],
        },
    ];

    it("une liste par couloir, chaque période décrite (dates, en cours) et liée si elle a un lien", () => {
        render(<TimelineLib start="2022-05-01" end="2026-11-22" lanes={lanes} />);

        const couloir = screen.getByRole("list", { name: "Gouvernements" });
        expect(within(couloir).getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByLabelText("Équipe A (Responsable : X), du 17/05/2022 au 08/01/2024")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Équipe B, depuis le 09/01/2024" })).toHaveAttribute("href", "/b");
    });

    it("une période trop courte masque son libellé visuellement mais le garde accessible", () => {
        render(
            <TimelineLib
                start="2022-01-01"
                end="2026-01-01"
                lanes={[{ id: "g", label: "Gouvernements", color: "var(--chart-2)", periods: [{ id: "c", label: "Équipe courte", start: "2025-09-09", end: "2025-10-09" }] }]}
            />
        );

        expect(screen.getByText("Équipe courte")).toHaveClass("sr-only");
        expect(screen.getByLabelText("Équipe courte, du 09/09/2025 au 09/10/2025")).toBeInTheDocument();
    });

    it("événements : repères numérotés sur la frise, mêmes numéros dans la légende (ordre chronologique)", () => {
        const { container } = render(
            <TimelineLib
                start="2022-05-01"
                end="2026-11-22"
                lanes={lanes}
                events={[{ date: "2024-07-07", label: "Élections" }, { date: "2024-06-09", label: "Dissolution" }]}
            />
        );

        const reperes = [...container.querySelectorAll(".timeline-lib__markers > .timeline-lib__marker")];
        expect(reperes.map((r) => [r.textContent, r.getAttribute("title")])).toEqual([
            ["1", "09/06/2024 : Dissolution"],
            ["2", "07/07/2024 : Élections"],
        ]);
        const legende = screen.getAllByRole("listitem").filter((li) => li.closest(".timeline-lib__legend"));
        expect(legende.map((li) => li.textContent)).toEqual(["109/06/2024 Dissolution", "207/07/2024 Élections"]);
    });

    it("repères trop proches : empilés sur une autre rangée", () => {
        expect(eventMarkerRows([10, 11, 12, 20, 21])).toEqual([0, 1, 2, 0, 1]);
        expect(eventMarkerRows([10, 50])).toEqual([0, 0]);
    });

    it("la ligne d'un événement porte la rangée de son repère, pour monter jusqu'à sa bulle", () => {
        const { container } = render(
            <TimelineLib
                start="2022-05-01"
                end="2026-11-22"
                lanes={lanes}
                events={[{ date: "2024-06-09", label: "Dissolution" }, { date: "2024-07-07", label: "Élections" }]}
            />
        );

        const rangee = (el: Element) => (el as HTMLElement).style.getPropertyValue("--timeline-marker-row");
        const reperes = [...container.querySelectorAll(".timeline-lib__markers > .timeline-lib__marker")].map(rangee);
        const lignes = [...container.querySelectorAll(".timeline-lib__event-line")].map(rangee);
        expect(reperes).toEqual(["0", "1"]);
        expect(lignes).toEqual(reperes);
    });
});
