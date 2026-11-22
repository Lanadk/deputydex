import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/(ui)/gateways/scrutins/scrutins.gateway", () => ({
    scrutinsGateway: { getScrutin: jest.fn() },
}));
// Sections et en-tête remplacés : c'est le chargement de secours de l'en-tête qui est testé ici.
jest.mock("@/app/(ui)/(views)/(db)/scrutins/[uid]/config", () => ({ SCRUTIN_SECTIONS: [] }));
jest.mock("@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader", () => ({
    SectionBlockLoader: () => null,
}));
jest.mock("@/app/(ui)/components/scrutins/scrutin-header", () => ({
    ScrutinHeader: ({ scrutin }: { scrutin: { titre: string } }) => <h1>{scrutin.titre}</h1>,
}));
jest.mock("@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout", () => ({
    AnchorLayout: ({ header, children }: { header: React.ReactNode; children: React.ReactNode }) => <div>{header}{children}</div>,
}));

import ScrutinPageClient from "@/app/(ui)/(views)/(db)/scrutins/[uid]/scrutin-page-client";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";

const getScrutin = scrutinsGateway.getScrutin as jest.Mock;

describe("ScrutinPageClient — en-tête (#122)", () => {
    beforeEach(() => jest.clearAllMocks());

    it("affiche le scrutin lu par la page serveur, sans appel client", () => {
        render(<ScrutinPageClient uid="VT1" initialScrutin={{ titre: "Scrutin lu côté serveur" } as never} />);

        expect(screen.getByText("Scrutin lu côté serveur")).toBeInTheDocument();
        expect(getScrutin).not.toHaveBeenCalled();
    });

    it("repli client en échec : erreur avec « Réessayer », puis le scrutin", async () => {
        getScrutin.mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce({ titre: "Scrutin rechargé" });

        render(<ScrutinPageClient uid="VT1" initialScrutin={null} />);

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger ce scrutin");
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(await screen.findByText("Scrutin rechargé")).toBeInTheDocument();
        expect(getScrutin).toHaveBeenCalledTimes(2);
    });
});
