/** Valeur de `scrutins.resultat_code` pour un scrutin adopté (open data AN). */
export const RESULTAT_SCRUTIN_ADOPTE = "adopté";

/** "Adopté" / "Rejeté" ; null si l'open data ne donne pas de résultat. */
export function resultatLibelle(code: string | null): string | null {
    if (!code) return null;
    return code === RESULTAT_SCRUTIN_ADOPTE ? "Adopté" : "Rejeté";
}

/** Libellés de l'objet d'un scrutin. */
const OBJET_LABELS: Record<string, string> = {
    ensemble: "Ensemble du texte",
    article: "Article",
    amendement: "Amendement",
    motion: "Motion",
    autre: "Autre",
};

export function scrutinObjetLabel(objet: string): string {
    return OBJET_LABELS[objet] ?? objet;
}
