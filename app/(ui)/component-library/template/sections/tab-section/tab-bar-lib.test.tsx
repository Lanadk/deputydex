import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Gauge, Vote, BookOpen } from "lucide-react";
import { TabSectionProvider } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-provider";
import { TabBarLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-bar-lib";
import { TabPanelLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-panel-lib";

const SECTIONS = [
    { id: "presence", label: "Présence", icon: Gauge },
    { id: "votes", label: "Votes", icon: Vote },
    { id: "mandats", label: "Mandats", icon: BookOpen },
];

beforeEach(() => window.history.replaceState(null, "", "/deputes/PA1"));

/** Même assemblage que TabLayout (sans BaseLayout) : barre d'onglets, un panneau par section. */
function Page() {
    return (
        <TabSectionProvider ids={SECTIONS.map((s) => s.id)}>
            <TabBarLib sections={SECTIONS} label="Fiche du député" />
            {SECTIONS.map((s) => (
                <TabPanelLib key={s.id} id={s.id}>
                    <p>Contenu {s.label}</p>
                </TabPanelLib>
            ))}
        </TabSectionProvider>
    );
}

const visible = (texte: string) => expect(screen.getByText(texte)).toBeVisible();
const cache = (texte: string) => expect(screen.getByText(texte)).not.toBeVisible();

describe("TabBarLib / TabPanelLib", () => {
    it("un onglet par section ; seule la première est affichée", () => {
        render(<Page />);

        expect(screen.getByRole("tablist", { name: "Fiche du député" })).toBeInTheDocument();
        expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Présence", "Votes", "Mandats"]);
        expect(screen.getByRole("tab", { name: "Présence" })).toHaveAttribute("aria-selected", "true");
        visible("Contenu Présence");
        cache("Contenu Votes");
        expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "tab-presence");
    });

    it("un clic ouvre la section et garde l'onglet dans l'URL", async () => {
        const user = userEvent.setup();
        render(<Page />);

        await user.click(screen.getByRole("tab", { name: "Votes" }));

        visible("Contenu Votes");
        cache("Contenu Présence");
        expect(window.location.hash).toBe("#votes");
    });

    it("clavier : flèches (en boucle), Début et Fin ; un seul onglet dans l'ordre de tabulation", async () => {
        const user = userEvent.setup();
        render(<Page />);

        await user.tab();
        expect(screen.getByRole("tab", { name: "Présence" })).toHaveFocus();
        expect(screen.getByRole("tab", { name: "Votes" })).toHaveAttribute("tabindex", "-1");

        await user.keyboard("{ArrowRight}");
        expect(screen.getByRole("tab", { name: "Votes" })).toHaveFocus();
        visible("Contenu Votes");

        await user.keyboard("{End}{ArrowRight}");
        expect(screen.getByRole("tab", { name: "Présence" })).toHaveAttribute("aria-selected", "true");
        await user.keyboard("{ArrowLeft}");
        expect(screen.getByRole("tab", { name: "Mandats" })).toHaveFocus();
        await user.keyboard("{Home}");
        expect(screen.getByRole("tab", { name: "Présence" })).toHaveFocus();
    });

    it("sections d'un onglet : une nav latérale à partir de deux, aucune pour une seule", () => {
        (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
        render(
            <TabSectionProvider ids={["presence", "mandats"]}>
                <TabPanelLib id="presence" navLabel="Présence" sections={[
                    { id: "presence-synthese", label: "Synthèse", icon: Gauge },
                    { id: "presence-mois", label: "Mois par mois", icon: Gauge },
                ]}>
                    <p>Sous-thèmes</p>
                </TabPanelLib>
                <TabPanelLib id="mandats" navLabel="Mandats" sections={[{ id: "mandats-liste", label: "Historique", icon: BookOpen }]}>
                    <p>Une section</p>
                </TabPanelLib>
            </TabSectionProvider>
        );

        expect(screen.getByRole("navigation", { name: "Navigation — Présence" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Mois par mois" })).toHaveAttribute("href", "#presence-mois");
        expect(screen.queryByRole("navigation", { name: "Navigation — Mandats", hidden: true })).not.toBeInTheDocument();
    });

    it("lien direct : #section ouvre cet onglet ; un #inconnu laisse le premier", () => {
        window.history.replaceState(null, "", "/deputes/PA1#mandats");
        const { unmount } = render(<Page />);
        visible("Contenu Mandats");
        cache("Contenu Présence");
        unmount();

        window.history.replaceState(null, "", "/deputes/PA1#autre");
        render(<Page />);
        visible("Contenu Présence");
    });
});
