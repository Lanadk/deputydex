import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { dateLongue, dureeLisible, LegislaturesCouvertes } from "@/app/(ui)/components/legislatures/legislatures-couvertes";

describe("LegislaturesCouvertes", () => {
    it("durée lisible", () => {
        expect(dureeLisible("2022-06-28", "2024-06-09")).toBe("1 an et 11 mois");
        expect(dureeLisible("2017-06-21", "2022-06-21")).toBe("5 ans");
        expect(dureeLisible("2024-07-18", "2024-11-22")).toBe("4 mois");
        expect(dureeLisible("2024-07-18", "2024-07-20")).toBe("0 mois");
    });

    it("date longue sans décalage de fuseau", () => {
        expect(dateLongue("2024-07-18T00:00:00.000Z")).toBe("18 juillet 2024");
    });

    it("une carte par législature, la plus récente d'abord ; fin anticipée = dissolution", () => {
        render(
            <LegislaturesCouvertes
                aujourdhui="2026-11-22"
                legislatures={[
                    { number: 15, startDate: "2017-06-21", endDate: "2022-06-21" },
                    { number: 16, startDate: "2022-06-28", endDate: "2024-06-09" },
                    { number: 17, startDate: "2024-07-18", endDate: null },
                ]}
            />
        );

        const cartes = screen.getAllByRole("listitem");
        expect(cartes.map((c) => c.textContent?.slice(0, 15))).toEqual(["17ᵉ législature", "16ᵉ législature", "15ᵉ législature"]);
        expect(cartes[0]).toHaveTextContent("En cours");
        expect(cartes[0]).toHaveTextContent("2 ans et 4 mois à ce jour");
        expect(cartes[1]).toHaveTextContent("interrompue par une dissolution");
        expect(cartes[2]).toHaveTextContent("Durée : 5 ans");
        expect(cartes[2]).not.toHaveTextContent("dissolution");
    });
});
