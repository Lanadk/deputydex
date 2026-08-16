import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
        getAll: jest.fn().mockResolvedValue([
            { id: 1, number: 16, startDate: null, endDate: null },
            { id: 2, number: 17, startDate: null, endDate: null },
        ]),
        getCurrent: jest.fn().mockResolvedValue(null),
    },
}));

// GroupeEntityResolver (réel dans ce test) tape groupesGateways dès qu'une
// législature est choisie, quel que soit le scope — mocké pour ne pas
// dépendre du réseau.
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: {
        getGroupesCards: jest.fn().mockResolvedValue([]),
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

    // "scrutins" est le seul domaine du test qui n'a ni entité ni filtre
    // législature (voir ENTITY_RESOLVERS) : "votes" en a un désormais
    // (VotesEntityResolver, filtre législature), comme "groupes"/"acteurs".
    const SCRUTINS_PARTICIPATION = {
        id: "scrutins.participation",
        slug: "participation",
        domain: "scrutins",
        scope: "aggregate",
        title: "Évolution du taux de participation",
        category: "Participation",
        keywords: [],
        methodology: "",
        dataShape: "timeseries",
    };

    const GROUPES_EFFECTIFS = {
        id: "groupes.effectifs",
        slug: "effectifs",
        domain: "groupes",
        scope: "aggregate",
        title: "Effectifs par groupe",
        category: "Composition",
        keywords: [],
        methodology: "",
        dataShape: "distribution",
    };

    return {
        STATS_CATALOG: [
            { id: "acteurs", label: "Députés", icon: Users, stats: [AGE_DISTRIBUTION] },
            { id: "groupes", label: "Groupes", icon: Users, stats: [GROUPES_EFFECTIFS] },
            { id: "votes", label: "Votes", icon: Users, stats: [VOTE_POSITIONS] },
            { id: "scrutins", label: "Scrutins", icon: Users, stats: [SCRUTINS_PARTICIPATION] },
            { id: "legislatures", label: "Législatures", icon: Users, stats: [] },
        ],
    };
});

import AvancePageClient from "@/app/(ui)/(views)/(db)/statistics/avance/avance-page-client";

