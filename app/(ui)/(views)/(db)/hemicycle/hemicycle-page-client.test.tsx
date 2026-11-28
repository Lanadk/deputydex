import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn(), getPresidenceAssemblee: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: { getDeputesCards: jest.fn(), getDeputesIndicateurs: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: { getGroupesCards: jest.fn() },
}));

import HemicyclePageClient from "@/app/(ui)/(views)/(db)/hemicycle/hemicycle-page-client";
import { LegislatureProvider } from "@/app/(ui)/providers/legislature-provider";
import { NotificationProvider } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";

const getCurrent = legislaturesGateway.getCurrent as jest.Mock;
const getAll = legislaturesGateway.getAll as jest.Mock;
const getPresidenceAssemblee = legislaturesGateway.getPresidenceAssemblee as jest.Mock;
const getDeputesCards = deputesGateway.getDeputesCards as jest.Mock;
const getDeputesIndicateurs = deputesGateway.getDeputesIndicateurs as jest.Mock;
const getGroupesCards = groupesGateways.getGroupesCards as jest.Mock;

const L17 = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };
const DEPUTES = [
    { deputeUID: "PA1", deputeFullName: "Mathilde Panot", deputeGroupeCode: "LFI-NFP", deputeImage: "/1.png" },
    { deputeUID: "PA721908", deputeFullName: "Yaël Braun-Pivet", deputeGroupeCode: "EPR", deputeImage: "/ybp.png" },
    { deputeUID: "PA3", deputeFullName: "Gabriel Attal", deputeGroupeCode: "EPR", deputeImage: "/3.png" },
];
const PRESIDENCE = { uid: "PA721908", nom: "Yaël Braun-Pivet", depuis: "2024-07-18", jusqua: null };

const renderPage = () => render(
    <NotificationProvider>
        <LegislatureProvider>
            <HemicyclePageClient />
        </LegislatureProvider>
    </NotificationProvider>
);

