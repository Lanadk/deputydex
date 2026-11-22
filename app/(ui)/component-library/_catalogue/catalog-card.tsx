"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export type ComponentPreview = {
    /** Rendu réel du composant, monté seulement pendant le survol. */
    render: () => React.ReactNode;
    /**
     * Largeur (px) à laquelle le composant est rendu. L'aperçu prend cette
     * largeur (au moins MIN_PANEL_WIDTH) et ne réduit le composant que si
     * l'écran est trop étroit.
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
// ouvrir une fenêtre par carte traversée.
const OPEN_DELAY_MS = 250;
const DEFAULT_RENDER_WIDTH = 800;
const MIN_PANEL_WIDTH = 560;
// Marges autour de l'aperçu, et hauteur de son en-tête.
const SCREEN_MARGIN = 48;
const HEADER_HEIGHT = 46;

/** Rend le composant à sa largeur, réduit seulement s'il ne tient pas dans l'écran. */
function PreviewPanel({ name, preview }: { name: string; preview: ComponentPreview }) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    const renderWidth = Math.max(preview.width ?? DEFAULT_RENDER_WIDTH, MIN_PANEL_WIDTH);
    const availableWidth = window.innerWidth - 2 * SCREEN_MARGIN;
    const maxViewportHeight = window.innerHeight * 0.85 - HEADER_HEIGHT;
    const scale = Math.min(1, availableWidth / renderWidth);

    // La hauteur suit celle du composant (graphiques et tableaux se
    // dimensionnent après le montage, d'où le ResizeObserver).
    useLayoutEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const measure = () => setContentHeight(el.offsetHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const scaledHeight = contentHeight === null ? maxViewportHeight : contentHeight * scale;
    const overflows = scaledHeight > maxViewportHeight;

    return (
        <>
            <div className="lib-catalog-backdrop" aria-hidden="true" />
            <div className="lib-catalog-preview" style={{ width: renderWidth * scale }} aria-hidden="true">
                <div className="lib-catalog-preview__header">
                    <SpanLib>Aperçu</SpanLib>
                    <SpanLib className="lib-catalog-preview__name">{name}</SpanLib>
                </div>
                <div
                    className={`lib-catalog-preview__viewport ${overflows ? "lib-catalog-preview__viewport--fade" : ""}`}
                    style={{ height: Math.ceil(Math.min(scaledHeight, maxViewportHeight)) }}
                >
                    {/* inert : l'aperçu ne capte ni le focus ni les clics. */}
                    <div
                        ref={stageRef}
                        className="lib-catalog-preview__stage"
                        style={{ width: renderWidth, transform: `scale(${scale})` }}
                        inert
                    >
                        {preview.render()}
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Carte du catalogue de la component-library. Au survol (ou au focus clavier),
 * affiche au centre de l'écran un grand aperçu du composant réel, non interactif,
 * sur un voile flouté. L'aperçu se ferme dès que la souris quitte la carte.
 */
export function CatalogCard({ name, description, path, preview }: CatalogCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

    const open = () => {
        if (!preview) return;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setIsOpen(true), OPEN_DELAY_MS);
    };

    const close = () => {
        if (timer.current) clearTimeout(timer.current);
        setIsOpen(false);
    };

    return (
        <div className="h-full" onMouseEnter={open} onMouseLeave={close}>
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

            {/* Portail vers <body> : l'aperçu se centre sur l'écran sans dépendre
                des parents (un parent avec `transform` décalerait un `position: fixed`). */}
            {isOpen && preview && createPortal(<PreviewPanel name={name} preview={preview} />, document.body)}
        </div>
    );
}
