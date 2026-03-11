import React from "react";
import { LucideIcon } from "lucide-react";

type GridCols = 1 | 2 | 3 | 4;

interface AnchorSectionBlockProps {
    /** Doit correspondre à l'id dans STATISTICS_SECTIONS → ancre de navigation */
    id: string;
    /** Titre de la section */
    title: string;
    /** Description courte */
    description?: string;
    /** Icône Lucide */
    icon: LucideIcon;
    /** Nombre de colonnes de la grille de contenu (défaut: 2) */
    cols?: GridCols;
    /** Composants charts / tables / etc. */
    children: React.ReactNode;
}

const GRID_COLS_CLASS: Record<GridCols, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

/**
 * AnchorSectionBlockLib
 * Bloc de section réutilisable pour toutes les pages /statistiques/*.
 * Fournit : ancre HTML, header (icône + titre + description), grille responsive.
 * Les enfants sont des composants chart/table/card autonomes.
 */
export const AnchorSectionBlockLib: React.FC<AnchorSectionBlockProps> = ({
                                                                                  id,
                                                                                  title,
                                                                                  description,
                                                                                  icon: Icon,
                                                                                  cols = 2,
                                                                                  children,
                                                                              }: AnchorSectionBlockProps) => {
    return (
        <section
            id={id}
            aria-labelledby={`section-title-${id}`}
            className="scroll-mt-8"
        >
            {/* ── Header de section ── */}
            <div
                className="flex items-start gap-3 mb-5 pb-4 border-b border-main"
            >
                {/* Icône dans un carré accent */}
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--surface-3)" }}
                >
                    <Icon
                        className="w-4 h-4"
                        style={{ color: "var(--accent)" }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        id={`section-title-${id}`}
                        className="font-bold leading-snug"
                        style={{ color: "var(--foreground)" }}
                    >
                        {title}
                    </h3>
                    {description && (
                        <p
                            className="text-sm mt-0.5 leading-relaxed"
                            style={{ color: "var(--subtitle-accent)" }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Grille de contenu ── */}
            <div className={`grid ${GRID_COLS_CLASS[cols]} gap-4`}>
                {children}
            </div>
        </section>
    );
};