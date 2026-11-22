"use client"

import { useTheme } from 'next-themes'
import { useEffect, useId, useRef, useState } from 'react'
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib"
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib"
import { FaAccessibleIcon, FaLightbulb, FaMoon } from "react-icons/fa"
import { X, Palette } from "lucide-react"

export interface ThemeSwitcherLibProps {
    /** Libellé à côté de l'icône ; sans libellé (ex. barre repliée), l'icône seule, nommée « Thème » pour les lecteurs d'écran. */
    label?: string;
    /** Classes du bouton qui ouvre le panneau (ex. style des liens de la barre latérale). */
    triggerClassName?: string;
    /** Côté d'ouverture du panneau. */
    side?: "right" | "top";
}

const PANEL_POSITION: Record<NonNullable<ThemeSwitcherLibProps["side"]>, string> = {
    right: "left-full bottom-0 ml-2",
    top: "bottom-full left-0 mb-2",
};

/**
 * Sélecteur de thème (Light, Dark, Accessible) : un bouton qui ouvre un petit
 * panneau. Intégré dans la barre latérale (plus de bouton flottant, qui
 * recouvrait les notifications en bas à droite). Fermeture : croix, Échap ou
 * clic à l'extérieur.
 */
export function ThemeSwitcherLib({ label, triggerClassName = "", side = "right" }: ThemeSwitcherLibProps) {
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const rootRef = useRef<HTMLDivElement>(null)
    const panelId = useId()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false) }
        const onPointerDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false)
        }
        document.addEventListener("keydown", onKeyDown)
        document.addEventListener("mousedown", onPointerDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.removeEventListener("mousedown", onPointerDown)
        }
    }, [isOpen])

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={label ? undefined : "Thème"}
                className={triggerClassName}
            >
                <Palette className="w-5 h-5 shrink-0" aria-hidden="true" />
                {label && <SpanLib className="whitespace-nowrap overflow-hidden">{label}</SpanLib>}
            </button>

            {isOpen && (
                <div
                    id={panelId}
                    role="group"
                    aria-label="Choix du thème"
                    className={`absolute z-50 w-44 bg-card p-4 rounded-lg shadow-lg border border-main ${PANEL_POSITION[side]}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold">Thème</span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="theme-close-btn"
                            aria-label="Fermer le choix du thème"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <ButtonLib
                            text="Light"
                            variant={mounted && theme === 'light' ? 'primary' : 'tertiary'}
                            icon={FaLightbulb}
                            onClick={() => setTheme('light')}
                        />
                        <ButtonLib
                            text="Dark"
                            variant={mounted && theme === 'dark' ? 'primary' : 'tertiary'}
                            icon={FaMoon}
                            onClick={() => setTheme('dark')}
                        />
                        <ButtonLib
                            text="Accessible"
                            variant={mounted && theme === 'accessible' ? 'primary' : 'tertiary'}
                            icon={FaAccessibleIcon}
                            onClick={() => setTheme('accessible')}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
