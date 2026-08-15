import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));

const mockUseLegislature = jest.fn();
jest.mock("@/app/(ui)/providers/legislature-provider", () => ({
    useLegislature: () => mockUseLegislature(),
}));

import { LegislatureSelector } from "@/app/(ui)/components/legislature-selector/legislature-selector";

function setLegislatureState(overrides: Record<string, unknown> = {}) {
    mockUseLegislature.mockReturnValue({
        legislature: { id: 2, number: 17, startDate: null, endDate: null },
        legislatures: [{ id: 2, number: 17, startDate: null, endDate: null }],
        setLegislature: jest.fn(),
        loading: false,
        unavailableLegislatureNumbers: new Set(),
        ...overrides,
    });
}

describe("LegislatureSelector", () => {
    afterEach(() => jest.resetAllMocks());

    it("renders the current legislature button on a page that uses it", () => {
        mockUsePathname.mockReturnValue("/groupes");
        setLegislatureState();

        render(<LegislatureSelector />);

        expect(screen.getByText("17ème")).toBeInTheDocument();
    });

    it("renders nothing on the statistics hub — no legislature-dependent content there", () => {
        mockUsePathname.mockReturnValue("/statistics");
        setLegislatureState();

        const { container } = render(<LegislatureSelector />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing on the advanced explorer — it manages its own legislature per context", () => {
        mockUsePathname.mockReturnValue("/statistics/avance");
        setLegislatureState();

        const { container } = render(<LegislatureSelector />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders the selector on chiffres-cles pages — they read the app-wide legislature directly, with no picker of their own", () => {
        mockUsePathname.mockReturnValue("/statistics/chiffres-cles");
        setLegislatureState();

        render(<LegislatureSelector />);

        expect(screen.getByText("17ème")).toBeInTheDocument();
    });

    it("renders the selector on a chiffres-cles theme page", () => {
        mockUsePathname.mockReturnValue("/statistics/chiffres-cles/femmes-assemblee");
        setLegislatureState();

        render(<LegislatureSelector />);

        expect(screen.getByText("17ème")).toBeInTheDocument();
    });

    it("renders nothing while the app-wide legislature is still loading (non-statistics page)", () => {
        mockUsePathname.mockReturnValue("/groupes");
        setLegislatureState({ loading: true });

        const { container } = render(<LegislatureSelector />);

        expect(container).toBeEmptyDOMElement();
    });
});
