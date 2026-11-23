import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn(), getChiffres: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: {
        getDeputesCardsSample: jest.fn(),
        getDeputesTendances: jest.fn(),
        getDeputeVoteStats: jest.fn(),
        getDeputeActivityCalendar: jest.fn(),
    },
}));
jest.mock("@/app/(ui)/gateways/scrutins/scrutins.gateway", () => ({
    scrutinsGateway: { getScrutinsList: jest.fn(), getScrutinPlusSerre: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: { getGroupesCards: jest.fn() },
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
import type { HomeData } from "@/app/home-data";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";

const L16 = { id: 16, number: 16, startDate: "2022-06-28", endDate: "2024-06-09" };
const L17 = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };
const SCRUTIN = {
    uid: "VOTE1", numero: "10001", date: "2026-11-18T00:00:00.000Z", titre: "l'ensemble du projet de loi de finances",
    type: { code: "SPS", libelle: "scrutin public solennel" }, resultat: { isAdopte: true, libelle: "adopté" },
    objet: { code: "ensemble", libelle: "Ensemble d'un texte" }, pour: 300, contre: 200, abstentions: 50,
};
const depute = (uid: string, nom: string) => ({ deputeUID: uid, deputeFullName: nom, deputeGroupeCode: "RN", deputeImage: `/img/${uid}.png` });
const CHIFFRES = {
    legislature: 17, debut: "2024-07-18", fin: null, dureeJours: 493,
    scrutins: 4321, deputesAyantSiege: 612, gouvernements: 4, entreesEnCours: 35, entreesParMotif: [],
};

/** Toutes les données de l'accueil, telles que le serveur les fournit. */
const SERVEUR: HomeData = {
    legislature: L17,
    legislatures: [L17, L16],
    cards: [],
    derniers: { items: [SCRUTIN], total: 1, page: 1, pageSize: 3, pageCount: 1 },
    groupes: [],
    chiffres: CHIFFRES,
    tendances: {
        periode: { debut: "2026-10-21", fin: "2026-11-19" },
        scrutins: 1134,
        assidu: { depute: depute("PA1", "Julien Guibert"), valeur: 850 },
        rebelle: { depute: depute("PA2", "Félicie Gérard"), valeur: 212 },
        amendements: null,
    },
    plusSerre: {
        periode: { debut: "2026-10-21", fin: "2026-11-19" },
        scrutin: { ...SCRUTIN, uid: "SERRE", titre: "l'amendement n° 2617", pour: 72, contre: 72, resultat: { isAdopte: false, libelle: "rejeté" } },
        ecart: 0,
    },
    fiche: {
        depute: depute("PA1", "Julien Guibert"),
        stats: {
            totalVotes: 1, totalPour: 1, totalContre: 0, totalAbstentions: 0, totalNonVotants: 0,
            rebelVotesCount: 0, tauxFidelite: 100, tauxParticipation: 100,
        },
        activite: [],
    },
};

const tousLesAppels = () => [
    legislaturesGateway.getCurrent, legislaturesGateway.getAll, legislaturesGateway.getChiffres,
    deputesGateway.getDeputesCardsSample, deputesGateway.getDeputesTendances,
    deputesGateway.getDeputeVoteStats, deputesGateway.getDeputeActivityCalendar,
    scrutinsGateway.getScrutinsList, scrutinsGateway.getScrutinPlusSerre, groupesGateways.getGroupesCards,
] as jest.Mock[];

describe("HomeClient", () => {
    beforeEach(() => jest.clearAllMocks());

    it("données du serveur : page complète, sans aucun appel API", () => {
        render(<HomeClient initial={SERVEUR} />);

        expect(screen.getByText("17ᵉ législature en cours")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "L'Assemblée en chiffres" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /4\s?321.*scrutins publics/ })).toHaveAttribute("href", "/scrutins");
        for (const appel of tousLesAppels()) expect(appel).not.toHaveBeenCalled();
    });

    it("l'actu : derniers votes importants et records du mois", () => {
        render(<HomeClient initial={SERVEUR} />);

        expect(screen.getByText(/21 oct\. → 19 nov\. 2026/)).toHaveTextContent(/1\s?134 scrutins publics/);
        expect(screen.getByRole("link", { name: /Dernier vote important.*Adopté.*L'ensemble du projet de loi de finances/ })).toHaveAttribute("href", "/scrutins/VOTE1");
        expect(screen.getByRole("link", { name: /Le plus assidu.*850.*scrutins sur 1\s?134.*Julien Guibert/ })).toHaveAttribute("href", "/deputes/PA1");
        expect(screen.getByRole("link", { name: /Le rebelle du mois.*212.*votes contre son groupe.*Félicie Gérard/ })).toHaveAttribute("href", "/deputes/PA2");
        expect(screen.getByRole("link", { name: /Le plus serré du mois.*72.*72.*Rejeté à égalité parfaite.*L'amendement n° 2617/ })).toHaveAttribute("href", "/scrutins/SERRE");
        // Pas de donnée pour un classement : message, pas de carte vide.
        expect(screen.getByText("Pas de données sur la période.")).toBeInTheDocument();
    });

    it("bloc indisponible côté serveur : rechargé par le client, et seulement lui", async () => {
        (legislaturesGateway.getChiffres as jest.Mock).mockResolvedValue(CHIFFRES);

        render(<HomeClient initial={{ ...SERVEUR, chiffres: null }} />);

        expect(await screen.findByRole("link", { name: /4\s?321.*scrutins publics/ })).toHaveAttribute("href", "/scrutins");
        expect(legislaturesGateway.getChiffres).toHaveBeenCalledWith(17);
        expect(scrutinsGateway.getScrutinsList).not.toHaveBeenCalled();
        expect(deputesGateway.getDeputesTendances).not.toHaveBeenCalled();
    });

    it("fiche miniature absente côté serveur : rechargée pour le député le plus assidu", async () => {
        (deputesGateway.getDeputeVoteStats as jest.Mock).mockResolvedValue({
            totalVotes: 1, totalPour: 1, totalContre: 0, totalAbstentions: 0, totalNonVotants: 0,
            rebelVotesCount: 0, tauxFidelite: 100, tauxParticipation: 100,
        });
        (deputesGateway.getDeputeActivityCalendar as jest.Mock).mockResolvedValue([]);

        render(<HomeClient initial={{ ...SERVEUR, fiche: null }} />);

        await screen.findByText("17ᵉ législature en cours");
        expect(deputesGateway.getDeputeVoteStats).toHaveBeenCalledWith("PA1", 17);
        expect(deputesGateway.getDeputeActivityCalendar).toHaveBeenCalledWith("PA1", 17);
    });

    it("barre de progression : un point par « page » de l'accueil, chacun vers sa page", () => {
        const { container } = render(<HomeClient initial={SERVEUR} />);

        const nav = within(screen.getByRole("navigation", { name: "Sections de l'accueil" }));
        expect(nav.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["#home-accueil", "#home-actu", "#home-explorer-page"]);
        for (const id of ["home-accueil", "home-actu", "home-explorer-page"]) {
            expect(container.querySelector(`#${id}`)).toBeInTheDocument();
        }
        // L'ancienne invitation à défiler n'est plus sur l'accueil.
        expect(screen.queryByRole("link", { name: /Défiler pour/ })).not.toBeInTheDocument();
    });

    it("plus de mode avancé sur l'accueil", () => {
        render(<HomeClient initial={SERVEUR} />);

        expect(screen.queryByText(/mode avancé/i)).not.toBeInTheDocument();
    });

    it("indique les législatures couvertes", () => {
        render(<HomeClient initial={SERVEUR} />);

        expect(screen.getByText("2 législatures couvertes : la 16ᵉ (2022 – 2024) et la 17ᵉ (depuis 2024)")).toBeInTheDocument();
    });

    it("ne met en avant que les thèmes statistiques qui ont une page", () => {
        render(<HomeClient initial={SERVEUR} />);

        expect(screen.getByRole("link", { name: /Les femmes à l'Assemblée nationale/ })).toHaveAttribute("href", "/statistics/chiffres-cles/femmes-assemblee");
        expect(screen.queryByText("Les textes de loi")).not.toBeInTheDocument();
    });
});
