import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { formatTimelineDate, TimelineLib, timelinePosition, yearTicks } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib";

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

    it("format des dates sans décalage de fuseau", () => {
        expect(formatTimelineDate("2024-07-18")).toBe("18/07/2024");
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

    it("légende des événements", () => {
        render(<TimelineLib start="2022-05-01" end="2026-11-22" lanes={lanes} events={[{ date: "2024-06-09", label: "Dissolution" }]} />);

        expect(screen.getByText(/Dissolution/)).toBeInTheDocument();
        expect(screen.getByText("09/06/2024")).toBeInTheDocument();
    });
});
