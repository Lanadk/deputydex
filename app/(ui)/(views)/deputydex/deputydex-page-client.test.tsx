import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn() },
}));
jest.mock("@/app/(ui)/gateways/deputes/deputes.gateway", () => ({
    deputesGateway: { getDeputesCards: jest.fn() },
}));

import DeputydexPageClient from "@/app/(ui)/(views)/deputydex/deputydex-page-client";
import { LegislatureProvider } from "@/app/(ui)/providers/legislature-provider";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";

const getCurrent = legislaturesGateway.getCurrent as jest.Mock;
const getAll = legislaturesGateway.getAll as jest.Mock;
const getDeputesCards = deputesGateway.getDeputesCards as jest.Mock;

// Législature courante volontairement différente de l'ancien repli `?? 17`.
const L18 = { id: 18, number: 18, startDate: "2027-07-01", endDate: null };

describe("DeputydexPageClient — requêtes au chargement (#135)", () => {
    // Le virtualizer de la liste appelle window.scrollTo, absent de jsdom.
    beforeAll(() => { window.scrollTo = jest.fn() as unknown as typeof window.scrollTo; });

    beforeEach(() => {
        jest.clearAllMocks();
        getAll.mockResolvedValue([L18]);
        getDeputesCards.mockResolvedValue([]);
    });

    it("n'appelle la liste des députés qu'une fois, avec la législature courante (pas 17 en attendant)", async () => {
        getCurrent.mockResolvedValue(L18);

        render(<LegislatureProvider><DeputydexPageClient /></LegislatureProvider>);

        await waitFor(() => expect(getDeputesCards).toHaveBeenCalled());
        expect(getDeputesCards).toHaveBeenCalledTimes(1);
        expect(getDeputesCards).toHaveBeenCalledWith(18);
    });

    it("n'envoie aucune requête tant que la législature courante n'est pas connue", async () => {
        getCurrent.mockReturnValue(new Promise(() => {})); // jamais résolue

        render(<LegislatureProvider><DeputydexPageClient /></LegislatureProvider>);

        await waitFor(() => expect(getCurrent).toHaveBeenCalled());
        expect(getDeputesCards).not.toHaveBeenCalled();
    });
});
