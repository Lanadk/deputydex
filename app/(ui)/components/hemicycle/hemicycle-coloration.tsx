"use client";

import React from "react";
import {
    bornesTranches,
    COULEUR_SANS_DONNEE,
    COULEURS_TRANCHES,
    EchelleHemicycle,
    IndicateurHemicycle,
    NOMS_TRANCHES,
    RANGS_TRANCHES,
    SEUIL_JOURS_FIABLES,
    themeDe,
    THEMES_HEMICYCLE,
} from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";

/**
 * Deux modes d'affichage distincts :
 * - `groupes` : sièges aux couleurs des groupes ; un groupe sélectionné à la fois,
 *   ou plusieurs en « mode coalition » (calcul de la coalition) ;
 * - `stats` : sièges colorés par un indicateur de chaque député (la sélection d'un
 *   groupe ne sert qu'à le mettre en relief).
 */
export type ModeHemicycle = "groupes" | "stats";

const MODES: { id: ModeHemicycle; label: string }[] = [
    { id: "groupes", label: "Groupes" },
    { id: "stats", label: "Statistiques par député" },
];

/**
 * Bascule entre les deux modes ; en mode groupes, le bouton « Mode coalition »
 * (sélection de plusieurs groupes) ; en mode statistiques, le choix de l'indicateur.
 */
export function HemicycleModeChoix({
    mode,
    coalition,
    indicateurId,
    onModeChangeAction,
    onCoalitionChangeAction,
    onIndicateurChangeAction,
}: {
    mode: ModeHemicycle;
    coalition: boolean;
    indicateurId: string;
    onModeChangeAction: (mode: ModeHemicycle) => void;
    onCoalitionChangeAction: (coalition: boolean) => void;
    onIndicateurChangeAction: (id: string) => void;
}) {
    const theme = themeDe(indicateurId);
    return (
        <div className="hemicycle-coloration">
            <div className="hemicycle-mode" role="group" aria-label="Affichage de l'hémicycle">
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        className="hemicycle-mode__btn"
                        aria-pressed={mode === m.id}
                        onClick={() => onModeChangeAction(m.id)}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            {mode === "groupes" && (
                <div className="hemicycle-coloration__indicateurs">
                    <PuceChoix label="Mode coalition" actif={coalition} onClick={() => onCoalitionChangeAction(!coalition)} />
                    <span className="text-sm text-subtitle-accent">
                        {coalition
                            ? "Sélectionne plusieurs groupes : leurs sièges s'additionnent face à la majorité absolue."
                            : "Active-le pour sélectionner plusieurs groupes et mesurer une coalition."}
                    </span>
                </div>
            )}

            {mode === "stats" && (
                <>
                    {/* Thème : choisir un thème affiche son premier indicateur. */}
                    <div className="hemicycle-coloration__indicateurs" role="group" aria-label="Thème">
                        <span className="hemicycle-coloration__titre">Thème</span>
                        {THEMES_HEMICYCLE.map((t) => (
                            <PuceChoix
                                key={t.id}
                                label={t.label}
                                actif={t.id === theme.id}
                                onClick={() => onIndicateurChangeAction(t.indicateurs[0].id)}
                            />
                        ))}
                    </div>
                    <div className="hemicycle-coloration__indicateurs" role="group" aria-label={`Indicateur : ${theme.label}`}>
                        <span className="hemicycle-coloration__titre">{theme.label}</span>
                        {theme.indicateurs.map((indicateur) => (
                            <PuceChoix
                                key={indicateur.id}
                                label={indicateur.label}
                                actif={indicateurId === indicateur.id}
                                onClick={() => onIndicateurChangeAction(indicateur.id)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function PuceChoix({ label, actif, onClick }: { label: string; actif: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            className="hemicycle-legend__btn"
            aria-pressed={actif}
            style={{ "--group-color": "var(--accent)" } as React.CSSProperties}
            onClick={onClick}
        >
            {label}
        </button>
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
