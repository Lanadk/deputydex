import React from "react";
import { Info, MessageSquareText, TriangleAlert } from "lucide-react";

export type CalloutVariant = "note" | "info" | "warning";

const VARIANTS: Record<CalloutVariant, { label: string; color: string; Icon: typeof Info }> = {
    note: { label: "Remarque", color: "var(--subtitle-accent)", Icon: MessageSquareText },
    info: { label: "Info", color: "var(--ui-info)", Icon: Info },
    warning: { label: "Attention", color: "var(--ui-warning)", Icon: TriangleAlert },
};

export interface CalloutLibProps {
    /** `note` (Remarque, neutre), `info` (Info, bleu), `warning` (Attention, orange). */
    variant?: CalloutVariant;
    /** Titre en gras ; par défaut le libellé de la variante (« Attention »…). */
    title?: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * CalloutLib
 * Encadré statique « Remarque / Info / Attention » pour prévenir le lecteur
 * dans le corps d'une page (limite d'une donnée, approximation d'un calcul) —
 * pas une notification : rien de temporaire ni d'interactif (`role="note"`,
 * pas `alert`, qui interromprait un lecteur d'écran au chargement).
 */
export const CalloutLib: React.FC<CalloutLibProps> = ({ variant = "info", title, children, className = "" }) => {
    const { label, color, Icon } = VARIANTS[variant];

    return (
        <aside
            role="note"
            aria-label={title ?? label}
            className={`callout-lib flex gap-3 rounded-lg border border-l-4 px-4 py-3 text-sm leading-relaxed ${className}`}
            style={{
                borderColor: "var(--border-main)",
                borderLeftColor: color,
                backgroundColor: `color-mix(in srgb, ${color} 8%, var(--surface-2))`,
                color: "var(--foreground)",
            }}
        >
            {/* Boîte de la hauteur d'UNE ligne de texte (1.625em = leading-relaxed, posé
                sur l'encadré) : l'icône est centrée sur la ligne du titre, quelle que soit la taille de police. */}
            <span className="flex h-[1.625em] shrink-0 items-center" aria-hidden="true">
                <Icon className="h-4 w-4" style={{ color }} />
            </span>
            <div className="flex flex-col gap-1">
                <p className="m-0 font-semibold">{title ?? label}</p>
                <div className="flex flex-col gap-1">{children}</div>
            </div>
        </aside>
    );
};
