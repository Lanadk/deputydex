"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { GroupMiniCardLib } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
    getGroupFullLabel,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/** Assez de colonnes pour que le plan incliné (agrandi) couvre toute la page (voir `.card-wall__plane`). */
export const CARD_WALL_COLUMNS = 9;
export const CARD_WALL_CARDS_PER_COLUMN = 6;
/** Colonnes affichées sur mobile (les autres sont masquées en CSS, leurs photos jamais chargées). */
export const CARD_WALL_COLUMNS_MOBILE = 5;
/** Au-delà, le mur apparaît même si toutes ses photos ne sont pas encore chargées. */
const DELAI_MAX_APPARITION_MS = 4000;

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

/** Photos (sans doublon) des colonnes affichées : celles à charger avant de montrer le mur. */
export function photosAffichees(columns: DeputesCardDTO[][], nbColonnes: number): string[] {
    return [...new Set(columns.slice(0, nbColonnes).flat().map((c) => c.deputeImage).filter(Boolean))];
}

/** Charge des images ; se résout quand toutes ont fini (chargées ou en erreur). */
function precharger(urls: string[]): Promise<void> {
    return Promise.all(urls.map((url) => new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = url;
    }))).then(() => undefined);
}

/**
 * Mur de cartes incliné de l'accueil, en fond de toute la page (collé à
 * l'écran pendant le défilement, agrandi pour le remplir entièrement) : des colonnes
 * qui défilent en boucle, une sur deux en sens inverse. Chaque colonne contient ses cartes en double :
 * l'animation translateY(0 → -50%) boucle exactement (padding-bottom = gap).
 *
 * Le mur n'apparaît (en fondu) qu'une fois les photos des colonnes affichées
 * chargées — pas de cartes qui se remplissent une à une — ou au bout de
 * DELAI_MAX_APPARITION_MS. Sur mobile, seules CARD_WALL_COLUMNS_MOBILE colonnes.
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
    const [pret, setPret] = useState(false);

    useEffect(() => {
        if (!columns.length) return;
        let annule = false;
        const mobile = window.matchMedia?.("(max-width: 600px)").matches ?? false;
        const photos = photosAffichees(columns, mobile ? CARD_WALL_COLUMNS_MOBILE : CARD_WALL_COLUMNS);
        const afficher = () => { if (!annule) setPret(true); };
        const delai = setTimeout(afficher, DELAI_MAX_APPARITION_MS);
        // Promesse ignorée volontairement : `precharger` ne rejette jamais (une image en erreur compte comme chargée).
        void precharger(photos).then(afficher);
        return () => {
            annule = true;
            clearTimeout(delai);
        };
    }, [columns]);

    return (
        <div className={`card-wall${pret ? " card-wall--pret" : ""}`} aria-hidden="true">
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
