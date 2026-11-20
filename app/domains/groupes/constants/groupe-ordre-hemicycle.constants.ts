/**
 * Ordre des groupes dans l'hémicycle, de la gauche vers la droite de la salle.
 *
 * Chaque entrée regroupe les codes BRUTS (tels qu'en base, `ref_groupes.code`
 * / `agg_deputes_cards.depute_groupe_code`) d'une même "famille" sur les
 * législatures couvertes (16ᵉ et 17ᵉ) : le rang ne dépend que de la famille.
 * Aucun effectif ici — ils viennent de l'API.
 *
 * Les non-inscrits sont placés en dernier. Un code inconnu (nouveau groupe pas
 * encore référencé) est placé juste avant eux, pour rester visible sans casser
 * l'ordre des groupes connus.
 */
const GROUPES_GAUCHE_DROITE: readonly (readonly string[])[] = [
    ["LFI-NFP", "LFI-NUPES"],
    ["GDR", "GDR-NUPES"],
    ["ECOS", "ECOLO-NUPES"],
    ["SOC", "SOC-NUPES"],
    ["DEM"],
    ["EPR", "RE"],
    ["HOR"],
    ["LIOT"],
    ["DR", "LR"],
    ["UDDPLR", "UDR"],
    ["RN"],
];

const NON_INSCRITS_RANK = GROUPES_GAUCHE_DROITE.length + 1;
const UNKNOWN_RANK = GROUPES_GAUCHE_DROITE.length;

function isNonInscrit(code: string): boolean {
    return code === "NI" || code.startsWith("NI-");
}

export function getGroupeRangGaucheDroite(code: string): number {
    if (isNonInscrit(code)) return NON_INSCRITS_RANK;
    const rank = GROUPES_GAUCHE_DROITE.findIndex((family) => family.includes(code));
    return rank === -1 ? UNKNOWN_RANK : rank;
}

export function compareGroupesGaucheDroite(a: string, b: string): number {
    return getGroupeRangGaucheDroite(a) - getGroupeRangGaucheDroite(b) || a.localeCompare(b, "fr");
}
