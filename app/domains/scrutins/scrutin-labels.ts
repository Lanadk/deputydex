/** Libellés courts des types de scrutin (open data AN). */
const TYPE_LABELS: Record<string, string> = {
    SPO: "Ordinaire",
    SPS: "Solennel",
    MOC: "Motion de censure",
};

/** Libellés de l'objet d'un scrutin. */
const OBJET_LABELS: Record<string, string> = {
    ensemble: "Ensemble du texte",
    article: "Article",
    amendement: "Amendement",
    motion: "Motion",
    autre: "Autre",
};

export function scrutinTypeLabel(code: string | null): string | null {
    return code ? TYPE_LABELS[code] ?? code : null;
}

export function scrutinObjetLabel(objet: string): string {
    return OBJET_LABELS[objet] ?? objet;
}
