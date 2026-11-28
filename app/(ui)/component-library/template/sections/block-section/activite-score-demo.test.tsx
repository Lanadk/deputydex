import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// react-activity-calendar est publié en ESM seul : seul le composant calendrier est remplacé,
// le renderer du bloc (type d'affichage, cadre) reste le vrai.
jest.mock("@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib", () => ({
    ActivityCalendarLib: () => <div data-testid="calendrier" />,
}));

import { ActiviteScoreDemo, calendrierSimule } from "@/app/(ui)/component-library/template/sections/block-section/activite-score-demo";

describe("Démo Activité et score", () => {
    it("calendrier simulé : une année, identique à chaque appel, rien le week-end ni en août", () => {
        const jours = calendrierSimule();
        expect(jours).toHaveLength(365);
        expect(calendrierSimule()).toEqual(jours);

        const actifsInterdits = jours.filter(({ date, count }) => {
            const d = new Date(`${date}T00:00:00Z`);
            return count > 0 && (d.getUTCDay() === 0 || d.getUTCDay() === 6 || d.getUTCMonth() === 7);
        });
        expect(actifsInterdits).toEqual([]);
        expect(jours.some((j) => j.count > 0)).toBe(true);
        expect(jours.every((j) => (j.count === 0) === (j.level === 0))).toBe(true);
    });

    it("affiche le score, son verdict et le détail par composante", () => {
        render(<ActiviteScoreDemo />);

        expect(screen.getByRole("heading", { name: "Activité et score" })).toBeInTheDocument();
        // Le calendrier est bien rendu par le vrai bloc (type d'affichage pris en charge).
        expect(screen.getByTestId("calendrier")).toBeInTheDocument();
        expect(screen.getByText("60")).toBeInTheDocument();
        expect(screen.getByText("Actif")).toBeInTheDocument();
        expect(screen.getByRole("list", { name: "Badges obtenus" })).toHaveTextContent("Assidu en séance");
        expect(screen.getByRole("heading", { name: "Détail du score" })).toBeInTheDocument();
        expect(screen.getByText("Présence")).toBeInTheDocument();
        expect(screen.getByText("+21,6 pts")).toBeInTheDocument();
    });
});
