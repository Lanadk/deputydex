"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { DeviceFrameLib } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib";
import { NAVITEMS } from "@/app/(ui)/components/sidebar/nave-items";
import { usePrefersReducedMotion } from "@/app/(ui)/_shared/hook/use-prefers-reduced-motion";
import {
    EcranActivite,
    EcranDeputes,
    EcranGroupes,
    EcranScrutin,
    EcranStats,
    HomeTabletFiche,
} from "@/app/(ui)/components/home/home-tablet-ecrans";

/**
 * Durée d'affichage de chaque écran de l'app, en ms : c'est la durée de la barre
 * de progression de la légende, dont la fin déclenche l'écran suivant.
 */
export const HOME_TABLET_SCREEN_MS = 10_000;

type EcranId = "deputes" | "activite" | "groupes" | "stats" | "scrutin";

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
        id: "activite",
        titre: "Fiche député",
        href: "/deputydex",
        accroche: "Suivre l'activité de chaque député",
        texte: "Pour chaque député : son calendrier d'activité jour par jour, ses votes, sa fidélité à son groupe, ses amendements et les dossiers qu'il a portés.",
        lien: "Trouver un député",
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
        texte: "Participation et présence aux scrutins, cohésion des groupes, qui vote avec qui, parité, âge, métiers d'origine : des graphiques expliqués simplement.",
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

/** Écrans montrés : ceux de la fiche, des groupes et du scrutin seulement si leurs données ont été chargées. */
export function ecransDisponibles(
    scrutin: ScrutinListItemDTO | null,
    groupes: GroupeCardDTO[] = [],
    fiche: HomeTabletFiche | null = null
): Ecran[] {
    return ECRANS.filter((e) =>
        (e.id !== "scrutin" || scrutin !== null)
        && (e.id !== "groupes" || groupes.length > 0)
        && (e.id !== "activite" || fiche !== null)
    );
}

/** Distance horizontale (px) d'un glissement de pointeur qui change de sujet. */
const SEUIL_GLISSEMENT_PX = 50;
/** Défilement horizontal cumulé (trackpad) qui change de sujet. */
const SEUIL_MOLETTE_PX = 60;
/** Après un changement à la molette, délai avant d'en accepter un autre (un geste = un sujet). */
const PAUSE_MOLETTE_MS = 700;

/**
 * Gestes horizontaux sur la tablette : glissement de pointeur (souris, doigt),
 * ou défilement horizontal (trackpad). `aller(+1)` vers la gauche, comme on
 * tourne une page ; `aller(-1)` vers la droite. Un geste surtout vertical est
 * laissé au défilement de la page.
 */
function useGlissementHorizontal(aller: (pas: number) => void) {
    const depart = useRef<{ x: number; y: number } | null>(null);
    const molette = useRef({ cumul: 0, bloqueJusqua: 0 });

    return {
        onPointerDown: (e: React.PointerEvent) => {
            if (e.isPrimary) depart.current = { x: e.clientX, y: e.clientY };
        },
        onPointerUp: (e: React.PointerEvent) => {
            const d = depart.current;
            depart.current = null;
            if (!d) return;
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            if (Math.abs(dx) >= SEUIL_GLISSEMENT_PX && Math.abs(dx) > Math.abs(dy)) aller(dx < 0 ? 1 : -1);
        },
        onPointerCancel: () => {
            depart.current = null;
        },
        onWheel: (e: React.WheelEvent) => {
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            const m = molette.current;
            if (Date.now() < m.bloqueJusqua) return;
            m.cumul += e.deltaX;
            if (Math.abs(m.cumul) < SEUIL_MOLETTE_PX) return;
            aller(m.cumul > 0 ? 1 : -1);
            m.cumul = 0;
            m.bloqueJusqua = Date.now() + PAUSE_MOLETTE_MS;
        },
    };
}

/** Icônes de la barre latérale : les rubriques du vrai menu. */
const MENU = NAVITEMS.filter((item) => item.section === "deputydex");

