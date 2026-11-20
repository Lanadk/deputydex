/** Couleur d'affichage du résultat d'un scrutin (badge, bandeau de la fiche). */
const RESULTAT_COLORS = { adopte: "#16a34a", rejete: "#dc2626" };

export function scrutinResultatColor(isAdopte: boolean): string {
    return isAdopte ? RESULTAT_COLORS.adopte : RESULTAT_COLORS.rejete;
}
