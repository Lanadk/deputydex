"use client"

import { useSearchParams } from 'next/navigation';
import { CatalogCard } from "@/app/(ui)/component-library/_catalogue/catalog-card";
import { COMPONENT_PREVIEWS } from "@/app/(ui)/component-library/_catalogue/component-previews";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { Suspense } from 'react';

type ComponentEntry = { name: string; description: string; path: string };
type ComponentTheme = { theme: string; items: ComponentEntry[] };

// Rangé par niveau (atoms / molecules / templates), puis par thème. Les noms
// sont ceux des composants, sans le suffixe `Lib`.
const components: Record<string, ComponentTheme[]> = {
    Atoms: [
        {
            theme: 'Actions',
            items: [
                { name: 'Button', description: 'Bouton et ses variantes', path: '/component-library/atoms/button' },
            ],
        },
        {
            theme: 'Texte et étiquettes',
            items: [
                { name: 'Span', description: 'Texte inline avec icône', path: '/component-library/atoms/span' },
                { name: 'Badge', description: 'Label, tag ou statut', path: '/component-library/atoms/badge' },
                { name: 'Avatar', description: 'Photo ronde ou initiales', path: '/component-library/atoms/badge-avatar' },
            ],
        },
    ],
    Molecules: [
        {
            theme: 'Formulaires et filtres',
            items: [
                { name: 'Input', description: 'Champ de saisie et de recherche', path: '/component-library/molecules/input' },
                { name: 'Select', description: 'Liste déroulante', path: '/component-library/molecules/select' },
                { name: 'Checkbox', description: 'Case à cocher', path: '/component-library/molecules/checkbox' },
                { name: 'ToggleSwitch', description: 'Interrupteur on / off', path: '/component-library/molecules/toggle-switch' },
                { name: 'FilterGroup', description: 'Groupe de contrôles de filtre', path: '/component-library/molecules/filter-group' },
                { name: 'FilterBar', description: 'Barre de filtres complète', path: '/component-library/molecules/filter-bar' },
            ],
        },
        {
            theme: 'Données',
            items: [
                { name: 'Table', description: 'Tableau paginé ou non', path: '/component-library/molecules/table' },
                { name: 'Charts', description: 'Barres, lignes, camemberts, nuages de points', path: '/component-library/molecules/chart' },
                { name: 'ActivityCalendar', description: "Calendrier d'activité", path: '/component-library/molecules/activity-calendar' },
                { name: 'DifficultyGauge', description: 'Jauge de 1 à 5', path: '/component-library/molecules/difficulty-gauge' },
                { name: 'Timeline', description: 'Frise chronologique en couloirs', path: '/component-library/molecules/timeline' },
                { name: 'OrgChart', description: 'Organigramme (arbre hiérarchique)', path: '/component-library/molecules/org-chart' },
                { name: 'ProportionBar', description: "Répartition d'un total en une barre", path: '/component-library/molecules/proportion-bar' },
            ],
        },
        {
            theme: 'Cartes',
            items: [
                { name: 'KpiCards', description: 'Cartes KPI, barre et liste résumée', path: '/component-library/molecules/cards' },
                { name: 'DeputyCard', description: "Carte d'un député", path: '/component-library/molecules/deputy' },
                { name: 'GroupMiniCard', description: "Carte aux couleurs d'un groupe", path: '/component-library/molecules/group-mini-card' },
                { name: 'ExpandableCard', description: 'Carte dépliable', path: '/component-library/molecules/expandable-card' },
            ],
        },
        {
            theme: 'États de page',
            items: [
                { name: 'PageState', description: '404, erreur, aucun résultat', path: '/component-library/molecules/page-state' },
                { name: 'ErrorState', description: 'Erreur de chargement et « Réessayer »', path: '/component-library/molecules/error-state' },
                { name: 'InfoTip', description: "Icône « i » et bulle d'information", path: '/component-library/molecules/info-tip' },
                { name: 'Notification', description: 'Notification temporaire (toast)', path: '/component-library/molecules/notification' },
                { name: 'Spinner', description: 'Indicateur de chargement', path: '/component-library/molecules/spinner' },
            ],
        },
        {
            theme: 'Outils',
            items: [
                { name: 'ThemeSwitcher', description: 'Choix du thème du site', path: '/component-library/molecules/theme-switcher' },
                { name: 'CodeBlock', description: 'Aperçu + code des démos', path: '/component-library/molecules/code-block' },
            ],
        },
        {
            theme: 'Navigation',
            items: [
                { name: 'Tabs', description: 'Onglets accessibles', path: '/component-library/molecules/tabs' },
            ],
        },
    ],
    Templates: [
        {
            theme: 'Mise en page',
            items: [
                { name: 'BaseLayout', description: 'Conteneur commun des pages', path: '/component-library/template/base-layout' },
                { name: 'PageContent', description: 'Empilement des sections', path: '/component-library/template/page-content' },
            ],
        },
        {
            theme: 'En-têtes',
            items: [
                { name: 'PageHeader', description: 'Titre et sous-titre de page', path: '/component-library/template/headers/page-header' },
            ],
        },
        {
            theme: 'Sections',
            items: [
                { name: 'BlockSection', description: 'Sections de page pilotées par config', path: '/component-library/template/sections/block-section' },
                { name: 'AnchorSection', description: 'Navigation par ancres et ses layouts', path: '/component-library/template/sections/anchor-section' },
            ],
        },
    ],
};

function ComponentGrid() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'Atoms';
    const currentComponents = components[type] || components.Atoms;

    return (
        <>
            <PageHeaderLib
                title={type}
                subtitle="Survolez un composant pour un aperçu, cliquez pour voir tous ses variants"
            />

            <div className="flex flex-col gap-10">
                {currentComponents.map((group) => (
                    <section key={group.theme} aria-labelledby={`theme-${group.theme}`}>
                        <h2
                            id={`theme-${group.theme}`}
                            className="mb-4 text-sm font-semibold uppercase tracking-wide"
                            style={{ color: 'var(--subtitle-accent)' }}
                        >
                            {group.theme}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.items.map((component) => (
                                <CatalogCard
                                    key={component.name}
                                    name={component.name}
                                    description={component.description}
                                    path={component.path}
                                    preview={COMPONENT_PREVIEWS[component.path]}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}

export default function ComponentLibraryPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ComponentGrid />
        </Suspense>
    );
}
