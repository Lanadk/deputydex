/*
 * Motifs d'entrée d'un député en cours de législature : les libellés
 * administratifs de l'Assemblée (« remplacement d'un député ayant démissionné
 * pour cause d'incompatibilité prévue aux articles LO 137… ») regroupés en
 * quelques motifs lisibles.
 */

export type MotifEntree = "gouvernement" | "retour-gouvernement" | "partielle" | "demission" | "deces" | "mission" | "autre";

/** Libellés des motifs, dans l'ordre d'affichage par défaut. */
export const LIBELLES_MOTIF_ENTREE: Record<MotifEntree, string> = {
    gouvernement: "Député nommé au Gouvernement",
    "retour-gouvernement": "Retour d'un ancien ministre",
    partielle: "Élection partielle",
    demission: "Démission (incompatibilité de mandats)",
    deces: "Décès",
    mission: "Mission de plus de six mois",
    autre: "Autre",
};

/** Motif d'une cause d'entrée telle qu'écrite par l'Assemblée nationale. */
export function motifEntree(cause: string): MotifEntree {
    const c = cause.toLowerCase();
    // « élection partielle, remplacement d'un député démissionnaire » est une élection partielle.
    if (c.startsWith("élection partielle")) return "partielle";
    if (c.includes("nommé au gouvernement")) return "gouvernement";
    if (c.includes("ancien membre du gouvernement")) return "retour-gouvernement";
    if (c.includes("démission")) return "demission";
    if (c.includes("décédé")) return "deces";
    if (c.includes("en mission")) return "mission";
    return "autre";
}
