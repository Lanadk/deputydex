"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";
import { CardWall } from "@/app/(ui)/components/home/card-wall";
import { HomeTablet } from "@/app/(ui)/components/home/home-tablet";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { HomeChiffres, HomeExplorer, HomeStatistiques } from "@/app/(ui)/components/home/home-sections";
import { resumeLegislaturesCouvertes } from "@/app/(ui)/components/home/home-legislatures";

/**
 * Accueil. Il présente la législature EN COURS lue en base
 * (`/api/legislatures/current`), pas celle du sélecteur global : changer de
 * législature ailleurs sur le site ne modifie pas l'accueil (le sélecteur y est masqué).
 */
export default function HomeClient() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const current = useAsyncData(() => legislaturesGateway.getCurrent(), "current");
    const toutes = useAsyncData(() => legislaturesGateway.getAll(), "all");
    const numero = current.data?.number ?? null;
    // Mur et tablette décoratifs : en cas d'échec, ils restent vides (la tablette saute
    // les écrans des groupes ou du scrutin s'ils n'ont pas pu être chargés).
    const cards = useAsyncData(numero === null ? null : () => deputesGateway.getDeputesCardsSample(numero), `cards|${numero}`);
    // Dernier scrutin important (premier de la liste par défaut, la plus récente d'abord).
    const scrutin = useAsyncData(
        numero === null ? null : () => scrutinsGateway.getScrutinsList(numero, { pageSize: "1" }).then((p) => p.items[0] ?? null),
        `scrutin|${numero}`
    );
    const groupes = useAsyncData(numero === null ? null : () => groupesGateways.getGroupesCards(numero), `groupes|${numero}`);
    const chiffres = useAsyncData(numero === null ? null : () => legislaturesGateway.getChiffres(numero), `chiffres|${numero}`);
    const couvertes = resumeLegislaturesCouvertes(toutes.data ?? []);
    const sample = cards.data ?? [];

    return (
        <div className="home">
            {/* Fond de TOUTE la page (premier écran et sections), collé à l'écran au défilement. */}
            <CardWall cards={sample} />

            <div className="home__layout">

                <section className="home__hero">
                    <div className="home__logo">
                        {mounted && (
                            <Image
                                src={
                                    resolvedTheme === "light"
                                        ? "/assets/imgs/ASS_DEX_LIGHT.svg"
                                        : "/assets/imgs/ASS_DEX_ACC.svg"
                                }
                                alt="Députédex - base de données des députés français"
                                width={300}
                                height={174}
                                priority
                            />
                        )}
                    </div>

                    {numero !== null && <span className="page-pill">{libelleLegislature(numero)} en cours</span>}

                    <h1 className="home__title">Bienvenue sur Députédex</h1>
                    <p className="subtitle home__lead">
                        La base de données interactive des députés français : mandats, groupes
                        parlementaires, scrutins, votes et statistiques de l&apos;Assemblée nationale.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-1">
                        <Link href="/deputydex">
                            <ButtonLib text="Explorer les députés" variant="primary" size="large" />
                        </Link>
                        <Link href="/hemicycle">
                            <ButtonLib text="Voir l'hémicycle" variant="secondary" size="large" />
                        </Link>
                    </div>

                    {couvertes && <p className="home__coverage">{couvertes}</p>}
                </section>

                <HomeTablet
                    cards={sample}
                    legislature={numero !== null ? libelleLegislature(numero) : null}
                    scrutin={scrutin.data ?? null}
                    groupes={groupes.data ?? []}
                />
            </div>

            <div className="home__sections">
                {numero !== null && <HomeChiffres numero={numero} chiffres={chiffres} />}
                <HomeExplorer />
                <HomeStatistiques />
            </div>
        </div>
    );
}
