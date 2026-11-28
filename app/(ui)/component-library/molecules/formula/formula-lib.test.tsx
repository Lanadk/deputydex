import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FormulaLib, formulaToText } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

describe("FormulaLib", () => {
    it("rend la fraction, les indices et la légende", () => {
        const { container } = render(
            <FormulaLib
                label="Taux de présence"
                result="τ"
                numerator="Σ_{d,j} P_{d,j}"
                denominator="Σ_{d,j} A_{d,j}"
                factor="× 100"
                legend={[{ symbol: "A_{d,j}", description: "1 si le député d est attendu le jour j" }]}
                note="Arrondi à 1 décimale."
            />
        );

        expect(screen.getByText("Taux de présence")).toBeInTheDocument();
        expect(screen.getByRole("math")).toHaveAttribute("aria-label", "τ égale Σ indice d,j P indice d,j divisé par Σ indice d,j A indice d,j × 100");
        expect(container.querySelectorAll("sub").length).toBe(5);
        expect(screen.getByText("1 si le député d est attendu le jour j")).toBeInTheDocument();
        expect(screen.getByText("Arrondi à 1 décimale.")).toBeInTheDocument();
    });

    it("sans dénominateur, affiche l'expression seule", () => {
        render(<FormulaLib result="N" numerator="Σ_{d} 1" legend={[]} />);
        expect(screen.getByRole("math")).toHaveAttribute("aria-label", "N égale Σ indice d 1");
    });

    it("formulaToText lit indices et exposants", () => {
        expect(formulaToText("x^{2} + y_{i}")).toBe("x exposant 2 + y indice i");
    });

    it("indice imbriqué : les accolades sont appariées par profondeur, aucune ne s'affiche", () => {
        const { container } = render(<FormulaLib result="τ_{m}" numerator="Σ_{s ∈ S_{m}} V_{s}" legend={[]} />);
        const math = screen.getByRole("math");

        expect(math.textContent).not.toMatch(/[{}]/);
        const externe = container.querySelector("sub sub")!.parentElement!;
        expect(externe.textContent).toBe("s ∈ Sm");
        expect(container.querySelector("sub sub")!.textContent).toBe("m");
        expect(formulaToText("Σ_{s ∈ S_{m}} V_{s}")).toBe("Σ indice s ∈ S indice m V indice s");
    });

    it("une accolade sans _ ni ^ devant reste du texte", () => {
        expect(formulaToText("v ∈ {pour, contre}")).toBe("v ∈ {pour, contre}");
    });
});
