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

const ROW_ESTIMATE_SIZE = 320;

function getColumnCount(width: number): number {
    if (width >= 1024) return 5;
    if (width >= 768) return 4;
    if (width >= 640) return 3;
    return 2;
}

function useColumnCount(): number {
    const [columnCount, setColumnCount] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setColumnCount(getColumnCount(window.innerWidth));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return columnCount;
}

export default function DeputydexPageClient() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const [deputies, setDeputies] = useState<DeputesCardDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroupe, setSelectedGroupe] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const columnCount = useColumnCount();
    const parentRef = useRef<HTMLDivElement | null>(null);
    const rowCount = Math.ceil(filteredDeputies.length / columnCount);
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
                            const start = virtualRow.index * columnCount;
                            const rowDeputies = filteredDeputies.slice(start, start + columnCount);

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
                                        display: "grid",
                                        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                    }}
                                    className="gap-4 py-2"
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
