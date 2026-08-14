"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

const CURRENT_YEAR = new Date().getFullYear();

export default function MentionsLegalesClient() {
    return (
        <BaseLayout>
            {/* HEADER */}
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Mentions légales"
                    subtitle="Éditeur, hébergement, propriété intellectuelle, licence des données et gestion des données personnelles."
                />
            </div>

            <PageContentLib>
                <main className="flex flex-col gap-8">

                    {/* COPYRIGHT */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Copyright</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                © {CURRENT_YEAR} Députédex. Sauf mention contraire, l’interface, les visuels,
                                les textes et le code source du site sont la propriété de leurs auteurs et ne
                                peuvent être reproduits sans autorisation préalable.
                            </p>
                            <p className="text-subtitle-accent">
                                Les données parlementaires affichées ne sont pas concernées par ce copyright :
                                voir la section « Licence des données » ci-dessous.
                            </p>
                        </div>
                    </section>

                    {/* EDITEUR */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Éditeur du site</div>
                            <div className="chart-lib__subtitle">
                                Projet personnel, à but non commercial
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Députédex est édité à titre non professionnel par Ottman BECUWE et Souheil NAOUEL.
                            </p>
                            <p>
                                Directeur de la publication : Ottman BECUWE.
                            </p>
                            <p>
                                Contact :{" "}
                                <a
                                    href="mailto:contact@ottmanbecuwe.com"
                                    className="text-accent hover:underline"
                                >
                                    contact@ottmanbecuwe.com
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* HEBERGEMENT */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Hébergement</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Le site est hébergé par OVHcloud (OVH SAS), 2 rue Kellermann, 59100 Roubaix, France.
                            </p>
                            <p>
                                <a
                                    href="https://www.ovhcloud.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline"
                                >
                                    ovhcloud.com
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* PROPRIETE INTELLECTUELLE */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Propriété intellectuelle</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Le code source, la charte graphique, les composants d’interface et les
                                contenus éditoriaux propres à Députédex (hors données parlementaires) sont
                                protégés au titre du droit d’auteur et restent la propriété exclusive de
                                leurs auteurs. Toute reproduction, représentation ou réutilisation, totale
                                ou partielle, est interdite sans autorisation préalable.
                            </p>
                            <p>
                                Les marques, logos et le nom « Députédex » ne peuvent être utilisés sans
                                accord préalable des auteurs.
                            </p>
                        </div>
                    </section>

                    {/* LICENCE DES DONNEES */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Licence des données</div>
                            <div className="chart-lib__subtitle">
                                Réutilisation des données publiques de l’Assemblée nationale
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Les données parlementaires affichées sur Députédex (députés, groupes,
                                mandats, scrutins, votes) proviennent de l’open data officiel de
                                l’Assemblée nationale, mis à disposition sous{" "}
                                <a
                                    href="https://www.etalab.gouv.fr/licence-ouverte-open-licence/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline"
                                >
                                    Licence Ouverte / Open Licence (Etalab)
                                </a>. Elles restent librement réutilisables dans les conditions fixées par
                                cette licence, indépendamment du copyright applicable au site lui-même.
                            </p>
                            <p className="text-subtitle-accent">
                                Voir la page{" "}
                                <a href="/data-sources" className="text-accent hover:underline">
                                    Sources de données
                                </a>{" "}
                                pour le détail des jeux de données utilisés.
                            </p>
                        </div>
                    </section>

                    {/* DONNEES PERSONNELLES */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Données personnelles &amp; cookies</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Députédex ne dépose aucun cookie de suivi ou de mesure d’audience et n’exploite
                                aucun outil de tracking publicitaire. Seule votre préférence d’affichage
                                (thème clair, sombre ou accessible) est mémorisée localement dans votre
                                navigateur (stockage local), sans transmission à un serveur tiers.
                            </p>
                            <p>
                                Les seules données à caractère personnel traitées par le site sont celles,
                                déjà publiques, relatives aux mandats des député(e)s de l’Assemblée nationale,
                                issues des sources listées ci-dessus.
                            </p>
                            <p className="text-subtitle-accent">
                                Pour toute question relative à ces données, vous pouvez contacter les éditeurs
                                du site à l’adresse indiquée plus haut.
                            </p>
                        </div>
                    </section>

                    {/* RESPONSABILITE */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Responsabilité</div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Députédex est un projet indépendant, développé à titre personnel, et n’est
                                affilié ni à l’Assemblée nationale ni à aucun parti ou groupe politique. Les
                                contenus sont fournis à titre informatif, sans garantie d’exhaustivité ou
                                d’absence d’erreur, et ne sauraient engager la responsabilité de leurs auteurs.
                            </p>
                            <p className="text-subtitle-accent">
                                En cas d’erreur constatée sur une donnée affichée, merci de la signaler via
                                l’adresse de contact indiquée ci-dessus.
                            </p>
                        </div>
                    </section>

                </main>
            </PageContentLib>
        </BaseLayout>
    );
}
