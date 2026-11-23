"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useInitialAsyncData } from "@/app/(ui)/_shared/hook/use-initial-async-data";
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
import { ScrollProgressLib } from "@/app/(ui)/component-library/molecules/scroll-progress/scroll-progress-lib";
import { HOME_DERNIERS_VOTES } from "@/app/(ui)/components/home/home-mois.helpers";
import type { HomeData } from "@/app/home-data";

/**
 * Accueil. Il présente la législature EN COURS lue en base, pas celle du
 * sélecteur global : changer de législature ailleurs sur le site ne modifie pas
 * l'accueil (le sélecteur y est masqué).
 *
 * Toutes les données arrivent du serveur (`initial`, voir `getHomeData`) : aucun
 * appel API au chargement. Un bloc indisponible côté serveur (`null`) est
 * rechargé ici, avec chargement, erreur et « Réessayer ».
 */
export default function HomeClient({ initial }: { initial: HomeData }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const current = useInitialAsyncData(initial.legislature, () => legislaturesGateway.getCurrent(), "current");
    const toutes = useInitialAsyncData(initial.legislatures, () => legislaturesGateway.getAll(), "all");
    const numero = current.data?.number ?? null;
    const pour = <T,>(charger: (n: number) => Promise<T>) => (numero === null ? null : () => charger(numero));
    // Mur et tablette décoratifs : en cas d'échec, ils restent vides (la tablette saute
    // les écrans des groupes ou du scrutin s'ils n'ont pas pu être chargés).
    const cards = useInitialAsyncData(initial.cards, pour((n) => deputesGateway.getDeputesCardsSample(n)), `cards|${numero}`);
    // Les derniers scrutins importants (liste par défaut, la plus récente d'abord) :
    // actu, et le premier sur la tablette.
    const derniers = useInitialAsyncData(
        initial.derniers,
        pour((n) => scrutinsGateway.getScrutinsList(n, { pageSize: String(HOME_DERNIERS_VOTES) })),
        `derniers|${numero}`
    );
    const groupes = useInitialAsyncData(initial.groupes, pour((n) => groupesGateways.getGroupesCards(n)), `groupes|${numero}`);
    const tendances = useInitialAsyncData(initial.tendances, pour((n) => deputesGateway.getDeputesTendances(n)), `tendances|${numero}`);
    const plusSerre = useInitialAsyncData(initial.plusSerre, pour((n) => scrutinsGateway.getScrutinPlusSerre(n)), `serre|${numero}`);
    const chiffres = useInitialAsyncData(initial.chiffres, pour((n) => legislaturesGateway.getChiffres(n)), `chiffres|${numero}`);
    // Fiche miniature de la tablette : le député le plus assidu du mois, avec ses vraies
    // stats de vote et son vrai calendrier d'activité (rien d'inventé sur une vraie personne).
    const assidu = tendances.data?.assidu?.depute ?? null;
    const fiche = useInitialAsyncData(
        initial.fiche,
        numero === null || !assidu ? null : () => Promise.all([
            deputesGateway.getDeputeVoteStats(assidu.deputeUID, numero),
            deputesGateway.getDeputeActivityCalendar(assidu.deputeUID, numero),
        ]).then(([stats, activite]) => ({ depute: assidu, stats, activite })),
        `fiche|${assidu?.deputeUID}|${numero}`
    );
    const couvertes = resumeLegislaturesCouvertes(toutes.data ?? []);
    const sample = cards.data ?? [];
    const sections = useMemo(() => [
        { id: "home-accueil", label: "Accueil" },
        ...(numero !== null ? [{ id: "home-actu", label: "L'actu" }] : []),
        { id: "home-explorer-page", label: "Explorer" },
    ], [numero]);

    return (
        <div className="home">
            {/* Fond de TOUTE la page (premier écran et sections), collé à l'écran au défilement. */}
            <CardWall cards={sample} />

            <div id="home-accueil" className="home__layout">

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

            </div>

            {/* Sous le premier écran, deux « pages » d'un écran de haut chacune :
                l'actu, puis l'Assemblée en chiffres (porte d'entrée des rubriques) et les statistiques. */}
            <div className="home__sections">
                {numero !== null && (
                    <div id="home-actu" className="home-panel home-panel--actu">
                        <HomeMois derniers={derniers} tendances={tendances} plusSerre={plusSerre} />
                    </div>
                )}
                <div id="home-explorer-page" className="home-panel home-panel--explorer">
                    {numero !== null && <HomeAssembleeChiffres numero={numero} chiffres={chiffres} groupes={groupes.data ?? []} />}
                    <HomeStatistiques />
                </div>
            </div>

            {/* Bord droit : où en est-on dans la page, et accès direct à chaque « page ». */}
            <ScrollProgressLib sections={sections} ariaLabel="Sections de l'accueil" />
        </div>
    );
}
