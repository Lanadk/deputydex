/**
 * Noms des huit commissions permanentes de l'Assemblée nationale, par
 * identifiant d'organe (les données importées n'ont que l'identifiant, pas le
 * libellé de l'organe). Stables d'une législature à l'autre.
 */
export const COMMISSIONS_PERMANENTES: Record<string, string> = {
    PO419604: "Affaires culturelles et éducation",
    PO419610: "Affaires économiques",
    PO59047: "Affaires étrangères",
    PO420120: "Affaires sociales",
    PO59046: "Défense nationale et forces armées",
    PO419865: "Développement durable et aménagement du territoire",
    PO59048: "Finances, économie générale et contrôle budgétaire",
    PO59051: "Lois constitutionnelles, législation et administration générale",
};

/** Libellé d'une commission permanente, ou l'identifiant brut si elle est inconnue. */
export function commissionPermanenteLabel(organeUid: string): string {
    return COMMISSIONS_PERMANENTES[organeUid] ?? organeUid;
}
