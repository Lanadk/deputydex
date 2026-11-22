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
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: { getGroupeInfos: jest.fn(), getGroupeLegislatures: jest.fn() },
}));
// Sections, mise en page et en-tête remplacés : c'est la gestion des erreurs de la fiche qui est testée ici.
jest.mock("@/app/(ui)/(views)/(db)/groupes/[code]/config", () => ({ GROUPES_SECTIONS: [] }));
jest.mock("@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader", () => ({
    SectionBlockLoader: () => null,
}));
jest.mock("@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout", () => ({
    AnchorLayout: ({ header, children }: { header: React.ReactNode; children: React.ReactNode }) => <div>{header}{children}</div>,
}));
jest.mock("@/app/(ui)/components/groups/fiche/groupe-header", () => ({
    GroupeHeader: ({ groupeInfos }: { groupeInfos: { label: string } }) => <h1>{groupeInfos.label}</h1>,
}));

import GroupePageClient from "@/app/(ui)/(views)/(db)/groupes/[code]/groupe-page-client";
import { NotificationProvider } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";

const getGroupeInfos = groupesGateways.getGroupeInfos as jest.Mock;
const getGroupeLegislatures = groupesGateways.getGroupeLegislatures as jest.Mock;

const renderPage = () => render(<NotificationProvider><GroupePageClient code="RN" /></NotificationProvider>);

describe("GroupePageClient — erreurs de chargement (#122)", () => {
    beforeEach(() => jest.clearAllMocks());

    it("en-tête en échec : erreur avec « Réessayer », puis l'en-tête", async () => {
        getGroupeLegislatures.mockResolvedValue([16, 17]);
        getGroupeInfos.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce({ label: "Rassemblement National" });

        renderPage();

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger les informations du groupe");
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(await screen.findByRole("heading", { name: "Rassemblement National" })).toBeInTheDocument();
        expect(getGroupeInfos).toHaveBeenCalledWith("RN", 17);
    });

    it("grise les législatures où le groupe n'existe pas", async () => {
        getGroupeInfos.mockResolvedValue({ label: "Rassemblement National" });
        getGroupeLegislatures.mockResolvedValue([17]);

        renderPage();

        await waitFor(() => expect(mockSetUnavailable).toHaveBeenCalledWith(new Set([16])));
    });

    it("vérification des législatures en échec : avertissement non bloquant", async () => {
        getGroupeInfos.mockResolvedValue({ label: "Rassemblement National" });
        getGroupeLegislatures.mockRejectedValue(new Error("500"));

        renderPage();

        expect(await screen.findByRole("status")).toHaveTextContent("Les législatures où ce groupe a existé n'ont pas pu être vérifiées.");
        expect(await screen.findByRole("heading", { name: "Rassemblement National" })).toBeInTheDocument();
    });
});
