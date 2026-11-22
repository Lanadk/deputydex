import { MotifEntree } from "@/app/domains/legislatures/motifs-entree";

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
    /** Entrées en cours de législature regroupées par motif, du plus fréquent au moins fréquent. */
    entreesParMotif: { motif: MotifEntree; libelle: string; nombre: number }[];
};
