"use client";

import React, { useEffect, useRef, useState } from "react";

export type ScrollProgressSection = {
    /** id de l'élément de la page qui commence la section. */
    id: string;
    /** Libellé (au survol, et brièvement pendant le défilement). */
    label: string;
};

export type ScrollProgressLibProps = {
    sections: ScrollProgressSection[];
    ariaLabel?: string;
    /** Collée au bord droit de l'écran (par défaut, masquée sur écran tactile : la barre
     *  native du navigateur suffit) ; `false` : dans le flux (démo). */
    fixed?: boolean;
    className?: string;
};

const borner = (n: number) => Math.min(Math.max(n, 0), 1);

/** Part de la page déjà défilée, de 0 (en haut) à 1 (tout en bas). */
export function progressionDefilement(scrollY: number, maxScroll: number): number {
    return maxScroll > 0 ? borner(scrollY / maxScroll) : 0;
}

/** Position de chaque section sur la barre (0 à 1) : la part de défilement où elle arrive en haut de l'écran. */
export function positionsSections(tops: number[], maxScroll: number): number[] {
    return tops.map((top) => (maxScroll > 0 ? borner(top / maxScroll) : 0));
}

/** Section active : la dernière dont le début a passé le repère (milieu de l'écran). */
export function indexSectionActive(tops: number[], repere: number): number {
    let active = 0;
    tops.forEach((top, i) => { if (top <= repere) active = i; });
    return active;
}

const memes = (a: number[] | null, b: number[]) =>
    a !== null && a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.001);

/**
 * Barre de défilement verticale : son remplissage suit la position de la vue
 * dans la page, et un point par section (placé là où la section arrive en haut
 * de l'écran) mène à cette section. Le libellé d'une section apparaît au survol,
 * au focus, et celui de la section courante pendant le défilement.
 * Sans JavaScript, les points restent des ancres.
 */
export function ScrollProgressLib({ sections, ariaLabel = "Progression dans la page", fixed = true, className = "" }: ScrollProgressLibProps) {
    const racine = useRef<HTMLElement>(null);
    const [positions, setPositions] = useState<number[] | null>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let frame = 0;
        let fin: ReturnType<typeof setTimeout> | undefined;

        const mesurer = () => {
            frame = 0;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const tops = sections.map(({ id }) => {
                const el = document.getElementById(id);
                return el ? el.getBoundingClientRect().top + window.scrollY : 0;
            });
            // Variable CSS posée directement : pas de rendu React à chaque image.
            racine.current?.style.setProperty("--scroll-progress", String(progressionDefilement(window.scrollY, maxScroll)));
            const suivantes = positionsSections(tops, maxScroll);
            setPositions((avant) => (memes(avant, suivantes) ? avant : suivantes));
            setActive(indexSectionActive(tops, window.scrollY + window.innerHeight / 2));
        };
        const planifier = () => { if (!frame) frame = requestAnimationFrame(mesurer); };
        const auDefilement = () => {
            planifier();
            racine.current?.classList.add("is-scrolling");
            clearTimeout(fin);
            fin = setTimeout(() => racine.current?.classList.remove("is-scrolling"), 1200);
        };

        mesurer();
        window.addEventListener("scroll", auDefilement, { passive: true });
        window.addEventListener("resize", planifier);
        // Contenu chargé après coup (images, tuiles) : la page change de hauteur.
        const observateur = typeof ResizeObserver !== "undefined" ? new ResizeObserver(planifier) : null;
        observateur?.observe(document.body);

        return () => {
            window.removeEventListener("scroll", auDefilement);
            window.removeEventListener("resize", planifier);
            observateur?.disconnect();
            cancelAnimationFrame(frame);
            clearTimeout(fin);
        };
    }, [sections]);

    const aller = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        const element = document.getElementById(id);
        if (!element) return;
        e.preventDefault();
        const reduit = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        element.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
    };

    const dernier = Math.max(sections.length - 1, 1);

    return (
        <nav ref={racine} className={`scroll-progress-lib${fixed ? " scroll-progress-lib--fixed" : ""} ${className}`} aria-label={ariaLabel}>
            <span className="scroll-progress-lib__track" aria-hidden="true">
                <span className="scroll-progress-lib__fill" />
            </span>
            <ol className="scroll-progress-lib__steps">
                {sections.map(({ id, label }, i) => (
                    <li
                        key={id}
                        className="scroll-progress-lib__step"
                        // Avant la première mesure : points répartis régulièrement.
                        style={{ "--step-position": positions?.[i] ?? i / dernier } as React.CSSProperties}
                    >
                        <a
                            href={`#${id}`}
                            onClick={aller(id)}
                            aria-current={i === active ? "location" : undefined}
                            className={`scroll-progress-lib__dot${i === active ? " is-active" : ""}${i < active ? " is-past" : ""}`}
                        >
                            <span className="scroll-progress-lib__label">{label}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
