import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockSetUnavailable = jest.fn();
jest.mock("@/app/(ui)/providers/legislature-provider", () => ({
    useLegislature: () => ({
        legislature: { number: 17 },
        legislatures: [{ number: 16 }, { number: 17 }],
        setUnavailableLegislatureNumbers: mockSetUnavailable,
    }),
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: { getDeputeIdentity: jest.fn(), getDeputeLegislatures: jest.fn() },
}));
// Sections, mise en page et en-tête remplacés : c'est la gestion des erreurs de la fiche qui est testée ici.
jest.mock("@/app/(ui)/(views)/(db)/deputes/[uid]/config", () => ({ DEPUTE_ONGLETS: [], DEPUTE_SECTIONS: [] }));
jest.mock("@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader", () => ({
    SectionBlockLoader: () => null,
}));
jest.mock("@/app/(ui)/component-library/template/sections/tab-section/tab-layout", () => ({
    TabLayout: ({ header, children }: { header: React.ReactNode; children: React.ReactNode }) => <div>{header}{children}</div>,
}));
jest.mock("@/app/(ui)/components/deputy/fiche/depute-header", () => ({
    DeputeHeader: ({ identity }: { identity: { nom: string } }) => <h1>{identity.nom}</h1>,
}));

import DeputePageClient from "@/app/(ui)/(views)/(db)/deputes/[uid]/depute-page-client";
import { NotificationProvider } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";

const getDeputeIdentity = deputesGateway.getDeputeIdentity as jest.Mock;
const getDeputeLegislatures = deputesGateway.getDeputeLegislatures as jest.Mock;

const renderPage = () => render(<NotificationProvider><DeputePageClient uid="PA1" /></NotificationProvider>);

describe("DeputePageClient — erreurs de chargement (#122)", () => {
    beforeEach(() => jest.clearAllMocks());

    it("en-tête en échec : erreur avec « Réessayer », puis l'en-tête", async () => {
        getDeputeLegislatures.mockResolvedValue([16, 17]);
        getDeputeIdentity.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce({ nom: "Marie Dupont" });

        renderPage();

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger les informations du député");
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(await screen.findByRole("heading", { name: "Marie Dupont" })).toBeInTheDocument();
        expect(getDeputeIdentity).toHaveBeenCalledWith("PA1", 17);
    });

    it("grise les législatures où le député n'a pas siégé", async () => {
        getDeputeIdentity.mockResolvedValue({ nom: "Marie Dupont" });
        getDeputeLegislatures.mockResolvedValue([17]);

        renderPage();

        await waitFor(() => expect(mockSetUnavailable).toHaveBeenCalledWith(new Set([16])));
    });

    it("vérification des législatures en échec : avertissement non bloquant", async () => {
        getDeputeIdentity.mockResolvedValue({ nom: "Marie Dupont" });
        getDeputeLegislatures.mockRejectedValue(new Error("500"));

        renderPage();

        expect(await screen.findByRole("status")).toHaveTextContent("Les législatures où ce député a siégé n'ont pas pu être vérifiées.");
        expect(await screen.findByRole("heading", { name: "Marie Dupont" })).toBeInTheDocument();
    });
});
