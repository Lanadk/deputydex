"use client";

import React from "react";
import Link from "next/link";
import { HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { GroupMiniCardLib } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

type HemicycleDetailProps = {
    groupe: HemicycleGroupe | null;
    total: number;
};

export function hemicycleDeputesHref(code: string): string {
    return `/deputydex?groupe=${encodeURIComponent(code)}`;
}

/**
 * Carte du groupe sélectionné : la carte du président·e — même `DeputyCard`
 * que dans /deputydex, cliquable vers sa fiche — ou, à défaut (non-inscrits,
 * président·e introuvable parmi les membres), la mini-carte décorative du groupe.
 */
function GroupeCard({ groupe }: { groupe: HemicycleGroupe }) {
    if (groupe.president) {
        return (
            <div className="hemicycle-detail__card">
                <DeputyCard
                    uid={groupe.president.deputeUID}
                    nom={groupe.president.deputeFullName}
                    groupe={groupe.president.deputeGroupeCode}
                    image={groupe.president.deputeImage}
                    role={groupe.presidentRole ?? undefined}
                />
            </div>
        );
    }

    return (
        <div aria-hidden="true">
            <GroupMiniCardLib
                size="md"
                theme={getGroupCardTheme(getCanonicalGroupCode(groupe.code))}
                chip={groupe.shortLabel}
                name={groupe.presidentFullName ?? groupe.label}
                subtitle={groupe.presidentFullName ? groupe.label : undefined}
            />
        </div>
    );
}

/** Panneau de détail (`aria-live`) : total sans sélection, carte + effectif + présidence sinon. */
export function HemicycleDetail({ groupe, total }: HemicycleDetailProps) {
    return (
        <div className="hemicycle-detail" aria-live="polite">
            {groupe ? (
                <>
                    <GroupeCard key={groupe.code} groupe={groupe} />
                    <div className="flex flex-col gap-1">
                        <span className="hemicycle-detail__big">{groupe.count} sièges</span>
                        <span className="font-semibold">{groupe.label}</span>
                        {groupe.presidence && (
                            <span className="text-sm text-subtitle-accent">{groupe.presidence}</span>
                        )}
                        <Link href={hemicycleDeputesHref(groupe.code)} className="mt-2 self-start">
                            <ButtonLib text="Voir les députés" variant="primary" />
                        </Link>
                    </div>
                </>
            ) : (
                <div>
                    <span className="hemicycle-detail__big">{total} sièges</span>
                    <p className="text-subtitle-accent max-w-sm mt-2">
                        Répartis entre les groupes parlementaires et les non-inscrits. Sélectionne un groupe pour
                        voir sa carte, son effectif et sa présidence.
                    </p>
                </div>
            )}
        </div>
    );
}
