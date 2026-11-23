import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn(), getChiffres: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: { getDeputesCardsSample: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/scrutins/scrutins.gateway", () => ({
    scrutinsGateway: { getScrutinsList: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: { getGroupesCards: jest.fn().mockResolvedValue([]) },
}));
jest.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "light" }) }));
// Le registre des thèmes « Chiffres clés » tire les configurations de toutes les pages : inutile ici.
jest.mock("@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry", () => ({
    KEY_FIGURE_THEMES: [
        { slug: "femmes-assemblee", title: "Les femmes à l'Assemblée nationale", teaser: "Parité", icon: () => null, category: "humain", sections: [{}] },
        { slug: "textes-de-loi", title: "Les textes de loi", teaser: "Bientôt", icon: () => null, category: "activite", sections: [] },
    ],
}));

import HomeClient from "@/app/home-client";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";

const L16 = { id: 16, number: 16, startDate: "2022-06-28", endDate: "2024-06-09" };
const L17 = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };

describe("HomeClient", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (legislaturesGateway.getCurrent as jest.Mock).mockResolvedValue(L17);
        (legislaturesGateway.getAll as jest.Mock).mockResolvedValue([L17, L16]);
        (legislaturesGateway.getChiffres as jest.Mock).mockResolvedValue({
            legislature: 17, debut: "2024-07-18", fin: null, dureeJours: 493,
            scrutins: 4321, deputesAyantSiege: 612, gouvernements: 4, entreesEnCours: 35, entreesParMotif: [],
        });
        (deputesGateway.getDeputesCardsSample as jest.Mock).mockResolvedValue([]);
        (scrutinsGateway.getScrutinsList as jest.Mock).mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 1, pageCount: 0 });
    });

    it("présente la législature en cours lue en base, sans passer par le sélecteur global", async () => {
        // Aucun LegislatureProvider monté : l'accueil n'en dépend pas.
        render(<HomeClient />);

        expect(await screen.findByText("17ᵉ législature en cours")).toBeInTheDocument();
        expect(legislaturesGateway.getChiffres).toHaveBeenCalledWith(17);
        expect(deputesGateway.getDeputesCardsSample).toHaveBeenCalledWith(17);
        expect(scrutinsGateway.getScrutinsList).toHaveBeenCalledWith(17, { pageSize: "1" });
        expect(await screen.findByText("4 321")).toBeInTheDocument();
    });

    it("indique les législatures couvertes", async () => {
        render(<HomeClient />);

        expect(await screen.findByText("2 législatures couvertes : la 16ᵉ (2022 – 2024) et la 17ᵉ (depuis 2024)")).toBeInTheDocument();
    });

    it("ne met en avant que les thèmes statistiques qui ont une page", () => {
        render(<HomeClient />);

        expect(screen.getByRole("link", { name: /Les femmes à l'Assemblée nationale/ })).toHaveAttribute("href", "/statistics/chiffres-cles/femmes-assemblee");
        expect(screen.queryByText("Les textes de loi")).not.toBeInTheDocument();
    });
});
