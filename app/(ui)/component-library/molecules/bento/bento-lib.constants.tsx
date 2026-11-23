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
];
