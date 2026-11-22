"use client";

import React from "react";
import { InfoTipLib } from "@/app/(ui)/component-library/molecules/info-tip/info-tip-lib";

const CODE_ICONE = `<p>
  Questure <InfoTipLib subject="Questure">Les questeurs gèrent le budget de l'Assemblée.</InfoTipLib>
</p>`;

const CODE_LABEL = `<InfoTipLib label="Qu'est-ce qu'un ministre délégué ?" subject="Ministre délégué">
  Membre du Gouvernement chargé d'une partie des attributions d'un ministre.
</InfoTipLib>`;

const CODE_RICHE = `<InfoTipLib subject="Questure" align="end">
  <span className="block">Les questeurs gèrent le budget de l'Assemblée.</span>
  <span className="mt-1 block text-xs text-subtitle-accent">Source : Règlement, art. 15</span>
</InfoTipLib>`;

export const getInfoTipSections = () => [
    {
        title: "Icône seule, à côté d'un intitulé (clic ou Entrée : ouvre ; Échap ou clic ailleurs : ferme)",
        code: CODE_ICONE,
        component: (
            <p className="text-sm">
                Questure <InfoTipLib subject="Questure">Les questeurs gèrent le budget et les services administratifs de l&apos;Assemblée.</InfoTipLib>
            </p>
        ),
    },
    {
        title: "Avec un texte avant l'icône (label)",
        code: CODE_LABEL,
        component: (
            <InfoTipLib label="Qu'est-ce qu'un ministre délégué ?" subject="Ministre délégué">
                Membre du Gouvernement chargé d&apos;une partie des attributions d&apos;un ministre.
            </InfoTipLib>
        ),
    },
    {
        title: "Contenu libre (définition + source) et bulle ancrée à droite (align=\"end\")",
        code: CODE_RICHE,
        component: (
            <div className="flex justify-end">
                <InfoTipLib subject="Questure" align="end">
                    <span className="block">Les questeurs gèrent le budget et les services administratifs de l&apos;Assemblée.</span>
                    <span className="mt-1 block text-xs text-subtitle-accent">Source : Règlement de l&apos;Assemblée nationale, art. 15</span>
                </InfoTipLib>
            </div>
        ),
    },
];
