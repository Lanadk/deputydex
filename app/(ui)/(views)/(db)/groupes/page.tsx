"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import {GroupCard} from "@/app/(ui)/components/groups/group-card";
import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import type {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {applyFilterBarQueryClient} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {GroupIntro} from "@/app/(ui)/components/groups/group-intro";
import {GroupFilter} from "@/app/(ui)/components/groups/group-filters";
import {GroupResume} from "@/app/(ui)/components/groups/group-resume";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {getGroupCardTheme} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

export default function GroupesPage() {
    const {legislature} = useLegislature();
    const legislatureNumber = legislature?.number ?? 0;
    const [groupes, setGroupes] = useState<GroupeCardDTO[]>([]);

    useEffect(() => {
        groupesGateways.getGroupesCards(legislatureNumber)
            .then(setGroupes)
            .catch(console.error);
    }, [legislatureNumber])

    const [query, setQuery] = useState<FilterBarQuery>({
        orderBy: [],
        where: {},
    });


    const filteredGroupes = useMemo(
        () => applyFilterBarQueryClient(groupes, query),
        [groupes, query]
    );

    const handleQueryChange = (q: FilterBarQuery) => {
        setQuery(q);
    };

    return (
        <>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Groupes parlementaires"
                    subtitle="Explorez les groupes parlementaires de l'assemblée nationale, découvrez leurs membres, leurs présidents et leurs positions politiques.
                    Plongez dans l'univers des groupes parlementaires pour mieux comprendre la dynamique politique de l'Assemblée nationale."
                />
            </div>

            <main className="flex flex-col gap-6 w-full mx-auto">
                <div className="relative z-30 grid w-full grid-cols-1 gap-2 lg:grid-cols-2 items-start">
                    <GroupIntro/>
                    <GroupResume
                        legislature={legislatureNumber}
                        activeGroupsCount={groupes.length}
                    />
                    <div className="lg:col-span-2">
                        <GroupFilter
                            count={filteredGroupes.length}
                            onQueryChangeAction={handleQueryChange}
                        />
                    </div>
                </div>

                <div className="relative z-0 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4 mt-5">
                    {filteredGroupes.map((groupe) => {
                        const theme = getGroupCardTheme(groupe.groupeCode);

                        return (
                            <div key={groupe.groupeId}>
                                <GroupCard
                                    code={groupe.groupeCode}
                                    libelle={groupe.groupeLabel}
                                    nbMembers={groupe.groupeCountMembers}
                                    president={groupe.groupePresidentFullName}
                                    sexPresidentType={groupe.groupeQualitySexLabel}
                                    position={groupe.groupePosition}
                                    href={groupe.groupeHref}
                                    theme={theme}
                                />
                            </div>
                        );
                    })}
                </div>

            </main>
        </>
    );
}