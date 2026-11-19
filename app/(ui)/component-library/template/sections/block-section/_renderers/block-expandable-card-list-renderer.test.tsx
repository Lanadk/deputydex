import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BlockExpandableCardListRenderer } from "./block-expandable-card-list-renderer";
import { ExpandableCardListConfig } from "@/app/(ui)/component-library/template/sections/block-section/expandable-card-list-config.types";

type Row = { uid: string; titre: string; deposes: number; cosignes: number };

const ROWS: Row[] = [
    { uid: "D1", titre: "Projet de loi de finances pour 2026", deposes: 179, cosignes: 2111 },
    { uid: "D2", titre: "Sécurité sociale", deposes: 3, cosignes: 40 },
    { uid: "D3", titre: "Élections municipales", deposes: 0, cosignes: 12 },
];

function makeConfig(overrides: Partial<ExpandableCardListConfig<Row>> = {}): ExpandableCardListConfig<Row> {
    return {
        id: "dossiers",
        title: "Dossiers législatifs",
        pageSize: 2,
        searchPlaceholder: "Rechercher un dossier",
        emptyLabel: "Aucun dossier législatif sur cette législature.",
        countLabel: (n) => `${n} dossier(s)`,
        getSearchText: (r) => r.titre,
        getRowKey: (r) => r.uid,
        toCard: (r) => ({ title: r.titre, itemsLabel: "Amendements déposés" }),
        loadItems: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

function cardTitles() {
    return screen.queryAllByRole("article").map((card) => card.getAttribute("aria-label"));
}

function renderList(config = makeConfig(), rows: Row[] = ROWS) {
    render(<BlockExpandableCardListRenderer config={config} data={rows} loading={false} params={{ uid: "PA1", legislature: 17 }} />);
}

describe("BlockExpandableCardListRenderer", () => {
    it("shows one page of dossiers and pages through the rest", () => {
        renderList();

        expect(screen.getByText("Dossiers législatifs")).toBeInTheDocument();
        expect(screen.getByText("3 dossier(s)")).toBeInTheDocument();
        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026", "Sécurité sociale"]);

        fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

        expect(cardTitles()).toEqual(["Élections municipales"]);
    });

    it("goes back to the first page when the data changes (ex. another legislature)", () => {
        const config = makeConfig();
        const params = { uid: "PA1", legislature: 17 };
        const { rerender } = render(<BlockExpandableCardListRenderer config={config} data={ROWS} loading={false} params={params} />);
        fireEvent.click(screen.getByRole("button", { name: "Suivant" }));
        expect(screen.getByText(/Page 2 \/ 2/)).toBeInTheDocument();

        const otherLegislatureRows = [...ROWS, { uid: "D4", titre: "Budget rectificatif", deposes: 1, cosignes: 0 }];
        rerender(<BlockExpandableCardListRenderer config={config} data={otherLegislatureRows} loading={false} params={{ ...params, legislature: 16 }} />);

        expect(screen.getByText(/Page 1 \/ 2/)).toBeInTheDocument();
        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026", "Sécurité sociale"]);
    });

    it("never shows a page past the last one when fewer rows come in", () => {
        const config = makeConfig();
        const { rerender } = render(<BlockExpandableCardListRenderer config={config} data={ROWS} loading={false} params={{}} />);
        fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

        rerender(<BlockExpandableCardListRenderer config={config} data={ROWS.slice(0, 1)} loading={false} params={{}} />);

        expect(screen.getByText(/Page 1 \/ 1/)).toBeInTheDocument();
        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026"]);
    });

    it("searches titles ignoring case and accents, back on the first page", () => {
        renderList();
        fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

        fireEvent.change(screen.getByPlaceholderText("Rechercher un dossier"), { target: { value: "securite" } });

        expect(cardTitles()).toEqual(["Sécurité sociale"]);
        expect(screen.getByText("1 dossier(s)")).toBeInTheDocument();
        expect(screen.getByText(/Page 1 \/ 1/)).toBeInTheDocument();
    });

    it("applies the first sort by default and reorders when another sort is picked", () => {
        renderList(makeConfig({
            pageSize: 10,
            sortOptions: [
                { value: "cosignes", label: "Plus co-signés", compare: (a, b) => b.cosignes - a.cosignes },
                { value: "titre", label: "Titre (A → Z)", compare: (a, b) => a.titre.localeCompare(b.titre, "fr") },
            ],
        }), [...ROWS].reverse());

        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026", "Sécurité sociale", "Élections municipales"]);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "titre" } });

        expect(cardTitles()).toEqual(["Élections municipales", "Projet de loi de finances pour 2026", "Sécurité sociale"]);
    });

    it("hides the rows a checked toggle filters out, and shows them again when unchecked", () => {
        renderList(makeConfig({
            pageSize: 10,
            toggles: [{ id: "actif", label: "Masquer les co-signatures seules", keep: (r) => r.deposes > 0 }],
        }));
        const toggle = screen.getByRole("checkbox", { name: "Masquer les co-signatures seules" });

        fireEvent.click(toggle);
        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026", "Sécurité sociale"]);

        fireEvent.click(toggle);
        expect(cardTitles()).toHaveLength(3);
    });

    it("loads a card's detail for that row with the page params", async () => {
        const loadItems = jest.fn().mockResolvedValue([{ id: "AM1", label: "n° 1" }]);
        renderList(makeConfig({ loadItems }));

        const card = screen.getByRole("article", { name: "Sécurité sociale" });
        fireEvent.click(within(card).getByRole("button", { name: "Amendements déposés" }));

        expect(await within(card).findByText("n° 1")).toBeInTheDocument();
        expect(loadItems).toHaveBeenCalledWith(ROWS[1], { uid: "PA1", legislature: 17 });
    });

    it("says so when there is no dossier at all", () => {
        renderList(makeConfig(), []);
        expect(screen.getByText("Aucun dossier législatif sur cette législature.")).toBeInTheDocument();
    });

    it("shows a loading state rather than the empty message while the section loads", () => {
        render(<BlockExpandableCardListRenderer config={makeConfig()} data={[]} loading={true} params={{}} />);

        expect(screen.getByText("Chargement…")).toBeInTheDocument();
        expect(screen.queryByText("Aucun dossier législatif sur cette législature.")).not.toBeInTheDocument();
    });

    it("speaks generically when the config gives no wording of its own", () => {
        renderList(makeConfig({ countLabel: undefined }));
        expect(screen.getByText("3 résultat(s)")).toBeInTheDocument();
    });

    it("applies a toggle checked by default from the first render", () => {
        renderList(makeConfig({
            pageSize: 10,
            toggles: [{ id: "actif", label: "Masquer les co-signatures seules", keep: (r) => r.deposes > 0, defaultChecked: true }],
        }));

        expect(screen.getByRole("checkbox", { name: "Masquer les co-signatures seules" })).toHaveAttribute("aria-checked", "true");
        expect(cardTitles()).toEqual(["Projet de loi de finances pour 2026", "Sécurité sociale"]);
    });
});
