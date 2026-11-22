import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/groupes/groupes.gateway", () => ({
    groupesGateways: { getGroupesCards: jest.fn() },
}));

import GroupesPageClient from "@/app/(ui)/(views)/(db)/groupes/groupes-page-client";
import { LegislatureProvider } from "@/app/(ui)/providers/legislature-provider";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";

const getCurrent = legislaturesGateway.getCurrent as jest.Mock;
const getAll = legislaturesGateway.getAll as jest.Mock;
const getGroupesCards = groupesGateways.getGroupesCards as jest.Mock;

const L16 = { id: 16, number: 16, startDate: "2022-06-28", endDate: "2024-06-09" };

describe("GroupesPageClient — requêtes au chargement (#135)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getAll.mockResolvedValue([L16]);
        getGroupesCards.mockResolvedValue([]);
    });

    it("n'appelle la liste des groupes qu'une fois, avec la législature courante (pas 0 en attendant)", async () => {
        getCurrent.mockResolvedValue(L16);

        render(<LegislatureProvider><GroupesPageClient /></LegislatureProvider>);

        await waitFor(() => expect(getGroupesCards).toHaveBeenCalled());
        expect(getGroupesCards).toHaveBeenCalledTimes(1);
        expect(getGroupesCards).toHaveBeenCalledWith(16);
    });

    it("affiche une erreur avec « Réessayer » si la liste des groupes ne se charge pas (#122)", async () => {
        getCurrent.mockResolvedValue(L16);
        getGroupesCards.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce([]);

        render(<LegislatureProvider><GroupesPageClient /></LegislatureProvider>);

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger les groupes parlementaires");
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
        expect(getGroupesCards).toHaveBeenCalledTimes(2);
    });

    it("n'envoie aucune requête tant que la législature courante n'est pas connue", async () => {
        getCurrent.mockReturnValue(new Promise(() => {})); // jamais résolue

        render(<LegislatureProvider><GroupesPageClient /></LegislatureProvider>);

        await waitFor(() => expect(getCurrent).toHaveBeenCalled());
        expect(getGroupesCards).not.toHaveBeenCalled();
    });
});
