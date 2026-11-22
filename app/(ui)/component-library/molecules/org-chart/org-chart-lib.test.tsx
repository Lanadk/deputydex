import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrgChartLib } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";

describe("OrgChartLib", () => {
    it("rend l'arbre en listes imbriquées, avec liens et mentions", () => {
        render(
            <OrgChartLib
                root={{
                    id: "r", title: "Direction",
                    children: [
                        { id: "a", title: "Pôle A", href: "/a", children: [{ id: "a1", title: "Bruno", note: "jusqu'au 01/03/2026" }] },
                    ],
                }}
            />
        );

        expect(screen.getByRole("group", { name: "Direction" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Pôle A" })).toHaveAttribute("href", "/a");
        expect(screen.getByText("jusqu'au 01/03/2026")).toBeInTheDocument();
        // Deux niveaux de listes : Pôle A, puis Bruno.
        expect(screen.getAllByRole("list")).toHaveLength(2);
    });

    it("affiche une longue liste de feuilles en grille", () => {
        const { container } = render(
            <OrgChartLib root={{ id: "r", title: "Bureau", children: ["A", "B", "C", "D"].map((t) => ({ id: t, title: t })) }} />
        );

        expect(container.querySelector(".org-chart-lib__children--grid")).not.toBeNull();
        expect(screen.getAllByRole("listitem")).toHaveLength(4);
    });
});
