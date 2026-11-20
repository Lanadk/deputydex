import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";

describe("BadgeLib", () => {
    it("applies the variant class", () => {
        render(<BadgeLib text="Rapporteur" variant="primary" />);

        expect(screen.getByText("Rapporteur")).toHaveClass("badge-lib", "badge-lib--primary");
    });

    it("uses only the base class for a custom badge, its colors coming from style", () => {
        render(<BadgeLib text="Adopté" style={{ color: "white", backgroundColor: "rgb(22, 163, 74)" }} />);
        const badge = screen.getByText("Adopté");

        expect(badge).toHaveAttribute("class", "badge-lib");
        expect(badge).toHaveStyle({ backgroundColor: "rgb(22, 163, 74)" });
    });
});
