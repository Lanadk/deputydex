import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputeIndicateursDTO } from "@/app/domains/presence/dto/depute-indicateurs.dto";
import { HemicycleGroupe, HemicyclePerchoir } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { HemicycleSeat } from "@/app/(ui)/components/hemicycle/hemicycle-seats";

/**
 * Coloration des sièges de l'hémicycle par un indicateur agrégé par député,
 * rangé dans un thème (Présence : total, séance, commission, scrutins).
 * Ajouter un indicateur = une entrée dans son thème ; un nouveau thème = une
 * entrée de `THEMES_HEMICYCLE`. Les seuils de couleur sont les quartiles des
 * valeurs affichées, calculés à la volée (rien n'est propre à un indicateur ni
 * à une législature).
 */
export type IndicateurHemicycle = {
    id: string;
    /** Libellé du bouton de choix, dans son thème (ex. « Séance »). */
    label: string;
    /** Libellé complet, dans l'info-bulle et la légende (ex. « Présence en séance »). */
    libelle: string;
    lire: (indicateurs: DeputeIndicateursDTO) => number | null;
};

export type ThemeHemicycle = {
    id: string;
    label: string;
    indicateurs: IndicateurHemicycle[];
};

export const THEMES_HEMICYCLE: ThemeHemicycle[] = [
    {
        id: "presence",
        label: "Présence",
        indicateurs: [
            { id: "presence-total", label: "Total", libelle: "Taux de présence", lire: (d) => d.tauxPresence },
            { id: "presence-seance", label: "Séance", libelle: "Présence en séance", lire: (d) => d.tauxPresenceSeance },
            { id: "presence-commission", label: "Commission", libelle: "Présence en commission", lire: (d) => d.tauxPresenceCommission },
            { id: "presence-scrutins", label: "Scrutins", libelle: "Participation aux scrutins", lire: (d) => d.tauxParticipationScrutins },
        ],
    },
];

export const INDICATEURS_HEMICYCLE: IndicateurHemicycle[] = THEMES_HEMICYCLE.flatMap((t) => t.indicateurs);

/** Thème d'un indicateur (le premier thème à défaut). */
export function themeDe(indicateurId: string): ThemeHemicycle {
    return THEMES_HEMICYCLE.find((t) => t.indicateurs.some((i) => i.id === indicateurId)) ?? THEMES_HEMICYCLE[0];
}

/** En dessous, le taux repose sur trop peu de jours : siège hachuré, mention dans l'info-bulle. */
export const SEUIL_JOURS_FIABLES = 30;

export type Quartiles = { q1: number; mediane: number; q3: number };

/** Interpolation linéaire, comme `percentile_cont` de Postgres. `tries` : croissant, non vide. */
function percentile(tries: number[], p: number): number {
    const pos = (tries.length - 1) * p;
    const bas = Math.floor(pos);
    const haut = Math.ceil(pos);
    return tries[bas] + (tries[haut] - tries[bas]) * (pos - bas);
}

export function quartiles(valeurs: number[]): Quartiles | null {
    if (valeurs.length === 0) return null;
    const tries = [...valeurs].sort((a, b) => a - b);
    return { q1: percentile(tries, 0.25), mediane: percentile(tries, 0.5), q3: percentile(tries, 0.75) };
}

/** 3 = quart le plus élevé, 0 = quart le plus bas. */
export type RangTranche = 0 | 1 | 2 | 3;
export const RANGS_TRANCHES: RangTranche[] = [3, 2, 1, 0];

export function trancheDe(valeur: number, q: Quartiles): RangTranche {
    if (valeur >= q.q3) return 3;
    if (valeur >= q.mediane) return 2;
    if (valeur >= q.q1) return 1;
    return 0;
}

export const COULEURS_TRANCHES: Record<RangTranche, string> = {
    3: "#3fa865",
    2: "#e3c13b",
    1: "#e8912d",
    0: "#c85048",
};
export const COULEUR_SANS_DONNEE = "#8a8f98";

export const NOMS_TRANCHES: Record<RangTranche, string> = {
    3: "Quart le plus élevé",
    2: "2ᵉ quart",
    1: "3ᵉ quart",
    0: "Quart le plus bas",
};

