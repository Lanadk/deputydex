import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ArenaBadgeTooltipLib } from "@/app/(ui)/component-library/organisms/arena-badge-tooltip/arena-badge-tooltip-lib";

describe("ArenaBadgeTooltipLib", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const hover = (el: Element) => {
        fireEvent.mouseEnter(el);
        act(() => { jest.advanceTimersByTime(200); });
    };

    it("opens a bubble with the name, the rule and the date on hover", () => {
        render(<ArenaBadgeTooltipLib variant="eclair" label="Frondeur" description="Contre son groupe 50 fois." earnedOn="12 mars 2025" />);

        hover(screen.getByRole("img", { name: "Frondeur" }).closest(".arena-badge-tooltip-lib")!);

        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveTextContent("Frondeur");
        expect(tooltip).toHaveTextContent("Contre son groupe 50 fois.");
        expect(tooltip).toHaveTextContent("Obtenu le 12 mars 2025");
    });

    it("says a locked badge is not earned yet, whatever the date", () => {
        render(<ArenaBadgeTooltipLib variant="lune" label="Noctambule" earnedOn="1 janvier 2025" locked />);

        hover(screen.getByRole("img", { name: "Noctambule (non obtenu)" }).closest(".arena-badge-tooltip-lib")!);

        expect(screen.getByRole("tooltip")).toHaveTextContent("Pas encore obtenu");
        expect(screen.getByRole("tooltip")).not.toHaveTextContent("1 janvier 2025");
    });

    it("is reachable with the keyboard", () => {
        render(<ArenaBadgeTooltipLib variant="etoile" />);

        expect(screen.getByRole("img", { name: "Badge Étoile" }).closest(".arena-badge-tooltip-lib")).toHaveAttribute("tabindex", "0");
    });
});
