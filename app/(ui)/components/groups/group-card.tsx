import Link from "next/link";
import React from "react";
import {GroupTheme} from "@/app/(ui)/theme/parliament-groups/group-theme.types";
import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {CardBody, CardContainer, CardItem} from "@/app/(ui)/component-library/external/3d-card/3d-card";
import {CardHoloOverlay} from "@/app/(ui)/components/holo-effect/card-holo-overlay";

export type GroupCardProps = {
    code: string;
    libelle?: string;
    nbMembers?: number;
    president?: string;
    sexPresidentType?: string;
    position?: string;
    href?: string;
    theme?: GroupTheme;
};

export const GroupCard: React.FC<GroupCardProps> = (props) => {
    if (!props.theme) return null;

    const bg = props.theme.badgeBg;

    const content = (
        <CardContainer className="w-full" containerClassName="w-full">
            <CardBody className="card-holo-host relative flex w-full min-h-70 flex-col rounded-xl">
                <CardHoloOverlay/>
                <div className="relative flex min-h-70 flex-col rounded-xl transform-3d">
                    <div
                        className="flex flex-col items-center relative min-h-27.5 rounded-t-xl px-4 pt-4 pb-8 transform-3d"
                        style={{
                            background: `${bg}`,
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                            <img
                                src="/assets/imgs/ASS.svg"
                                alt=""
                                aria-hidden="true"
                                className="h-60 w-60 object-contain opacity-[0.25]"
                            />
                        </div>

                        <CardItem
                            translateZ={30}
                            className="absolute top-2.5 left-3 text-[12px] font-bold tracking-widest uppercase text-white/70"
                        >
                            {props.code}
                        </CardItem>

                        <CardItem
                            translateZ={30}
                            className="absolute top-2.5 right-3 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-white/85"
                        >
                            {props.nbMembers} membres
                        </CardItem>
                    </div>

                    <div className="pointer-events-none absolute top-16 left-1/2 z-20 -translate-x-1/2 transform-3d">
                        <CardItem
                            translateZ={70}
                            rotateX={4}
                            className="pointer-events-auto flex items-center justify-center overflow-hidden h-20 w-20
                            rounded-[14px] border-[2.5px] border-white/95 bg-white
                            shadow-[0_4px_16px_rgba(0,0,0,0.38)]"
                        >
                            <img
                                src={`/tribun/17/logos_groupes/${props.code}.png`}
                                alt={props.libelle}
                                className="h-16.5 w-16.5 object-contain"
                            />
                        </CardItem>
                    </div>

                    <div className="flex flex-1 flex-col items-center rounded-b-xl bg-[#13131f] px-4 pt-12 pb-4 text-center transform-3d">
                        <CardItem translateZ={38} className="w-full">
                            <h2 className="flex items-center justify-center min-h-9 text-[13px] text-[#eef0f8]">
                                {props.libelle}
                            </h2>
                        </CardItem>

                        {props.president && props.sexPresidentType && (
                            <CardItem translateZ={26} className="w-full">
                                <p className="mt-1 text-[10.5px] text-[#eef0f8]">
                                    {props.sexPresidentType} groupe : {props.president}
                                </p>
                            </CardItem>
                        )}

                        {props.position && (
                            <CardItem translateZ={40} className="mt-auto pt-3">
                                <BadgeLib
                                    text={props.position}
                                    style={{
                                        backgroundColor: `${bg}24`,
                                        color: bg,
                                        border: `1px solid ${bg}50`,
                                    }}
                                />
                            </CardItem>
                        )}
                    </div>
                </div>
            </CardBody>
        </CardContainer>
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