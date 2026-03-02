"use client"

import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";

export const PAGE_HEADER_CODE_BASIC = `<PageHeader
  title="Titre de la page"
  subtitle="Description ou sous-titre de la page"
/>`;

export const PAGE_HEADER_CODE_USE_CASE = `// Dans la page Button
<PageHeader
  title="Button"
  subtitle="Composant bouton avec différentes variantes et options"
/>

// Dans la page Input
<PageHeader
  title="Input"
  subtitle="Composant input pour recherche, filtres et saisie"
/>

// Dans la page Avatar
<PageHeader
  title="Avatar"
  subtitle="Composant avatar rond avec photo ou initiales en fallback"
/>`;

export const getPageHeaderSections = () => [
    {
        title: "Usage basique",
        code: PAGE_HEADER_CODE_BASIC,
        component: (
            <PageHeader
                title="Titre de la page"
                subtitle="Description ou sous-titre de la page"
            />
        )
    },
    {
        title: "Exemples réels (pages de composants)",
        code: PAGE_HEADER_CODE_USE_CASE,
        component: (
            <div className="space-y-8">
                <PageHeader
                    title="Button"
                    subtitle="Composant bouton avec différentes variantes et options"
                />
                <PageHeader
                    title="Input"
                    subtitle="Composant input pour recherche, filtres et saisie"
                />
                <PageHeader
                    title="Avatar"
                    subtitle="Composant avatar rond avec photo ou initiales en fallback"
                />
            </div>
        )
    }
];