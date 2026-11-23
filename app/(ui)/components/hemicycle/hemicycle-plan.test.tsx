import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
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

    describe("libellé au survol", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("affiche le nom et le titre de la présidence au survol, les masque peu après la sortie", () => {
            render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);
            const lien = screen.getByRole("link", { name: /Présidence de l'Assemblée nationale/ });

            expect(screen.queryByTestId("hemicycle-perchoir-label")).not.toBeInTheDocument();
            fireEvent.mouseEnter(lien);
            const libelle = screen.getByTestId("hemicycle-perchoir-label");
            expect(libelle).toHaveTextContent("Yaël Braun-Pivet");
            expect(libelle).toHaveTextContent("Présidence de l'Assemblée nationale");

            fireEvent.mouseLeave(lien);
            expect(screen.getByTestId("hemicycle-perchoir-label")).toBeInTheDocument();
            act(() => jest.advanceTimersByTime(200));
            expect(screen.queryByTestId("hemicycle-perchoir-label")).not.toBeInTheDocument();
        });

        it("une sortie suivie d'un retour immédiat ne masque pas le libellé", () => {
            render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);
            const lien = screen.getByRole("link", { name: /Présidence de l'Assemblée nationale/ });

            fireEvent.mouseEnter(lien);
            fireEvent.mouseLeave(lien);
            act(() => jest.advanceTimersByTime(50));
            fireEvent.mouseEnter(lien);
            act(() => jest.advanceTimersByTime(500));
            expect(screen.getByTestId("hemicycle-perchoir-label")).toBeInTheDocument();
        });
    });

    it("affiche aussi le libellé au focus clavier, le masque au blur", () => {
        render(<HemicyclePlan seats={seats} selectedCode={null} perchoir={PERCHOIR} />);
        const lien = screen.getByRole("link", { name: /Présidence de l'Assemblée nationale/ });

        fireEvent.focus(lien);
        expect(screen.getByTestId("hemicycle-perchoir-label")).toBeInTheDocument();
        fireEvent.blur(lien);
        expect(screen.queryByTestId("hemicycle-perchoir-label")).not.toBeInTheDocument();
    });

    it("sans présidence : aucun lien, aucune carte", () => {
        render(<HemicyclePlan seats={computeHemicycleSeats(GROUPES)} selectedCode={null} />);

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
