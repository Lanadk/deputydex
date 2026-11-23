import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BentoGridLib, BentoTileLib } from "@/app/(ui)/component-library/molecules/bento/bento-lib";

describe("BentoGridLib / BentoTileLib", () => {
    it("tuile : taille en classes, lien si href, simple bloc sinon", () => {
        render(
            <BentoGridLib columns={3}>
                <BentoTileLib colSpan={2} rowSpan={2} href="/scrutins">Lien</BentoTileLib>
                <BentoTileLib variant="accent">Bloc</BentoTileLib>
                <BentoTileLib variant="solid">Opaque</BentoTileLib>
            </BentoGridLib>
        );
        expect(screen.getByText("Opaque")).toHaveClass("bento-tile--solid");

        const lien = screen.getByRole("link", { name: "Lien" });
        expect(lien).toHaveAttribute("href", "/scrutins");
        expect(lien).toHaveClass("bento-tile--c2", "bento-tile--r2", "bento-tile--glass", "bento-tile--link");
        expect(screen.getByText("Bloc")).toHaveClass("bento-tile--accent", "bento-tile--c1");
    });

    it("tuile en chargement : vide, masquée aux lecteurs d'écran, même sans contenu", () => {
        const { container } = render(<BentoGridLib><BentoTileLib loading href="/x">Caché</BentoTileLib></BentoGridLib>);

        const tuile = container.querySelector(".bento-tile");
        expect(tuile).toHaveClass("is-loading");
        expect(tuile).toHaveAttribute("aria-hidden", "true");
        expect(screen.queryByText("Caché")).not.toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("fill : la grille remplit la hauteur de son conteneur", () => {
        const { container, rerender } = render(<BentoGridLib><BentoTileLib>A</BentoTileLib></BentoGridLib>);
        expect(container.firstChild).not.toHaveClass("bento-lib--fill");

        rerender(<BentoGridLib fill><BentoTileLib>A</BentoTileLib></BentoGridLib>);
        expect(container.firstChild).toHaveClass("bento-lib--fill");
    });

    it("grille : nombre de colonnes et hauteur de rangée en variables CSS", () => {
        const { container } = render(<BentoGridLib columns={2} rowMinHeight={150}><BentoTileLib>A</BentoTileLib></BentoGridLib>);

        const grille = container.querySelector(".bento-lib__grid") as HTMLElement;
        expect(grille.style.getPropertyValue("--bento-columns")).toBe("2");
        expect(grille.style.getPropertyValue("--bento-row")).toBe("150px");
    });
});
