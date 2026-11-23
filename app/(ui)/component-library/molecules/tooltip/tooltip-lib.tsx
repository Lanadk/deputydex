"use client";

import React, { cloneElement, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipLibProps = {
    /** Texte de la bulle. Vide, `null` ou `disabled` : pas de bulle, l'enfant est rendu tel quel. */
    content: React.ReactNode;
    /**
     * L'élément qui déclenche la bulle (lien, bouton…), un seul. Il reçoit les
     * écouteurs de survol / focus et `aria-describedby` pendant que la bulle est ouverte.
     */
    children: React.ReactElement<TriggerProps>;
    /** Côté où s'affiche la bulle (défaut : `top`). */
    placement?: TooltipPlacement;
    /** Délai avant l'ouverture au survol, en ms (le focus clavier ouvre tout de suite). */
    delay?: number;
    disabled?: boolean;
};

type TriggerProps = {
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    onPointerDown?: React.PointerEventHandler;
    "aria-describedby"?: string;
};

/** Écart entre le déclencheur et la bulle, en px. */
const ECART = 8;

/** Point d'ancrage de la bulle (coordonnées de l'écran) ; le CSS la décale selon le côté. */
export function ancrageTooltip(rect: Pick<DOMRect, "top" | "right" | "bottom" | "left">, placement: TooltipPlacement) {
    const milieuX = (rect.left + rect.right) / 2;
    const milieuY = (rect.top + rect.bottom) / 2;
    switch (placement) {
        case "right": return { left: rect.right + ECART, top: milieuY };
        case "left": return { left: rect.left - ECART, top: milieuY };
        case "bottom": return { left: milieuX, top: rect.bottom + ECART };
        default: return { left: milieuX, top: rect.top - ECART };
    }
}

/** Focus venu du clavier (pas d'un clic) : seul cas où le focus ouvre la bulle. */
const focusClavier = (el: Element) => {
    try {
        return el.matches(":focus-visible");
    } catch {
        return true; // sélecteur inconnu (vieux navigateur) : on montre la bulle
    }
};

/**
 * Bulle d'aide courte (libellé d'une icône, raccourci…) : au survol de la souris
 * (après `delay`) et au focus clavier. Se ferme quand la souris ou le focus s'en
 * va, avec Échap, au clic sur le déclencheur et au défilement. Rendue dans
 * `document.body` (position fixe) : jamais coupée par un parent `overflow`.
 * Pour une explication qu'on ouvre au clic, voir `InfoTipLib`.
 */
export function TooltipLib({ content, children, placement = "top", delay = 150, disabled = false }: TooltipLibProps) {
    const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
    /** Survol en attente d'ouverture (le délai court dans l'effet ci-dessous). */
    const [enAttente, setEnAttente] = useState<Element | null>(null);
    const id = useId();
    const actif = !disabled && content !== null && content !== undefined && content !== "" && content !== false;
    const ouverte = actif && position !== null;

    const fermer = () => {
        setEnAttente(null);
        setPosition(null);
    };
    const ouvrir = (cible: Element, attente: number) => {
        if (attente > 0) {
            setEnAttente(cible);
        } else {
            setEnAttente(null);
            setPosition(ancrageTooltip(cible.getBoundingClientRect(), placement));
        }
    };

    // Le nettoyage de l'effet annule le délai si la souris part avant (fermer → enAttente null).
    useEffect(() => {
        if (!enAttente) return;
        const minuteur = setTimeout(() => {
            setEnAttente(null);
            setPosition(ancrageTooltip(enAttente.getBoundingClientRect(), placement));
        }, delay);
        return () => clearTimeout(minuteur);
    }, [enAttente, delay, placement]);

    useEffect(() => {
        if (!ouverte) return;
        const masquer = () => setPosition(null);
        const auClavier = (e: KeyboardEvent) => { if (e.key === "Escape") masquer(); };
        // La bulle est en position fixe : au défilement, elle ne suivrait plus son déclencheur.
        window.addEventListener("keydown", auClavier);
        window.addEventListener("scroll", masquer, true);
        return () => {
            window.removeEventListener("keydown", auClavier);
            window.removeEventListener("scroll", masquer, true);
        };
    }, [ouverte]);

    if (!actif) {
        // Désactivée pendant qu'elle était ouverte ou en attente (ex. menu déplié au survol) :
        // on oublie tout, sinon elle réapparaîtrait seule à la réactivation.
        if (position !== null) setPosition(null);
        if (enAttente !== null) setEnAttente(null);
        return children;
    }

    const p = children.props;
    const declencheur = cloneElement(children, {
        onMouseEnter: (e: React.MouseEvent) => { p.onMouseEnter?.(e); ouvrir(e.currentTarget, delay); },
        onMouseLeave: (e: React.MouseEvent) => { p.onMouseLeave?.(e); fermer(); },
        onFocus: (e: React.FocusEvent) => { p.onFocus?.(e); if (focusClavier(e.target)) ouvrir(e.currentTarget, 0); },
        onBlur: (e: React.FocusEvent) => { p.onBlur?.(e); fermer(); },
        onPointerDown: (e: React.PointerEvent) => { p.onPointerDown?.(e); fermer(); },
        "aria-describedby": ouverte ? [p["aria-describedby"], id].filter(Boolean).join(" ") : p["aria-describedby"],
    });

    return (
        <>
            {declencheur}
            {ouverte && createPortal(
                <span
                    id={id}
                    role="tooltip"
                    className={`tooltip-lib tooltip-lib--${placement}`}
                    style={{ left: position.left, top: position.top }}
                >
                    {content}
                </span>,
                document.body
            )}
        </>
    );
}
