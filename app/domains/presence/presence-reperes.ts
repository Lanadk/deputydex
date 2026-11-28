import { StatMarker } from "@/app/_shared/statistics/raw-stat-data.types";
import { DebutLegislatureRow } from "@/app/domains/presence/entities/presence-stats.entity";

/** Échelle des libellés d'une courbe de présence (format produit par presence-labels.ts). */
export type EchelleReperes = "mois" | "jour" | "civile" | "parlementaire";

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Libellé, dans l'échelle de la courbe, de la période qui contient `date` :
 * « 2024-07 » (mois), « 2024-07-18 » (jour), « 2024 » (civile), « 2023-2024 »
 * (parlementaire : 1er octobre → 30 septembre, même règle que la vue).
 */
export function libelleDansEchelle(date: Date, echelle: EchelleReperes): string {
    const jour = iso(date);
    const annee = Number(jour.slice(0, 4));
    const mois = Number(jour.slice(5, 7));
    switch (echelle) {
        case "jour":
            return jour;
        case "mois":
            return jour.slice(0, 7);
        case "civile":
            return String(annee);
        case "parlementaire":
            return mois >= 10 ? `${annee}-${annee + 1}` : `${annee - 1}-${annee}`;
    }
}

/**
 * Repères « Début de la Nᵉ législature » d'une courbe toutes législatures, calculés
 * depuis `param_legislatures` : rien n'est écrit en dur, une nouvelle législature
 * ajoute son repère d'elle-même.
 *
 * Chaque début est posé sur le premier libellé de la courbe à partir de sa
 * période (un jour de passage sans séance tombe sur la séance suivante). Pas de
 * repère au tout premier point (le début de la courbe n'est pas une rupture),
 * ni après le dernier.
 */
export function reperesLegislatures(debuts: DebutLegislatureRow[], echelle: EchelleReperes, libelles: string[]): StatMarker[] {
    if (libelles.length === 0) return [];
    const tries = [...libelles].sort((a, b) => a.localeCompare(b));

    return [...debuts]
        .sort((a, b) => a.debut.getTime() - b.debut.getTime())
        .flatMap(({ legislature, debut }) => {
            const cible = libelleDansEchelle(debut, echelle);
            const index = tries.findIndex((l) => l.localeCompare(cible) >= 0);
            if (index <= 0) return [];
            return [{ at: tries[index], label: `Début de la ${legislature}ᵉ législature` }];
        });
}
