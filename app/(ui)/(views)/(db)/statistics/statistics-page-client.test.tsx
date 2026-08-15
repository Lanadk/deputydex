import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// StatViewer fetch/render une vraie stat — hors-sujet pour ce test, qui
// porte sur la visibilité du bouton "Quitter la comparaison" dans le hub.
jest.mock("@/app/(ui)/components/statistics/stat-viewer", () => ({
    StatViewer: ({ definition }: { definition: { title: string } }) => <div>{definition.title}</div>,
}));

// ActeurEntityResolver (réel dans ce test) tape legislaturesGateway pour lister
// les législatures disponibles — mocké pour ne pas dépendre du réseau.
jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: {
        getAll: jest.fn().mockResolvedValue([{ id: 1, number: 17, startDate: null, endDate: null }]),
        getCurrent: jest.fn().mockResolvedValue(null),
    },
}));

jest.mock("@/app/(ui)/_shared/statistics/catalog/stats-catalog", () => {
    const { Users } = jest.requireActual("lucide-react");

    const AGE_DISTRIBUTION = {
        id: "acteurs.age-distribution",
        slug: "age-distribution",
        domain: "acteurs",
        scope: "aggregate",
        title: "Répartition par âge",
        category: "Démographie",
        keywords: [],
        methodology: "",
        dataShape: "distribution",
    };

    const VOTE_POSITIONS = {
        id: "votes.positions",
        slug: "positions",
        domain: "votes",
        scope: "aggregate",
        title: "Répartition des positions de vote",
        category: "Positions de vote",
        keywords: [],
        methodology: "",
        dataShape: "distribution",
    };

    return {
        STATS_CATALOG: [
            { id: "acteurs", label: "Députés", icon: Users, stats: [AGE_DISTRIBUTION] },
            { id: "groupes", label: "Groupes", icon: Users, stats: [] },
            { id: "votes", label: "Votes", icon: Users, stats: [VOTE_POSITIONS] },
            { id: "scrutins", label: "Scrutins", icon: Users, stats: [] },
            { id: "legislatures", label: "Législatures", icon: Users, stats: [] },
        ],
    };
});

import StatisticsPageClient from "@/app/(ui)/(views)/(db)/statistics/statistics-page-client";

describe("StatisticsPageClient", () => {
    it("keeps 'Quitter la comparaison' visible after deselecting every stat while in split mode", async () => {
        render(<StatisticsPageClient />);

        // Sélectionne une stat, dans le premier (et seul, pour l'instant) picker
        // — il faut d'abord choisir une législature pour que la catégorie apparaisse.
        fireEvent.click(screen.getAllByText("Députés")[0]);
        fireEvent.click(await screen.findByText("17ᵉ législature"));
        fireEvent.click(await screen.findByText("Répartition par âge"));

        // Entre en comparaison.
        fireEvent.click(screen.getByText("Comparer"));
        expect(screen.getByText("Quitter la comparaison")).toBeInTheDocument();

        // Décoche la stat (sélection partagée entre les deux colonnes) : plus
        // rien à comparer, mais on doit pouvoir sortir du mode comparaison.
        fireEvent.click(screen.getAllByText("Répartition par âge")[0]);

        expect(screen.getByText("Quitter la comparaison")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Quitter la comparaison"));
        expect(screen.queryByText("Quitter la comparaison")).not.toBeInTheDocument();
    });

    it("resetting one context's picker does not clear the shared stat selection (nor the other context's chart)", async () => {
        render(<StatisticsPageClient />);

        fireEvent.click(screen.getAllByText("Députés")[0]);
        fireEvent.click(await screen.findByText("17ᵉ législature"));
        fireEvent.click(await screen.findByText("Répartition par âge"));
        fireEvent.click(screen.getByText("Comparer"));

        expect(screen.getByText("1 statistique sélectionnée")).toBeInTheDocument();

        // Réinitialise seulement le 2ᵉ contexte (celui-ci frais, jamais rempli).
        fireEvent.click(screen.getAllByText("Réinitialiser ce contexte")[1]);

        // selectedStatIds est partagé : réinitialiser un seul contexte ne doit
        // jamais le vider, sinon l'autre colonne perdrait aussi son graphe.
        expect(screen.getByText("1 statistique sélectionnée")).toBeInTheDocument();
        expect(
            screen.queryByText("Sélectionne une ou plusieurs statistiques ci-dessus pour commencer.")
        ).not.toBeInTheDocument();
    });

    it("hides 'Comparer' for a domain with no entity/population to vary between contexts", () => {
        render(<StatisticsPageClient />);

        fireEvent.click(screen.getAllByText("Votes")[0]);
        fireEvent.click(screen.getAllByText("Répartition des positions de vote")[0]);

        expect(screen.queryByText("Comparer")).not.toBeInTheDocument();
        expect(
            screen.getByText("Comparaison indisponible : ce domaine n'a pas d'entité ni de filtre à faire varier.")
        ).toBeInTheDocument();
    });
});
