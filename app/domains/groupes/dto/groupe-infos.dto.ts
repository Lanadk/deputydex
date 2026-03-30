export type GroupeInfosDTO = {
    groupeLabel: string;
    groupeCode: string;
    groupePosition?: 'Droite' | 'Centre' | 'Gauche';
    groupeCountMembers: number;
    groupeRank: number;
    groupeYearOfCreation: string,
    groupeWebSite: string;
    groupeColor?: string;
    groupeImg?: string | null;
    groupePresidentFullName: string;
    groupeQualitySexLabel: string;
    groupeSeatsSharePercent: number;
};