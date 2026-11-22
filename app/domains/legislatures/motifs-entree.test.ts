import { motifEntree } from "@/app/domains/legislatures/motifs-entree";

describe("motifEntree", () => {
    it.each([
        ["remplacement d'un député nommé au Gouvernement", "gouvernement"],
        ["reprise de l'exercice du mandat d'un ancien membre du Gouvernement", "retour-gouvernement"],
        ["élection partielle", "partielle"],
        ["élection partielle, remplacement d'un député démissionnaire", "partielle"],
        ["élection partielle, suite à l'annulation de l'élection d'un député", "partielle"],
        ["remplacement d'un député ayant démissionné pour cause d’incompatibilité prévue aux articles LO 137, LO 137-1, LO 141 ou LO 141-1 du code électoral", "demission"],
        ["remplacement d'un député décédé", "deces"],
        ["remplacement d'un député en mission au-delà de 6 mois", "mission"],
        ["cause inconnue", "autre"],
    ])("« %s » → %s", (cause, motif) => {
        expect(motifEntree(cause)).toBe(motif);
    });
});
