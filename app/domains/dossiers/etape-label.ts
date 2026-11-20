/**
 * Libellé lisible d'une Étape (voir GLOSSARY.md) à partir du code de l'étape
 * racine de l'open data AN — préfixe d'un `code_acte` : "AN1", "SN1", "CMP"…
 * Un code inconnu est renvoyé tel quel plutôt que masqué.
 */
const ETAPE_LABELS: Record<string, string> = {
    AN1: "1ère lecture AN",
    SN1: "1ère lecture Sénat",
    AN2: "2e lecture AN",
    SN2: "2e lecture Sénat",
    AN3: "3e lecture AN",
    SN3: "3e lecture Sénat",
    ANNLEC: "Nouvelle lecture AN",
    SNNLEC: "Nouvelle lecture Sénat",
    ANLDEF: "Lecture définitive AN",
    ANLUNI: "Lecture unique AN",
    AN20: "Travaux AN",
    AN21: "Débat AN",
    CMP: "Commission mixte paritaire",
    CC: "Conseil constitutionnel",
    CG22: "Congrès du Parlement",
    PROM: "Promulgation",
    AN: "Mise en application de la loi",
};

export function etapeLabel(code: string): string {
    return ETAPE_LABELS[code] ?? code;
}
