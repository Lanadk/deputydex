import React from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

export type DeviceFrameKind = "phone" | "tablet";

export type DeviceFrameLibProps = {
    children: React.ReactNode;
    /** `phone` : smartphone en portrait (type iPhone) ; `tablet` : tablette en paysage (type iPad). */
    device?: DeviceFrameKind;
    /** Heure affichée dans la barre d'état. */
    time?: string;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Cadre d'appareil autour d'un contenu : smartphone (contour, boutons latéraux,
 * Dynamic Island) ou tablette en paysage (bord fin, caméra frontale). Barre
 * d'état et barre d'accueil dans les deux cas ; `children` remplit l'écran.
 * Purement visuel : le cadre et la barre d'état sont masqués aux lecteurs
 * d'écran, le contenu garde son accessibilité propre. Largeur réglable par
 * `--device-width`.
 */
export function DeviceFrameLib({ children, device = "phone", time = "9:41", className = "", style }: DeviceFrameLibProps) {
    return (
        <div className={`device-frame device-frame--${device} ${className}`} style={style}>
            {device === "phone" ? (
                <>
                    <span className="device-frame__button device-frame__button--action" aria-hidden="true" />
                    <span className="device-frame__button device-frame__button--volume-up" aria-hidden="true" />
                    <span className="device-frame__button device-frame__button--volume-down" aria-hidden="true" />
                    <span className="device-frame__button device-frame__button--power" aria-hidden="true" />
                </>
            ) : (
                <>
                    <span className="device-frame__button device-frame__button--top" aria-hidden="true" />
                    <span className="device-frame__camera" aria-hidden="true" />
                </>
            )}

            <div className="device-frame__screen">
                <div className="device-frame__status" aria-hidden="true">
                    <span className="device-frame__time">{time}</span>
                    {device === "phone" && <span className="device-frame__island" />}
                    <span className="device-frame__icons">
                        <Signal size={12} strokeWidth={2.5} />
                        <Wifi size={12} strokeWidth={2.5} />
                        <BatteryFull size={15} strokeWidth={2} />
                    </span>
                </div>
                <div className="device-frame__content">{children}</div>
                <span className="device-frame__home-indicator" aria-hidden="true" />
            </div>
        </div>
    );
}
