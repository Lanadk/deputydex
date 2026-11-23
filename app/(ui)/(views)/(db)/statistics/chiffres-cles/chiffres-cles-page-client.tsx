"use client";

import React from "react";
import Link from "next/link";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { BentoGridLib } from "@/app/(ui)/component-library/molecules/bento/bento-lib";
import { typeStatCouleur, typeStatEncre } from "@/app/(ui)/_shared/adapter/stat-type.adapter";
import { KEY_FIGURE_CATEGORIES, themesDeCategorie } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";
import {
    dispositionThemes,
    KeyFigureThemesAVenir,
    KeyFigureThemeTile,
    libelleNombreThemes,
} from "@/app/(ui)/components/statistics/key-figure-tiles";

/**
 * Catégories dont la grande tuile 2 × 2 passe à droite : une sur deux parmi
 * celles qui en ont une (les autres dispositions ne comptent pas), pour que
 * deux sections de suite ne se ressemblent pas.
 */
export function categoriesGrandeADroite(nombreDeThemes: { id: string; disponibles: number }[]): Set<string> {
    const avecGrande = nombreDeThemes.filter((c) => dispositionThemes(c.disponibles).some((t) => t.rowSpan === 2));
    return new Set(avecGrande.filter((_, i) => i % 2 === 1).map((c) => c.id));
}

/**
 * Une section par catégorie : ses thèmes en grille bento, chacun à sa couleur,
 * avec une disposition propre à son nombre de thèmes (`dispositionThemes`). Les
 * thèmes sans page (voir `themes.registry.ts`) ne sont pas des tuiles menant à
 * une page vide : une ligne « Bientôt » les liste, sans lien.
 */
export default function ChiffresClesPageClient() {
    const grandeADroite = categoriesGrandeADroite(
        KEY_FIGURE_CATEGORIES.map(({ id }) => ({ id, disponibles: themesDeCategorie(id).disponibles.length }))
    );

    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <Link href="/statistics" className="text-sm text-subtitle-accent hover:text-accent">
                    ← Retour au hub Statistiques
                </Link>
                <PageHeaderLib
                    title="Chiffres clés"
                    subtitle="Les grands chiffres de l'Assemblée nationale, expliqués : qui sont les député·es,
                    comment votent-ils, comment ça évolue."
                    className="mt-3 mb-0"
                />
            </div>

            <div className="flex flex-col gap-12">
                {KEY_FIGURE_CATEGORIES.map((categorie) => {
                    const { disponibles, aVenir } = themesDeCategorie(categorie.id);
                    if (disponibles.length === 0 && aVenir.length === 0) return null;
                    const Icon = categorie.icon;
                    const titreId = `categorie-${categorie.id}-titre`;

                    return (
                        <section
                            key={categorie.id}
                            id={`categorie-${categorie.id}`}
                            className="stat-categorie"
                            style={{
                                "--stat-categorie-color": typeStatCouleur(categorie.color),
                                "--stat-categorie-ink": typeStatEncre(categorie.color),
                            } as React.CSSProperties}
                            aria-labelledby={titreId}
                        >
                            <header className="stat-categorie__header">
                                <span className="stat-categorie__icone" aria-hidden="true"><Icon size={20} /></span>
                                <h2 id={titreId} className="stat-categorie__titre">{categorie.label}</h2>
                                <span className="stat-categorie__compte">{libelleNombreThemes(disponibles.length)}</span>
                            </header>

                            {disponibles.length > 0 && (
                                <BentoGridLib columns={4} rowMinHeight={170}>
                                    {dispositionThemes(disponibles.length).map((taille, i) => (
                                        <KeyFigureThemeTile
                                            key={disponibles[i].slug}
                                            theme={disponibles[i]}
                                            taille={taille}
                                            aDroite={grandeADroite.has(categorie.id)}
                                            index={i}
                                        />
                                    ))}
                                </BentoGridLib>
                            )}

                            <KeyFigureThemesAVenir themes={aVenir} />
                        </section>
                    );
                })}
            </div>
        </BaseLayout>
    );
}
