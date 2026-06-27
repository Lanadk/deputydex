"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

type SortDir = "asc" | "desc";
const PAGE_SIZE = 50;

export default function DeputydexPage() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const [deputes, setDeputes] = useState<DeputeListItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroupe, setSelectedGroupe] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setPage(1);
        setSelectedGroupe(null);
        deputesGateway
            .getDeputesList(legislatureNum)
            .then(setDeputes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [legislatureNum]);

    // Reset page when filter changes
    useEffect(() => { setPage(1); }, [selectedGroupe, sortDir]);

    const groupes = useMemo(() => {
        const seen = new Map<string, string>(); // code → label
        for (const d of deputes) {
            if (d.groupeCode && d.groupeLabel && !seen.has(d.groupeCode)) {
                seen.set(d.groupeCode, d.groupeLabel);
            }
        }
        return Array.from(seen.entries())
            .map(([code, label]) => ({ code, label }))
            .sort((a, b) => a.label.localeCompare(b.label, "fr"));
    }, [deputes]);

    const filtered = useMemo(() => {
        let list = deputes;
        if (selectedGroupe) {
            list = list.filter((d) => d.groupeCode === selectedGroupe);
        }
        return [...list].sort((a, b) => {
            const nomA = (a.nom ?? "").toLowerCase();
            const nomB = (b.nom ?? "").toLowerCase();
            return sortDir === "asc"
                ? nomA.localeCompare(nomB, "fr")
                : nomB.localeCompare(nomA, "fr");
        });
    }, [deputes, selectedGroupe, sortDir]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageRows = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Controls */}
            <div className="flex flex-col gap-4">
                {/* Tri */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium opacity-60">Trier :</span>
                    {(["asc", "desc"] as SortDir[]).map((dir) => (
                        <button
                            key={dir}
                            onClick={() => setSortDir(dir)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                sortDir === dir
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border opacity-60 hover:opacity-100"
                            }`}
                        >
                            {dir === "asc" ? "A → Z" : "Z → A"}
                        </button>
                    ))}
                </div>

                {/* Chips groupes */}
                {groupes.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium opacity-60">Groupe :</span>
                        <button
                            onClick={() => setSelectedGroupe(null)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                selectedGroupe === null
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border opacity-60 hover:opacity-100"
                            }`}
                        >
                            Tous
                        </button>
                        {groupes.map(({ code, label }) => {
                            // Use code through getCanonicalGroupCode for correct theme resolution
                            const theme = getGroupCardTheme(getCanonicalGroupCode(code));
                            const isActive = selectedGroupe === code;
                            return (
                                <button
                                    key={code}
                                    onClick={() => setSelectedGroupe(isActive ? null : code)}
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

                <p className="text-sm opacity-50">
                    {filtered.length} député{filtered.length > 1 ? "s" : ""}
                    {pageCount > 1 && ` — page ${page}/${pageCount}`}
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <SpinnerLib />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {pageRows.map((d) => (
                            <DeputyCard
                                key={d.uid}
                                uid={d.uid}
                                nom={`${d.prenom ?? ""} ${d.nom ?? ""}`.trim()}
                                groupe={d.groupeCode ?? ""}
                                image={d.photoPath ?? ""}
                            />
                        ))}
                    </div>

                    {pageCount > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-30 hover:opacity-80 transition-opacity"
                            >
                                ← Précédent
                            </button>
                            <span className="text-sm opacity-60">
                                {page} / {pageCount}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                                disabled={page === pageCount}
                                className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-30 hover:opacity-80 transition-opacity"
                            >
                                Suivant →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
