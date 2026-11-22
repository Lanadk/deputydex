"use client";

import React, { useState } from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import { formatJourFr } from "@/app/_shared/utils/date";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { LegislaturesFrise } from "@/app/(ui)/components/legislatures/legislatures-frise";
import { LegislatureChiffres } from "@/app/(ui)/components/legislatures/legislature-chiffres";
import { LegislatureOrganigramme } from "@/app/(ui)/components/legislatures/legislature-organigramme";
import { LegislaturesCouvertes } from "@/app/(ui)/components/legislatures/legislatures-couvertes";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section aria-labelledby={id} className="flex flex-col gap-4">
            <h2 id={id} className="text-xl font-semibold">{title}</h2>
            {children}
        </section>
    );
}

function Chargement() {
    return <div className="flex h-32 items-center justify-center"><SpinnerLib /></div>;
}

export default function LegislaturesPageClient() {
    // La liste des législatures vient du contexte global ; le choix, lui, est propre
    // à la page (onglets), le sélecteur global y est masqué.
    const { legislatures } = useLegislature();
    const numeros = [...legislatures].map((l) => l.number).sort((a, b) => b - a);
    const [choix, setChoix] = useState<number | null>(null);
    const numero = choix ?? numeros[0] ?? null;

    const frise = useAsyncData(() => legislaturesGateway.getFrise(), "frise");
    const chiffres = useAsyncData(numero === null ? null : () => legislaturesGateway.getChiffres(numero), String(numero));
    const organisation = useAsyncData(numero === null ? null : () => legislaturesGateway.getOrganisation(numero), String(numero));

    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Législatures"
                    subtitle="Ce qu'est une législature, qui gouverne et qui préside l'Assemblée : la chronologie et l'organisation des institutions pendant les législatures couvertes par Députédex."
                />
            </div>

            <div className="flex flex-col gap-10">
                <Section id="comprendre" title="Qu'est-ce qu'une législature ?">
                    <div className="flex flex-col gap-3 rounded-lg border border-main bg-surface-2 p-5 leading-relaxed">
                        <p>
                            Une législature est la période pendant laquelle siège une même Assemblée nationale.
                            Ses 577 députés sont élus au suffrage universel direct pour cinq ans. La législature
                            s&apos;achève au terme de ces cinq ans, ou plus tôt si le Président de la République
                            dissout l&apos;Assemblée (article 12 de la Constitution) : de nouvelles élections
                            ont alors lieu dans les vingt à quarante jours. Les législatures sont numérotées depuis le début de la
                            Ve République, en 1958.
                        </p>
                        <p>
                            Le Gouvernement, dirigé par le Premier ministre que nomme le Président de la République,
                            est responsable devant l&apos;Assemblée : s&apos;il est renversé par une motion de censure, un nouveau
                            gouvernement est formé. Plusieurs gouvernements peuvent donc se succéder pendant une même législature.
                            L&apos;Assemblée, elle, est dirigée par son président et son Bureau
                            (six vice-présidents, trois questeurs, douze secrétaires).
                        </p>
                    </div>
                    {/* Mêmes données que la frise (dates, fin par dissolution) : affiché une fois la frise chargée. */}
                    {frise.data && <LegislaturesCouvertes legislatures={frise.data.legislatures} aujourdhui={frise.data.fin} />}
                </Section>

                <Section id="chronologie" title="Chronologie">
                    {frise.error
                        ? <ErrorStateLib message="Impossible de charger la chronologie pour le moment." onRetry={frise.retry} />
                        : frise.data ? <LegislaturesFrise frise={frise.data} /> : <Chargement />}
                </Section>

                {numero !== null && (
                    <div className="flex flex-col gap-6">
                        <TabsLib
                            tabs={numeros.map((n) => ({ id: String(n), label: libelleLegislature(n) }))}
                            activeId={String(numero)}
                            onChange={(id) => setChoix(Number(id))}
                            ariaLabel="Législature présentée"
                            idPrefix="legislature"
                        />
                        <div {...tabPanelProps("legislature", String(numero))} className="flex flex-col gap-10">
                        <Section id="chiffres" title={`La ${libelleLegislature(numero)} en chiffres`}>
                            {chiffres.error
                                ? <ErrorStateLib message="Impossible de charger les chiffres de la législature pour le moment." onRetry={chiffres.retry} />
                                : chiffres.data ? <LegislatureChiffres chiffres={chiffres.data} /> : <Chargement />}
                        </Section>

                        <Section id="organigramme" title={`Organigramme de la ${libelleLegislature(numero)}`}>
                            {organisation.data && (
                                <p className="text-sm text-subtitle-accent">
                                    {organisation.data.dateReference === new Date().toISOString().slice(0, 10)
                                        ? "Fonctions en place aujourd'hui."
                                        : `Fonctions en place à la fin de la législature (${formatJourFr(organisation.data.dateReference)}).`}
                                    {" "}Les portefeuilles ministériels ne sont pas encore importés dans Députédex : les membres du
                                    gouvernement sont présentés par rang.
                                </p>
                            )}
                            {organisation.error
                                ? <ErrorStateLib message="Impossible de charger l'organigramme pour le moment." onRetry={organisation.retry} />
                                : organisation.data
                                    ? <LegislatureOrganigramme key={organisation.data.legislature} organisation={organisation.data} />
                                    : <Chargement />}
                        </Section>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
}
