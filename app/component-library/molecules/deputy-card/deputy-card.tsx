"use client";

import React from "react";
import {CardBody, CardContainer, CardItem} from "@/app/component-library/external/3d-card";

//TODO change this a static lib + link this to badge component colors
const PARTI_THEMES: Record<string, {
    bg: [string, string, string];
    text: string;
    border: string;
    holo: [string, string, string]
}> = {
    "RN": {
        bg: ["#003189", "#003189", "#003189"],
        text: "#ffffff",
        border: "#003189",
        holo: ["#001a4d", "#003189", "#001a4d"]
    },
    "LFI": {
        bg: ["#cc0000", "#ff0000", "#cc0000"],
        text: "#ffffff",
        border: "#ff0000",
        holo: ["#1a0000", "#3d0000", "#1a0000"]
    },
    "PS": {
        bg: ["#ff69b4", "#e91e8c", "#ff69b4"],
        text: "#ffffff",
        border: "#e91e8c",
        holo: ["#1a0011", "#3d0029", "#1a0011"]
    },
    "LR": {
        bg: ["#0066cc", "#003f8a", "#0066cc"],
        text: "#ffffff",
        border: "#0066cc",
        holo: ["#001433", "#003f8a", "#001433"]
    },
    "RE": {
        bg: ["#ffbe00", "#ff9400", "#ffbe00"],
        text: "#1a1a1a",
        border: "#ff9400",
        holo: ["#1a0e00", "#3d2200", "#1a0e00"]
    },
    "EELV": {
        bg: ["#2d9b2d", "#1a7a1a", "#2d9b2d"],
        text: "#ffffff",
        border: "#2d9b2d",
        holo: ["#001a00", "#0d330d", "#001a00"]
    },
    "PCF": {
        bg: ["#cc0000", "#8b0000", "#cc0000"],
        text: "#ffffff",
        border: "#cc0000",
        holo: ["#1a0000", "#2d0000", "#1a0000"]
    },
    "UDI": {
        bg: ["#00a0e3", "#0077b6", "#00a0e3"],
        text: "#ffffff",
        border: "#00a0e3",
        holo: ["#001a26", "#003347", "#001a26"]
    },
    "MODEM": {
        bg: ["#ff8c00", "#cc6600", "#ff8c00"],
        text: "#ffffff",
        border: "#ff8c00",
        holo: ["#1a0900", "#331200", "#1a0900"]
    },
    "HOR": {
        bg: ["#00b4d8", "#0077b6", "#00b4d8"],
        text: "#ffffff",
        border: "#00b4d8",
        holo: ["#001a26", "#003347", "#001a26"]
    },
    "DEFAULT": {
        bg: ["#a82028", "#ffde00", "#2b5aa6"],
        text: "#ffffff",
        border: "#ffde00",
        holo: ["#0d1a2e", "#152238", "#0d1a2e"]
    },
};

/* Motif hexagone + RF exact, centré sur cx/cy, taille size */
const HexRF = ({ cx, cy, size }: { cx: number; cy: number; size: number }) => {
    const s = size / 220;
    const tx = cx - size / 2;
    const ty = cy - size / 2;
    return (
        <g transform={"translate(" + tx + "," + ty + ") scale(" + s + ")"}>
            <path d="M110 18 L186 62 L186 158 L110 202 L34 158 L34 62 Z" fill="none" stroke="white" strokeOpacity=".35" strokeWidth="6"/>
            <path d="M110 28 L178 66 L178 154 L110 192 L42 154 L42 66 Z" fill="none" stroke="white" strokeOpacity=".12" strokeWidth="3"/>
            <path d="M110 34 L171 70 L171 150 L110 186 L49 150 L49 70 Z" fill="none" stroke="white" strokeOpacity=".15" strokeWidth="2"/>
            <path d="M110 44 L164 76 L164 144 L110 176 L56 144 L56 76 Z" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1"/>
            <text x="110" y="132" fontSize="64" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fill="white" fillOpacity=".35">RF</text>
        </g>
    );
};

const getPartiTheme = (parti: string) =>
    PARTI_THEMES[parti.toUpperCase()] ?? PARTI_THEMES["DEFAULT"];

interface DeputyCardProps {
    nom: string;
    parti: string;
    image: string;
    role: string;
}

export default function DeputyCard({nom, parti, image, role = "Député" }: DeputyCardProps) {
    const partiTheme = getPartiTheme(parti);

    return (
        <CardContainer className="inter-var">
            <CardBody
                className="deputy-card-shell relative group/card w-full aspect-5/7 rounded-xl p-3 cursor-pointer flex flex-col justify-between"
                style={{
                    border: `4px solid ${partiTheme.border}`,
                    background: `linear-gradient(135deg, ${partiTheme.holo[0]} 0%, ${partiTheme.holo[1]} 50%, ${partiTheme.holo[2]} 100%)`,
                }}
            >
                {/* Background SVG */}
                <CardItem translateZ="0" className="absolute inset-0 w-full h-full pointer-events-none">
                    <svg viewBox="0 0 192 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <HexRF cx={96} cy={140} size={220} />
                    </svg>
                </CardItem>

                {/* Bandeau parti */}
                <CardItem
                    translateZ="50"
                    className="font-bold w-full text-center rounded-lg z-10"
                    style={{
                        background: `linear-gradient(90deg, ${partiTheme.bg[0]}, ${partiTheme.bg[1]}, ${partiTheme.bg[2]})`,
                        color: partiTheme.text
                    }}
                >
                    {parti}
                </CardItem>

                {/* Image — milieu */}
                <CardItem translateZ="100" className="w-full flex-1 flex items-center justify-center py-2 z-10">
                    <div className="w-3/4 aspect-3/4">
                        <img
                            src={image}
                            alt={nom}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </CardItem>

                {/* Nom + rôle */}
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