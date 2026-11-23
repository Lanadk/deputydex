"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { compareGroupesGaucheDroite } from "@/app/domains/groupes/constants/groupe-ordre-hemicycle.constants";
import { DeviceFrameLib } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { NAVITEMS } from "@/app/(ui)/components/sidebar/nave-items";
import { scrutinResultatColor } from "@/app/(ui)/_shared/adapter/scrutin-resultat.adapter";
import { formatJourFr } from "@/app/_shared/utils/date";
import { capitalizeFirst } from "@/app/_shared/utils/string";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
    getGroupFullLabel,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/** Nombre maximal de cartes de la grille miniature du DéputéDex (deux rangées de six). */
export const HOME_TABLET_DEPUTES = 12;

const estNonInscrit = (code: string) => code === "NI" || code.startsWith("NI-");

/**
 * Cartes de la grille miniature : un député par groupe, de la gauche vers la
 * droite de l'hémicycle — seulement des députés avec photo, sans les non-inscrits.
 */
export function deputesVitrine(cards: DeputesCardDTO[]): DeputesCardDTO[] {
    const parGroupe = new Map<string, DeputesCardDTO>();
    for (const card of cards) {
        const code = card.deputeGroupeCode;
        if (!code || estNonInscrit(code) || !card.deputeImage || parGroupe.has(code)) continue;
        parGroupe.set(code, card);
    }
    return [...parGroupe.values()]
        .sort((a, b) => compareGroupesGaucheDroite(a.deputeGroupeCode, b.deputeGroupeCode))
        .slice(0, HOME_TABLET_DEPUTES);
}
/**
 * Durée d'affichage de chaque écran de l'app, en ms : c'est la durée de la barre
 * de progression de la légende, dont la fin déclenche l'écran suivant.
 */
export const HOME_TABLET_SCREEN_MS = 15_000;

type EcranId = "deputes" | "groupes" | "stats" | "scrutin";
/**
 * `href` : rubrique du site (surbrillance dans la barre latérale, lien de la légende).
 * `accroche` / `texte` / `lien` : légende sous la tablette, ce que la rubrique permet de faire.
 */
type Ecran = { id: EcranId; titre: string; href: string; accroche: string; texte: string; lien: string };

const ECRANS: Ecran[] = [
    {
        id: "deputes",
        titre: "DéputéDex",
        href: "/deputydex",
        accroche: "Explorer les députés de l'Assemblée nationale",
        texte: "Les 577 députés en cartes, à filtrer par groupe. Chaque fiche raconte un mandat : son groupe, ses votes et son activité.",
        lien: "Ouvrir le DéputéDex",
    },
    {
        id: "groupes",
        titre: "Groupes",
        href: "/groupes",
        accroche: "Comprendre les groupes politiques",
        texte: "Qui siège avec qui : le poids de chaque groupe dans l'hémicycle, sa présidence, ses membres, et sa façon de voter — cohésion, participation, proximité avec les autres groupes.",
        lien: "Découvrir les groupes",
    },
    {
        id: "stats",
        titre: "Statistiques",
        href: "/statistics",
        accroche: "Analyser l'Assemblée en graphiques",
        texte: "Participation et présence aux scrutins, cohésion des groupes, qui vote avec qui, parité, âge, métiers d'origine : des graphiques expliqués, et un mode avancé pour comparer.",
        lien: "Voir les statistiques",
    },
    {
        id: "scrutin",
        titre: "Scrutins",
        href: "/scrutins",
        accroche: "Découvrir les résultats des scrutins",
        texte: "Chaque scrutin public, du plus récent au plus ancien : adopté ou rejeté, et comment chaque groupe et chaque député a voté, siège par siège dans l'hémicycle.",
        lien: "Parcourir les scrutins",
    },
];

/** Écrans montrés : ceux des groupes et du scrutin seulement si leurs données ont été chargées. */
export function ecransDisponibles(scrutin: ScrutinListItemDTO | null, groupes: GroupeCardDTO[] = []): Ecran[] {
    return ECRANS.filter((e) => (e.id !== "scrutin" || scrutin !== null) && (e.id !== "groupes" || groupes.length > 0));
}

