import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog", () => {
    const { Users } = jest.requireActual("lucide-react");

    const makeStat = (overrides: Record<string, unknown>) => ({
        id: "acteurs.dummy",
        slug: "dummy",
        domain: "acteurs",
        scope: "aggregate",
        title: "Dummy",
        category: "Test",
        keywords: [],
        methodology: "",
        dataShape: "distribution",
        ...overrides,
    });

    const AGE_DISTRIBUTION = makeStat({
        id: "acteurs.age-distribution",
        slug: "age-distribution",
        title: "Répartition par âge",
        category: "Démographie",
    });
    const PARITE = makeStat({ id: "acteurs.parite", slug: "parite", title: "Parité", category: "Démographie" });
    const COHESION = makeStat({ id: "acteurs.cohesion", slug: "cohesion", title: "Taux de cohésion", category: "Cohésion" });
    const GROUPE_ENTITY = makeStat({
        id: "groupes.infos",
        slug: "infos",
        domain: "groupes",
        scope: "entity",
        title: "Infos groupe",
        category: "Général",
    });

    return {
        STATS_CATALOG: [
            { id: "acteurs", label: "Députés", icon: Users, stats: [AGE_DISTRIBUTION, PARITE, COHESION] },
            { id: "groupes", label: "Groupes", icon: Users, stats: [GROUPE_ENTITY] },
            { id: "votes", label: "Votes", icon: Users, stats: [] },
            { id: "scrutins", label: "Scrutins", icon: Users, stats: [] },
            { id: "legislatures", label: "Législatures", icon: Users, stats: [] },
        ],
    };
});

import { StatPickerLib } from "@/app/(ui)/components/statistics/stat-picker-lib";

describe("StatPickerLib", () => {
    it("renders one button per domain", () => {
        render(<StatPickerLib selectedStatIds={[]} onToggleStat={jest.fn()} />);
        expect(screen.getByText("Députés")).toBeInTheDocument();
        expect(screen.getByText("Groupes")).toBeInTheDocument();
    });

    it("disables domains with no stats at all", () => {
        render(<StatPickerLib selectedStatIds={[]} onToggleStat={jest.fn()} />);
        expect(screen.getByText("Votes").closest("button")).toBeDisabled();
    });

    it("shows categories and stats when a domain is clicked", () => {
        render(<StatPickerLib selectedStatIds={[]} onToggleStat={jest.fn()} />);

        fireEvent.click(screen.getByText("Députés"));

        expect(screen.getByText("Démographie")).toBeInTheDocument();
        expect(screen.getByText("Cohésion")).toBeInTheDocument();
        expect(screen.getByText("Répartition par âge")).toBeInTheDocument();
    });

    it("calls onToggleStat when a stat checkbox is clicked", () => {
        const onToggleStat = jest.fn();
        render(<StatPickerLib selectedStatIds={[]} onToggleStat={onToggleStat} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Répartition par âge"));

        expect(onToggleStat).toHaveBeenCalledWith("acteurs.age-distribution");
    });

    it("disables domains incompatible with the current selection", () => {
        render(<StatPickerLib selectedStatIds={["acteurs.age-distribution"]} onToggleStat={jest.fn()} />);

        expect(screen.getByText("Groupes").closest("button")).toBeDisabled();
        expect(screen.getByText("Députés").closest("button")).not.toBeDisabled();
    });

    it("auto-expands the domain matching the current selection", () => {
        render(<StatPickerLib selectedStatIds={["acteurs.age-distribution"]} onToggleStat={jest.fn()} />);

        expect(screen.getByText("Démographie")).toBeInTheDocument();
    });
});
