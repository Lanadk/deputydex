"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/app/(ui)/component-library/external/3d-card/3d-card";
import {getGroupCardTheme} from "@/app/lib/colors/parliament-groups/group-theme.helpers";

const HexRF = ({ cx, cy, size }: { cx: number; cy: number; size: number }) => {
    const s = size / 220;
    const tx = cx - size / 2;
    const ty = cy - size / 2;

    return (
        <g transform={`translate(${tx},${ty}) scale(${s})`}>
            <path d="M110 18 L186 62 L186 158 L110 202 L34 158 L34 62 Z" fill="none" stroke="white" strokeOpacity=".35" strokeWidth="6" />
            <path d="M110 28 L178 66 L178 154 L110 192 L42 154 L42 66 Z" fill="none" stroke="white" strokeOpacity=".12" strokeWidth="3" />
            <path d="M110 34 L171 70 L171 150 L110 186 L49 150 L49 70 Z" fill="none" stroke="white" strokeOpacity=".15" strokeWidth="2" />
            <path d="M110 44 L164 76 L164 144 L110 176 L56 144 L56 76 Z" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1" />
            <text
                x="110"
                y="132"
                fontSize="64"
                textAnchor="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="800"
                fill="white"
                fillOpacity=".35"
            >
                RF
            </text>
        </g>
    );
};

interface DeputyCardProps {
    nom: string;
    groupe: string;
    image: string;
    role?: string;
}

export default function DeputyCard({
                                       nom,
                                       groupe,
                                       image,
                                       role = "Député",
                                   }: DeputyCardProps) {
    const groupTheme = getGroupCardTheme(groupe);

    return (
        <CardContainer className="inter-var">
            <CardBody
                className="deputy-card-shell relative group/card w-full aspect-5/7 rounded-xl p-3 cursor-pointer flex flex-col justify-between"
                style={{
                    border: `4px solid ${groupTheme.border}`,
                    background: `linear-gradient(135deg, ${groupTheme.holo[0]} 0%, ${groupTheme.holo[1]} 50%, ${groupTheme.holo[2]} 100%)`,
                }}
            >
                <CardItem translateZ="0" className="absolute inset-0 w-full h-full pointer-events-none">
                    <svg viewBox="0 0 192 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <HexRF cx={96} cy={140} size={220} />
                    </svg>
                </CardItem>

                <CardItem
                    translateZ="50"
                    className="font-bold w-full text-center rounded-lg z-10 py-1 px-2"
                    style={{
                        background: `linear-gradient(90deg, ${groupTheme.bg[0]}, ${groupTheme.bg[1]}, ${groupTheme.bg[2]})`,
                        color: groupTheme.text,
                    }}
                >
                    {groupe}
                </CardItem>

                <CardItem translateZ="100" className="w-full flex-1 flex items-center justify-center py-2 z-10">
                    <div className="w-3/4 aspect-3/4">
                        <img
                            src={image}
                            alt={nom}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </CardItem>

                <CardItem translateZ={50} className="w-full text-center z-10 pb-1">
                    <p className="font-bold text-white text-xs leading-tight truncate w-full">
                        {nom}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5 truncate">
                        {role}
                    </p>
                </CardItem>
            </CardBody>
        </CardContainer>
    );
}