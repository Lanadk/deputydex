import { ParagraphItem } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

/**
 * Lecture des stats de présence du catalogue pour les sections « Présence »
 * des fiches (député, groupe) : mêmes stats que le mode avancé, remises en
 * forme pour les cartes et graphiques de la section.
 */

export type Item = { label: string; value: number };

/** Une stat en échec ne fait pas tomber toute la section : elle s'affiche vide. */
export const lireStat = (p: Promise<RawStatData>): Promise<RawStatData | null> => p.catch(() => null);
export const pointsOf = (s: RawStatData | null): Item[] => (s?.shape === "timeseries" ? s.points : []);
export const seriesOf = (s: RawStatData | null) => (s?.shape === "multi-series" ? s.series : []);
export const itemsOf = (s: RawStatData | null): Item[] => (s?.shape === "distribution" ? s.items : []);

/** « 1 · En séance » → « En séance » ; « 17ᵉ · année 1 » → « année 1 ». */
export const sansPrefixe = (label: string) => label.replace(/^(\d+ · |\d+ᵉ · )/, "");

export const CLE_TAUX = "Présence (tous jours attendus)";

/** Composantes affichées, dans cet ordre ; clé = libellé sans préfixe des stats `*-composantes` / `presence-moyenne`. */
export const COMPOSANTES = [
    { cle: CLE_TAUX, libelle: "Taux de présence" },
    { cle: "En séance", libelle: "En séance" },
    { cle: "En commission", libelle: "En commission" },
    { cle: "Excusés en commission", libelle: "Excusé en commission" },
    { cle: "Participation aux scrutins", libelle: "Scrutins" },
];

/** Première série d'une stat composantes (une seule législature) → valeur par composante. */
export function valeursComposantes(stat: RawStatData | null): Map<string, number> {
    return new Map((seriesOf(stat)[0]?.items ?? []).map((i) => [sansPrefixe(i.label), i.value]));
}

/** `groupes.presence-composantes` (une série par composante, un item par groupe) + `groupes.presence` → valeurs du groupe `code`. */
export function valeursGroupe(composantes: RawStatData | null, global: RawStatData | null, code: string | null): Map<string, number> {
    const valeurs = new Map<string, number>();
    if (!code) return valeurs;
    for (const s of seriesOf(composantes)) {
        const v = s.items.find((i) => i.label === code)?.value;
        if (v != null) valeurs.set(sansPrefixe(s.name), v);
    }
    const taux = itemsOf(global).find((i) => i.label === code)?.value;
    if (taux != null) valeurs.set(CLE_TAUX, taux);
    return valeurs;
}

/** Graphique de comparaison : une ligne par composante, une colonne par population (ordre fixe, pas de tri). */
export function comparaison(populations: { nom: string; valeurs: Map<string, number> }[]): { data: MultiDatum[]; series: SeriesConfig[] } {
    const presentes = populations.filter((p) => p.valeurs.size > 0);
    return {
        series: presentes.map((p, i) => ({ dataKey: `s${i}`, label: p.nom })),
        data: COMPOSANTES.map(({ cle, libelle }) => {
            const row: MultiDatum = { label: libelle };
            presentes.forEach((p, i) => {
                row[`s${i}`] = p.valeurs.get(cle) ?? null;
            });
            return row;
        }),
    };
}

export const pct = (v: number | undefined) => (v != null ? `${v}%` : "—");

export function avertissementPresence(note: string | undefined): ParagraphItem[] {
    return [
        {
            type: "callout",
            variant: "warning",
            title: "Une estimation, pas un pointage",
            paragraphs: [
                ...(note ? [note + "."] : []),
                "L'Assemblée ne publie pas de registre de présence : ces chiffres sont reconstitués à partir des votes, " +
                    "des prises de parole en séance et des listes de présence des commissions. Ils sous-estiment la " +
                    "présence (un député assis qui ne vote ni ne parle n'est pas vu) et ignorent le travail en " +
                    "circonscription. Le calcul exact est sous chaque graphique.",
            ],
        },
    ];
}
