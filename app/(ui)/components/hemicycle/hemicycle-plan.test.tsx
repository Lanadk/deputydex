import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HemicyclePlan } from "@/app/(ui)/components/hemicycle/hemicycle-plan";
import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { HemicyclePerchoir } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";

const GROUPES = [{ code: "LFI-NFP", count: 3 }, { code: "EPR", count: 4 }];
const PERCHOIR: HemicyclePerchoir = {
    presidence: { uid: "PA_YBP", nom: "Yaël Braun-Pivet", depuis: "2024-07-18", jusqua: null },
    carte: { deputeUID: "PA_YBP", deputeFullName: "Yaël Braun-Pivet", deputeGroupeCode: "EPR", deputeImage: "/ybp.png" },
    groupeCode: "EPR",
};

describe("HemicyclePlan — perchoir", () => {
    const seats = computeHemicycleSeats(GROUPES, { groupeCode: "EPR" });

    it("le perchoir est un lien nommé vers la fiche de la présidence ; les autres sièges restent décoratifs", () => {
        render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);

        const lien = screen.getByRole("link", { name: "Présidence de l'Assemblée nationale : Yaël Braun-Pivet" });
        expect(lien).toHaveAttribute("href", "/deputes/PA_YBP");
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });

    it("affiche la carte de la présidence au survol, la masque en sortie", () => {
        render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);
        const lien = screen.getByRole("link", { name: /Présidence de l'Assemblée nationale/ });

        expect(screen.queryByTestId("hemicycle-perchoir-card")).not.toBeInTheDocument();
        fireEvent.mouseEnter(lien, { clientX: 100, clientY: 80 });
        expect(screen.getByTestId("hemicycle-perchoir-card")).toHaveTextContent("Yaël Braun-Pivet");

        fireEvent.mouseLeave(lien);
        expect(screen.queryByTestId("hemicycle-perchoir-card")).not.toBeInTheDocument();
    });

    it("affiche aussi la carte au focus clavier", () => {
        render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);

        fireEvent.focus(screen.getByRole("link", { name: /Présidence de l'Assemblée nationale/ }));
        expect(screen.getByTestId("hemicycle-perchoir-card")).toBeInTheDocument();
    });

    it("sans présidence : aucun lien, aucune carte", () => {
        render(<HemicyclePlan seats={computeHemicycleSeats(GROUPES)} selectedCode={null} />);

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
