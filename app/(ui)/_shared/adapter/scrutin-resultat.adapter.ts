/** Couleur d'affichage du résultat d'un scrutin (badge, bandeau de la fiche), depuis les tokens du design system. */
export function scrutinResultatColor(isAdopte: boolean): string {
    return isAdopte ? "var(--ui-success)" : "var(--ui-danger)";
}
