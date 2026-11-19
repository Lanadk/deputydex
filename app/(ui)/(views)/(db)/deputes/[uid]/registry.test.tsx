import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { table } from "@/app/(ui)/(views)/(db)/deputes/[uid]/registry";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";

const VOTE: DeputeRecentVoteDTO = {
    scrutinUid: "VTANR5L17V3878",
    titre: "l'amendement n° 119 de M. de Courson à l'article premier",
    date: "2025-11-18T00:00:00.000Z",
    position: "contre",
    groupePosition: "contre",
    isRebel: false,
    lienAN: "https://www.assemblee-nationale.fr/dyn/17/scrutins/3878",
};

const AN_LINK = /site de l'Assemblée nationale/;

function renderScrutinCell(vote: DeputeRecentVoteDTO) {
    const config = table("depute-recent-votes-table") as unknown as TableConfig<DeputeRecentVoteDTO>;
    const column = config.columns.find((c) => c.id === "titre");
    if (!column?.cell) throw new Error("colonne Scrutin absente");
    render(<>{column.cell(vote)}</>);
}

describe("Fiche député — Derniers votes", () => {
    it("links the scrutin to its DeputeDex page, and to the AN site as a secondary link", () => {
        renderScrutinCell(VOTE);

        expect(screen.getByRole("link", { name: VOTE.titre! })).toHaveAttribute("href", "/scrutins/VTANR5L17V3878");
        expect(screen.getByRole("link", { name: AN_LINK })).toHaveAttribute("href", VOTE.lienAN);
    });

    it("keeps the DeputeDex link but drops the AN link when it is unknown", () => {
        renderScrutinCell({ ...VOTE, lienAN: null });

        expect(screen.getByRole("link", { name: VOTE.titre! })).toHaveAttribute("href", "/scrutins/VTANR5L17V3878");
        expect(screen.queryByRole("link", { name: AN_LINK })).not.toBeInTheDocument();
    });

    it("still links to the DeputeDex page when the title is missing", () => {
        renderScrutinCell({ ...VOTE, titre: null });

        expect(screen.getByRole("link", { name: "Scrutin VTANR5L17V3878" })).toHaveAttribute("href", "/scrutins/VTANR5L17V3878");
    });
});
