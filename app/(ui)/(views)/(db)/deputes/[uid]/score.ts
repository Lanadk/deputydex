import { DeputeScoreBadgeDTO, DeputeScoreComposanteDTO, DeputeScoreDTO } from "@/app/domains/deputes/dto/depute-score.dto";
import { FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

/**
 * Score du député (onglet Activité). Les données ne sont pas encore calculées :
 * `scoreDeputeApercu` renvoie une maquette marquée `apercu: true`. À remplacer
 * par l'appel au gateway (même forme : `DeputeScoreDTO`) quand deputydex-data
 * exposera le score.
 */

const COMPOSANTES_APERCU: DeputeScoreComposanteDTO[] = [
    { id: "presence", label: "Présence", description: "Jours de présence parmi les jours où il était attendu (séance avec vote, commission).", poids: 30, score: 72 },
    { id: "votes", label: "Participation aux votes", description: "Votes exprimés parmi les scrutins où il pouvait voter.", poids: 25, score: 58 },
    { id: "amendements", label: "Amendements", description: "Amendements déposés et adoptés, rapportés aux autres députés.", poids: 25, score: 64 },
    { id: "interventions", label: "Interventions en séance", description: "Prises de parole dans l'hémicycle.", poids: 10, score: 41 },
    { id: "textes", label: "Travail sur les textes", description: "Rôle de rapporteur, textes déposés ou co-signés.", poids: 10, score: 35 },
];

const BADGES_APERCU: DeputeScoreBadgeDTO[] = [
    { id: "assidu-seance", label: "Assidu en séance", description: "Présent à plus de 70 % des séances avec vote." },
    { id: "amendeur", label: "Amendeur", description: "Parmi le quart des députés qui déposent le plus d'amendements." },
    { id: "pilier-commission", label: "Pilier de commission", description: "Présent à plus de 80 % des réunions de ses commissions." },
];

/** Moyenne pondérée des sous-scores connus ; les poids des composantes sans donnée sont redistribués. */
export function calculerScore(composantes: DeputeScoreComposanteDTO[]): number | null {
    const connues = composantes.filter((c): c is DeputeScoreComposanteDTO & { score: number } => c.score != null);
    const poids = connues.reduce((s, c) => s + c.poids, 0);
    if (poids === 0) return null;
    return Math.round(connues.reduce((s, c) => s + c.poids * c.score, 0) / poids);
}

/** Maquette du score (données fictives), en attendant les vraies données. */
export function scoreDeputeApercu(): DeputeScoreDTO {
    return { score: calculerScore(COMPOSANTES_APERCU), percentile: 64, composantes: COMPOSANTES_APERCU, badges: BADGES_APERCU, apercu: true };
}

/** Lecture rapide du score (repères provisoires, à caler sur la répartition réelle des scores). */
export function verdictScore(score: number | null): string {
    if (score == null) return "Pas assez de données";
    if (score >= 80) return "Très actif";
    if (score >= 60) return "Actif";
    if (score >= 40) return "Dans la moyenne";
    if (score >= 20) return "Peu actif";
    return "Très peu actif";
}

export const F_DEPUTE_SCORE: FormulaLibProps = {
    label: "score du député",
    result: "S_{d}",
    numerator: "Σ_{k} w_{k} · s_{d,k}",
    denominator: "Σ_{k} w_{k}",
    legend: [
        { symbol: "d", description: "ce député, sur la législature affichée" },
        { symbol: "k", description: "une composante du score (présence, votes, amendements…), avec un sous-score connu" },
        { symbol: "w_{k}", description: "poids de la composante (en %, total 100)" },
        { symbol: "s_{d,k}", description: "sous-score de d pour la composante k, sur 100" },
    ],
    note: "Une composante sans donnée est ignorée et son poids redistribué. Aperçu : composantes, poids et valeurs sont provisoires.",
};
