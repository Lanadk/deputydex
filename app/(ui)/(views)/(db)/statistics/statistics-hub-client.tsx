"use client";

import React from "react";
import {ArrowUpRight, BarChart3, Sparkles} from "lucide-react";
import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {BentoGridLib, BentoTileLib} from "@/app/(ui)/component-library/molecules/bento/bento-lib";
import {STATS_CATALOG} from "@/app/(ui)/_shared/statistics/catalog/stats-catalog";
import {KEY_FIGURE_CATEGORIES, themesDisponibles} from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";
import {KeyFigureCategoryTile} from "@/app/(ui)/components/statistics/key-figure-tiles";
import {typeStatCouleur, typeStatEncre} from "@/app/(ui)/_shared/adapter/stat-type.adapter";

/** Nombre de statistiques du mode avancé (tous domaines). */
export const nombreStatistiques = () => STATS_CATALOG.reduce((total, domaine) => total + domaine.stats.length, 0);

/**
 * `/statistics` — plus l'explorateur lui-même (déplacé sous `/statistics/avance`,
 * voir `avance/avance-page-client.tsx`), mais un hub à deux entrées, en grille bento :
 *
 * - "Chiffres clés" (`chiffres-cles/`) : pages éditoriales, un grand chiffre
 *   par thème, textes d'explication, pensées pour le grand public.
 * - "Mode avancé" (`avance/`) : le catalogue Statistiques existant —
 *   recherche/sélection/comparaison/export, pensé pour qui veut creuser.
 *
 * Puis une tuile par catégorie de Chiffres clés. Les chiffres affichés
 * (thèmes, statistiques) sont comptés dans les registres, jamais écrits en dur.
 *
 * Voir `5.STATS-CATALOG_client_side.md` pour l'architecture des deux.
 */
export default function StatisticsHubClient() {
    const themes = themesDisponibles();

    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Statistiques"
                    subtitle="Découvre les grands chiffres de l'Assemblée nationale, ou explore la base de données dans le détail."
                />
            </div>

            <BentoGridLib columns={4} rowMinHeight={150} mobileColumns={2}>
                <BentoTileLib
                    colSpan={2}
                    rowSpan={2}
                    href="/statistics/chiffres-cles"
                    variant="solid"
                    color={typeStatCouleur("bleu")}
                    ink={typeStatEncre("bleu")}
                    className="stat-tile stat-tile--entree"
                    style={{"--stat-i": 0} as React.CSSProperties}
                >
                    <span className="stat-tile__kicker">Pour tout le monde</span>
                    <span className="stat-tile__icone" aria-hidden="true"><Sparkles size={24}/></span>
                    <ArrowUpRight className="stat-tile__fleche" size={22} aria-hidden="true"/>
                    <span className="stat-tile__titre">Chiffres clés</span>
                    <span className="stat-tile__texte">
                        Les grands chiffres de l&apos;Assemblée nationale expliqués simplement : qui sont
                        les député·es, comment votent-ils, comment ça évolue. Un thème à la fois, avec du contexte.
                    </span>
                    <span className="stat-tile__bas">
                        <span className="stat-tile__nombre">{themes.length}</span>
                        <span className="stat-tile__unite">thèmes expliqués en graphiques</span>
                        {/* Les icônes des thèmes, chacune à sa couleur : un aperçu de ce qu'on va trouver. */}
                        <span className="stat-tile__pastilles" aria-hidden="true">
                            {themes.map(({slug, icon: Icon, color}) => (
                                <span
                                    key={slug}
                                    style={{"--stat-pastille": typeStatCouleur(color), "--stat-pastille-ink": typeStatEncre(color)} as React.CSSProperties}
                                >
                                    <Icon size={16}/>
                                </span>
                            ))}
                        </span>
                    </span>
                </BentoTileLib>

                <BentoTileLib
                    colSpan={2}
                    rowSpan={2}
                    href="/statistics/avance"
                    variant="solid"
                    color={typeStatCouleur("rouge")}
                    ink={typeStatEncre("rouge")}
                    className="stat-tile stat-tile--entree"
                    style={{"--stat-i": 1} as React.CSSProperties}
                >
                    <span className="stat-tile__kicker">Pour creuser</span>
                    <span className="stat-tile__icone" aria-hidden="true"><BarChart3 size={24}/></span>
                    <ArrowUpRight className="stat-tile__fleche" size={22} aria-hidden="true"/>
                    <span className="stat-tile__titre">Mode avancé</span>
                    <span className="stat-tile__texte">
                        Le catalogue complet : cherche une statistique précise, change son format
                        d&apos;affichage, compare-la entre deux groupes, deux législatures ou deux
                        député·es, exporte-la.
                    </span>
                    <span className="stat-tile__bas">
                        <span className="stat-tile__nombre">{nombreStatistiques()}</span>
                        <span className="stat-tile__unite">statistiques à explorer</span>
                        <span className="stat-tile__domaines">
                            {STATS_CATALOG.map(({id, label, icon: Icon}) => (
                                <span key={id} className="stat-tile__domaine"><Icon size={14} aria-hidden="true"/> {label}</span>
                            ))}
                        </span>
                    </span>
                </BentoTileLib>

                {KEY_FIGURE_CATEGORIES.map((categorie, i) => (
                    <KeyFigureCategoryTile key={categorie.id} categorie={categorie} index={i + 2}/>
                ))}
            </BentoGridLib>
        </BaseLayout>
    );
}
