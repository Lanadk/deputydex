"use client"

import React from "react";
import { BentoGridLib, BentoTileLib } from "@/app/(ui)/component-library/molecules/bento/bento-lib";

export const BENTO_CODE = `<BentoGridLib columns={4}>
    <BentoTileLib colSpan={2} rowSpan={2} href="/scrutins">Grande tuile</BentoTileLib>
    <BentoTileLib colSpan={2}>Tuile large</BentoTileLib>
    <BentoTileLib variant="solid">Opaque</BentoTileLib>
    <BentoTileLib loading />
    <BentoTileLib colSpan={2}>Tuile large</BentoTileLib>
    <BentoTileLib>Petite</BentoTileLib>
    <BentoTileLib href="/scrutins" variant="accent">Appel à l'action</BentoTileLib>
</BentoGridLib>
`;

export const BENTO_3_CODE = `<BentoGridLib columns={3} rowMinHeight={140}>
    <BentoTileLib colSpan={2}>…</BentoTileLib>
    <BentoTileLib rowSpan={2}>…</BentoTileLib>
    <BentoTileLib>…</BentoTileLib>
    <BentoTileLib>…</BentoTileLib>
</BentoGridLib>
`;

const Contenu = ({ titre, texte }: { titre: string; texte: string }) => (
    <>
        <span className="text-xs font-bold uppercase tracking-wider text-subtitle-accent">{titre}</span>
        <span className="text-3xl font-extrabold">{texte}</span>
    </>
);

export const BENTO_FILL_CODE = `<div style={{ height: 420, display: "flex", flexDirection: "column" }}>
    <BentoGridLib columns={3} rowMinHeight={100} fill>…</BentoGridLib>
</div>
`;

export const BENTO_MOBILE_CODE = `<BentoGridLib columns={4} mobileColumns={2}>
    <BentoTileLib colSpan={2}>Pleine largeur sur mobile</BentoTileLib>
    <BentoTileLib>Demi</BentoTileLib>
    <BentoTileLib>Demi</BentoTileLib>
</BentoGridLib>
`;

export const BENTO_COLOR_CODE = `<BentoGridLib columns={3} rowMinHeight={140}>
    <BentoTileLib href="/statistics" variant="solid"
        color="var(--stat-type-blanc)" ink="var(--stat-type-blanc-ink)">…</BentoTileLib>
    <BentoTileLib href="/statistics" variant="solid"
        color="var(--stat-type-rouge)" ink="var(--stat-type-rouge-ink)">…</BentoTileLib>
    <BentoTileLib href="/statistics" variant="solid"
        color="var(--stat-type-bleu)" ink="var(--stat-type-bleu-ink)">…</BentoTileLib>
</BentoGridLib>
// Dans la tuile : var(--bento-tile-color) pour l'accent et les fonds teintés
// (color-mix), var(--bento-tile-ink) pour le texte et les icônes.
`;

export const getBentoSections = () => [
    {
        title: "Grille de 4 colonnes : tailles, lien, chargement, appel à l'action",
        code: BENTO_CODE,
        component: (
            <BentoGridLib columns={4}>
                <BentoTileLib colSpan={2} rowSpan={2} href="#"><Contenu titre="2 × 2, lien" texte="Grande tuile" /></BentoTileLib>
                <BentoTileLib colSpan={2}><Contenu titre="2 × 1" texte="Tuile large" /></BentoTileLib>
                <BentoTileLib variant="solid"><Contenu titre="1 × 1, solid" texte="Opaque" /></BentoTileLib>
                <BentoTileLib loading />
                <BentoTileLib colSpan={2}><Contenu titre="2 × 1" texte="Tuile large" /></BentoTileLib>
                <BentoTileLib><Contenu titre="1 × 1" texte="Petite" /></BentoTileLib>
                <BentoTileLib href="#" variant="accent"><span className="text-xl font-extrabold">Appel à l&apos;action →</span></BentoTileLib>
            </BentoGridLib>
        ),
    },
    {
        title: "Grille de 3 colonnes, rangées plus basses",
        code: BENTO_3_CODE,
        component: (
            <BentoGridLib columns={3} rowMinHeight={140}>
                <BentoTileLib colSpan={2}><Contenu titre="2 × 1" texte="Large" /></BentoTileLib>
                <BentoTileLib rowSpan={2}><Contenu titre="1 × 2" texte="Haute" /></BentoTileLib>
                <BentoTileLib><Contenu titre="1 × 1" texte="A" /></BentoTileLib>
                <BentoTileLib><Contenu titre="1 × 1" texte="B" /></BentoTileLib>
            </BentoGridLib>
        ),
    },
    {
        title: "fill : remplit la hauteur du conteneur (ici 420px)",
        code: BENTO_FILL_CODE,
        component: (
            <div style={{ height: 420, display: "flex", flexDirection: "column" }}>
                <BentoGridLib columns={3} rowMinHeight={100} fill>
                    <BentoTileLib colSpan={2}><Contenu titre="2 × 1" texte="Large" /></BentoTileLib>
                    <BentoTileLib rowSpan={2}><Contenu titre="1 × 2" texte="Haute" /></BentoTileLib>
                    <BentoTileLib><Contenu titre="1 × 1" texte="A" /></BentoTileLib>
                    <BentoTileLib><Contenu titre="1 × 1" texte="B" /></BentoTileLib>
                </BentoGridLib>
            </div>
        ),
    },
    {
        title: "color + ink : tuiles colorées (halo, survol teinté) ; color pour l'accent, ink pour le texte",
        code: BENTO_COLOR_CODE,
        component: (
            <BentoGridLib columns={3} rowMinHeight={140}>
                {["blanc", "rouge", "bleu"].map((type) => (
                    <BentoTileLib
                        key={type}
                        href="#"
                        variant="solid"
                        color={`var(--stat-type-${type})`}
                        ink={`var(--stat-type-${type}-ink)`}
                    >
                        <span
                            className="self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                            style={{
                                background: "color-mix(in srgb, var(--bento-tile-color) 18%, transparent)",
                                color: "var(--bento-tile-ink)",
                            }}
                        >
                            {type}
                        </span>
                        <span className="text-3xl font-extrabold">Couleur</span>
                    </BentoTileLib>
                ))}
            </BentoGridLib>
        ),
    },
    {
        title: "mobileColumns={2} : sur mobile, petites tuiles en demi-largeur (réduire la fenêtre sous 520px)",
        code: BENTO_MOBILE_CODE,
        component: (
            <div style={{ maxWidth: 400 }}>
                <BentoGridLib columns={4} mobileColumns={2}>
                    <BentoTileLib colSpan={2}><Contenu titre="2 × 1" texte="Pleine largeur" /></BentoTileLib>
                    <BentoTileLib><Contenu titre="1 × 1" texte="A" /></BentoTileLib>
                    <BentoTileLib><Contenu titre="1 × 1" texte="B" /></BentoTileLib>
                </BentoGridLib>
            </div>
        ),
    },
];
