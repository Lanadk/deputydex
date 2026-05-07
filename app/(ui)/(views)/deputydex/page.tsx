"use client";

import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import type {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {applyFilterBarQueryClient} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {DeputyFilter} from "@/app/(ui)/components/deputy/deputy-filter";
import {deputesGateway} from "@/app/(ui)/gateways/deputes/deputes.gateway";
import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";

export default function DeputydexPage() {
    const {legislature} = useLegislature();
    const legislatureNumber = legislature?.number ?? 0;

    const [deputies, setDeputies] = useState<DeputesCardDTO[]>([]);
    const [query, setQuery] = useState<FilterBarQuery>({
        orderBy: [],
        where: {},
    });
    const handleQueryChange = (q: FilterBarQuery) => {
        setQuery(q);
    };
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
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Deputydex"
                    subtitle="Toto"
                />
            </div>

            <main ref={parentRef} className="flex flex-col gap-6 w-full mx-auto">

                {/*

                                    <div className="w-full">
                        <DeputyFilter
                            count={filteredDeputies.length}
                            onQueryChangeAction={handleQueryChange}
                        />
                    </div>
                */}



                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: "relative",
                    }}
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
                                className="flex justify-center gap-12 py-4"
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
        </BaseLayout>
    );
}