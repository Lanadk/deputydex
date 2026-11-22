"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export const DEFAULT_ERROR_MESSAGE = "Impossible de charger ces données pour le moment.";

export type ErrorStateLibProps = {
    /** Ce qui n'a pas pu être chargé (par défaut : message générique). */
    message?: string;
    /** Relance le chargement ; sans elle, pas de bouton. */
    onRetry?: () => void;
    /** Libellé du bouton (par défaut « Réessayer »). */
    retryLabel?: string;
    className?: string;
};

/**
 * Erreur de chargement en ligne (section, liste, en-tête) : message et bouton
 * « Réessayer ». À distinguer du chargement (SpinnerLib) et de l'état vide
 * (« Aucun résultat ») ; pour une page entière, voir PageStateLib.
 */
export function ErrorStateLib({
    message = DEFAULT_ERROR_MESSAGE,
    onRetry,
    retryLabel = "Réessayer",
    className = "",
}: ErrorStateLibProps) {
    return (
        <div
            role="alert"
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-main bg-surface-2 p-8 text-center ${className}`}
        >
            <SpanLib className="text-subtitle-accent">{message}</SpanLib>
            {onRetry && <ButtonLib text={retryLabel} size="small" variant="tertiary" onClick={onRetry} />}
        </div>
    );
}
