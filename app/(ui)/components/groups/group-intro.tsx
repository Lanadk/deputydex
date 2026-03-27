"use client";

import React from "react";

export const GroupIntro: React.FC = () => {
    return (
        <div className="flex h-full w-full flex-col rounded-xl border border-main bg-surface-1 p-5 shadow-sm">
            <p className="text-sm font-semibold text-main">
                Comprendre les groupes politiques
            </p>

            <p className="mt-2 text-sm leading-6 text-subtitle-accent">
                Un parti politique est un groupe de personnes possédant des idées politiques communes
                réunies en association.
                Il peut chercher à influencer le gouvernement en place, en le soutenant si celui-ci en est
                issu, ou en s&#39;y opposant.
                Il nomme également ses propres candidats aux différentes élections et en tentant
                d&#39;obtenir des mandats politiques.
                Un parti politique peut aussi influencer l&#39;opinion publique. Il peut être présent au
                Parlement.
            </p>

            <p className="mt-3 text-sm leading-6 text-subtitle-accent">
                Plus généralement, la notion de parti politique possède deux définitions.
            </p>

            <p className="mt-3 text-sm leading-6 text-subtitle-accent">
                La première, d&#39;ordre idéologique, est presque synonyme de faction : il s&#39;agit, pour
                reprendre les termes de Benjamin Constant,
                d&#39;une « réunion d&#39;hommes qui professent la même doctrine politique ».
            </p>

            <p className="mt-3 text-sm leading-6 text-subtitle-accent">
                La seconde, d&#39;ordre institutionnel, le tient pour un élément essentiel du jeu
                démocratique :
                « elle consiste à saisir le parti politique en tant que forme politique, structure
                d&#39;organisation de la démocratie ».
            </p>
        </div>
    );
};