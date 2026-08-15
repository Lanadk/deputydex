import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

// Les EntityResolvers tapent de vrais gateways réseau — on les mocke pour ne
// pas dépendre du réseau/de la DB dans ce test unitaire.
jest.mock("@/app/(ui)/gateways/acteurs/acteurs.gateway", () => ({
    acteursGateway: {
        searchDeputies: jest.fn().mockResolvedValue([
            { id: "PA001", prenom: "Amélie", nom: "Durand", professionCategorie: null, dateNaissance: null },
        ]),
        search: jest.fn(),
        getById: jest.fn(),
    },
}));

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: {
        getAll: jest.fn().mockResolvedValue([{ id: 1, number: 17, startDate: null, endDate: null }]),
        getCurrent: jest.fn().mockResolvedValue(null),
    },
}));

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

import { StatPicker } from "@/app/(ui)/components/statistics/stat-picker";

function renderPicker(props: Partial<React.ComponentProps<typeof StatPicker>> = {}) {
    return render(
        <StatPicker
            selectedStatIds={[]}
            onToggleStat={jest.fn()}
            context={{}}
            onContextChange={jest.fn()}
            onClearSelection={jest.fn()}
            onReset={jest.fn()}
            isComparing={false}
            {...props}
        />
    );
}

/** Harnais avec état réel pour context — nécessaire pour les flux qui dépendent d'un aller-retour onContextChange -> context. */
function StatefulPickerHarness({
    onContextChange,
    ...props
}: Partial<React.ComponentProps<typeof StatPicker>> & { onContextChange: (p: StatFetchParams) => void }) {
    const [context, setContext] = React.useState<StatFetchParams>({});

    return (
        <StatPicker
            selectedStatIds={[]}
            onToggleStat={jest.fn()}
            onClearSelection={jest.fn()}
            onReset={jest.fn()}
            isComparing={false}
            {...props}
            context={context}
            onContextChange={(params) => {
                setContext(params);
                onContextChange(params);
            }}
        />
    );
}

