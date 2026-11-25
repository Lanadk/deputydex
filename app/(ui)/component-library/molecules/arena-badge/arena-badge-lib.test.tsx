import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ArenaBadgeLib } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib";
import { ARENA_BADGE_STYLES, ARENA_BADGE_VARIANTS } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.variants";

describe("ArenaBadgeLib", () => {
    it("names the badge after its variant by default", () => {
        render(<ArenaBadgeLib variant="eclair" />);

        expect(screen.getByRole("img", { name: "Badge Éclair" })).toBeInTheDocument();
    });

    it("uses the given label and flags a badge not yet earned", () => {
        const { container } = render(<ArenaBadgeLib variant="lune" label="Noctambule" locked />);

        expect(screen.getByRole("img", { name: "Noctambule (non obtenu)" })).toBeInTheDocument();
        expect(container.firstChild).toHaveClass("arena-badge-lib", "arena-badge-lib--locked");
    });

    it("hides the visible label on demand", () => {
        render(<ArenaBadgeLib variant="etoile" label="Voix décisive" hideLabel />);

        expect(screen.queryByText("Voix décisive")).not.toBeInTheDocument();
    });

    it("gives each badge its own gradient id", () => {
        const { container } = render(<><ArenaBadgeLib variant="etoile" /><ArenaBadgeLib variant="etoile" /></>);
        const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id);

        expect(new Set(ids).size).toBe(2);
    });

    it("defines at least 8 variants, each with a closed shape and palette colors", () => {
        expect(ARENA_BADGE_VARIANTS.length).toBeGreaterThanOrEqual(8);
        for (const variant of ARENA_BADGE_VARIANTS) {
            const style = ARENA_BADGE_STYLES[variant];
            expect(style.shape).toMatch(/Z$/);
            for (const color of [...style.face, style.rim]) {
                expect(color).toMatch(/^var\(--p[12]-/);
            }
        }
    });
});
