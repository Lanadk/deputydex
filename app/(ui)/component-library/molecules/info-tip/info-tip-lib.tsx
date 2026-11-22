"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";

export type InfoTipLibProps = {
    /** Contenu de la bulle (définition, explication…). */
    children: React.ReactNode;
    /** Texte affiché avant l'icône ; absent : l'icône seule. */
    label?: React.ReactNode;
    /** Nom accessible du bouton ; par défaut « Plus d'informations », ou « Définition : … » si `subject` est donné. */
    ariaLabel?: string;
    /** Ce que la bulle explique (ex. « Questure »), pour le nom accessible du bouton. */
    subject?: string;
    /** Côté d'ancrage de la bulle : `start` (déborde à droite) ou `end` (déborde à gauche). */
    align?: "start" | "end";
    className?: string;
};

/**
 * Icône « i » qui ouvre une bulle d'information au clic (ou Entrée / Espace).
 * La bulle se ferme au second clic, avec Échap (le focus revient au bouton) ou
 * en cliquant ailleurs. Le contenu est libre : texte, lien, liste…
 */
export function InfoTipLib({ children, label, ariaLabel, subject, align = "start", className }: InfoTipLibProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const bubbleId = useId();

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const name = ariaLabel ?? (subject ? `Définition : ${subject}` : "Plus d'informations");

    return (
        <span ref={rootRef} className={`info-tip-lib${className ? ` ${className}` : ""}`}>
            {label !== undefined && <span className="info-tip-lib__label">{label}</span>}
            <button
                ref={buttonRef}
                type="button"
                className="info-tip-lib__button"
                aria-label={name}
                aria-expanded={open}
                aria-controls={open ? bubbleId : undefined}
                onClick={() => setOpen((o) => !o)}
            >
                <Info size={14} aria-hidden="true" />
            </button>
            {open && (
                <span id={bubbleId} role="note" className={`info-tip-lib__bubble info-tip-lib__bubble--${align}`}>
                    {children}
                </span>
            )}
        </span>
    );
}
