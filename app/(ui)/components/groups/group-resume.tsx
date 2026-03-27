"use client";

import React from "react";

type GroupResumeProps = {
    legislature: number | null;
    activeGroupsCount: number;
};

export const GroupResume: React.FC<GroupResumeProps> = ({
                                                          legislature,
                                                          activeGroupsCount,
                                                      }) => {
    return (
        <div className="flex h-full w-full flex-col rounded-xl border border-main bg-surface-1 p-5 shadow-sm">
            <p className="text-sm font-semibold text-main">
                Groupes actifs
            </p>

            <p className="mt-1 text-xs text-subtitle-accent">
                Législature {legislature ?? "—"}
            </p>

            <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-bold leading-none text-main">
                    {activeGroupsCount}
                </span>
                <span className="pb-1 text-sm text-subtitle-accent">
                    groupe{activeGroupsCount > 1 ? "s" : ""} actif{activeGroupsCount > 1 ? "s" : ""}
                </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-subtitle-accent">
                Nombre de groupes parlementaires actifs pour la législature sélectionnée,
                hors non-inscrits.
            </p>
        </div>
    );
};