/** Groupes de la gauche vers la droite de l'hémicycle (sans les groupes vides). */
export function groupesGaucheDroite(groupes: GroupeCardDTO[]): GroupeCardDTO[] {
    return groupes
        .filter((g) => g.groupeCountMembers > 0)
        .sort((a, b) => compareGroupesGaucheDroite(a.groupeCode, b.groupeCode));
}

/** Icônes de la barre latérale : les rubriques du vrai menu. */
const MENU = NAVITEMS.filter((item) => item.section === "deputydex");

function usePrefersReducedMotion(): boolean {
    const [reduit, setReduit] = useState(false);
    useEffect(() => {
        const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!media) return;
        const maj = () => setReduit(media.matches);
        maj();
        media.addEventListener("change", maj);
        return () => media.removeEventListener("change", maj);
    }, []);
    return reduit;
}

/**
 * Le DéputéDex en miniature : la vraie grille de la page (`DeputyCard`), avec
 * un député par groupe (voir `deputesVitrine`), fixe. Réduite par `zoom` en CSS.
 */
function EcranDeputes({ cards }: { cards: DeputesCardDTO[] }) {
    const vitrine = useMemo(() => deputesVitrine(cards), [cards]);
    return (
        <div className="home-tablet__deputes">
            <div className="home-tablet__toolbar">
                <span className="home-tablet__search"><Search size={12} /> Rechercher un député</span>
                <span className="home-tablet__chip">Groupe</span>
                <span className="home-tablet__chip">Trier : nom</span>
            </div>
            <div className="home-tablet__deputes-grid">
                {vitrine.map((d) => (
                    <DeputyCard
                        key={d.deputeUID}
                        uid={d.deputeUID}
                        nom={d.deputeFullName}
                        groupe={d.deputeGroupeCode}
                        image={d.deputeImage}
                        role={d.deputeRole}
                    />
                ))}
            </div>
        </div>
    );
}

/** Hauteurs / largeurs (en %) des barres d'illustration : formes seulement, sans valeur affichée. */
const BARRES = [92, 74, 58, 46, 33, 24, 15];
const COHESION = [94, 88, 81, 72, 63];

