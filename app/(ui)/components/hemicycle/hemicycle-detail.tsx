"use client";

import React from "react";
import Link from "next/link";
import { HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { GroupMiniCardLib } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { formatTaux, majoriteAbsolue } from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";

type HemicycleDetailProps = {
    /** Groupes sélectionnés : aucun = total ; un = sa carte ; plusieurs = la coalition. */
    groupes: HemicycleGroupe[];
    total: number;
    /** Mode coalition : panneau coalition dès le premier groupe, et invite tant qu'aucun n'est choisi. */
    coalition?: boolean;
    onClearAction?: () => void;
};

/**
 * Coalition : sièges cumulés, part de l'hémicycle et écart à la majorité
 * absolue (calculée sur les sièges pourvus affichés). Barre segmentée par
 * groupe, avec le seuil de majorité ; le texte porte toute l'information.
 */
function Coalition({ groupes, total, onClearAction }: { groupes: HemicycleGroupe[]; total: number; onClearAction?: () => void }) {
    const sieges = groupes.reduce((somme, g) => somme + g.count, 0);
    const majorite = majoriteAbsolue(total);
    const ecart = sieges - majorite;
    const part = (n: number) => (total > 0 ? (n / total) * 100 : 0);

    return (
        <div className="hemicycle-coalition">
            <span className="hemicycle-detail__big">{sieges} sièges</span>
            <span className="font-semibold">Coalition {groupes.map((g) => g.shortLabel).join(" + ")}</span>
            <span className="text-sm text-subtitle-accent">{formatTaux(part(sieges))} des {total} sièges pourvus</span>

            <div className="hemicycle-coalition__barre" aria-hidden="true">
                {groupes.map((g) => {
                    const theme = getGroupCardTheme(getCanonicalGroupCode(g.code));
                    return (
                        <span
                            key={g.code}
                            className="hemicycle-coalition__part"
                            style={{ width: `${part(g.count)}%`, background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})` }}
                        />
                    );
                })}
                <span className="hemicycle-coalition__seuil" style={{ left: `${part(majorite)}%` }} />
            </div>

            <span className={`text-sm font-semibold ${ecart >= 0 ? "hemicycle-coalition__statut--atteinte" : ""}`}>
                {ecart >= 0
                    ? `Majorité absolue atteinte : ${majorite} sièges requis, ${ecart} de plus.`
                    : `Majorité absolue : ${majorite} sièges requis, il en manque ${-ecart}.`}
            </span>

            {onClearAction && (
                <div className="mt-2 self-start">
                    <ButtonLib text="Effacer la sélection" variant="secondary" size="small" onClick={onClearAction} />
                </div>
            )}
        </div>
    );
}

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

/**
 * Panneau de détail (`aria-live`) : total sans sélection, carte + effectif +
 * présidence pour un groupe, coalition pour plusieurs.
 */
export function HemicycleDetail({ groupes, total, coalition = false, onClearAction }: HemicycleDetailProps) {
    const groupe = groupes.length === 1 ? groupes[0] : null;
    return (
        <div className="hemicycle-detail" aria-live="polite">
            {coalition && groupes.length === 0 ? (
                <div>
                    <span className="hemicycle-detail__big">Mode coalition</span>
                    <p className="text-subtitle-accent max-w-sm mt-2">
                        Choisis les groupes de la coalition : leurs sièges s&apos;additionnent et se comparent à la
                        majorité absolue ({majoriteAbsolue(total)} sièges sur {total}).
                    </p>
                </div>
            ) : groupes.length > 1 || (coalition && groupes.length > 0) ? (
                <Coalition groupes={groupes} total={total} onClearAction={onClearAction} />
            ) : groupe ? (
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
                        voir sa carte, son effectif et sa présidence, ou active le mode coalition pour en réunir
                        plusieurs.
                    </p>
                </div>
            )}
        </div>
    );
}
