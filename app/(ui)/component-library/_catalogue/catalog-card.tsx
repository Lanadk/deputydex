"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export type ComponentPreview = {
    /** Rendu réel du composant, monté seulement pendant le survol. */
    render: () => React.ReactNode;
    /**
     * Largeur (px) à laquelle le composant est rendu avant réduction dans la
     * fenêtre d'aperçu. Petit composant → petite largeur → presque taille réelle.
     */
    width?: number;
};

type CatalogCardProps = {
    name: string;
    description: string;
    path: string;
    preview?: ComponentPreview;
};

// Délai avant d'afficher l'aperçu : balayer la grille à la souris ne doit pas
// faire clignoter une fenêtre par carte traversée.
const OPEN_DELAY_MS = 180;
// Dimensions utiles de la fenêtre d'aperçu (cf. .lib-catalog-preview dans globals.css).
const VIEWPORT_WIDTH = 440;
const VIEWPORT_MAX_HEIGHT = 240;
const DEFAULT_STAGE_WIDTH = 800;

/** Rend le composant à `width` px puis le réduit pour tenir dans la fenêtre. */
function PreviewStage({ preview }: { preview: ComponentPreview }) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const width = preview.width ?? DEFAULT_STAGE_WIDTH;
    const scale = Math.min(1, VIEWPORT_WIDTH / width);

    // La hauteur de la fenêtre suit celle du composant (graphiques et tableaux
    // se dimensionnent après le montage, d'où le ResizeObserver).
    useLayoutEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const measure = () => setContentHeight(el.offsetHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const height = contentHeight === null
        ? VIEWPORT_MAX_HEIGHT
        : Math.min(VIEWPORT_MAX_HEIGHT, Math.ceil(contentHeight * scale));
    const overflows = contentHeight !== null && contentHeight * scale > VIEWPORT_MAX_HEIGHT;

    return (
        <div
            className={`lib-catalog-preview__viewport ${overflows ? "lib-catalog-preview__viewport--fade" : ""}`}
            style={{ height }}
        >
            {/* inert : l'aperçu ne capte ni le focus ni les clics. */}
            <div
                ref={stageRef}
                className="lib-catalog-preview__stage"
                style={{ width, transform: `scale(${scale})` }}
                inert
            >
                {preview.render()}
            </div>
        </div>
    );
}

/**
 * Carte du catalogue de la component-library. Au survol (ou au focus clavier),
 * affiche une fenêtre d'aperçu avec le composant réel, réduit et non interactif.
 * L'aperçu s'ouvre sous la carte, ou au-dessus si la carte est en bas de l'écran.
 */
export function CatalogCard({ name, description, path, preview }: CatalogCardProps) {
    const [placement, setPlacement] = useState<"above" | "below" | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

    const open = () => {
        if (!preview) return;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            const rect = cardRef.current?.getBoundingClientRect();
            const isLowOnScreen = !!rect && rect.top > window.innerHeight / 2;
            setPlacement(isLowOnScreen ? "above" : "below");
        }, OPEN_DELAY_MS);
    };

    const close = () => {
        if (timer.current) clearTimeout(timer.current);
        setPlacement(null);
    };

    // L'aperçu est frère du lien, pas enfant : il peut contenir des liens et
    // boutons, interdits à l'intérieur d'un <a>.
    return (
        <div ref={cardRef} className="relative h-full" onMouseEnter={open} onMouseLeave={close}>
            <Link
                href={path}
                onFocus={open}
                onBlur={close}
                className="lib-catalog-card block border border-main bg-card rounded-lg p-6"
            >
                <h3>{name}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--subtitle-accent)" }}>
                    {description}
                </p>
            </Link>

            {placement && preview && (
                <div className={`lib-catalog-preview lib-catalog-preview--${placement}`} aria-hidden="true">
                    <div className="lib-catalog-preview__header">
                        <SpanLib>Aperçu</SpanLib>
                        <SpanLib className="lib-catalog-preview__name">{name}</SpanLib>
                    </div>
                    <PreviewStage preview={preview} />
                </div>
            )}
        </div>
    );
}