/** Aperçu des pages de statistiques : formes de graphiques, sans chiffres (illustration). */
function EcranStats() {
    return (
        <div className="home-tablet__stats">
            <div className="home-tablet__panel">
                <span className="home-tablet__panel-title">La taille des groupes</span>
                <div className="home-tablet__bars">
                    {BARRES.map((h, i) => (
                        <span key={i} style={{ height: `${h}%`, background: `var(--chart-${i + 1})`, animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
            </div>
            <div className="home-tablet__panel home-tablet__panel--row">
                <span className="home-tablet__donut" />
                <div className="flex flex-col gap-1">
                    <span className="home-tablet__panel-title">Les femmes à l&apos;Assemblée</span>
                    <span className="home-tablet__panel-text">Parité, législature après législature</span>
                </div>
            </div>
            <div className="home-tablet__panel">
                <span className="home-tablet__panel-title">Participation aux scrutins</span>
                <svg className="home-tablet__line" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <polyline points="0,42 22,30 44,36 66,18 88,26 110,14 132,22 154,10 176,20 200,8" />
                </svg>
            </div>
            <div className="home-tablet__panel">
                <span className="home-tablet__panel-title">La cohésion des groupes</span>
                <div className="home-tablet__hbars">
                    {COHESION.map((w, i) => (
                        <span key={i} style={{ width: `${w}%`, background: `var(--chart-${i + 2})`, animationDelay: `${i * 80}ms` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const nombre = (n: number | null) => (n ?? 0).toLocaleString("fr-FR");

/** Le dernier scrutin important de la législature en cours (données réelles). */
function EcranScrutin({ scrutin }: { scrutin: ScrutinListItemDTO }) {
    const pour = scrutin.pour ?? 0;
    const contre = scrutin.contre ?? 0;
    const abstentions = scrutin.abstentions ?? 0;
    const total = Math.max(pour + contre + abstentions, 1);
    return (
        <div className="home-tablet__scrutin">
            <span className="home-tablet__panel-text">
                {scrutin.numero ? `Scrutin n° ${scrutin.numero}` : "Scrutin"}{scrutin.date ? ` · ${formatJourFr(scrutin.date)}` : ""}
                {scrutin.type.libelle ? ` · ${scrutin.type.libelle}` : ""}
            </span>
            <p className="home-tablet__scrutin-titre">{capitalizeFirst(scrutin.titre ?? scrutin.objet.libelle)}</p>
            <span className="home-tablet__badge" style={{ background: scrutinResultatColor(scrutin.resultat.isAdopte) }}>
                {scrutin.resultat.isAdopte ? "Adopté" : "Rejeté"}
            </span>
            <div className="home-tablet__votes">
                <span style={{ width: `${(pour / total) * 100}%`, background: "var(--vote-pour)" }} />
                <span style={{ width: `${(contre / total) * 100}%`, background: "var(--vote-contre)" }} />
                <span style={{ width: `${(abstentions / total) * 100}%`, background: "var(--vote-abstention)" }} />
            </div>
            <dl className="home-tablet__counts">
                <div><dt>Pour</dt><dd style={{ color: "var(--vote-pour)" }}>{nombre(scrutin.pour)}</dd></div>
                <div><dt>Contre</dt><dd style={{ color: "var(--vote-contre)" }}>{nombre(scrutin.contre)}</dd></div>
                <div><dt>Abstention</dt><dd style={{ color: "var(--vote-abstention)" }}>{nombre(scrutin.abstentions)}</dd></div>
            </dl>
        </div>
    );
}

/** Les groupes de la législature en cours (données réelles) : répartition des sièges, puis un groupe par ligne. */
function EcranGroupes({ groupes }: { groupes: GroupeCardDTO[] }) {
    const lignes = groupesGaucheDroite(groupes);
    const total = Math.max(lignes.reduce((n, g) => n + g.groupeCountMembers, 0), 1);
    const couleur = (code: string) => getGroupCardTheme(getCanonicalGroupCode(code)).bg[0];
    return (
        <div className="home-tablet__groupes">
            <div className="flex items-baseline justify-between gap-2">
                <span className="home-tablet__panel-title">Répartition des sièges, de la gauche à la droite</span>
                <span className="home-tablet__panel-text">{nombre(total)} députés</span>
            </div>
            <div className="home-tablet__seats">
                {lignes.map((g, i) => (
                    <span
                        key={g.groupeCode}
                        style={{ width: `${(g.groupeCountMembers / total) * 100}%`, background: couleur(g.groupeCode), animationDelay: `${i * 50}ms` }}
                    />
                ))}
            </div>
            <ul className="home-tablet__groupes-list">
                {lignes.map((g, i) => (
                    <li key={g.groupeCode} style={{ animationDelay: `${200 + i * 60}ms` }}>
                        <span className="home-tablet__groupe-chip" style={{ background: couleur(g.groupeCode) }} />
                        <span className="home-tablet__groupe-code">{g.groupeCode}</span>
                        <span className="home-tablet__groupe-nom">
                            {getGroupFullLabel(g.groupeCode)}
                            {g.groupePresidentFullName && <span className="home-tablet__panel-text"> · {g.groupePresidentFullName}</span>}
                        </span>
                        <span className="home-tablet__groupe-count">{nombre(g.groupeCountMembers)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

type TabletAppProps = {
    ecrans: Ecran[];
    position: number;
    cards: DeputesCardDTO[];
    legislature: string | null;
    scrutin: ScrutinListItemDTO | null;
    groupes: GroupeCardDTO[];
};

/** L'écran de la tablette : barre latérale du site, en-tête, écrans superposés, points de pagination. */
function TabletApp({ ecrans, position, cards, legislature, scrutin, groupes }: TabletAppProps) {
    const actif = ecrans[position];
    return (
        <div className="home-tablet__app">
            <div className="home-tablet__rail">
                {MENU.map((item) => (
                    <span key={item.href} className={`home-tablet__rail-item${item.href === actif.href ? " is-active" : ""}`}>
                        <item.icon size={15} />
                    </span>
                ))}
            </div>

            <div className="home-tablet__main">
                <div className="home-tablet__header">
                    <span key={actif.id} className="home-tablet__title">{actif.titre}</span>
                    {legislature && <span className="home-tablet__pill">{legislature}</span>}
                </div>

                <div className="home-tablet__screens">
                    {ecrans.map((e, i) => (
                        <div
                            key={e.id}
                            className={`home-tablet__screen${i === position ? " is-active" : ""}${i < position ? " is-past" : ""}`}
                            data-screen={e.id}
                        >
                            {e.id === "deputes" && <EcranDeputes cards={cards} />}
                            {e.id === "groupes" && <EcranGroupes groupes={groupes} />}
                            {e.id === "stats" && <EcranStats />}
                            {e.id === "scrutin" && scrutin && <EcranScrutin scrutin={scrutin} />}
                        </div>
                    ))}
                </div>

                <div className="home-tablet__dots">
                    {ecrans.map((e, i) => <span key={e.id} className={i === position ? "is-active" : undefined} />)}
                </div>
            </div>
        </div>
    );
}

/**
 * Maquette de l'app sur l'accueil : une tablette en paysage, inclinée vers la
 * gauche (vers le texte). Son écran reprend la barre latérale du site et
 * enchaîne des aperçus — la grille du DéputéDex, les groupes, des graphiques,
 * le résultat du dernier scrutin important. Sous la tablette, une légende dit
 * ce que la rubrique affichée permet de faire, avec un lien et une barre de
 * progression : c'est la FIN de cette barre qui fait passer à l'écran suivant
 * (pas de minuteur à part, qui se décalerait de la barre).
 * La tablette est décorative (`aria-hidden`), la légende non. Sans animation si
 * l'utilisateur la refuse : pas de barre, premier écran fixe.
 */
export function HomeTablet({ cards, legislature, scrutin = null, groupes = [] }: {
    cards: DeputesCardDTO[];
    legislature: string | null;
    scrutin?: ScrutinListItemDTO | null;
    groupes?: GroupeCardDTO[];
}) {
    const ecrans = ecransDisponibles(scrutin, groupes);
    const reduit = usePrefersReducedMotion();
    // Écran suivi par son id : un écran qui apparaît en cours de route (données
    // chargées après coup) ne fait pas sauter l'écran affiché.
    const [actifId, setActifId] = useState<EcranId>(ecrans[0].id);
    const position = Math.max(ecrans.findIndex((e) => e.id === actifId), 0);
    const actif = ecrans[position];
    const suivant = () => setActifId(ecrans[(position + 1) % ecrans.length].id);

    return (
        <div className="home-tablet">
            {/* `inert` : les cartes de la grille sont des liens ; dans la maquette, ni focus ni clic. */}
            <div className="home-tablet__stage" aria-hidden="true" inert>
                <DeviceFrameLib device="tablet" className="home-tablet__frame">
                    <TabletApp ecrans={ecrans} position={position} cards={cards} legislature={legislature} scrutin={scrutin} groupes={groupes} />
                </DeviceFrameLib>
            </div>

            {/* Légende de l'écran affiché : ce que la rubrique permet de faire. Pas de région
                « live » : un texte qui change seul toutes les 15 s serait lu en boucle. */}
            <div key={actif.id} className="home-tablet__caption" data-testid="home-tablet-caption">
                <p className="home-tablet__caption-title">{actif.accroche}</p>
                <p className="home-tablet__caption-text">{actif.texte}</p>
                <Link href={actif.href} className="home-section__more">
                    {actif.lien} <ArrowRight size={16} aria-hidden="true" />
                </Link>
                {!reduit && (
                    <span
                        className="home-tablet__progress"
                        aria-hidden="true"
                        data-testid="home-tablet-progress"
                        style={{ animationDuration: `${HOME_TABLET_SCREEN_MS}ms` }}
                        onAnimationEnd={suivant}
                    />
                )}
            </div>
        </div>
    );
}
