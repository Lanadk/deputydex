import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Députédex",
    description: "Explorez l'intégralité des députés français de l'Assemblée nationale : mandats, groupes, activité " +
        "parlementaire, votes ainsi que leurs statistiques",
    alternates: { canonical: "/deputydex" },
    openGraph: {
        title: "Députédex",
        description: "Explorez l'intégralité des députés français de l'Assemblée nationale : mandats, groupes, " +
            "activité parlementaire, votes et leurs statistiques.",
        url: "/deputydex",
    },
};

export default function DeputydexPage() {
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { DeputyFilter, SortDir } from "@/app/(ui)/components/deputy/deputy-filter";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { AnchorLayoutFixHeader } from "@/app/(ui)/component-library/template/sections/anchor-section-header-fix/anchor-layout-fix-header";

const COLUMN_COUNT = 5;
const ROW_ESTIMATE_SIZE = 320;

export default function DeputydexPage() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const [deputies, setDeputies] = useState<DeputesCardDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroupe, setSelectedGroupe] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    useEffect(() => {
        setLoading(true);
        deputesGateway
            .getDeputesCards(legislatureNum)
            .then(setDeputies)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [legislatureNum]);

    const filteredDeputies = useMemo(() => {
        const list = selectedGroupe
            ? deputies.filter((d) => d.deputeGroupeCode === selectedGroupe)
            : deputies;

        return [...list].sort((a, b) => {
            const nomA = (a.deputeFullName ?? "").toLowerCase();
            const nomB = (b.deputeFullName ?? "").toLowerCase();
            return sortDir === "asc"
                ? nomA.localeCompare(nomB, "fr")
                : nomB.localeCompare(nomA, "fr");
        });
    }, [deputies, selectedGroupe, sortDir]);

    const parentRef = useRef<HTMLDivElement | null>(null);
    const rowCount = Math.ceil(filteredDeputies.length / COLUMN_COUNT);
    const rowVirtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => ROW_ESTIMATE_SIZE,
        overscan: 5,
    });

    return (
        <AnchorLayoutFixHeader
            title="Députés"
            subtitle="Parcourez l’ensemble des députés de l’Assemblée nationale, filtrez-les par groupe parlementaire ou rôle, et accédez à leur fiche détaillée."
            sections={[]}
            fixedBar={
                <DeputyFilter
                    count={filteredDeputies.length}
                    deputies={deputies}
                    selectedGroupe={selectedGroupe}
                    sortDir={sortDir}
                    onSelectGroupeAction={setSelectedGroupe}
                    onSortDirAction={setSortDir}
                />
            }
        >
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <SpinnerLib />
                </div>
            ) : (
                <main ref={parentRef} className="w-full">
                    <div
                        style={{
                            height: rowVirtualizer.getTotalSize(),
                            position: "relative",
                            width: "100%",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const start = virtualRow.index * COLUMN_COUNT;
                            const rowDeputies = filteredDeputies.slice(start, start + COLUMN_COUNT);

                            return (
                                <div
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    ref={rowVirtualizer.measureElement}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-2"
                                >
                                    {rowDeputies.map((d) => (
                                        <DeputyCard
                                            key={d.deputeUID}
                                            uid={d.deputeUID}
                                            nom={d.deputeFullName}
                                            groupe={d.deputeGroupeCode}
                                            image={d.deputeImage}
                                            role={d.deputeRole}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}
        </AnchorLayoutFixHeader>
    );
}
