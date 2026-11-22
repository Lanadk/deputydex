import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/providers/legislature-provider", () => ({
    useLegislature: () => ({
        // Choix global sur la 16ᵉ : la page l'ignore, ses onglets s'ouvrent sur la plus récente.
        legislature: { id: 1, number: 16, startDate: "2022-06-28T00:00:00.000Z", endDate: "2024-06-09T00:00:00.000Z" },
        legislatures: [
            { id: 2, number: 17, startDate: "2024-07-18T00:00:00.000Z", endDate: null },
            { id: 1, number: 16, startDate: "2022-06-28T00:00:00.000Z", endDate: "2024-06-09T00:00:00.000Z" },
        ],
    }),
}));
jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getFrise: jest.fn(), getChiffres: jest.fn(), getOrganisation: jest.fn() },
}));

import LegislaturesPageClient from "@/app/(ui)/(views)/(db)/legislatures/legislatures-page-client";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

const gateway = legislaturesGateway as jest.Mocked<typeof legislaturesGateway>;

const FRISE = {
    debut: "2022-05-17", fin: "2026-11-22", evenements: [{ date: "2024-06-09", libelle: "Dissolution de l'Assemblée" }],
    couloirs: [{ id: "gouvernements" as const, libelle: "Gouvernements", periodes: [{ id: "g", libelle: "Gouvernement Borne", detail: null, debut: "2022-05-17", fin: "2024-01-08", href: null }] }],
};
const CHIFFRES = { legislature: 17, debut: "2024-07-18", fin: null, dureeJours: 857, scrutins: 10040, deputesAyantSiege: 655, gouvernements: 4, entreesEnCours: 107, entreesParMotif: [] };
const ORGANISATION = {
    legislature: 17, dateReference: "2026-11-22", presidence: null, gouvernements: [],
    assemblee: { president: null, vicePresidents: [], questeurs: [], secretaires: [], presidentsGroupe: [], presidentsCommission: [] },
};

describe("LegislaturesPageClient", () => {
    beforeEach(() => jest.clearAllMocks());

    it("explique, liste les législatures couvertes, et affiche frise, chiffres et organigramme de la législature choisie", async () => {
        gateway.getFrise.mockResolvedValue(FRISE);
        gateway.getChiffres.mockResolvedValue(CHIFFRES);
        gateway.getOrganisation.mockResolvedValue(ORGANISATION);

        render(<LegislaturesPageClient />);

        expect(screen.getByRole("heading", { name: "Qu'est-ce qu'une législature ?" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Les législatures présentes dans Députédex" })).toBeInTheDocument();
        expect(screen.getByText("28 juin 2022")).toBeInTheDocument();
        expect(screen.getByText("9 juin 2024")).toBeInTheDocument();
        expect(screen.getByText("18 juillet 2024")).toBeInTheDocument();
        expect(screen.getByText("En cours")).toBeInTheDocument();
        expect(screen.getByText(/1 an et 11 mois · interrompue par une dissolution/)).toBeInTheDocument();

        expect(await screen.findByRole("list", { name: "Gouvernements" })).toBeInTheDocument();
        expect(await screen.findByText("10 040")).toBeInTheDocument();
        expect(await screen.findByRole("heading", { name: "Exécutif" })).toBeInTheDocument();
        expect(gateway.getChiffres).toHaveBeenCalledWith(17);
        expect(gateway.getOrganisation).toHaveBeenCalledWith(17);
    });

    it("onglets de législature : la plus récente par défaut (quel que soit le choix global), puis l'onglet choisi", async () => {
        gateway.getFrise.mockResolvedValue(FRISE);
        gateway.getChiffres.mockResolvedValue(CHIFFRES);
        gateway.getOrganisation.mockResolvedValue(ORGANISATION);

        render(<LegislaturesPageClient />);

        const onglets = screen.getAllByRole("tab");
        expect(onglets.map((o) => o.textContent)).toEqual(["17ᵉ législature", "16ᵉ législature"]);
        expect(onglets[0]).toHaveAttribute("aria-selected", "true");

        fireEvent.click(onglets[1]);

        expect(await screen.findByRole("heading", { name: "La 16ᵉ législature en chiffres" })).toBeInTheDocument();
        expect(gateway.getChiffres).toHaveBeenLastCalledWith(16);
        expect(gateway.getOrganisation).toHaveBeenLastCalledWith(16);
    });

    it("chaque bloc a son erreur et son « Réessayer », sans bloquer les autres", async () => {
        gateway.getFrise.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce(FRISE);
        gateway.getChiffres.mockResolvedValue(CHIFFRES);
        gateway.getOrganisation.mockResolvedValue(ORGANISATION);

        render(<LegislaturesPageClient />);

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger la chronologie");
        expect(await screen.findByText("10 040")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));
        expect(await screen.findByRole("list", { name: "Gouvernements" })).toBeInTheDocument();
    });
});
