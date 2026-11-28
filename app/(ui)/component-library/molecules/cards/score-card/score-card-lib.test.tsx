import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { couleurScore, palierScore, ScoreCardLib } from "@/app/(ui)/component-library/molecules/cards/score-card/score-card-lib";
import { ScoreBreakdownCardLib } from "@/app/(ui)/component-library/molecules/cards/score-breakdown-card/score-breakdown-card-lib";

describe("ScoreCardLib", () => {
    it("affiche le score, son échelle, le verdict, la légende et le badge", () => {
        render(<ScoreCardLib title="Score" score={59} verdict="Dans la moyenne" caption="Mieux que 64 % des députés" badge="Aperçu" />);

        expect(screen.getByRole("heading", { name: "Score" })).toBeInTheDocument();
        expect(screen.getByText("59")).toBeInTheDocument();
        expect(screen.getByText("sur 100")).toBeInTheDocument();
        expect(screen.getByText("Dans la moyenne")).toBeInTheDocument();
        expect(screen.getByText("Mieux que 64 % des députés")).toBeInTheDocument();
        expect(screen.getByText("Aperçu")).toBeInTheDocument();
    });

    it("badges : une liste sous le verdict, la description en info-bulle ; aucune section sans badge", () => {
        const { rerender } = render(
            <ScoreCardLib title="Score" score={60} badges={[{ label: "Amendeur", description: "Dépose beaucoup d'amendements." }, { label: "Assidu en séance" }]} />
        );

        const liste = screen.getByRole("list", { name: "Badges obtenus" });
        expect(Array.from(liste.querySelectorAll("li")).map((li) => li.textContent)).toEqual(["Amendeur", "Assidu en séance"]);
        expect(screen.getByText("Amendeur")).toHaveAttribute("title", "Dépose beaucoup d'amendements.");

        rerender(<ScoreCardLib title="Score" score={60} />);
        expect(screen.queryByRole("list", { name: "Badges obtenus" })).not.toBeInTheDocument();
    });

    it("garde la hauteur de son contenu (pas d'étirement sur la grille)", () => {
        const { container } = render(<ScoreCardLib title="Score" score={60} />);
        expect(container.querySelector(".score-card")).not.toHaveClass("h-full");
    });

    it("sans score : un tiret, jauge vide", () => {
        const { container } = render(<ScoreCardLib title="Score" score={null} />);
        expect(screen.getByText("—")).toBeInTheDocument();
        const arc = container.querySelector(".score-card__arc")!;
        expect(arc.getAttribute("stroke-dashoffset")).toBe(arc.getAttribute("stroke-dasharray"));
    });

    it("couleur par palier de rareté (bornes basses incluses)", () => {
        expect([0, 24, 25, 49, 50, 74, 75, 94, 95, 98, 99, 100].map((s) => palierScore(s)?.nom)).toEqual([
            "Commun", "Commun", "Inhabituel", "Inhabituel", "Rare", "Rare", "Épique", "Épique", "Légendaire", "Légendaire", "Mythique", "Parfait",
        ]);
        // Palette 1 du site, en variables CSS (thème clair / sombre).
        expect([10, 30, 60, 80, 96, 99, 100].map((s) => couleurScore(s))).toEqual([
            "var(--p1-steel-2)", "var(--p1-green-3)", "var(--p1-blue-3)", "var(--p1-blue-4)",
            "var(--p1-orange-3)", "var(--p1-red-3)", "var(--p1-red-4)",
        ]);
        // Autre échelle : ramenée sur 100.
        expect(palierScore(8, 10)?.nom).toBe("Épique");
        expect(couleurScore(null)).toBe("var(--surface-3)");
    });
});

describe("ScoreBreakdownCardLib", () => {
    it("une ligne par composante : poids, sous-score et points apportés", () => {
        render(
            <ScoreBreakdownCardLib
                title="Détail du score"
                items={[
                    { label: "Présence", poids: 30, score: 72 },
                    { label: "Interventions en séance", poids: 15, score: null },
                ]}
            />
        );

        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("poids 30 %")).toBeInTheDocument();
        expect(screen.getByText("72/100")).toBeInTheDocument();
        expect(screen.getByText("+21,6 pts")).toBeInTheDocument();
        expect(screen.getByText("non compté")).toBeInTheDocument();
    });
});