describe("HemicyclePageClient — présidence au perchoir", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
        getCurrent.mockResolvedValue(L17);
        getAll.mockResolvedValue([L17]);
        getDeputesCards.mockResolvedValue(DEPUTES);
        getGroupesCards.mockResolvedValue([]);
    });
    afterEach(() => jest.restoreAllMocks());

    it("place la présidence au perchoir, lien vers sa fiche, sans siège de plus", async () => {
        getPresidenceAssemblee.mockResolvedValue(PRESIDENCE);

        const { container } = renderPage();

        const perchoir = await screen.findByRole("link", { name: "Présidence de l'Assemblée nationale : Yaël Braun-Pivet" });
        expect(perchoir).toHaveAttribute("href", "/deputes/PA721908");
        expect(getPresidenceAssemblee).toHaveBeenCalledWith(17);
        expect(container.querySelectorAll(".hemicycle-seat")).toHaveLength(DEPUTES.length);
        expect(container.querySelectorAll('[data-perchoir="true"]')).toHaveLength(1);
    });

    it("échec de la présidence : hémicycle sans perchoir, et une notification", async () => {
        getPresidenceAssemblee.mockRejectedValue(new Error("500"));

        const { container } = renderPage();

        expect(await screen.findByText("La présidence de l'Assemblée n'a pas pu être chargée.")).toBeInTheDocument();
        await waitFor(() => expect(container.querySelectorAll(".hemicycle-seat")).toHaveLength(DEPUTES.length));
        expect(container.querySelector('[data-perchoir="true"]')).toBeNull();
        expect(screen.queryByRole("link", { name: /Présidence de l'Assemblée nationale/ })).not.toBeInTheDocument();
    });

    it("échec des cartes députés : message d'erreur", async () => {
        getPresidenceAssemblee.mockResolvedValue(PRESIDENCE);
        getDeputesCards.mockRejectedValue(new Error("500"));

        renderPage();

        expect(await screen.findByText("Impossible de charger l'hémicycle.")).toBeInTheDocument();
    });
});

describe("HemicyclePageClient — coalition et couleur des sièges", () => {
    const indicateur = (uid: string, tauxPresence: number | null, joursAttendus = 100) => ({
        uid, joursAttendus, tauxPresence, tauxPresenceSeance: null, tauxPresenceCommission: null, tauxParticipationScrutins: null,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
        getCurrent.mockResolvedValue(L17);
        getAll.mockResolvedValue([L17]);
        getDeputesCards.mockResolvedValue(DEPUTES);
        getGroupesCards.mockResolvedValue([]);
        getPresidenceAssemblee.mockResolvedValue(null);
    });
    afterEach(() => jest.restoreAllMocks());

    const titres = (container: HTMLElement) =>
        Array.from(container.querySelectorAll(".hemicycle-seat")).map((s) => s.getAttribute("title"));

    it("mode groupes par défaut : chaque siège nomme son député, pas d'indicateur chargé ni proposé", async () => {
        const { container } = renderPage();

        await waitFor(() => expect(titres(container)).toEqual(["Mathilde Panot · LFI-NFP", "Gabriel Attal · EPR", "Yaël Braun-Pivet · EPR"]));
        expect(screen.getByRole("button", { name: "Groupes" })).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "Mode coalition" })).toHaveAttribute("aria-pressed", "false");
        expect(screen.queryByRole("group", { name: "Thème" })).not.toBeInTheDocument();
        expect(getDeputesIndicateurs).not.toHaveBeenCalled();
    });

    it("mode statistiques : présence par défaut, quartiles, info-bulle avec la valeur, échelle", async () => {
        getDeputesIndicateurs.mockResolvedValue([indicateur("PA1", 80), indicateur("PA721908", 50, 12), indicateur("PA3", 20)]);
        const user = userEvent.setup();
        const { container } = renderPage();

        await user.click(await screen.findByRole("button", { name: "Statistiques par député" }));

        expect(getDeputesIndicateurs).toHaveBeenCalledWith(17);
        expect(await screen.findByRole("list", { name: "Échelle : Taux de présence" })).toBeInTheDocument();
        // Thème Présence, indicateur Total par défaut ; séance, commission et scrutins dans le même thème.
        expect(screen.getByRole("button", { name: "Présence" })).toHaveAttribute("aria-pressed", "true");
        const indicateursPresence = screen.getByRole("group", { name: "Indicateur : Présence" });
        expect(Array.from(indicateursPresence.querySelectorAll("button")).map((b) => b.textContent)).toEqual(["Total", "Séance", "Commission", "Scrutins"]);
        expect(screen.getByRole("button", { name: "Total" })).toHaveAttribute("aria-pressed", "true");
        expect(titres(container)).toContain("Mathilde Panot · LFI-NFP\nTaux de présence : 80,0 % (sur 100 jours attendus)");
        expect(container.querySelectorAll(".hemicycle-seat.hemicycle-seat--peu-fiable")).toHaveLength(1);
        expect(screen.getByText("Hachuré : moins de 30 jours attendus")).toBeInTheDocument();

        // Un autre indicateur réutilise les données déjà chargées.
        await user.click(screen.getByRole("button", { name: "Séance" }));
        expect(getDeputesIndicateurs).toHaveBeenCalledTimes(1);
        expect(titres(container)).toContain("Mathilde Panot · LFI-NFP\nPrésence en séance : pas de donnée");
        expect(screen.getByText("Présence en séance : pas de donnée pour cette législature.")).toBeInTheDocument();
    });

    it("échec des indicateurs : notification et retour au mode groupes", async () => {
        getDeputesIndicateurs.mockRejectedValue(new Error("500"));
        const user = userEvent.setup();
        renderPage();

        await user.click(await screen.findByRole("button", { name: "Statistiques par député" }));

        expect(await screen.findByText("Les indicateurs des députés n'ont pas pu être chargés.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Groupes" })).toHaveAttribute("aria-pressed", "true");
    });

    it("sans mode coalition : un seul groupe à la fois, un clic remplace la sélection", async () => {
        const user = userEvent.setup();
        renderPage();

        const [lfi, epr] = await screen.findAllByRole("button", { name: /: \d+ sièges$/ });
        await user.click(lfi);
        await user.click(epr);

        expect(epr).toHaveAttribute("aria-pressed", "true");
        expect(lfi).toHaveAttribute("aria-pressed", "false");
        expect(screen.queryByText(/^Coalition /)).not.toBeInTheDocument();
    });

    it("mode coalition : plusieurs groupes, majorité absolue ; on garde le dernier en le quittant", async () => {
        getDeputesIndicateurs.mockResolvedValue([]);
        const user = userEvent.setup();
        renderPage();

        await user.click(await screen.findByRole("button", { name: "Mode coalition" }));
        expect(screen.getByRole("button", { name: "Mode coalition" })).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("Mode coalition", { selector: ".hemicycle-detail__big" })).toBeInTheDocument();

        const [lfi, epr] = screen.getAllByRole("button", { name: /: \d+ sièges$/ });
        await user.click(epr);
        expect(screen.getByText("Coalition EPR")).toBeInTheDocument();
        await user.click(lfi);
        expect(screen.getByText("Coalition LFI-NFP + EPR")).toBeInTheDocument();
        expect(screen.getByText("Majorité absolue atteinte : 2 sièges requis, 1 de plus.")).toBeInTheDocument();

        // Statistiques : un seul groupe en relief (le dernier choisi), pas de coalition.
        await user.click(screen.getByRole("button", { name: "Statistiques par député" }));
        expect(screen.queryByText(/^Coalition /)).not.toBeInTheDocument();
        expect(lfi).toHaveAttribute("aria-pressed", "true");
        expect(epr).toHaveAttribute("aria-pressed", "false");

        // Retour aux groupes : le mode coalition est resté actif.
        await user.click(screen.getByRole("button", { name: "Groupes" }));
        expect(screen.getByText("Coalition LFI-NFP")).toBeInTheDocument();

        // Mode coalition désactivé : retour à la carte du groupe.
        await user.click(screen.getByRole("button", { name: "Mode coalition" }));
        expect(screen.queryByText(/^Coalition /)).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Voir les députés" })).toHaveAttribute("href", "/deputydex?groupe=LFI-NFP");
    });
});
