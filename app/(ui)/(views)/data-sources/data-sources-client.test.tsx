import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/datasets/datasets.gateway", () => ({
    datasetsGateway: { getLastUpdate: jest.fn() },
}));

import DataSourcesClient from "@/app/(ui)/(views)/data-sources/data-sources-client";
import { datasetsGateway } from "@/app/(ui)/gateways/datasets/datasets.gateway";

const getLastUpdate = datasetsGateway.getLastUpdate as jest.Mock;

describe("DataSourcesClient — date de dernière mise à jour", () => {
    beforeEach(() => jest.clearAllMocks());

    it("la charge une seule fois (plus de seconde requête)", async () => {
        // Comme la vraie gateway : la date arrive en chaîne (JSON).
        getLastUpdate.mockResolvedValue("2026-11-21T05:30:00.000Z");

        render(<DataSourcesClient />);

        expect(await screen.findByText("21/11/2026")).toBeInTheDocument();
        await new Promise((r) => setTimeout(r, 50));
        expect(getLastUpdate).toHaveBeenCalledTimes(1);
    });

    it("affiche « Indisponible » avec « Réessayer » en cas d'échec (#122)", async () => {
        getLastUpdate.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce(new Date("2026-11-21T05:30:00Z"));

        render(<DataSourcesClient />);

        expect(await screen.findByRole("alert")).toHaveTextContent("Indisponible");
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(await screen.findByText("21/11/2026")).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    });
});
