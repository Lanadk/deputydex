"use client"

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { ButtonLib } from "@/app/component-library/atoms/button/button-lib"
import { FaAccessibleIcon, FaLightbulb, FaMoon } from "react-icons/fa"
import { X, Palette } from "lucide-react"

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed bottom-4 right-4 z-9999">
            {isOpen ? (
                <div className="bg-card p-4 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Thème</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="theme-close-btn p-1 rounded hover:bg-opacity-10"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <ButtonLib
                            text="Light"
                            variant={theme === 'light' ? 'primary' : 'tertiary'}
                            icon={FaLightbulb}
                            onClick={() => setTheme('light')}
                        />
                        <ButtonLib
                            text="Dark"
                            variant={theme === 'dark' ? 'primary' : 'tertiary'}
                            icon={FaMoon}
                            onClick={() => setTheme('dark')}
                        />
                        <ButtonLib
                            text="Accessible"
                            variant={theme === 'accessible' ? 'primary' : 'tertiary'}
                            icon={FaAccessibleIcon}
                            onClick={() => setTheme('accessible')}
                        />
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-card p-3 rounded-full shadow-lg"
                >
                    <Palette size={20} />
                </button>
            )}
        </div>
    )
}