import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DossierCardLib, DossierCardItem } from "./dossier-card-lib";

const ITEMS: DossierCardItem[] = [
    {
        id: "AM5",
        label: "n° 5 (Rect)",
        context: "Article PREMIER",
        status: "Adopté",
        tone: "success",
        date: "22/06/2026",
        summary: "Par cet amendement d'appel.",
        href: "https://www.assemblee-nationale.fr/dyn/17/amendements/AM5",
    },
];

function renderCard(loadItems = jest.fn().mockResolvedValue(ITEMS)) {
    render(
        <DossierCardLib
            title="Projet de loi de finances pour 2026"
            href="https://www.assemblee-nationale.fr/dyn/17/dossiers/PLF_2026"
            subtitle="Projet de loi de finances de l'année"
            badges={["Rapporteur pour avis"]}
            stats={[
                { label: "déposés", value: 179 },
                { label: "adoptés", value: 22 },
            ]}
            itemsLabel="Amendements déposés"
            loadItems={loadItems}
        />
    );
    return loadItems;
}

describe("DossierCardLib", () => {
    it("shows the dossier summary while collapsed, without loading its items", () => {
        const loadItems = renderCard();

        expect(screen.getByRole("link", { name: "Projet de loi de finances pour 2026" }))
            .toHaveAttribute("href", "https://www.assemblee-nationale.fr/dyn/17/dossiers/PLF_2026");
        expect(screen.getByText("Projet de loi de finances de l'année")).toBeInTheDocument();
        expect(screen.getByText("Rapporteur pour avis")).toBeInTheDocument();
        expect(screen.getByText("179")).toBeInTheDocument();
        expect(screen.getByText("adoptés")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /amendements déposés/i })).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("n° 5 (Rect)")).not.toBeInTheDocument();
        expect(loadItems).not.toHaveBeenCalled();
    });

    it("loads and lists the items when expanded", async () => {
        renderCard();

        fireEvent.click(screen.getByRole("button", { name: /amendements déposés/i }));

        const item = await screen.findByRole("link", { name: /n° 5 \(Rect\)/ });
        expect(item).toHaveAttribute("href", "https://www.assemblee-nationale.fr/dyn/17/amendements/AM5");
        expect(screen.getByText("Article PREMIER")).toBeInTheDocument();
        expect(screen.getByText("Adopté")).toBeInTheDocument();
        expect(screen.getByText("Par cet amendement d'appel.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /amendements déposés/i })).toHaveAttribute("aria-expanded", "true");
    });

    it("hides the items when collapsed again and does not refetch on re-expand", async () => {
        const loadItems = renderCard();
        const toggle = screen.getByRole("button", { name: /amendements déposés/i });

        fireEvent.click(toggle);
        await screen.findByText("n° 5 (Rect)");
        fireEvent.click(toggle);
        expect(screen.queryByText("n° 5 (Rect)")).not.toBeInTheDocument();

        fireEvent.click(toggle);
        expect(screen.getByText("n° 5 (Rect)")).toBeInTheDocument();
        expect(loadItems).toHaveBeenCalledTimes(1);
    });

    it("shows a loading state until the items arrive, without fetching twice", async () => {
        let resolve: (items: DossierCardItem[]) => void = () => {};
        const loadItems = renderCard(jest.fn(() => new Promise<DossierCardItem[]>((r) => { resolve = r; })));
        const toggle = screen.getByRole("button", { name: /amendements déposés/i });

        fireEvent.click(toggle);
        expect(screen.getByText("Chargement…")).toBeInTheDocument();
        fireEvent.click(toggle);
        fireEvent.click(toggle);

        resolve(ITEMS);
        await screen.findByText("n° 5 (Rect)");
        expect(screen.queryByText("Chargement…")).not.toBeInTheDocument();
        expect(loadItems).toHaveBeenCalledTimes(1);
    });

    it("shows an error with a retry that loads the items again", async () => {
        const loadItems = jest.fn()
            .mockRejectedValueOnce(new Error("network"))
            .mockResolvedValueOnce(ITEMS);
        renderCard(loadItems);

        fireEvent.click(screen.getByRole("button", { name: /amendements déposés/i }));
        fireEvent.click(await screen.findByRole("button", { name: "Réessayer" }));

        expect(await screen.findByText("n° 5 (Rect)")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
    });

    it("groups the items under one heading per group, in order", async () => {
        renderCard(jest.fn().mockResolvedValue([
            { id: "A1", label: "n° 1", group: "Projet de loi n° 1906 · 1ère lecture AN" },
            { id: "A2", label: "n° 2", group: "Projet de loi n° 1906 · 1ère lecture AN" },
            { id: "B1", label: "n° 9", group: "Projet de loi n° 2247 · Nouvelle lecture AN" },
        ]));

        fireEvent.click(screen.getByRole("button", { name: /amendements déposés/i }));

        const first = await screen.findByRole("group", { name: "Projet de loi n° 1906 · 1ère lecture AN (2)" });
        expect(within(first).getAllByRole("listitem")).toHaveLength(2);
        const second = screen.getByRole("group", { name: "Projet de loi n° 2247 · Nouvelle lecture AN (1)" });
        expect(within(second).getByText("n° 9")).toBeInTheDocument();
    });

    it("tells the reader when there is nothing to list", async () => {
        renderCard(jest.fn().mockResolvedValue([]));

        fireEvent.click(screen.getByRole("button", { name: /amendements déposés/i }));

        expect(await screen.findByText("Aucun élément à afficher.")).toBeInTheDocument();
    });
});