type TabletAppProps = {
    ecrans: Ecran[];
    position: number;
    cards: DeputesCardDTO[];
    legislature: string | null;
    scrutin: ScrutinListItemDTO | null;
    groupes: GroupeCardDTO[];
    fiche: HomeTabletFiche | null;
};

/** L'écran de la tablette : barre latérale du site, en-tête, écrans superposés, points de pagination. */
function TabletApp({ ecrans, position, cards, legislature, scrutin, groupes, fiche }: TabletAppProps) {
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
                            {e.id === "activite" && fiche && <EcranActivite fiche={fiche} />}
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
 * enchaîne des aperçus (voir `home-tablet-ecrans.tsx`) — la grille du DéputéDex,
 * une fiche député (activité), les groupes, des graphiques, le dernier scrutin
 * important. Sous la tablette, une légende dit ce que la rubrique affichée
 * permet de faire, avec un lien et une barre de progression : c'est la FIN de
 * cette barre qui fait passer à l'écran suivant (pas de minuteur à part, qui
 * se décalerait de la barre). On peut aussi changer de sujet à la main : en
 * glissant la tablette, en défilant horizontalement, ou avec les boutons ‹ ›.
 * La tablette est décorative (`aria-hidden`), la légende non. Sans animation si
 * l'utilisateur la refuse : pas de barre, premier écran fixe.
 */
export function HomeTablet({ cards, legislature, scrutin = null, groupes = [], fiche = null }: {
    cards: DeputesCardDTO[];
    legislature: string | null;
    scrutin?: ScrutinListItemDTO | null;
    groupes?: GroupeCardDTO[];
    fiche?: HomeTabletFiche | null;
}) {
    const ecrans = ecransDisponibles(scrutin, groupes, fiche);
    const reduit = usePrefersReducedMotion();
    // Écran suivi par son id : un écran qui apparaît en cours de route (données
    // chargées après coup) ne fait pas sauter l'écran affiché.
    const [actifId, setActifId] = useState<EcranId>(ecrans[0].id);
    const position = Math.max(ecrans.findIndex((e) => e.id === actifId), 0);
    const actif = ecrans[position];
    /** Change de sujet de `pas` écrans (±1), en boucle. La barre de progression repart de zéro. */
    const aller = (pas: number) => setActifId(ecrans[(position + pas + ecrans.length) % ecrans.length].id);
    const suivant = () => aller(1);
    const glisser = useGlissementHorizontal(aller);

    return (
        <div className="home-tablet">
            {/* Glisser la tablette (souris, doigt) ou défiler horizontalement (trackpad) change
                de sujet. Les gestes sont captés ici : la tablette elle-même est inerte. */}
            <div className="home-tablet__swipe" data-testid="home-tablet-swipe" {...glisser}>
                {/* `inert` : les cartes de la grille sont des liens ; dans la maquette, ni focus ni clic. */}
                <div className="home-tablet__stage" aria-hidden="true" inert>
                    <DeviceFrameLib device="tablet" className="home-tablet__frame">
                        <TabletApp ecrans={ecrans} position={position} cards={cards} legislature={legislature} scrutin={scrutin} groupes={groupes} fiche={fiche} />
                    </DeviceFrameLib>
                </div>
            </div>

            {/* Légende de l'écran affiché : ce que la rubrique permet de faire. Pas de région
                « live » : un texte qui change seul toutes les 10 s serait lu en boucle. */}
            <div key={actif.id} className="home-tablet__caption" data-testid="home-tablet-caption">
                {ecrans.length > 1 && (
                    <div className="home-tablet__nav">
                        <span className="home-tablet__nav-position">{position + 1} / {ecrans.length}</span>
                        <button type="button" className="home-tablet__nav-btn" onClick={() => aller(-1)} aria-label="Sujet précédent">
                            <ChevronLeft size={18} aria-hidden="true" />
                        </button>
                        <button type="button" className="home-tablet__nav-btn" onClick={() => aller(1)} aria-label="Sujet suivant">
                            <ChevronRight size={18} aria-hidden="true" />
                        </button>
                    </div>
                )}
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
