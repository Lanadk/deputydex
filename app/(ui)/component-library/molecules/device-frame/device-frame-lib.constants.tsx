"use client"

import React from "react";
import { DeviceFrameLib } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib";

export const DEVICE_FRAME_TABLET_CODE = `<DeviceFrameLib device="tablet">
    <div className="p-4">Contenu de l'écran</div>
</DeviceFrameLib>
`;

export const DEVICE_FRAME_PHONE_CODE = `<DeviceFrameLib device="phone" time="18:30" style={{ "--device-width": "220px" } as React.CSSProperties}>
    ...
</DeviceFrameLib>
`;

const Ecran = ({ titre, colonnes }: { titre: string; colonnes: number }) => (
    <div className="flex h-full flex-col gap-3 p-4">
        <p className="text-lg font-bold">{titre}</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${colonnes}, minmax(0, 1fr))` }}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-main bg-surface-2 p-3 text-sm">Élément {i}</div>
            ))}
        </div>
    </div>
);

export const getDeviceFrameSections = () => [
    {
        title: "Tablette (paysage)",
        code: DEVICE_FRAME_TABLET_CODE,
        component: (
            <DeviceFrameLib device="tablet">
                <Ecran titre="Députédex" colonnes={2} />
            </DeviceFrameLib>
        ),
    },
    {
        title: "Téléphone, largeur et heure personnalisées",
        code: DEVICE_FRAME_PHONE_CODE,
        component: (
            <DeviceFrameLib device="phone" time="18:30" style={{ "--device-width": "220px" } as React.CSSProperties}>
                <Ecran titre="Députédex" colonnes={1} />
            </DeviceFrameLib>
        ),
    },
];
