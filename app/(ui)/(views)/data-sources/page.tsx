"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function DataSourcesPage() {
    return (
        <BaseLayout>
            {/* HEADER GLOBAL */}
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Sources de données"
                    subtitle="Les données du Députédex proviennent exclusivement de sources publiques et officielles de l’Assemblée nationale."
                />
            </div>

            {/* CONTENT WRAPPER STANDARD */}
            <PageContentLib>
                <main className="flex flex-col gap-8">

                    {/* ORIGINE */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Origine des données</div>
                            <div className="chart-lib__subtitle">
                                Données publiques de l’Assemblée nationale
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Toutes les informations visibles dans l’application (députés, groupes politiques,
                                mandats, commissions, historiques de fonctions) proviennent de l’open data officiel de l’Assemblée nationale.
                            </p>

                            <p>
                                Ces données sont structurées, mises à jour régulièrement et publiées dans un format ouvert.
                            </p>
                        </div>
                    </section>

                    {/* GOLDEN SOURCES */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Golden sources</div>
                            <div className="chart-lib__subtitle">
                                Références officielles et sources de vérité
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-4">

                            <div className="bg-surface-1 p-4 rounded-lg border border-main">
                                <p className="font-semibold">Open Data Assemblée nationale</p>
                                <a
                                    href="https://data.assemblee-nationale.fr/"
                                    target="_blank"
                                    className="text-accent hover:underline"
                                >
                                    https://data.assemblee-nationale.fr/
                                </a>
                                <p className="text-subtitle-accent mt-2">
                                    Portail principal contenant les jeux de données structurés (députés, mandats, organes, etc.).
                                </p>
                            </div>

                            <div className="bg-surface-1 p-4 rounded-lg border border-main">
                                <p className="font-semibold">Site officiel Assemblée nationale</p>
                                <a
                                    href="https://www.assemblee-nationale.fr/"
                                    target="_blank"
                                    className="text-accent hover:underline"
                                >
                                    https://www.assemblee-nationale.fr/
                                </a>
                                <p className="text-subtitle-accent mt-2">
                                    Source de référence institutionnelle pour validation et contexte des données.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* ACCES DONNEES */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Accès aux données</div>
                            <div className="chart-lib__subtitle">
                                Transparence et exploitation dans les visualisations
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Les données sont déjà utilisées dans l’ensemble des graphiques et pages de l’application.
                            </p>

                            <p>
                                Certaines visualisations permettent également d’accéder aux données sources associées.
                            </p>

                            <p className="text-subtitle-accent">
                                À terme, les datasets seront directement explorables et exportables depuis l’interface.
                            </p>
                        </div>
                    </section>

                    {/* ROADMAP */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Évolutions à venir</div>
                        </div>

                        <div className="chart-lib__body">
                            <ul className="list-disc pl-5 space-y-1 text-subtitle-accent">
                                <li>Accès direct aux datasets depuis chaque graphique</li>
                                <li>Export CSV / JSON</li>
                                <li>Filtrage avancé des sources</li>
                                <li>Historique des mises à jour</li>
                            </ul>
                        </div>
                    </section>

                </main>
            </PageContentLib>
        </BaseLayout>
    );
}