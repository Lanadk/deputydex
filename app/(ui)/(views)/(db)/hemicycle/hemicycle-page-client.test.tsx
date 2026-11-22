import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn(), getPresidenceAssemblee: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: { getDeputesCards: jest.fn() },
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
