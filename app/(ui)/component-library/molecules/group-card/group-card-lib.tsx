import Link from "next/link";
import React from "react";
import { GroupTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.types";
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

    const bg = props.theme.badgeBg;
    const bgDeep = props.theme.badgeBgDeep ?? props.theme.badgeBg;

    const content = (
        <article
            className="group-card-lib"
            style={
                {
                    "--group-card-accent": bg,
                    "--group-card-accent-deep": bgDeep,
                } as React.CSSProperties
            }
        >
            <div className="group-card-lib__inner">
                <div className="group-card-lib__top">
                    <div className="group-card-lib__texture" />

                    <span className="group-card-lib__code">{props.code}</span>

                    <span className="group-card-lib__members">
                        {props.nb_membres} membres
                    </span>

                    <div className="group-card-lib__logo badge-logo-wrap">
                        <img
                            src={`/tribun/17/logos_groupes/${props.code}.png`}
                            alt={props.libelle}
                            className="group-card-lib__logo-img"
                        />
                    </div>
                </div>

                <div className="group-card-lib__bottom">
                    <h2 className="group-card-lib__title">{props.libelle}</h2>

                    {props.president && (
                        <p className="group-card-lib__president">
                            Président : {props.president}
                        </p>
                    )}

                    {props.position && (
                        <div className="group-card-lib__badge">
                            <BadgeLib
                                text={props.position}
                                style={{
                                    backgroundColor: `${bg}24`,
                                    color: bg,
                                    border: `1px solid ${bg}50`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );

    if (props.href) {
        return (
            <Link href={props.href} className="group-card-lib__link">
                {content}
            </Link>
        );
    }

    return content;
};