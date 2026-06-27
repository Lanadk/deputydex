"use client";

import React, { useMemo } from "react";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
    getGroupFullLabel,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

export type SortDir = "asc" | "desc";

type DeputyFilterProps = {
    count: number;
    deputies: DeputesCardDTO[];
    selectedGroupe: string | null;
    sortDir: SortDir;
    onSelectGroupeAction: (code: string | null) => void;
    onSortDirAction: (dir: SortDir) => void;
};

export const DeputyFilter: React.FC<DeputyFilterProps> = ({
                                                                count,
                                                                deputies,
                                                                selectedGroupe,
                                                                sortDir,
                                                                onSelectGroupeAction,
                                                                onSortDirAction,
                                                            }) => {
    const groupes = useMemo(() => {
        const codes = new Set<string>();
        for (const d of deputies) {
            if (d.deputeGroupeCode) codes.add(d.deputeGroupeCode);
        }
        return Array.from(codes).sort((a, b) => a.localeCompare(b, "fr"));
    }, [deputies]);

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-main">
                        Trier et filtrer les députés
                    </p>
                    <p className="text-xs text-subtitle-accent">
                        Affinez l’affichage par groupe parlementaire ou ordre alphabétique.
                    </p>
                </div>

                <SpanLib className="text-subtitle-accent">
                    {count} résultat{count > 1 ? "s" : ""}
                </SpanLib>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-subtitle-accent">Trier :</span>
                {(["asc", "desc"] as SortDir[]).map((dir) => (
                    <ButtonLib
                        key={dir}
                        text={dir === "asc" ? "A → Z" : "Z → A"}
                        size="small"
                        variant={sortDir === dir ? "primary" : "secondary"}
                        onClick={() => onSortDirAction(dir)}
                    />
                ))}
            </div>

            {groupes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-subtitle-accent">Groupe :</span>
                    <button
                        onClick={() => onSelectGroupeAction(null)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                            selectedGroupe === null
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-main text-subtitle-accent opacity-70 hover:opacity-100"
                        }`}
                    >
                        Tous
                    </button>
                    {groupes.map((code) => {
                        const theme = getGroupCardTheme(getCanonicalGroupCode(code));
                        const label = getGroupFullLabel(code);
                        const isActive = selectedGroupe === code;
                        return (
                            <button
                                key={code}
                                onClick={() => onSelectGroupeAction(isActive ? null : code)}
                                title={label}
                                className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                                style={
                                    isActive
                                        ? {
                                              background: `linear-gradient(90deg, ${theme.bg[0]}, ${theme.bg[1]})`,
                                              color: theme.text,
                                              borderColor: theme.border,
                                          }
                                        : {
                                              background: "transparent",
                                              color: theme.border,
                                              borderColor: theme.border,
                                              opacity: 0.7,
                                          }
                                }
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
