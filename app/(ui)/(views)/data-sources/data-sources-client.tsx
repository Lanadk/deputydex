"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import {datasetsGateway} from "@/app/(ui)/gateways/datasets/datasets.gateway";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";

export default function DataSourcesClient() {
    // Chargée une fois (avant : l'effet dépendait de la date qu'il écrivait, d'où une seconde requête).
    const lastUpdateData = useAsyncData(() => datasetsGateway.getLastUpdate(), "last-update");
    const lastUpdate = lastUpdateData.data;


    return (
        <BaseLayout>
            {/* HEADER */}
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Sources de données"
                    subtitle="Les données du Députédex proviennent exclusivement de sources publiques et officielles de l’Assemblée nationale."
                />
            </div>

            <PageContentLib>
                <div className="flex flex-col gap-8">

                    {/* ORIGINE */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Origine des données</div>
                            <div className="chart-lib__subtitle">
                                Assemblée nationale – Open Data
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Les données affichées (députés, groupes politiques, mandats, commissions)
                                proviennent de l’open data officiel de l’Assemblée nationale.
                            </p>

                            <p>
                                Elles sont structurées, publiques et mises à jour régulièrement.
                            </p>
                        </div>
                    </section>

                    {/* GOLDEN SOURCES */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Sources officielles</div>
                            <div className="chart-lib__subtitle">
                                Références utilisées comme source de vérité
                            </div>
                        </div>

                        <div className="chart-lib__body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                                    <div className="font-semibold">
                                        Open Data Assemblée nationale
                                    </div>

                                    <a
                                        href="https://data.assemblee-nationale.fr/"
                                        target="_blank"
                                        className="text-accent hover:underline text-sm"
                                    >
                                        data.assemblee-nationale.fr
                                    </a>

                                    <p className="text-subtitle-accent text-sm">
                                        Données structurées officielles (députés, mandats, organes).
                                    </p>
                                </div>

                                <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                                    <div className="font-semibold">
                                        Assemblée nationale
                                    </div>

                                    <a
                                        href="https://www.assemblee-nationale.fr/"
                                        target="_blank"
                                        className="text-accent hover:underline text-sm"
                                    >
                                        assemblee-nationale.fr
                                    </a>

                                    <p className="text-subtitle-accent text-sm">
                                        Référence institutionnelle pour validation des données.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* DATA ACCESS */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Accès aux données</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Les données sont utilisées dans toutes les pages et visualisations.
                            </p>

                            <p>
                                Certaines vues exposent directement les données sources associées aux graphiques.
                            </p>

                            <p className="text-subtitle-accent">
                                L’objectif est de rendre l’ensemble des datasets consultables et exportables.
                            </p>
                        </div>
                    </section>

                    {/* UPDATE INFO */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Mise à jour des données</div>
                            <div className="chart-lib__subtitle">
                                Fréquence et fraîcheur des données
                            </div>
                        </div>

                        <div className="chart-lib__body">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* CADENCE */}
                                <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                                    <div className="text-sm text-subtitle-accent">
                                        Cadence
                                    </div>

                                    <div className="text-lg font-semibold">
                                        Hebdomadaire
                                    </div>

                                    <p className="text-sm text-subtitle-accent">
                                        Synchronisation automatique via l’API de l’Assemblée nationale.
                                    </p>
                                </div>

                                {/* LAST UPDATE */}
                                <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                                    <div className="text-sm text-subtitle-accent">
                                        Dernière mise à jour
                                    </div>

                                    {lastUpdateData.error ? (
                                        <div role="alert" className="flex flex-wrap items-center gap-3">
                                            <span className="text-lg font-semibold">Indisponible</span>
                                            <ButtonLib text="Réessayer" size="small" variant="tertiary" onClick={lastUpdateData.retry} />
                                        </div>
                                    ) : (
                                        <div className="text-lg font-semibold">
                                            {lastUpdate ? new Date(lastUpdate).toLocaleString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }) : "Chargement ..."}
                                        </div>
                                    )}

                                    <p className="text-sm text-subtitle-accent">
                                        Dernière synchronisation complète des datasets.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ROADMAP */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Évolutions</div>
                        </div>

                        <div className="chart-lib__body">
                            <ul className="list-disc pl-5 space-y-1 text-subtitle-accent">
                                <li>Export CSV / JSON</li>
                                <li>Accès direct aux datasets</li>
                                <li>Filtrage avancé des sources</li>
                                <li>Historique des mises à jour</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </PageContentLib>
        </BaseLayout>
    );
}
