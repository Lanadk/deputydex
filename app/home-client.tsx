"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";
import { CardWall } from "@/app/(ui)/components/home/card-wall";
import { HomeTablet } from "@/app/(ui)/components/home/home-tablet";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { HomeStatistiques } from "@/app/(ui)/components/home/home-sections";
import { resumeLegislaturesCouvertes } from "@/app/(ui)/components/home/home-legislatures";
import { HomeMois } from "@/app/(ui)/components/home/home-mois";
import { HomeAssembleeChiffres } from "@/app/(ui)/components/home/home-assemblee-chiffres";
import { ScrollHintLib } from "@/app/(ui)/component-library/molecules/scroll-hint/scroll-hint-lib";

/** Nombre de derniers scrutins importants montrés dans « Ce mois-ci ». */
const HOME_DERNIERS_VOTES = 3;

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
    // Les 3 derniers scrutins importants (liste par défaut, la plus récente d'abord) :
    // section « Ce mois-ci », et le premier sur la tablette.
    const derniers = useAsyncData(
        numero === null ? null : () => scrutinsGateway.getScrutinsList(numero, { pageSize: String(HOME_DERNIERS_VOTES) }),
        `derniers|${numero}`
    );
    const groupes = useAsyncData(numero === null ? null : () => groupesGateways.getGroupesCards(numero), `groupes|${numero}`);
    const tendances = useAsyncData(numero === null ? null : () => deputesGateway.getDeputesTendances(numero), `tendances|${numero}`);
    const plusSerre = useAsyncData(numero === null ? null : () => scrutinsGateway.getScrutinPlusSerre(numero), `serre|${numero}`);
    const chiffres = useAsyncData(numero === null ? null : () => legislaturesGateway.getChiffres(numero), `chiffres|${numero}`);
    // Fiche miniature de la tablette : le député le plus assidu du mois, avec ses vraies
    // stats de vote et son vrai calendrier d'activité (rien d'inventé sur une vraie personne).
    const assidu = tendances.data?.assidu?.depute ?? null;
    const fiche = useAsyncData(
        numero === null || !assidu ? null : () => Promise.all([
            deputesGateway.getDeputeVoteStats(assidu.deputeUID, numero),
            deputesGateway.getDeputeActivityCalendar(assidu.deputeUID, numero),
        ]).then(([stats, activite]) => ({ depute: assidu, stats, activite })),
        `fiche|${assidu?.deputeUID}|${numero}`
    );
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

                    {couvertes && <p className="home__coverage">{couvertes}</p>}
                </section>

                <HomeTablet
                    cards={sample}
                    legislature={numero !== null ? libelleLegislature(numero) : null}
                    scrutin={derniers.data?.items[0] ?? null}
                    groupes={groupes.data ?? []}
                    fiche={fiche.data ?? null}
                />

                <ScrollHintLib
                    target="home-suite"
                    label={numero !== null ? "Défiler pour l'actu" : "Défiler pour la suite"}
                    className="home__scroll-hint"
                />
            </div>

            {/* Sous le premier écran, deux « pages » d'un écran de haut chacune :
                l'actu, puis l'Assemblée en chiffres (porte d'entrée des rubriques) et les statistiques. */}
            <div id="home-suite" className="home__sections">
                {numero !== null && (
                    <div className="home-panel home-panel--actu">
                        <HomeMois derniers={derniers} tendances={tendances} plusSerre={plusSerre} />
                        <ScrollHintLib target="home-explorer-page" label="Défiler pour explorer" className="home__scroll-hint" />
                    </div>
                )}
                <div id="home-explorer-page" className="home-panel">
                    {numero !== null && <HomeAssembleeChiffres numero={numero} chiffres={chiffres} groupes={groupes.data ?? []} />}
                    <HomeStatistiques />
                </div>
            </div>
        </div>
    );
}
