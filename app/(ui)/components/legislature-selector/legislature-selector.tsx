"use client";

import {useState} from "react";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {SpanLib} from "@/app/(ui)/component-library/atoms/span/span-lib";
import {Landmark, X} from "lucide-react";
import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {useLegislature} from "@/app/(ui)/providers/legislature-provider";

export function LegislatureSelector() {
    const {legislature, legislatures, setLegislature, loading} = useLegislature();
    const [isOpen, setIsOpen] = useState(false);

    if (loading) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-card border border-main rounded-lg shadow-lg p-4 flex flex-col gap-2 min-w-56">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Landmark className="text-subtitle-accent" />
                            <SpanLib className="font-semibold">Législature</SpanLib>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="theme-close-btn"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-1">
                        {legislatures.map(l => (
                            <button
                                key={l.id}
                                onClick={() => {
                                    setLegislature(l);
                                    setIsOpen(false)
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg gap-2 sidebar-link ${legislature?.id === l.id ? "sidebar-link--active" : ""}`}
                            >
                                <SpanLib>{l.number} ème législature</SpanLib>
                                {!l.endDate
                                    ? <BadgeLib text="en cours" variant="primary" />
                                    : <BadgeLib text="archive" variant="secondary" />
                                }
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <ButtonLib
                    icon={Landmark}
                    text={`${legislature?.number}ème`}
                    variant="tertiary"
                    size="small"
                    onClick={() => setIsOpen(true)}
                />
            )}
        </div>
    );
}