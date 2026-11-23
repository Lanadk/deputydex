"use client";

import React, { useMemo } from "react";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { GroupMiniCardLib } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
    getGroupFullLabel,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/** Assez de colonnes pour que le plan incliné couvre toute la page (voir `.card-wall__plane`). */
export const CARD_WALL_COLUMNS = 12;
export const CARD_WALL_CARDS_PER_COLUMN = 8;

/**
 * Répartit les cartes en colonnes de `perColumn` cartes uniques. S'il y a
 * moins de cartes que de places, on reboucle sur la liste en décalant chaque
 * colonne, pour que deux colonnes voisines ne soient pas identiques.
 */
export function buildCardWallColumns<T>(cards: T[], columns: number, perColumn: number): T[][] {
    if (cards.length === 0) return [];
    const offset = cards.length >= columns * perColumn ? perColumn : 5;
    return Array.from({ length: columns }, (_, k) =>
        Array.from({ length: perColumn }, (_, i) => cards[(k * offset + i) % cards.length])
    );
}

/**
 * Mur de cartes incliné de l'accueil, en fond de toute la page (collé à
 * l'écran pendant le défilement, agrandi pour le remplir entièrement) : des colonnes
 * qui défilent en boucle, une sur deux en sens inverse. Chaque colonne contient ses cartes en double :
 * l'animation translateY(0 → -50%) boucle exactement (padding-bottom = gap).
 *
 * Purement décoratif (`aria-hidden`) : la structure accessible de la page
 * est portée par le titre et les sections de la page. Animation continue (pas de pause au
 * survol), désactivée avec `prefers-reduced-motion` (voir `.card-wall` dans globals.css).
 */
export function CardWall({ cards }: { cards: DeputesCardDTO[] }) {
    const columns = useMemo(
        () => buildCardWallColumns(cards, CARD_WALL_COLUMNS, CARD_WALL_CARDS_PER_COLUMN),
        [cards]
    );

    return (
        <div className="card-wall" aria-hidden="true">
            {/* Fenêtre collante de la hauteur de l'écran : le mur reste visible pendant tout le défilement de la page. */}
            <div className="card-wall__viewport">
                <div className="card-wall__plane">
                    {columns.map((column, k) => (
                        <div
                            key={k}
                            className="card-wall__col"
                            style={{
                                animationDuration: `${36 + (k % 4) * 8}s`,
                                animationDelay: `-${k * 6}s`,
                                animationDirection: k % 2 ? "reverse" : "normal",
                            }}
                        >
                            {[...column, ...column].map((card, i) => (
                                <GroupMiniCardLib
                                    key={`${card.deputeUID}-${i}`}
                                    theme={getGroupCardTheme(getCanonicalGroupCode(card.deputeGroupeCode))}
                                    chip={card.deputeGroupeCode}
                                    name={card.deputeFullName}
                                    subtitle={getGroupFullLabel(card.deputeGroupeCode)}
                                    image={card.deputeImage}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="card-wall__fade card-wall__fade--left" />
            </div>
        </div>
    );
}
