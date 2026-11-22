/**
 * Mandats présidentiels de la Ve République utiles à la frise des législatures.
 *
 * Référence statique : le Président de la République n'apparaît pas dans les
 * données de l'Assemblée nationale (il n'y figure que s'il a été député, et
 * sans date de fin de mandat présidentiel). À compléter à chaque élection
 * présidentielle (prochaine : 2027). Dates de début et de fin de mandat
 * (et non d'investiture), au format AAAA-MM-JJ ; `fin: null` = en cours.
 */
export type MandatPresidentiel = {
    president: string;
    mandat: string;
    debut: string;
    fin: string | null;
};

export const MANDATS_PRESIDENTIELS: MandatPresidentiel[] = [
    { president: "François Hollande", mandat: "1er mandat", debut: "2012-05-15", fin: "2017-05-14" },
    { president: "Emmanuel Macron", mandat: "1er mandat", debut: "2017-05-14", fin: "2022-05-13" },
    { president: "Emmanuel Macron", mandat: "2e mandat", debut: "2022-05-14", fin: null },
];
