import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// StatViewerLib fetch/render une vraie stat — hors-sujet pour ce test, qui
// porte sur la visibilité du bouton "Quitter la comparaison" dans le hub.
jest.mock("@/app/(ui)/components/statistics/stat-viewer-lib", () => ({
    StatViewerLib: ({ definition }: { definition: { title: string } }) => <div>{definition.title}</div>,
}));

jest.mock("@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog", () => {
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
    it("keeps 'Quitter la comparaison' visible after resetting the selection while in split mode", () => {
        render(<StatisticsPageClient />);

        // Sélectionne une stat, dans le premier (et seul, pour l'instant) picker.
        fireEvent.click(screen.getAllByText("Députés")[0]);
        fireEvent.click(screen.getAllByText("Répartition par âge")[0]);

        // Entre en comparaison.
        fireEvent.click(screen.getByText("Comparer"));
        expect(screen.getByText("Quitter la comparaison")).toBeInTheDocument();

        // Reset depuis l'un des deux pickers (maintenant dupliqués en mode split).
        fireEvent.click(screen.getAllByText("Réinitialiser")[0]);

        // Le bouton pour sortir du mode comparaison doit rester accessible
        // même si plus aucune stat n'est sélectionnée.
        expect(screen.getByText("Quitter la comparaison")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Quitter la comparaison"));
        expect(screen.queryByText("Quitter la comparaison")).not.toBeInTheDocument();
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
