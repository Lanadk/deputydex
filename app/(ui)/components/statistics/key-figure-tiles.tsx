import React from "react";
import { ArrowUpRight } from "lucide-react";
import { BentoTileLib } from "@/app/(ui)/component-library/molecules/bento/bento-lib";
import { typeStatCouleur, typeStatEncre } from "@/app/(ui)/_shared/adapter/stat-type.adapter";
import {
    KeyFigureCategory,
    KeyFigureTheme,
    themesDeCategorie,
} from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

/** Taille d'une tuile de thème ; `sommaire` : assez grande pour lister les sections de sa page. */
export type TailleTheme = { colSpan: 1 | 2 | 3 | 4; rowSpan: 1 | 2; sommaire: boolean };

const petite: TailleTheme = { colSpan: 1, rowSpan: 1, sommaire: false };
const large: TailleTheme = { colSpan: 2, rowSpan: 1, sommaire: false };
const grande: TailleTheme = { colSpan: 2, rowSpan: 2, sommaire: true };

/**
 * Disposition des tuiles d'une catégorie sur 4 colonnes, selon le nombre de
 * thèmes : rangées toujours pleines, et une mise en page propre à chaque
 * effectif (un bandeau pleine largeur pour un thème seul, une grande tuile 2 × 2
 * avec son sommaire pour 3 à 5 thèmes…) plutôt que la même grille partout.
 */
export function dispositionThemes(nombre: number): TailleTheme[] {
    switch (nombre) {
        case 0: return [];
        case 1: return [{ colSpan: 4, rowSpan: 1, sommaire: true }];
        case 2: return [{ ...large, sommaire: true }, { ...large, sommaire: true }];
        case 3: return [grande, large, large];
        case 4: return [grande, large, petite, petite];
        case 5: return [grande, petite, petite, petite, petite];
        case 6: return [large, petite, petite, petite, petite, large];
        default: {
            // Au-delà : la première tuile s'élargit pour compléter la dernière rangée.
            const reste = nombre % 4;
            const premiere = (reste === 0 ? 1 : 5 - reste) as TailleTheme["colSpan"];
            return [{ colSpan: premiere, rowSpan: 1, sommaire: false }, ...Array<TailleTheme>(nombre - 1).fill(petite)];
        }
    }
}

export const libelleNombreThemes = (n: number) => (n === 0 ? "Bientôt" : `${n} thème${n > 1 ? "s" : ""}`);

/** Décalage de l'apparition en cascade (index de la tuile). */
const cascade = (index: number) => ({ "--stat-i": index }) as React.CSSProperties;

/**
 * Tuile d'un thème « Chiffres clés » : icône et bandeau à sa couleur, titre,
 * accroche. Une grande tuile (`taille.sommaire`) liste aussi les sections de la
 * page du thème. `aDroite` : une grande tuile 2 × 2 placée à droite (alternance
 * d'une catégorie à l'autre), sur grand écran seulement.
 */
export function KeyFigureThemeTile({ theme, taille = { colSpan: 1, rowSpan: 1, sommaire: false }, aDroite = false, index = 0 }: {
    theme: KeyFigureTheme;
    taille?: TailleTheme;
    aDroite?: boolean;
    index?: number;
}) {
    const Icon = theme.icon;
    const classes = [
        "stat-tile",
        taille.colSpan > 1 || taille.rowSpan > 1 ? "stat-tile--vedette" : "",
        taille.colSpan === 4 ? "stat-tile--bandeau" : "",
        aDroite && taille.rowSpan === 2 ? "stat-tile--a-droite" : "",
    ].filter(Boolean).join(" ");

    return (
        <BentoTileLib
            href={`/statistics/chiffres-cles/${theme.slug}`}
            variant="solid"
            color={typeStatCouleur(theme.color)}
            ink={typeStatEncre(theme.color)}
            colSpan={taille.colSpan}
            rowSpan={taille.rowSpan}
            className={classes}
            style={cascade(index)}
        >
            <span className="stat-tile__icone" aria-hidden="true"><Icon size={22} /></span>
            <ArrowUpRight className="stat-tile__fleche" size={20} aria-hidden="true" />
            <span className="stat-tile__titre">{theme.title}</span>
            <span className="stat-tile__texte">{theme.teaser}</span>
            {taille.sommaire && theme.sections.length > 0 && (
                <span className="stat-tile__sommaire">
                    <span className="stat-tile__sommaire-titre">Au sommaire</span>
                    <span className="stat-tile__sommaire-liste">
                        {theme.sections.map(({ id, label, icon: SectionIcon }) => (
                            <span key={id} className="stat-tile__sommaire-item">
                                <SectionIcon size={14} aria-hidden="true" /> {label}
                            </span>
                        ))}
                    </span>
                </span>
            )}
        </BentoTileLib>
    );
}

/** Thèmes sans page : une ligne discrète, pas des tuiles (rien à ouvrir). */
export function KeyFigureThemesAVenir({ themes }: { themes: KeyFigureTheme[] }) {
    if (themes.length === 0) return null;
    return (
        <div className="stat-a-venir">
            <span className="stat-a-venir__label">Bientôt</span>
            <ul className="stat-a-venir__liste">
                {themes.map(({ slug, title, icon: Icon }) => (
                    <li key={slug} className="stat-a-venir__theme">
                        <Icon size={14} aria-hidden="true" /> {title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Tuile d'une catégorie du hub : mène à sa section des Chiffres clés ; grisée si aucun thème n'est prêt. */
export function KeyFigureCategoryTile({ categorie, index = 0 }: { categorie: KeyFigureCategory; index?: number }) {
    const Icon = categorie.icon;
    const nombre = themesDeCategorie(categorie.id).disponibles.length;
    const pret = nombre > 0;
    return (
        <BentoTileLib
            href={pret ? `/statistics/chiffres-cles#categorie-${categorie.id}` : undefined}
            variant="solid"
            color={pret ? typeStatCouleur(categorie.color) : undefined}
            ink={pret ? typeStatEncre(categorie.color) : undefined}
            className={`stat-tile stat-tile--categorie${pret ? "" : " stat-tile--a-venir"}`}
            style={cascade(index)}
        >
            <span className="stat-tile__icone" aria-hidden="true"><Icon size={20} /></span>
            {pret && <ArrowUpRight className="stat-tile__fleche" size={20} aria-hidden="true" />}
            <span className="stat-tile__titre">{categorie.label}</span>
            <span className="stat-tile__compte">{libelleNombreThemes(nombre)}</span>
        </BentoTileLib>
    );
}
