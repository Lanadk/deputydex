import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn(), getChiffres: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: {
        getDeputesCardsSample: jest.fn(),
        getDeputesTendances: jest.fn(),
        getDeputeVoteStats: jest.fn().mockResolvedValue({
            totalVotes: 1, totalPour: 1, totalContre: 0, totalAbstentions: 0, totalNonVotants: 0,
            rebelVotesCount: 0, tauxFidelite: 100, tauxParticipation: 100,
        }),
        getDeputeActivityCalendar: jest.fn().mockResolvedValue([]),
    },
}));
jest.mock("@/app/(ui)/gateways/scrutins/scrutins.gateway", () => ({
    scrutinsGateway: { getScrutinsList: jest.fn(), getScrutinPlusSerre: jest.fn() },
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
const SCRUTIN = {
    uid: "VOTE1", numero: "10001", date: "2026-11-18T00:00:00.000Z", titre: "l'ensemble du projet de loi de finances",
    type: { code: "SPS", libelle: "scrutin public solennel" }, resultat: { isAdopte: true, libelle: "adopté" },
    objet: { code: "ensemble", libelle: "Ensemble d'un texte" }, pour: 300, contre: 200, abstentions: 50,
};
const depute = (uid: string, nom: string) => ({ deputeUID: uid, deputeFullName: nom, deputeGroupeCode: "RN", deputeImage: `/img/${uid}.png` });

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
        (scrutinsGateway.getScrutinsList as jest.Mock).mockResolvedValue({ items: [SCRUTIN], total: 1, page: 1, pageSize: 3, pageCount: 1 });
        (deputesGateway.getDeputesTendances as jest.Mock).mockResolvedValue({
            periode: { debut: "2026-10-21", fin: "2026-11-19" },
            scrutins: 1134,
            assidu: { depute: depute("PA1", "Julien Guibert"), valeur: 850 },
            rebelle: { depute: depute("PA2", "Félicie Gérard"), valeur: 212 },
            amendements: null,
        });
        (scrutinsGateway.getScrutinPlusSerre as jest.Mock).mockResolvedValue({
            periode: { debut: "2026-10-21", fin: "2026-11-19" },
            scrutin: { ...SCRUTIN, uid: "SERRE", titre: "l'amendement n° 2617", pour: 72, contre: 72, resultat: { isAdopte: false, libelle: "rejeté" } },
            ecart: 0,
        });
    });

    it("« Ce mois-ci » : derniers votes importants et records du mois", async () => {
        render(<HomeClient />);

        const periode = await screen.findByText(/21 oct\. → 19 nov\. 2026/);
        expect(periode).toHaveTextContent(/1\s?134 scrutins publics/);
        expect(scrutinsGateway.getScrutinsList).toHaveBeenCalledWith(17, { pageSize: "3" });
        expect(screen.getByRole("link", { name: /Dernier vote important.*Adopté.*L'ensemble du projet de loi de finances/ })).toHaveAttribute("href", "/scrutins/VOTE1");
        expect(await screen.findByRole("link", { name: /Le plus assidu.*850.*scrutins sur 1\s?134.*Julien Guibert/ })).toHaveAttribute("href", "/deputes/PA1");
        expect(screen.getByRole("link", { name: /Le rebelle du mois.*212.*votes contre son groupe.*Félicie Gérard/ })).toHaveAttribute("href", "/deputes/PA2");
        expect(screen.getByRole("link", { name: /Le plus serré du mois.*72.*72.*Rejeté à égalité parfaite.*L'amendement n° 2617/ })).toHaveAttribute("href", "/scrutins/SERRE");
        // Pas de donnée pour un classement : message, pas de carte vide.
        expect(screen.getByText("Pas de données sur la période.")).toBeInTheDocument();
    });

    it("invite à défiler vers la suite de la page", async () => {
        const { container } = render(<HomeClient />);

        expect(await screen.findByRole("link", { name: "Défiler pour l'actu" })).toHaveAttribute("href", "#home-suite");
        expect(container.querySelector("#home-suite")).toBeInTheDocument();
        // Puis, en bas de l'actu, vers la page suivante.
        expect(screen.getByRole("link", { name: "Défiler pour explorer" })).toHaveAttribute("href", "#home-explorer-page");
        expect(container.querySelector("#home-explorer-page")).toBeInTheDocument();
    });

    it("plus de mode avancé sur l'accueil", () => {
        render(<HomeClient />);

        expect(screen.queryByText(/mode avancé/i)).not.toBeInTheDocument();
    });

    it("présente la législature en cours lue en base, sans passer par le sélecteur global", async () => {
        // Aucun LegislatureProvider monté : l'accueil n'en dépend pas.
        render(<HomeClient />);

        expect(await screen.findByText("17ᵉ législature en cours")).toBeInTheDocument();
        expect(deputesGateway.getDeputesCardsSample).toHaveBeenCalledWith(17);
        expect(deputesGateway.getDeputesTendances).toHaveBeenCalledWith(17);
        expect(scrutinsGateway.getScrutinPlusSerre).toHaveBeenCalledWith(17);
        // L'Assemblée en chiffres, avant « Explorer ».
        expect(legislaturesGateway.getChiffres).toHaveBeenCalledWith(17);
        expect(screen.getByRole("heading", { name: "L'Assemblée en chiffres" })).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: /4\s?321.*scrutins publics/ })).toHaveAttribute("href", "/scrutins");
        // Fiche miniature de la tablette : les vraies données du député le plus assidu.
        expect(deputesGateway.getDeputeVoteStats).toHaveBeenCalledWith("PA1", 17);
        expect(deputesGateway.getDeputeActivityCalendar).toHaveBeenCalledWith("PA1", 17);
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