describe("StatPicker", () => {
    it("renders one button per domain", () => {
        renderPicker();
        expect(screen.getByText("Députés")).toBeInTheDocument();
        expect(screen.getByText("Groupes")).toBeInTheDocument();
    });

    it("disables domains with no stats at all", () => {
        renderPicker();
        expect(screen.getByText("Votes").closest("button")).toBeDisabled();
    });

    it("shows aggregate categories/stats only after a legislature is chosen", async () => {
        render(<StatefulPickerHarness onContextChange={jest.fn()} />);

        fireEvent.click(screen.getByText("Députés"));

        expect(screen.queryByText("Démographie")).not.toBeInTheDocument();
        expect(
            screen.getByText("Choisis d'abord une législature pour voir les statistiques disponibles.")
        ).toBeInTheDocument();

        fireEvent.click(await screen.findByText("17ᵉ législature"));

        expect(await screen.findByText("Démographie")).toBeInTheDocument();
        expect(screen.getByText("Cohésion")).toBeInTheDocument();
        expect(screen.getByText("Répartition par âge")).toBeInTheDocument();
        expect(screen.queryByText("Profil")).not.toBeInTheDocument();
    });

    it("calls onToggleStat when a stat checkbox is clicked, once a legislature is chosen", async () => {
        const onToggleStat = jest.fn();
        render(<StatefulPickerHarness onContextChange={jest.fn()} onToggleStat={onToggleStat} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(await screen.findByText("17ᵉ législature"));

        fireEvent.click(await screen.findByText("Répartition par âge"));

        expect(onToggleStat).toHaveBeenCalledWith("acteurs.age-distribution");
    });

    it("disables domains incompatible with the current selection while comparing", () => {
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"], isComparing: true });

        expect(screen.getByText("Groupes").closest("button")).toBeDisabled();
        expect(screen.getByText("Députés").closest("button")).not.toBeDisabled();
    });

    it("does not disable other domains when not comparing, and clears the selection on switch", () => {
        const onClearSelection = jest.fn();
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"], onClearSelection, isComparing: false });

        expect(screen.getByText("Groupes").closest("button")).not.toBeDisabled();

        fireEvent.click(screen.getByText("Groupes"));

        expect(onClearSelection).toHaveBeenCalledTimes(1);
    });

    it("clears the selection when switching scope (aggregate -> entity) while not comparing", () => {
        const onClearSelection = jest.fn();
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"], onClearSelection, isComparing: false });

        fireEvent.click(screen.getByText("Un député précis"));

        expect(onClearSelection).toHaveBeenCalledTimes(1);
    });

    it("auto-expands the domain matching the current selection once its context is ready", () => {
        renderPicker({
            selectedStatIds: ["acteurs.age-distribution"],
            context: { filters: { legislature: 17 } },
        });

        expect(screen.getByText("Démographie")).toBeInTheDocument();
    });

    it("does not show categories for the auto-expanded domain until its context is ready", () => {
        renderPicker({ selectedStatIds: ["acteurs.age-distribution"] });

        expect(screen.queryByText("Démographie")).not.toBeInTheDocument();
        expect(
            screen.getByText("Choisis d'abord une législature pour voir les statistiques disponibles.")
        ).toBeInTheDocument();
    });

    it("shows the entity resolver toggle for a domain that has one", () => {
        renderPicker();

        fireEvent.click(screen.getByText("Députés"));

        expect(screen.getByText("Un député précis")).toBeInTheDocument();
        expect(screen.getByText("Tous les députés")).toBeInTheDocument();
    });

    it("only shows entity-scoped stats once a specific deputy has been picked", async () => {
        render(<StatefulPickerHarness onContextChange={jest.fn()} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Un député précis"));

        expect(screen.queryByText("Profil")).not.toBeInTheDocument();
        expect(
            screen.getByText("Choisis d'abord un élément précis pour voir les statistiques disponibles.")
        ).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText("Rechercher un député par nom…"), { target: { value: "Amélie" } });
        fireEvent.click(await screen.findByText("Amélie Durand"));

        expect(await screen.findByText("Profil")).toBeInTheDocument();
        expect(screen.queryByText("Démographie")).not.toBeInTheDocument();
    });

    it("fills the input with the picked deputy's name and closes the results list", async () => {
        render(<StatefulPickerHarness onContextChange={jest.fn()} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Un député précis"));
        fireEvent.change(screen.getByPlaceholderText("Rechercher un député par nom…"), { target: { value: "Amélie" } });

        fireEvent.click(await screen.findByText("Amélie Durand"));

        expect(screen.getByDisplayValue("Amélie Durand")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Amélie Durand" })).not.toBeInTheDocument();
    });

    it("clears the picked deputy and re-searches when the user types again", async () => {
        render(<StatefulPickerHarness onContextChange={jest.fn()} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Un député précis"));
        fireEvent.change(screen.getByPlaceholderText("Rechercher un député par nom…"), { target: { value: "Amélie" } });
        fireEvent.click(await screen.findByText("Amélie Durand"));

        fireEvent.change(screen.getByDisplayValue("Amélie Durand"), { target: { value: "Kar" } });

        // Le champ reflète maintenant ce qui est tapé, plus l'ancien choix.
        expect(screen.getByDisplayValue("Kar")).toBeInTheDocument();
        // "Profil" (stat entity-scoped) redisparaît : plus d'entité choisie.
        expect(screen.queryByText("Profil")).not.toBeInTheDocument();
    });

    it("searches deputies by name (no legislature gate) and calls onContextChange when one is picked", async () => {
        const onContextChange = jest.fn();
        render(<StatefulPickerHarness onContextChange={onContextChange} />);

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Un député précis"));

        // Pas de liste avant d'avoir tapé au moins 2 caractères.
        expect(screen.queryByText("Amélie Durand")).not.toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText("Rechercher un député par nom…"), { target: { value: "Amélie" } });

        fireEvent.click(await screen.findByText("Amélie Durand"));

        expect(onContextChange).toHaveBeenLastCalledWith({
            entityId: "PA001",
            filters: { entityLabel: "Amélie Durand" },
        });
    });

    it("shows a legislature filter for 'Tous les députés' but not for 'Un député précis'", async () => {
        renderPicker();

        fireEvent.click(screen.getByText("Députés"));
        // scope par défaut à l'ouverture = aggregate -> le filtre doit déjà être là.
        await screen.findByText("17ᵉ législature");

        fireEvent.click(screen.getByText("Un député précis"));
        expect(screen.queryByText("17ᵉ législature")).not.toBeInTheDocument();
    });

    it("calls onContextChange with a legislature filter when 'Tous les députés' is scoped", async () => {
        const onContextChange = jest.fn();
        renderPicker({ onContextChange });

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(await screen.findByText("17ᵉ législature"));

        expect(onContextChange).toHaveBeenCalledWith({ filters: { legislature: 17 } });
    });

    it("shows a 'Réinitialiser' button once a domain is open, calling onReset and closing the domain", () => {
        const onReset = jest.fn();
        renderPicker({ onReset });

        expect(screen.queryByText("Réinitialiser")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Députés"));
        fireEvent.click(screen.getByText("Réinitialiser"));

        expect(onReset).toHaveBeenCalledTimes(1);
        // Le picker revient à l'état "aucun domaine ouvert" — décision locale,
        // indépendante de ce que fait le reducer avec selectedStatIds.
        expect(screen.queryByText("Démographie")).not.toBeInTheDocument();
    });

    it("shows 'Réinitialiser ce contexte' while comparing, and delegates entirely to onReset", () => {
        // La décision de vider aussi selectedStatIds (partagé entre les deux
        // contextes) appartient au reducer (RESET_CONTEXT, voir
        // comparator.reducer.test.ts) — ce composant se contente d'appeler
        // onReset, qu'il soit en comparaison ou non.
        const onReset = jest.fn();
        renderPicker({
            selectedStatIds: ["acteurs.age-distribution"],
            context: { filters: { legislature: 17 } },
            onReset,
            isComparing: true,
        });

        fireEvent.click(screen.getByText("Réinitialiser ce contexte"));

        expect(onReset).toHaveBeenCalledTimes(1);
    });
});
