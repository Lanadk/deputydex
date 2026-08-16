import Link from "next/link";
import React from "react";
import {GroupTheme} from "@/app/(ui)/theme/parliament-groups/group-theme.types";

/**
 * Carte "extrême" pour un député précis (ex: le/la plus jeune, le/la plus
 * expérimenté·e) — volontairement plate (pas d'effet holo/3D comme
 * `GroupCard`/`DeputyCard`) : juste un portrait, son nom, son groupe et son
 * âge, dans le même style que les autres cartes plates de la librairie
 * (`KpiCardLib` : `border border-main rounded-lg bg-surface-2`). Un peu de
 * dynamisme au survol/clic (léger soulèvement + ombre, tassement au clic)
 * pour signaler que c'est cliquable — même esprit que les tuiles de
 * `component-library/page.tsx` (`hover:shadow-lg transition-shadow`).
 */
export type DeputeMiniCardProps = {
    uid: string;
    fullName: string;
    groupeCode: string;
    age: number;
    image?: string | null;
    href?: string;
    theme?: GroupTheme;
};

export const DeputeMiniCard: React.FC<DeputeMiniCardProps> = (props) => {
    const accent = props.theme?.badgeBg;

    const content = (
        <div className="flex h-full flex-col items-center gap-3 rounded-lg border border-main bg-surface-2 p-4 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-95 active:shadow-sm cursor-pointer">
            <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-muted"
                style={{borderColor: accent}}
            >
                {props.image ? (
                    <img
                        src={props.image}
                        alt={props.fullName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-semibold">{props.groupeCode}</span>
                )}
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold">{props.fullName}</span>
                <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={accent ? {backgroundColor: `${accent}24`, color: accent} : undefined}
                >
                    {props.groupeCode}
                </span>
                <span className="text-xs text-subtitle-accent">{props.age} ans</span>
            </div>
        </div>
    );

    if (props.href) {
        return (
            <Link href={props.href} className="block h-full">
                {content}
            </Link>
        );
    }

    return content;
};
