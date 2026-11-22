import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { dureeLisible, LegislaturesCouvertes } from "@/app/(ui)/components/legislatures/legislatures-couvertes";

describe("LegislaturesCouvertes", () => {
    it("durée lisible", () => {
        expect(dureeLisible("2022-06-28", "2024-06-09")).toBe("1 an et 11 mois");
        expect(dureeLisible("2017-06-21", "2022-06-21")).toBe("5 ans");
        expect(dureeLisible("2024-07-18", "2024-11-22")).toBe("4 mois");
        expect(dureeLisible("2024-07-18", "2024-07-20")).toBe("0 mois");
    });

    it("une carte par législature, dans l'ordre reçu ; la dissolution vient des données", () => {
        render(
            <LegislaturesCouvertes
                aujourdhui="2026-11-22"
                legislatures={[
                    { numero: 17, debut: "2024-07-18", fin: null, finParDissolution: false },
                    { numero: 16, debut: "2022-06-28", fin: "2024-06-09", finParDissolution: true },
                    // Courte mais sans dissolution dans les données : pas de mention (plus de déduction par la durée).
                    { numero: 15, debut: "2017-06-21", fin: "2019-06-21", finParDissolution: false },
                ]}
            />
        );

        const cartes = screen.getAllByRole("listitem");
        expect(cartes.map((c) => c.textContent?.slice(0, 15))).toEqual(["17ᵉ législature", "16ᵉ législature", "15ᵉ législature"]);
        expect(cartes[0]).toHaveTextContent("En cours");
        expect(cartes[0]).toHaveTextContent("Depuis le 18 juillet 2024");
        expect(cartes[0]).toHaveTextContent("2 ans et 4 mois à ce jour");
        expect(cartes[1]).toHaveTextContent("Du 28 juin 2022 au 9 juin 2024");
        expect(cartes[1]).toHaveTextContent("Durée : 1 an et 11 mois · interrompue par une dissolution");
        expect(cartes[2]).not.toHaveTextContent("dissolution");
    });
});
