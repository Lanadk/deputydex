import React from "react";
import { act, render } from "@testing-library/react";
import {
    buildCardWallColumns,
    CARD_WALL_CARDS_PER_COLUMN,
    CARD_WALL_COLUMNS,
    CARD_WALL_COLUMNS_MOBILE,
    CardWall,
    photosAffichees,
} from "@/app/(ui)/components/home/card-wall";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";

const CARTES: DeputesCardDTO[] = Array.from({ length: 56 }, (_, i) => ({
    deputeUID: `PA${i}`,
    deputeFullName: `Député ${i}`,
    deputeGroupeCode: i % 2 ? "RN" : "LFI-NFP",
    deputeImage: `/img/${i}.png`,
}));

describe("buildCardWallColumns", () => {
    it("fills the wall with distinct cards when the sample is large enough", () => {
        const columns = buildCardWallColumns(CARTES, CARD_WALL_COLUMNS, CARD_WALL_CARDS_PER_COLUMN);

        expect(columns).toHaveLength(CARD_WALL_COLUMNS);
        expect(columns.every((c) => c.length === CARD_WALL_CARDS_PER_COLUMN)).toBe(true);
        expect(new Set(columns.flat()).size).toBe(CARD_WALL_COLUMNS * CARD_WALL_CARDS_PER_COLUMN);
    });

    it("loops over a smaller list, shifting each column", () => {
        const columns = buildCardWallColumns([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3, 4);

        expect(columns).toEqual([[0, 1, 2, 3], [5, 6, 7, 8], [0, 1, 2, 3].map((i) => (i + 10) % 10)]);
    });

    it("returns no column without cards", () => {
        expect(buildCardWallColumns([], 7, 8)).toEqual([]);
    });
});

describe("photosAffichees", () => {
    it("only the photos of the displayed columns, without duplicates or empty ones", () => {
        const columns = [[CARTES[0], CARTES[1]], [CARTES[1], { ...CARTES[2], deputeImage: "" }], [CARTES[3]]];

        expect(photosAffichees(columns, 2)).toEqual(["/img/0.png", "/img/1.png"]);
    });
});

describe("CardWall", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    });
    afterEach(() => jest.useRealTimers());

    it("is decorative and duplicates each column for a seamless loop", () => {
        const { container } = render(<CardWall cards={CARTES} />);

        expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
        const columns = container.querySelectorAll(".card-wall__col");
        expect(columns).toHaveLength(CARD_WALL_COLUMNS);
        expect(columns[0].querySelectorAll(".group-mini-card")).toHaveLength(CARD_WALL_CARDS_PER_COLUMN * 2);
        expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
    });

    it("stays hidden until its photos are loaded (here: until the fallback delay)", () => {
        const { container } = render(<CardWall cards={CARTES} />);
        expect(container.firstChild).not.toHaveClass("card-wall--pret");

        // jsdom ne charge pas les images : seul le délai maximal fait apparaître le mur.
        act(() => jest.advanceTimersByTime(4000));
        expect(container.firstChild).toHaveClass("card-wall--pret");
    });

    it("on mobile, preloads only the photos of the displayed columns", () => {
        expect(CARD_WALL_COLUMNS_MOBILE).toBeLessThan(CARD_WALL_COLUMNS);
        const columns = buildCardWallColumns(CARTES, CARD_WALL_COLUMNS, CARD_WALL_CARDS_PER_COLUMN);

        expect(photosAffichees(columns, CARD_WALL_COLUMNS_MOBILE)).toHaveLength(CARD_WALL_COLUMNS_MOBILE * CARD_WALL_CARDS_PER_COLUMN);
    });
});
