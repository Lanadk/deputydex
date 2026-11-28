import React from "react";
import { CalloutLib } from "@/app/(ui)/component-library/molecules/callout/callout-lib";

const CODE_WARNING = `<CalloutLib variant="warning" title="Des estimations, pas un pointage">
  <p>Ces taux sont calculés à partir des seules traces publiques…</p>
</CalloutLib>
`;

const CODE_INFO = `<CalloutLib variant="info">
  <p>Données mises à jour chaque nuit depuis l'open data de l'Assemblée.</p>
</CalloutLib>
`;

const CODE_NOTE = `<CalloutLib variant="note">
  <p>Les Non inscrits sont exclus du classement.</p>
</CalloutLib>
`;

const p = (t: string) => <p className="m-0">{t}</p>;

export const getCalloutSections = () => [
    {
        title: "Attention — prévenir d'une limite ou d'une approximation",
        code: CODE_WARNING,
        component: (
            <CalloutLib variant="warning" title="Des estimations, pas un pointage">
                {p("Ces taux sont calculés à partir des seules traces publiques (votes, prises de parole, listes de présence des commissions).")}
            </CalloutLib>
        ),
    },
    {
        title: "Info — information utile",
        code: CODE_INFO,
        component: <CalloutLib variant="info">{p("Données mises à jour chaque nuit depuis l'open data de l'Assemblée.")}</CalloutLib>,
    },
    {
        title: "Remarque — précision secondaire",
        code: CODE_NOTE,
        component: <CalloutLib variant="note">{p("Les Non inscrits sont exclus du classement.")}</CalloutLib>,
    },
];
