import React from "react";
import { FormulaLib } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

const CODE_FRACTION = `<FormulaLib
  label="Taux de présence"
  result="τ"
  numerator="Σ_{d,j} 𝟙[A_{d,j} ∧ P_{d,j}]"
  denominator="Σ_{d,j} 𝟙[A_{d,j}]"
  factor="× 100"
  legend={[
    { symbol: "d, j", description: "un député, un jour" },
    { symbol: "A_{d,j}", description: "le député d est attendu le jour j" },
    { symbol: "P_{d,j}", description: "le député d est présent le jour j" },
  ]}
/>
`;

const CODE_SIMPLE = `<FormulaLib
  result="N_{j}"
  numerator="Σ_{d} 𝟙[P_{d,j}]"
  legend={[{ symbol: "N_{j}", description: "nombre de députés présents le jour j" }]}
  note="Un député compte une fois, quel que soit le nombre de ses votes ce jour-là."
/>
`;

export const getFormulaSections = () => [
    {
        title: "Fraction, facteur et légende",
        code: CODE_FRACTION,
        component: (
            <FormulaLib
                label="Taux de présence"
                result="τ"
                numerator="Σ_{d,j} 𝟙[A_{d,j} ∧ P_{d,j}]"
                denominator="Σ_{d,j} 𝟙[A_{d,j}]"
                factor="× 100"
                legend={[
                    { symbol: "d, j", description: "un député, un jour" },
                    { symbol: "A_{d,j}", description: "le député d est attendu le jour j" },
                    { symbol: "P_{d,j}", description: "le député d est présent le jour j" },
                ]}
            />
        ),
    },
    {
        title: "Expression sans fraction, avec note",
        code: CODE_SIMPLE,
        component: (
            <FormulaLib
                result="N_{j}"
                numerator="Σ_{d} 𝟙[P_{d,j}]"
                legend={[{ symbol: "N_{j}", description: "nombre de députés présents le jour j" }]}
                note="Un député compte une fois, quel que soit le nombre de ses votes ce jour-là."
            />
        ),
    },
];
