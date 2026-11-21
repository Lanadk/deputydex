import React from "react";
import { PageStateLib } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

const CODE_NOT_FOUND = `<PageStateLib
  code="404"
  title="Page introuvable"
  description="Cette page n'existe pas ou a été déplacée."
>
  <a href="/" className="btn-lib btn-lib--primary btn-lib--medium">Accueil</a>
  <a href="/deputydex" className="btn-lib btn-lib--secondary btn-lib--medium">Les députés</a>
</PageStateLib>
`;

const CODE_ERROR = `<PageStateLib
  title="Une erreur est survenue"
  description="Le chargement de la page a échoué."
>
  <ButtonLib text="Réessayer" onClick={() => retry()} />
</PageStateLib>
`;

const CODE_MINIMAL = `<PageStateLib title="Aucun résultat" />
`;

export const getPageStateSections = () => [
    {
        title: "Page introuvable (404) — code, texte et liens",
        code: CODE_NOT_FOUND,
        component: (
            <PageStateLib
                code="404"
                title="Page introuvable"
                description="Cette page n'existe pas ou a été déplacée."
            >
                <a href="#" className="btn-lib btn-lib--primary btn-lib--medium">Accueil</a>
                <a href="#" className="btn-lib btn-lib--secondary btn-lib--medium">Les députés</a>
            </PageStateLib>
        ),
    },
    {
        title: "Erreur — avec bouton « Réessayer »",
        code: CODE_ERROR,
        component: (
            <PageStateLib title="Une erreur est survenue" description="Le chargement de la page a échoué.">
                <ButtonLib text="Réessayer" />
            </PageStateLib>
        ),
    },
    {
        title: "Minimal — titre seul",
        code: CODE_MINIMAL,
        component: <PageStateLib title="Aucun résultat" />,
    },
];
