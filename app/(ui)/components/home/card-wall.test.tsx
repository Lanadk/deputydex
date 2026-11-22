import React from "react";
import { render } from "@testing-library/react";
import { buildCardWallColumns, CardWall } from "@/app/(ui)/components/home/card-wall";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";

describe("buildCardWallColumns", () => {
    it("fills 7 columns of 8 distinct cards from a 56-card sample", () => {
        const cards = Array.from({ length: 56 }, (_, i) => i);
        const columns = buildCardWallColumns(cards, 7, 8);

        expect(columns).toHaveLength(7);
        expect(columns.every((c) => c.length === 8)).toBe(true);
        expect(new Set(columns.flat()).size).toBe(56);
    });

    it("loops over a smaller list, shifting each column", () => {
        const columns = buildCardWallColumns([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3, 4);

        expect(columns).toEqual([[0, 1, 2, 3], [5, 6, 7, 8], [0, 1, 2, 3].map((i) => (i + 10) % 10)]);
    });

    it("returns no column without cards", () => {
        expect(buildCardWallColumns([], 7, 8)).toEqual([]);
    });
});

describe("CardWall", () => {
    it("is decorative and duplicates each column for a seamless loop", () => {
        const cards: DeputesCardDTO[] = Array.from({ length: 56 }, (_, i) => ({
            deputeUID: `PA${i}`,
            deputeFullName: `Député ${i}`,
            deputeGroupeCode: i % 2 ? "RN" : "LFI-NFP",
            deputeImage: `/img/${i}.png`,
        }));
        const { container } = render(<CardWall cards={cards} />);

        expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
        const columns = container.querySelectorAll(".card-wall__col");
        expect(columns).toHaveLength(7);
        expect(columns[0].querySelectorAll(".group-mini-card")).toHaveLength(16);
        expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
    });
});
