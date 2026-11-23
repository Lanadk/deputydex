"use client";

import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { ActivityCalendarDay } from "@/app/_shared/calendar/activity-calendar-day.dto";
import { compareGroupesGaucheDroite } from "@/app/domains/groupes/constants/groupe-ordre-hemicycle.constants";
import { grilleActivite } from "@/app/(ui)/components/home/home-activite.helpers";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";
import { scrutinResultatColor } from "@/app/(ui)/_shared/adapter/scrutin-resultat.adapter";
import { formatJourFr } from "@/app/_shared/utils/date";
import { capitalizeFirst } from "@/app/_shared/utils/string";
import {
    getCanonicalGroupCode,
    getGroupCardTheme,
    getGroupFullLabel,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/*
 * Les écrans de la tablette de l'accueil (voir `HomeTablet`) : chacun est un
 * aperçu d'une rubrique de l'app, avec de vraies données sauf l'écran des
 * statistiques (formes de graphiques, sans chiffres).
 */

/** Nombre maximal de cartes de la grille miniature du DéputéDex (deux rangées de six). */
export const HOME_TABLET_DEPUTES = 12;

/** Semaines affichées dans le calendrier d'activité de la fiche miniature. */
const SEMAINES_ACTIVITE = 26;

/** Fiche député miniature (écran « activité ») : données réelles d'un député. */
export type HomeTabletFiche = {
    depute: DeputesCardDTO;
    stats: DeputeVoteStatsDTO;
    activite: ActivityCalendarDay[];
};

const nombre = (n: number | null) => (n ?? 0).toLocaleString("fr-FR");
const pourcent = (taux: number | null) => (taux === null ? "–" : `${Math.round(taux)} %`);
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

/** Groupes de la gauche vers la droite de l'hémicycle (sans les groupes vides). */
export function groupesGaucheDroite(groupes: GroupeCardDTO[]): GroupeCardDTO[] {
    return groupes
        .filter((g) => g.groupeCountMembers > 0)
        .sort((a, b) => compareGroupesGaucheDroite(a.groupeCode, b.groupeCode));
}

/**
 * Le DéputéDex en miniature : la vraie grille de la page (`DeputyCard`), avec
 * un député par groupe (voir `deputesVitrine`), fixe. Réduite par `zoom` en CSS.
 */
export function EcranDeputes({ cards }: { cards: DeputesCardDTO[] }) {
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

/**
 * Fiche député miniature (données réelles) : identité, quelques chiffres de
 * vote et le calendrier d'activité des derniers mois, comme sur sa vraie fiche.
 */
export function EcranActivite({ fiche }: { fiche: HomeTabletFiche }) {
    const { depute, stats, activite } = fiche;
    const theme = getGroupCardTheme(getCanonicalGroupCode(depute.deputeGroupeCode));
    const grille = useMemo(() => grilleActivite(activite, SEMAINES_ACTIVITE), [activite]);
    return (
        <div className="home-tablet__fiche">
            <div className="home-tablet__fiche-tete">
                <span className="home-tablet__fiche-photo" style={{ background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- photos servies telles quelles, comme sur les cartes */}
                    {depute.deputeImage && <img src={depute.deputeImage} alt="" />}
                </span>
                <span className="flex min-w-0 flex-col">
                    <span className="home-tablet__fiche-nom">{depute.deputeFullName}</span>
                    <span className="home-tablet__panel-text">{getGroupFullLabel(depute.deputeGroupeCode)}</span>
                </span>
            </div>

            <div className="home-tablet__fiche-kpis">
                <span><strong>{pourcent(stats.tauxParticipation)}</strong>participation</span>
                <span><strong>{pourcent(stats.tauxFidelite)}</strong>fidélité au groupe</span>
                <span><strong>{nombre(stats.totalVotes)}</strong>votes</span>
            </div>

            <div className="home-tablet__panel">
                <span className="home-tablet__panel-title">Activité, semaine par semaine</span>
                <div className="home-tablet__calendrier">
                    {grille.map((semaine, s) => (
                        <span key={s} className="home-tablet__calendrier-semaine">
                            {semaine.map((niveau, j) => (
                                <span key={j} className="home-tablet__calendrier-jour" data-niveau={niveau} style={{ animationDelay: `${s * 25}ms` }} />
                            ))}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Les groupes de la législature en cours (données réelles) : répartition des sièges, puis un groupe par ligne. */
export function EcranGroupes({ groupes }: { groupes: GroupeCardDTO[] }) {
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

/** Hauteurs / largeurs (en %) des barres d'illustration : formes seulement, sans valeur affichée. */
const BARRES = [92, 74, 58, 46, 33, 24, 15];
const COHESION = [94, 88, 81, 72, 63];

/** Aperçu des pages de statistiques : formes de graphiques, sans chiffres (illustration). */
export function EcranStats() {
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

/** Le dernier scrutin important de la législature en cours (données réelles). */
export function EcranScrutin({ scrutin }: { scrutin: ScrutinListItemDTO }) {
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
