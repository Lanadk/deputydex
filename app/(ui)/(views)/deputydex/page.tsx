"use client"

import {
    AnchorLayoutFixHeader
} from "@/app/(ui)/component-library/template/sections/anchor-section-header-fix/anchor-layout-fix-header";
import {DeputyFilter} from "@/app/(ui)/components/deputy/deputy-filter";
import {useEffect, useMemo, useRef, useState} from "react";
import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {applyFilterBarQueryClient} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {deputesGateway} from "@/app/(ui)/gateways/deputes/deputes.gateway";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";

export default function DeputydexPage() {
    const {legislature} = useLegislature();
    const legislatureNumber = legislature?.number ?? 0;

    const [deputies, setDeputies] = useState<DeputesCardDTO[]>([]);
    const [query, setQuery] = useState<FilterBarQuery>({ orderBy: [], where: {} });

    const filteredDeputies = useMemo(
        () => applyFilterBarQueryClient(deputies, query),
        [deputies, query]
    );

    const parentRef = useRef<HTMLDivElement | null>(null);
    const columnCount = 5;
    const rowCount = Math.ceil(filteredDeputies.length / columnCount);
    const rowVirtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => 320,
        overscan: 10,
        measureElement: (el) => el.getBoundingClientRect().height,
    });

    useEffect(() => {
        deputesGateway.getDeputesCards(legislatureNumber)
            .then(setDeputies)
            .catch(console.error);
    }, [legislatureNumber]);

    return (
        <AnchorLayoutFixHeader
            title="Deputydex"
            subtitle="Toto"
            sections={[]}
            fixedBar={
                <DeputyFilter
                    count={filteredDeputies.length}
                    onQueryChangeAction={(q) => setQuery(q)}
                />
            }
        >
            <main ref={parentRef} className="w-full">
                <div
                    style={{ height: rowVirtualizer.getTotalSize(), position: "relative", zIndex: 0 }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const start = virtualRow.index * columnCount;
                        const items = filteredDeputies.slice(start, start + columnCount);

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
                                className="flex justify-end gap-12 py-4"
                            >
                                {items.map((d) => (
                                    <div key={d.deputeUID} className="w-50">
                                        <DeputyCard
                                            nom={d.deputeFullName}
                                            groupe={d.deputeGroupeCode}
                                            image={d.deputeImage}
                                            role={d.deputeRole}
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </main>
        </AnchorLayoutFixHeader>
    );
}