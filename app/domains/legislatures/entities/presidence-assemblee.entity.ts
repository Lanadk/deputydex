/** Un mandat de président de l'Assemblée nationale pendant une législature (dates AAAA-MM-JJ, formatées en SQL). */
export type PresidenceAssembleeEntity = {
    acteur_uid: string;
    prenom: string;
    nom: string;
    debut: string;
    fin: string | null;
};