describe("AvancePageClient", () => {
    it("keeps 'Quitter la comparaison' visible after deselecting every stat while in split mode", async () => {
        render(<AvancePageClient />);

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
        render(<AvancePageClient />);

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

    it("follows the domain established by the OTHER context's pick, not a stale locally-opened domain", async () => {
        render(<AvancePageClient />);

        // Contexte A : ouvre "Députés" (openDomain local du picker A =
        // "acteurs") puis sélectionne une stat -> comparaison.
        fireEvent.click(screen.getAllByText("Députés")[0]);
        fireEvent.click(await screen.findByText("17ᵉ législature"));
        fireEvent.click(await screen.findByText("Répartition par âge"));
        fireEvent.click(screen.getByText("Comparer"));

        // Désélectionne la stat côté A : selectedStatIds redevient vide des
        // deux côtés, mais le picker A garde "acteurs" comme openDomain
        // local (jamais réinitialisé par un simple décochage).
        fireEvent.click(screen.getAllByText("Répartition par âge")[0]);

        // Contexte B choisit "Groupes" et sélectionne sa propre stat — ça
        // établit selectedStatIds (partagé) sur le domaine "groupes". 16ᵉ
        // (pas 17ᵉ, déjà pris par le contexte A — voir otherContext) pour ne
        // pas se heurter au grisage testé par ailleurs.
        fireEvent.click(screen.getAllByText("Groupes")[1]);
        await waitFor(() => expect(screen.getAllByText("16ᵉ législature")).toHaveLength(2));
        fireEvent.click(screen.getAllByText("16ᵉ législature")[1]);
        fireEvent.click(await screen.findByText("Effectifs par groupe"));

        // Le picker A doit désormais suivre la contrainte partagée
        // (« groupes ») plutôt que son openDomain local périmé (« acteurs »)
        // — sans qu'on ait besoin de recliquer sur "Groupes" côté A.
        expect(screen.queryByText("Tous les députés")).not.toBeInTheDocument();
        expect(screen.queryByText("Un député précis")).not.toBeInTheDocument();
        expect(screen.getAllByText("Tous les groupes")).toHaveLength(2);
    });

    it("resetting one context's picker closes only that picker — the other keeps its filters/categories untouched", async () => {
        render(<AvancePageClient />);

        // Contexte A : Groupes -> 16ᵉ législature -> Effectifs par groupe.
        fireEvent.click(screen.getAllByText("Groupes")[0]);
        fireEvent.click(await screen.findByText("16ᵉ législature"));
        fireEvent.click(await screen.findByText("Effectifs par groupe"));
        fireEvent.click(screen.getByText("Comparer"));

        // Contexte B : même domaine (auto-ouvert via la sélection partagée),
        // une législature différente (17ᵉ, 16ᵉ déjà prise par A).
        await waitFor(() => expect(screen.getAllByText("17ᵉ législature")).toHaveLength(2));
        fireEvent.click(screen.getAllByText("17ᵉ législature")[1]);

        // Les deux pickers affichent le resolver "Groupes" à ce stade.
        expect(screen.getAllByText("Tous les groupes")).toHaveLength(2);

        // Réinitialise SEULEMENT le contexte A.
        fireEvent.click(screen.getAllByText("Réinitialiser ce contexte")[0]);

        // Le picker A revient au choix de domaine (plus de resolver ni de
        // catégories pour lui) — celui de B reste inchangé.
        expect(screen.getAllByText("Tous les groupes")).toHaveLength(1);
        expect(screen.getByText("17ᵉ législature")).toBeInTheDocument();
    });

    it("resetting BOTH contexts clears the shared selection too, unlocking domain choice again", async () => {
        render(<AvancePageClient />);

        // Contexte A : Groupes -> 16ᵉ législature -> Effectifs par groupe.
        fireEvent.click(screen.getAllByText("Groupes")[0]);
        fireEvent.click(await screen.findByText("16ᵉ législature"));
        fireEvent.click(await screen.findByText("Effectifs par groupe"));
        fireEvent.click(screen.getByText("Comparer"));

        // Contexte B : même domaine (auto-ouvert), 17ᵉ (16 déjà pris par A).
        await waitFor(() => expect(screen.getAllByText("17ᵉ législature")).toHaveLength(2));
        fireEvent.click(screen.getAllByText("17ᵉ législature")[1]);

        // La sélection active verrouille le domaine : "Votes" indisponible
        // des deux côtés.
        expect(screen.getAllByText("Votes")[0].closest("button")).toBeDisabled();
        expect(screen.getAllByText("Votes")[1].closest("button")).toBeDisabled();

        // Réinitialise A seul : B garde encore ses filtres, la contrainte
        // domaine/scope doit donc persister.
        fireEvent.click(screen.getAllByText("Réinitialiser ce contexte")[0]);
        expect(screen.getAllByText("Votes")[0].closest("button")).toBeDisabled();

        // Réinitialise aussi B : plus aucun contexte n'a de filtre nulle
        // part, la contrainte tombe et "Votes" redevient choisissable.
        fireEvent.click(screen.getAllByText("Réinitialiser ce contexte")[1]);

        expect(screen.getAllByText("Votes")[0].closest("button")).not.toBeDisabled();
        expect(screen.getAllByText("Votes")[1].closest("button")).not.toBeDisabled();
        expect(screen.queryByText("1 statistique sélectionnée")).not.toBeInTheDocument();
    });

    it("hides 'Comparer' for a domain with no entity/population to vary between contexts", () => {
        render(<AvancePageClient />);

        fireEvent.click(screen.getAllByText("Scrutins")[0]);
        fireEvent.click(screen.getAllByText("Évolution du taux de participation")[0]);

        expect(screen.queryByText("Comparer")).not.toBeInTheDocument();
        expect(
            screen.getByText("Comparaison indisponible : ce domaine n'a pas d'entité ni de filtre à faire varier.")
        ).toBeInTheDocument();
    });

    it("requires a legislature for 'votes' (VotesEntityResolver, filtre législature seul — pas de portée entité/population)", async () => {
        render(<AvancePageClient />);

        fireEvent.click(screen.getAllByText("Votes")[0]);

        // Pas encore prêt : la catégorie ne doit pas apparaître avant le choix
        // d'une législature (même règle que groupes/acteurs).
        expect(screen.queryByText("Répartition des positions de vote")).not.toBeInTheDocument();
        expect(screen.queryByText("Un groupe précis")).not.toBeInTheDocument();
        expect(screen.queryByText("Tous les groupes")).not.toBeInTheDocument();

        fireEvent.click(await screen.findByText("17ᵉ législature"));
        fireEvent.click(await screen.findByText("Répartition des positions de vote"));

        // Deux occurrences désormais : la checkbox du picker + le mock
        // StatViewer qui rend le titre de la définition sélectionnée.
        expect(screen.getAllByText("Répartition des positions de vote").length).toBeGreaterThan(0);
    });
});
