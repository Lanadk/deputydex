import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// Rendu des blocs remplacé (ses graphiques importent des modules ESM) : c'est le chargeur qui est testé ici.
jest.mock("@/app/(ui)/component-library/template/sections/block-section/block-section-renderer", () => ({
    BlockSectionRenderer: () => <p>Contenu de la section</p>,
}));

import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

const sectionWith = (gatewayFn: PageSection["gatewayFn"]): PageSection => ({
    id: "membres",
    label: "Membres",
    icon: () => null,
    cols: 1,
    gatewayFn,
    blocks: [{ type: "paragraph", items: [{ type: "text", content: "Contenu de la section" }] }],
} as unknown as PageSection);

describe("SectionBlockLoader — échec du chargement", () => {
    it("affiche l'erreur à la place des blocs et signale la section prête", async () => {
        const onReady = jest.fn();
        const gatewayFn = jest.fn().mockRejectedValue(new Error("500"));

        render(<SectionBlockLoader section={sectionWith(gatewayFn)} params={{}} onReady={onReady} />);

        expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger « Membres » pour le moment.");
        expect(screen.queryByText("Contenu de la section")).not.toBeInTheDocument();
        expect(onReady).toHaveBeenCalledTimes(1);
    });

    it("« Réessayer » relance le chargement et affiche les blocs s'il réussit", async () => {
        const gatewayFn = jest.fn().mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce({});

        render(<SectionBlockLoader section={sectionWith(gatewayFn)} params={{}} onReady={jest.fn()} />);

        fireEvent.click(await screen.findByRole("button", { name: "Réessayer" }));

        expect(await screen.findByText("Contenu de la section")).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
        expect(gatewayFn).toHaveBeenCalledTimes(2);
    });
});
