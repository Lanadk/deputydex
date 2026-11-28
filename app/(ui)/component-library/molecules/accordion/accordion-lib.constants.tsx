import React from "react";
import { AccordionLib } from "@/app/(ui)/component-library/molecules/accordion/accordion-lib";
import { FormulaLib } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

const CODE_DEFAULT = `<AccordionLib
  items={[
    { id: "methode", title: "Méthode", content: <p>…</p> },
    { id: "sources", title: "Sources", hint: "3 jeux de données", content: <p>…</p> },
  ]}
/>
`;

const CODE_FORMULE = `<AccordionLib
  multiple={false}
  defaultOpenIds={["taux"]}
  items={[
    {
      id: "taux",
      title: "Taux de présence",
      content: <FormulaLib result="τ" numerator="Σ_{d,j} 𝟙[A_{d,j} ∧ P_{d,j}]" denominator="Σ_{d,j} 𝟙[A_{d,j}]" factor="× 100" legend={[…]} framed={false} />,
    },
    { id: "seance", title: "Présence en séance", content: … },
  ]}
/>
`;

const texte = (t: string) => <p className="text-sm" style={{ color: "var(--foreground)" }}>{t}</p>;

export const getAccordionSections = () => [
    {
        title: "Par défaut — plusieurs panneaux ouvrables, tous fermés",
        code: CODE_DEFAULT,
        component: (
            <AccordionLib
                items={[
                    { id: "methode", title: "Méthode", content: texte("Un jour est attendu quand une séance avec scrutin s'est tenue pendant le mandat.") },
                    { id: "sources", title: "Sources", hint: "3 jeux de données", content: texte("Scrutins, comptes rendus des débats, réunions des commissions.") },
                ]}
            />
        ),
    },
    {
        title: "Un seul panneau ouvert à la fois, le premier ouvert, avec des formules",
        code: CODE_FORMULE,
        component: (
            <AccordionLib
                multiple={false}
                defaultOpenIds={["taux"]}
                items={[
                    {
                        id: "taux",
                        title: "Taux de présence",
                        content: (
                            <FormulaLib
                                result="τ"
                                numerator="Σ_{d,j} 𝟙[A_{d,j} ∧ P_{d,j}]"
                                denominator="Σ_{d,j} 𝟙[A_{d,j}]"
                                factor="× 100"
                                legend={[
                                    { symbol: "A_{d,j}", description: "le député d est attendu le jour j" },
                                    { symbol: "P_{d,j}", description: "le député d est présent le jour j" },
                                ]}
                                framed={false}
                            />
                        ),
                    },
                    {
                        id: "seance",
                        title: "Présence en séance",
                        content: <FormulaLib result="τ^{séance}" numerator="Σ_{d,j} 𝟙[S_{j} ∧ M_{d,j} ∧ PS_{d,j}]" denominator="Σ_{d,j} 𝟙[S_{j} ∧ M_{d,j}]" factor="× 100" legend={[]} framed={false} />,
                    },
                ]}
            />
        ),
    },
];