export function formatTaux(valeur: number): string {
    return `${valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

export function bornesTranches(q: Quartiles): Record<RangTranche, string> {
    return {
        3: `≥ ${formatTaux(q.q3)}`,
        2: `${formatTaux(q.mediane)} – ${formatTaux(q.q3)}`,
        1: `${formatTaux(q.q1)} – ${formatTaux(q.mediane)}`,
        0: `< ${formatTaux(q.q1)}`,
    };
}

const parNom = (a: DeputesCardDTO, b: DeputesCardDTO) => a.deputeFullName.localeCompare(b.deputeFullName, "fr");

/**
 * Ordre des membres dans les sièges du groupe : par valeur décroissante
 * (sans valeur en dernier) quand un indicateur est choisi, ce qui dessine un
 * dégradé dans chaque bloc ; par nom sinon.
 */
function ordonner(membres: DeputesCardDTO[], valeur?: (uid: string) => number | null): DeputesCardDTO[] {
    if (!valeur) return [...membres].sort(parNom);
    return [...membres].sort((a, b) => {
        const va = valeur(a.deputeUID);
        const vb = valeur(b.deputeUID);
        if (va == null || vb == null) return va == null ? (vb == null ? parNom(a, b) : 1) : -1;
        return vb - va || parNom(a, b);
    });
}

/**
 * Concordance siège ↔ député : le siège de rang r d'un groupe reçoit son r-ième
 * membre (voir `ordonner`) ; le perchoir reçoit la présidence, retirée des
 * membres de son groupe. Clé : `seat.index`.
 */
export function assignerDeputes(
    seats: HemicycleSeat[],
    groupes: HemicycleGroupe[],
    perchoir: HemicyclePerchoir | null,
    valeur?: (uid: string) => number | null
): Map<number, DeputesCardDTO> {
    const auPerchoir = perchoir && seats.some((s) => s.perchoir) ? perchoir.carte.deputeUID : null;
    const membresParGroupe = new Map(
        groupes.map((g) => [g.code, ordonner(g.membres.filter((m) => m.deputeUID !== auPerchoir), valeur)])
    );

    const assignation = new Map<number, DeputesCardDTO>();
    for (const seat of seats) {
        const depute = seat.perchoir ? perchoir?.carte : membresParGroupe.get(seat.groupeCode)?.[seat.rank];
        if (depute) assignation.set(seat.index, depute);
    }
    return assignation;
}

export type HabillageSiege = {
    /** Couleur imposée (sinon celle du groupe). */
    background?: string;
    /** Info-bulle native : député, groupe, valeur. */
    title: string;
    /** Taux calculé sur moins de `SEUIL_JOURS_FIABLES` jours attendus. */
    peuFiable?: boolean;
};

export type EchelleHemicycle = {
    quartiles: Quartiles;
    comptes: Record<RangTranche, number>;
    sansDonnee: number;
    peuFiables: number;
};

/**
 * Habillage de chaque siège occupé. Sans indicateur (ou indicateurs non
 * chargés) : nom et groupe seulement, couleur du groupe. Avec : couleur de la
 * tranche de quartile, les quartiles étant ceux des députés affichés.
 */
export function habillerSieges(
    assignation: Map<number, DeputesCardDTO>,
    groupes: HemicycleGroupe[],
    indicateur: IndicateurHemicycle | null,
    indicateurs: Map<string, DeputeIndicateursDTO> | null
): { habillage: Map<number, HabillageSiege>; echelle: EchelleHemicycle | null } {
    const sigles = new Map(groupes.map((g) => [g.code, g.shortLabel]));
    const identite = (d: DeputesCardDTO) => `${d.deputeFullName} · ${sigles.get(d.deputeGroupeCode) ?? d.deputeGroupeCode}`;
    const habillage = new Map<number, HabillageSiege>();

    if (!indicateur || !indicateurs) {
        assignation.forEach((d, index) => habillage.set(index, { title: identite(d) }));
        return { habillage, echelle: null };
    }

    const lire = (d: DeputesCardDTO) => {
        const ligne = indicateurs.get(d.deputeUID);
        return { valeur: ligne ? indicateur.lire(ligne) : null, jours: ligne?.joursAttendus ?? null };
    };
    const q = quartiles([...assignation.values()].map((d) => lire(d).valeur).filter((v): v is number => v != null));
    const comptes: Record<RangTranche, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    let sansDonnee = 0;
    let peuFiables = 0;

    assignation.forEach((d, index) => {
        const { valeur, jours } = lire(d);
        if (valeur == null || !q) {
            sansDonnee++;
            habillage.set(index, { background: COULEUR_SANS_DONNEE, title: `${identite(d)}\n${indicateur.libelle} : pas de donnée` });
            return;
        }
        const rang = trancheDe(valeur, q);
        const peuFiable = jours != null && jours < SEUIL_JOURS_FIABLES;
        comptes[rang]++;
        if (peuFiable) peuFiables++;
        const surJours = jours != null ? ` (sur ${jours} jours attendus)` : "";
        habillage.set(index, {
            background: COULEURS_TRANCHES[rang],
            title: `${identite(d)}\n${indicateur.libelle} : ${formatTaux(valeur)}${surJours}`,
            peuFiable,
        });
    });

    return { habillage, echelle: q ? { quartiles: q, comptes, sansDonnee, peuFiables } : null };
}

/** Majorité absolue des sièges pourvus. */
export function majoriteAbsolue(total: number): number {
    return Math.floor(total / 2) + 1;
}
