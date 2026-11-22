/**
 * Événements institutionnels marquants des législatures couvertes, affichés
 * sur la frise. Référence statique (ces dates ne sont pas dans les données de
 * l'Assemblée nationale), au format AAAA-MM-JJ.
 */
export type EvenementInstitutionnel = {
    date: string;
    libelle: string;
};

export const EVENEMENTS_INSTITUTIONNELS: EvenementInstitutionnel[] = [
    { date: "2022-06-19", libelle: "Élections législatives (2d tour)" },
    { date: "2024-06-09", libelle: "Dissolution de l'Assemblée" },
    { date: "2024-07-07", libelle: "Élections législatives anticipées (2d tour)" },
];
