"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export type ScrollHintLibProps = {
    /** id de l'élément vers lequel défiler. */
    target: string;
    /** Libellé (ex. « Défiler pour l'actu »). */
    label: string;
    className?: string;
};

/**
 * Invitation à faire défiler : souris dont la molette descend, libellé,
 * chevron qui rebondit. C'est un lien vers `#target` : au clic, défilement
 * doux jusqu'à la cible (instantané si l'utilisateur refuse les animations ;
 * sans JavaScript, l'ancre fonctionne quand même). Animations coupées avec
 * `prefers-reduced-motion`.
 */
export function ScrollHintLib({ target, label, className = "" }: ScrollHintLibProps) {
    const defiler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const element = document.getElementById(target);
        if (!element) return;
        e.preventDefault();
        const reduit = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        element.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    };

    return (
        <a href={`#${target}`} className={`scroll-hint-lib ${className}`} onClick={defiler}>
            <span className="scroll-hint-lib__souris" aria-hidden="true">
                <span className="scroll-hint-lib__molette" />
            </span>
            <span className="scroll-hint-lib__texte">{label}</span>
            <ChevronDown className="scroll-hint-lib__chevron" size={18} aria-hidden="true" />
        </a>
    );
}
