/** Chiffres clés d'une législature. */
export type LegislatureChiffresDTO = {
    legislature: number;
    debut: string;
    fin: string | null;
    /** Durée en jours, jusqu'à aujourd'hui pour la législature en cours. */
    dureeJours: number;
    scrutins: number;
    deputesAyantSiege: number;
    gouvernements: number;
    /** Députés entrés en cours de législature (remplacements, élections partielles…). */
    entreesEnCours: number;
    entreesParCause: { cause: string; nombre: number }[];
};
