"use client";

import React, {useMemo, useState} from "react";
import {PARLIAMENTARY_GROUP_THEME_REGISTRY} from "@/app/(ui)/theme/parliament-groups/group-theme.registry";
import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import {GroupTheme} from "@/app/(ui)/theme/parliament-groups/group-theme.types";
import {GroupCard} from "@/app/(ui)/components/groups/group-card";
import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import type {
    FilterBarQuery,
} from "@/app/_shared/filtering/filter-bar.types";
import {applyFilterBarQueryClient} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {GroupIntro} from "@/app/(ui)/components/groups/group-intro";
import {GroupFilter} from "@/app/(ui)/components/groups/group-filters";
import {GroupResume} from "@/app/(ui)/components/groups/group-resume";

export type Groupe = {
    code: string;
    libelle?: string;
    nb_membres?: number;
    president?: string;
    position?: string;
    href?: string;
};

function useMockGroupes(legislature: number | null): Groupe[] {
    if (!legislature) return [];

    if (legislature === 16) {
        return [];
    }

    if (legislature === 17) {
        return [
            {
                code: "RN",
                libelle: "Rassemblement National",
                nb_membres: 122,
                president: "Marine Le Pen",
                position: "Droite",
            },
            {
                code: "UDDPLR",
                libelle: "Union des droites pour la République",
                nb_membres: 17,
                president: "Éric Ciotti",
                position: "Droite",
            },
            {
                code: "DR",
                libelle: "Droite Républicaine",
                nb_membres: 49,
                president: "Olivier Marleix",
                position: "Droite",
            },
            {
                code: "LIOT",
                libelle: "Libertés, Indépendants, Outre-mer et Territoires",
                nb_membres: 22,
                president: "Bertrand Pancher",
                position: "Centre",
            },
            {
                code: "HOR",
                libelle: "Horizons et Indépendants",
                nb_membres: 35,
                president: "Laurent Marcangeli",
                position: "Centre",
            },
            {
                code: "DEM",
                libelle: "Les Démocrates",
                nb_membres: 36,
                president: "Jean-Paul Mattei",
                position: "Centre",
            },
            {
                code: "EPR",
                libelle: "Ensemble pour la République",
                nb_membres: 91,
                president: "Gabriel Attal",
                position: "Centre",
            },
            {
                code: "SOC",
                libelle: "Socialistes et apparentés",
                nb_membres: 69,
                president: "Boris Vallaud",
                position: "Gauche",
            },
            {
                code: "ECOS",
                libelle: "Écologiste et Social",
                nb_membres: 38,
                president: "Cyrielle Chatelain",
                position: "Gauche",
            },
            {
                code: "GDR",
                libelle: "Gauche Démocrate et Républicaine",
                nb_membres: 17,
                president: "André Chassaigne",
                position: "Gauche",
            },
            {
                code: "LFI_NFP",
                libelle: "La France insoumise - NFP",
                nb_membres: 71,
                president: "Mathilde Panot",
                position: "Gauche",
            },
            {
                code: "NI",
                libelle: "Non inscrit",
                nb_membres: 7,
            },
        ];
    }

    return [];
}

export default function GroupesPage() {
    const {legislature} = useLegislature();
    const legislatureNumber = legislature?.number ?? 0;
    const groupes = useMockGroupes(legislatureNumber);

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

            <main className="flex flex-col gap-6">
                <div className="relative z-30 grid w-full grid-cols-1 gap-2 lg:grid-cols-2 items-start">
                    <GroupIntro />
                    <GroupResume
                        legislature={legislatureNumber}
                        activeGroupsCount={groupes.length}
                    />
                    <div className="lg:col-span-2">
                        <GroupFilter
                            count={filteredGroupes.length}
                            onQueryChange={handleQueryChange}
                        />
                    </div>
                </div>

                <div className="relative z-0 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredGroupes.map((groupe) => {
                        const theme: GroupTheme =
                            PARLIAMENTARY_GROUP_THEME_REGISTRY[groupe.code] ??
                            PARLIAMENTARY_GROUP_THEME_REGISTRY.DEFAULT;

                        return (
                            <div key={groupe.code}>
                                <GroupCard
                                    code={groupe.code}
                                    libelle={groupe.libelle}
                                    nb_membres={groupe.nb_membres}
                                    president={groupe.president}
                                    position={groupe.position}
                                    href={`/groupes/${groupe.code}`}
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