"use client";

import React from "react";

export const GroupIntro: React.FC = () => {
    return (
        <div className="flex h-full w-full flex-col rounded-xl border border-main bg-surface-1 p-5 shadow-sm">
            <p className="text-sm font-semibold text-main">
                Comprendre les groupes politiques
            </p>

            <p className="mt-2 text-sm leading-6 text-subtitle-accent">
                Les groupes rassemblent des députés selon leurs affinités politiques.
                Ils jouent un rôle majeur dans le fonctionnement de l’Assemblée.
                Les présidents de groupe siègent à la Conférence des présidents.
                Les commissions sont composées en proportion de l’importance numérique des groupes.
                Un groupe doit comprendre au moins quinze députés. Les groupes d’opposition et les groupes minoritaires
                (c'est à dire les groupes qui ne sont pas déclarés d'opposition, à l’exception de celui dont l’effectif est le plus nombreux)
                bénéficient de droits particuliers.
            </p>

        </div>
    );
};