import { Result } from "@/app/_shared/result-pattern/result";

/**
 * Faut-il répondre 404 pour une fiche député / groupe ?
 *
 * La législature affichée est choisie côté client (sélecteur global) : la page
 * serveur ne peut donc pas tester l'existence dans UNE législature (un député
 * de la seule 16e n'existe pas en 17e, mais sa fiche existe). Elle teste la
 * liste des législatures où l'entité a existé :
 * - liste vide → l'entité n'existe pas → 404 ;
 * - liste non vide → la fiche existe ;
 * - erreur (panne de la base) → PAS de 404 : la page s'affiche et ses sections
 *   gèrent l'erreur. Une panne ne doit jamais se faire passer pour « introuvable ».
 */
export function isUnknownEntity<E>(legislatures: Result<readonly number[], E>): boolean {
    return legislatures.success && legislatures.data.length === 0;
}
