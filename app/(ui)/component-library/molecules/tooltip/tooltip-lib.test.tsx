import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ancrageTooltip, TooltipLib } from "@/app/(ui)/component-library/molecules/tooltip/tooltip-lib";

const renderTip = (props: Partial<React.ComponentProps<typeof TooltipLib>> = {}) => {
    render(
        <div>
            <TooltipLib content="Scrutins" placement="right" delay={0} {...props}>
                <a href="#scrutins" aria-label="Scrutins">icône</a>
            </TooltipLib>
            <button type="button">Ailleurs</button>
        </div>
    );
    return screen.getByRole("link", { name: "Scrutins" });
};

describe("ancrageTooltip", () => {
    const rect = { top: 100, bottom: 140, left: 10, right: 60 };

    it("ancre la bulle au bord du déclencheur, du côté demandé, à 8px", () => {
        expect(ancrageTooltip(rect, "right")).toEqual({ left: 68, top: 120 });
        expect(ancrageTooltip(rect, "left")).toEqual({ left: 2, top: 120 });
        expect(ancrageTooltip(rect, "top")).toEqual({ left: 35, top: 92 });
        expect(ancrageTooltip(rect, "bottom")).toEqual({ left: 35, top: 148 });
    });
});

describe("TooltipLib", () => {
    it("fermée au départ", () => {
        renderTip();

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("au survol : bulle affichée, reliée au déclencheur (aria-describedby) ; fermée quand la souris part", () => {
        const lien = renderTip();

        fireEvent.mouseEnter(lien);
        const bulle = screen.getByRole("tooltip");
        expect(bulle).toHaveTextContent("Scrutins");
        expect(bulle).toHaveClass("tooltip-lib--right");
        expect(lien).toHaveAttribute("aria-describedby", bulle.id);

        fireEvent.mouseLeave(lien);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        expect(lien).not.toHaveAttribute("aria-describedby");
    });

    it("au survol, attend le délai avant d'ouvrir", () => {
        jest.useFakeTimers();
        const lien = renderTip({ delay: 200 });

        fireEvent.mouseEnter(lien);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        act(() => { jest.advanceTimersByTime(200); });
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        jest.useRealTimers();
    });

    it("au clavier : ouverte au focus (Tab), fermée au départ du focus", async () => {
        const user = userEvent.setup();
        renderTip();

        await user.tab();
        expect(screen.getByRole("tooltip")).toHaveTextContent("Scrutins");

        await user.tab();
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("Échap ferme la bulle", () => {
        const lien = renderTip();

        fireEvent.mouseEnter(lien);
        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("se ferme au clic sur le déclencheur", () => {
        const lien = renderTip();

        fireEvent.mouseEnter(lien);
        fireEvent.pointerDown(lien);

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("garde les écouteurs de l'enfant", () => {
        const onMouseEnter = jest.fn();
        render(
            <TooltipLib content="Aide" delay={0}>
                <button type="button" onMouseEnter={onMouseEnter}>?</button>
            </TooltipLib>
        );

        fireEvent.mouseEnter(screen.getByRole("button"));

        expect(onMouseEnter).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("disabled ou contenu vide : jamais de bulle", () => {
        const lien = renderTip({ disabled: true });
        fireEvent.mouseEnter(lien);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("désactivée pendant qu'elle est ouverte : ne réapparaît pas seule à la réactivation", () => {
        const { rerender } = render(
            <TooltipLib content="Scrutins" delay={0}><a href="#">x</a></TooltipLib>
        );
        fireEvent.mouseEnter(screen.getByRole("link"));
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        rerender(<TooltipLib content="Scrutins" delay={0} disabled><a href="#">x</a></TooltipLib>);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        rerender(<TooltipLib content="Scrutins" delay={0}><a href="#">x</a></TooltipLib>);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
});
