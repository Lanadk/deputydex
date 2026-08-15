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
    const PROFIL = makeStat({ id: "acteurs.profil", slug: "profil", scope: "entity", title: "Mandats", category: "Profil" });
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
            { id: "acteurs", label: "Députés", icon: Users, stats: [AGE_DISTRIBUTION, PARITE, COHESION, PROFIL] },
            { id: "groupes", label: "Groupes", icon: Users, stats: [GROUPE_ENTITY] },
            { id: "votes", label: "Votes", icon: Users, stats: [] },
            { id: "scrutins", label: "Scrutins", icon: Users, stats: [] },
            { id: "legislatures", label: "Législatures", icon: Users, stats: [] },
        ],
    };
});

import { StatPickerLib } from "@/app/(ui)/components/statistics/stat-picker-lib";

function renderPicker(props: Partial<React.ComponentProps<typeof StatPickerLib>> = {}) {
    return render(
        <StatPickerLib
            selectedStatIds={[]}
            onToggleStat={jest.fn()}
            context={{}}
            onContextChange={jest.fn()}
            {...props}
        />
    );
}

describe("StatPickerLib", () => {
    it("renders one button per domain", () => {
        renderPicker();
        expect(screen.getByText("Députés")).toBeInTheDocument();
        expect(screen.getByText("Groupes")).toBeInTheDocument();
    });

    it("disables domains with no stats at all", () => {
        renderPicker();
        expect(screen.getByText("Votes").closest("button")).toBeDisabled();
    });

    it("shows aggregate categories/stats by default when a domain is opened", () => {
        renderPicker();

        fireEvent.click(screen.getByText("Députés"));

        expect(screen.getByText("Démographie")).toBeInTheDocument();
        expect(screen.getByText("Cohésion")).toBeInTheDocument();
        expect(screen.getByText("Répartition par âge")).toBeInTheDocument();
        expect(screen.queryByText("Profil")).not.toBeInTheDocument();
    });

    it("calls onToggleStat when a stat checkbox is clicked", () => {
        const onToggleStat = jest.fn();
        renderPicker({ onToggleStat });

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Répartition par âge"));

        expect(onToggleStat).toHaveBeenCalledWith("acteurs.age-distribution");
    });

    it("disables domains incompatible with the current selection", () => {
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"] });

        expect(screen.getByText("Groupes").closest("button")).toBeDisabled();
        expect(screen.getByText("Députés").closest("button")).not.toBeDisabled();
    });

    it("auto-expands the domain matching the current selection", () => {
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"] });

        expect(screen.getByText("Démographie")).toBeInTheDocument();
    });

    it("shows the entity resolver toggle for a domain that has one", () => {
        renderPicker();

        fireEvent.click(screen.getByText("Députés"));

        expect(screen.getByText("Un député précis")).toBeInTheDocument();
        expect(screen.getByText("Tous les députés")).toBeInTheDocument();
    });

    it("switches to entity-scoped stats when the resolver is set to a specific entity", () => {
        renderPicker();

        fireEvent.click(screen.getByText("Députés"));
        expect(screen.queryByText("Profil")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Un député précis"));

        expect(screen.getByText("Profil")).toBeInTheDocument();
        expect(screen.queryByText("Démographie")).not.toBeInTheDocument();
    });

    it("calls onContextChange when an entity is picked in the resolver", () => {
        const onContextChange = jest.fn();
        renderPicker({ onContextChange });

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Un député précis"));
        fireEvent.change(screen.getByPlaceholderText("Rechercher un député…"), { target: { value: "Amélie" } });
        fireEvent.click(screen.getByText("Amélie Durand"));

        expect(onContextChange).toHaveBeenCalledWith({ entityId: "PA001" });
    });
});
