"use client";

import React from "react";
import {
    bornesTranches,
    COULEUR_SANS_DONNEE,
    COULEURS_TRANCHES,
    EchelleHemicycle,
    IndicateurHemicycle,
    INDICATEURS_HEMICYCLE,
    NOMS_TRANCHES,
    RANGS_TRANCHES,
    SEUIL_JOURS_FIABLES,
} from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";

/** Coloration par défaut : la couleur du groupe de chaque siège. */
export const COLORATION_GROUPE = "groupe";

const OPTIONS = [{ id: COLORATION_GROUPE, label: "Groupe" }, ...INDICATEURS_HEMICYCLE];

/** Choix de la couleur des sièges : groupe, ou un indicateur par député. */
export function HemicycleColorationChoix({ valeur, onChangeAction }: { valeur: string; onChangeAction: (id: string) => void }) {
    return (
        <div className="hemicycle-coloration" role="group" aria-label="Couleur des sièges">
            <span className="hemicycle-coloration__titre">Couleur des sièges</span>
            {OPTIONS.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    className="hemicycle-legend__btn"
                    aria-pressed={valeur === option.id}
                    style={{ "--group-color": "var(--accent)" } as React.CSSProperties}
                    onClick={() => onChangeAction(option.id)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

/**
 * Échelle d'un indicateur : une tranche par quartile (bornes réelles et effectif),
 * les sièges sans donnée et ceux calculés sur peu de jours.
 */
export function HemicycleEchelle({
    indicateur,
    echelle,
    chargement,
}: {
    indicateur: IndicateurHemicycle;
    /** null une fois chargé = aucun député n'a de valeur pour cet indicateur. */
    echelle: EchelleHemicycle | null;
    chargement: boolean;
}) {
    if (chargement || !echelle) {
        return (
            <p className="hemicycle-echelle text-sm text-subtitle-accent">
                {chargement ? "Chargement des indicateurs…" : `${indicateur.libelle} : pas de donnée pour cette législature.`}
            </p>
        );
    }
    const bornes = bornesTranches(echelle.quartiles);

    return (
        <div className="hemicycle-echelle">
            <span className="font-semibold">{indicateur.libelle}</span>
            <ul className="hemicycle-echelle__liste" aria-label={`Échelle : ${indicateur.libelle}`}>
                {RANGS_TRANCHES.map((rang) => (
                    <li key={rang} className="hemicycle-echelle__item">
                        <span className="hemicycle-legend__dot" style={{ background: COULEURS_TRANCHES[rang] }} aria-hidden="true" />
                        <span>{bornes[rang]}</span>
                        <span className="hemicycle-legend__count">{NOMS_TRANCHES[rang]} · {echelle.comptes[rang]}</span>
                    </li>
                ))}
                {echelle.sansDonnee > 0 && (
                    <li className="hemicycle-echelle__item">
                        <span className="hemicycle-legend__dot" style={{ background: COULEUR_SANS_DONNEE }} aria-hidden="true" />
                        <span>Pas de donnée</span>
                        <span className="hemicycle-legend__count">{echelle.sansDonnee}</span>
                    </li>
                )}
                {echelle.peuFiables > 0 && (
                    <li className="hemicycle-echelle__item">
                        <span className="hemicycle-legend__dot hemicycle-seat--peu-fiable" style={{ background: COULEUR_SANS_DONNEE }} aria-hidden="true" />
                        <span>Hachuré : moins de {SEUIL_JOURS_FIABLES} jours attendus</span>
                        <span className="hemicycle-legend__count">{echelle.peuFiables}</span>
                    </li>
                )}
            </ul>
            <p className="text-sm text-subtitle-accent">
                Couleurs relatives : chaque couleur réunit environ un quart des députés qui siègent (quartiles de la
                législature). Les taux sont des estimations tirées des données ouvertes de l&apos;Assemblée, pas un pointage.
                Survole un siège pour voir le député et sa valeur.
            </p>
        </div>
    );
}
