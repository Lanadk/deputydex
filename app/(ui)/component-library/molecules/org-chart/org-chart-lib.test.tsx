import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrgChartLib } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";

describe("OrgChartLib", () => {
    it("toolbar sur la ligne des contrôles, attributs posés sur le conteneur de l'arbre", () => {
        const { container } = render(
            <OrgChartLib
                root={{ id: "r", title: "Direction", children: [{ id: "a", title: "Pôle A" }] }}
                showExpandControls
                toolbar={<span>Onglets</span>}
                treeProps={{ id: "arbre", role: "tabpanel" }}
            />
        );

        const controls = container.querySelector(".org-chart-lib__controls")!;
        expect(controls).toHaveTextContent("Onglets");
        expect(controls).toContainElement(screen.getByRole("button", { name: "Tout déplier" }));
        expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "arbre");
        expect(screen.getByRole("tabpanel")).toHaveTextContent("Pôle A");
        expect(screen.getByRole("tabpanel")).not.toHaveTextContent("Onglets");
    });

    it("pyramide : feuilles d'un même parent en rangée, sous-arbres empilés ; mêmes listes et replis", () => {
        const { container } = render(
            <OrgChartLib
                layout="pyramide"
                root={{
                    id: "r", title: "Direction",
                    children: [
                        { id: "a", title: "Pôle A", href: "/a", children: [{ id: "a1", title: "Bruno" }, { id: "a2", title: "Chloé", note: "jusqu'au 01/03/2026" }] },
                        { id: "b", variant: "group", title: "Pôle B", children: [{ id: "b1", title: "David" }] },
                    ],
                }}
            />
        );

        expect(container.querySelector(".org-chart-lib--pyramide")).toBeInTheDocument();
        expect(container.querySelectorAll(".org-chart-lib__pyr-children--stack")).toHaveLength(1);
        expect(container.querySelectorAll(".org-chart-lib__pyr-children--row")).toHaveLength(2);
        expect(screen.getByRole("link", { name: "Pôle A" })).toHaveAttribute("href", "/a");
        expect(screen.getByText("jusqu'au 01/03/2026")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Replier « Pôle A »" }));
        expect(screen.queryByText("Bruno")).not.toBeInTheDocument();
        expect(screen.getByText("David")).toBeInTheDocument();
    });

    it("sélecteur Arbre / Pyramide : état interne, ou contrôlé par la page", () => {
        const root = { id: "r", title: "Direction", children: [{ id: "a", title: "Pôle A" }] };
        const { container, rerender } = render(<OrgChartLib root={root} showLayoutToggle />);

        expect(screen.getByRole("button", { name: "Arbre" })).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(screen.getByRole("button", { name: "Pyramide" }));
        expect(screen.getByRole("button", { name: "Pyramide" })).toHaveAttribute("aria-pressed", "true");
        expect(container.querySelector(".org-chart-lib--pyramide")).toBeInTheDocument();

        const onLayoutChange = jest.fn();
        rerender(<OrgChartLib root={root} showLayoutToggle layout="arbre" onLayoutChange={onLayoutChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Pyramide" }));
        expect(onLayoutChange).toHaveBeenCalledWith("pyramide");
        // Contrôlé : l'affichage ne change que si la page le décide.
        expect(container.querySelector(".org-chart-lib--arbre")).toBeInTheDocument();
    });

    it("toolbar={null} réserve la ligne (vide) ; sans toolbar, pas de ligne", () => {
        const root = { id: "r", title: "Direction" };
        const { container, rerender } = render(<OrgChartLib root={root} showExpandControls toolbar={null} />);
        expect(container.querySelector(".org-chart-lib__toolbar")).toBeEmptyDOMElement();

        rerender(<OrgChartLib root={root} showExpandControls />);
        expect(container.querySelector(".org-chart-lib__toolbar")).toBeNull();
    });

    it("rend l'arbre en listes imbriquées, avec liens et mentions", () => {
        render(
            <OrgChartLib
                root={{
                    id: "r", title: "Direction",
                    children: [
                        { id: "a", title: "Pôle A", href: "/a", children: [{ id: "a1", title: "Bruno", note: "jusqu'au 01/03/2026" }] },
                    ],
                }}
            />
        );

        expect(screen.getByRole("group", { name: "Direction" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Pôle A" })).toHaveAttribute("href", "/a");
        expect(screen.getByText("jusqu'au 01/03/2026")).toBeInTheDocument();
        // Deux niveaux de listes : Pôle A, puis Bruno.
        expect(screen.getAllByRole("list")).toHaveLength(2);
    });

    it("affiche une longue liste de feuilles en grille", () => {
        const { container } = render(
            <OrgChartLib root={{ id: "r", title: "Bureau", children: ["A", "B", "C", "D"].map((t) => ({ id: t, title: t })) }} />
        );

        expect(container.querySelector(".org-chart-lib__children--grid")).not.toBeNull();
        expect(screen.getAllByRole("listitem")).toHaveLength(4);
    });

    it("avatar et pastille", () => {
        render(
            <OrgChartLib
                root={{
                    id: "r", title: "Yaël Braun-Pivet",
                    avatar: { src: "/photo.jpg" },
                    badge: { label: "EPR", background: "#facc15", color: "#1a1a1a", title: "Groupe : Ensemble pour la République" },
                }}
            />
        );

        expect(screen.getByLabelText("Groupe : Ensemble pour la République")).toHaveTextContent("EPR");
        expect(document.querySelector("img")).toHaveAttribute("src", expect.stringContaining("photo.jpg"));
    });

    it("variant « group » : intitulé de regroupement et compteur, sans carte", () => {
        const { container } = render(
            <OrgChartLib root={{ id: "r", title: "Direction", children: [{ id: "g", variant: "group", title: "Adjoints", subtitle: "1", children: [{ id: "b", title: "Bruno" }] }] }} />
        );

        expect(container.querySelector(".org-chart-lib__group")).toHaveTextContent("Adjoints1");
        // Seuls la racine et Bruno sont des cartes.
        expect(container.querySelectorAll(".org-chart-lib__card")).toHaveLength(2);
        expect(screen.getByRole("button", { name: "Replier « Adjoints »" })).toBeInTheDocument();
    });

    const ARBRE = {
        id: "r", title: "Direction",
        children: [{ id: "a", title: "Pôle A", children: [{ id: "a1", title: "Bruno" }] }],
    };

    it("chaque branche se replie et se déplie, ouverte par défaut", () => {
        render(<OrgChartLib root={ARBRE} />);

        const bouton = screen.getByRole("button", { name: "Replier « Pôle A »" });
        expect(bouton).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByText("Bruno")).toBeInTheDocument();

        fireEvent.click(bouton);

        expect(screen.queryByText("Bruno")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Déplier « Pôle A »" })).toHaveAttribute("aria-expanded", "false");
    });

    it("« Tout replier » / « Tout déplier »", () => {
        render(<OrgChartLib root={ARBRE} showExpandControls />);

        fireEvent.click(screen.getByRole("button", { name: "Tout replier" }));
        expect(screen.queryByText("Pôle A")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Tout déplier" }));
        expect(screen.getByText("Bruno")).toBeInTheDocument();
    });
});
