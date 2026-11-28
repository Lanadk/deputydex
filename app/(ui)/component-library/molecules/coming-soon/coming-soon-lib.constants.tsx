import React from "react";
import { ComingSoonLib } from "@/app/(ui)/component-library/molecules/coming-soon/coming-soon-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";

const CODE_DEFAUT = `<ComingSoonLib>
  <KpiCardLib kpiValue="60" kpiLabel="score" />
</ComingSoonLib>
`;

const CODE_LIBELLE = `<ComingSoonLib label="Arrive avec la 18ᵉ législature">
  …
</ComingSoonLib>
`;

const CODE_BLOC = `// Dans une section (config) : n'importe quel bloc, formules comprises
{ type: "card", colSpan: 1, config: card("card-score-depute"), bientot: true }
{ type: "card", colSpan: 3, config: card("card-score-detail"), bientot: "Calcul en préparation" }
`;

export const getComingSoonSections = () => [
    {
        title: "Par défaut — « Disponible bientôt » sur un aperçu flouté",
        code: CODE_DEFAUT,
        component: (
            <div className="w-64">
                <ComingSoonLib>
                    <KpiCardLib kpiValue="60" kpiLabel="score" />
                </ComingSoonLib>
            </div>
        ),
    },
    {
        title: "Mention personnalisée",
        code: CODE_LIBELLE,
        component: (
            <div className="w-64">
                <ComingSoonLib label="Arrive avec la 18ᵉ législature">
                    <KpiCardLib kpiValue="42 %" kpiLabel="taux de présence" />
                </ComingSoonLib>
            </div>
        ),
    },
    {
        title: "Sur un bloc de section — option `bientot`",
        code: CODE_BLOC,
        component: (
            <p className="text-sm text-subtitle-accent">
                Tout bloc de section accepte <code>bientot: true</code> (mention par défaut) ou <code>bientot: &quot;…&quot;</code> :
                le bloc et ses formules sont floutés sous la mention.
            </p>
        ),
    },
];
