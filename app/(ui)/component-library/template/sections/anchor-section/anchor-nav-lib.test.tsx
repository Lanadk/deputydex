import React, { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Gauge } from "lucide-react";
import { AnchorNavLib } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-nav-lib";
import { AnchorSectionProvider } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-provider";

type Callback = (entries: { isIntersecting: boolean; target: Element }[]) => void;
const observers: { callback: Callback; observed: Set<Element> }[] = [];

beforeEach(() => {
    observers.length = 0;
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
        observed = new Set<Element>();
        constructor(private callback: Callback) {
            observers.push(this as unknown as { callback: Callback; observed: Set<Element> });
        }
        observe(el: Element) { this.observed.add(el); }
        unobserve(el: Element) { this.observed.delete(el); }
        disconnect() { this.observed.clear(); }
    };
});

const SECTIONS = [
    { id: "s-un", label: "Section un", icon: Gauge },
    { id: "s-deux", label: "Section deux", icon: Gauge },
];

/** Sections rendues seulement après coup, comme les Chiffres clés (spinner tant que la législature charge). */
function Page() {
    const [ready, setReady] = useState(false);
    return (
        <AnchorSectionProvider initialId="s-un">
            <AnchorNavLib sections={SECTIONS} />
            <button onClick={() => setReady(true)}>charger</button>
            {ready && SECTIONS.map((s) => <div key={s.id} id={s.id} />)}
        </AnchorSectionProvider>
    );
}

describe("AnchorNavLib", () => {
    it("suit le défilement même quand les sections apparaissent après le montage de la nav", async () => {
        render(<Page />);
        const observer = observers[0];
        expect(observer.observed.size).toBe(0);

        await act(async () => {
            screen.getByText("charger").click();
        });
        // MutationObserver : rappel en micro-tâche
        await act(async () => {});

        expect(observer.observed.size).toBe(2);

        act(() => observer.callback([{ isIntersecting: true, target: document.getElementById("s-deux")! }]));

        expect(screen.getByText("Section deux").closest("a")).toHaveClass("sidebar-link--active");
        expect(screen.getByText("Section un").closest("a")).not.toHaveClass("sidebar-link--active");
    });
});
