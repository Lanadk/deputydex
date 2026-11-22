import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/legislatures/legislatures.gateway", () => ({
    legislaturesGateway: { getCurrent: jest.fn(), getAll: jest.fn() },
}));

import { LegislatureProvider, useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { NotificationProvider } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

const getCurrent = legislaturesGateway.getCurrent as jest.Mock;
const getAll = legislaturesGateway.getAll as jest.Mock;
const L17 = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };

function Current() {
    const { legislature, error } = useLegislature();
    return <p>{error ? "erreur" : legislature ? `législature ${legislature.number}` : "chargement"}</p>;
}

const renderProvider = () =>
    render(<NotificationProvider><LegislatureProvider><Current /></LegislatureProvider></NotificationProvider>);

describe("LegislatureProvider — échec du chargement (#122)", () => {
    beforeEach(() => jest.clearAllMocks());

    it("charge la législature courante", async () => {
        getCurrent.mockResolvedValue(L17);
        getAll.mockResolvedValue([L17]);

        renderProvider();

        expect(await screen.findByText("législature 17")).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("signale l'échec par une notification, et « Réessayer » recharge", async () => {
        getCurrent.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce(L17);
        getAll.mockResolvedValue([L17]);

        renderProvider();

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger les législatures");
        expect(screen.getByText("erreur")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(await screen.findByText("législature 17")).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
        expect(getCurrent).toHaveBeenCalledTimes(2);
    });
});
