import Link from "next/link";
import { GroupTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.types";
import React from "react";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export type GroupCardProps = {
    code: string;
    libelle?: string;
    nb_membres?: number;
    president?: string;
    position?: string;
    href?: string;
    theme?: GroupTheme;
};

export const GroupCardLib: React.FC<GroupCardProps> = (props) => {
    if (!props.theme) return null;

    const content = (
        <article className="group-card-lib relative flex h-full min-h-72 flex-col overflow-hidden rounded-xl">
            <div
                className="absolute left-0 top-0 h-1.5 w-full"
                style={{ backgroundColor: props.theme.badgeBg }}
            />

            <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-9 text-center sm:px-6 sm:pb-6 sm:pt-10">
                <div className="mb-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border bg-surface-2 shadow-sm sm:h-28 sm:w-28">
                    <img
                        src={`/tribun/17/logos_groupes/${props.code}.png`}
                        alt={props.libelle}
                        className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                    />
                </div>

                <h2 className="flex min-h-16 items-center justify-center text-base font-semibold leading-tight sm:min-h-20 sm:text-lg">
                    {props.libelle}
                </h2>

                {props.president && (
                    <p className="mt-3 text-sm text-subtitle-accent">
                        Président : {props.president}
                    </p>
                )}

                {props.position && (
                    <div className="mt-4">
                        <BadgeLib
                            text={props.position}
                            style={{
                                backgroundColor: `${props.theme.badgeBg}20`,
                                color: props.theme.badgeBg,
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="mt-auto border-t border-main bg-surface-1 px-4 py-3 text-center text-sm text-subtitle-accent sm:px-6 sm:py-4">
                {props.nb_membres} membres
            </div>
        </article>
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