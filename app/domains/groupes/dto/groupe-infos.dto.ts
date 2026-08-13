export type GroupeInfosDTO = {
    legislature: number;
    groupeLabel: string;
    groupeCode: string;
    groupePosition?: 'Droite' | 'Centre' | 'Gauche';
    groupeCountMembers: number;
    groupeRank: number;
    groupeYearOfCreation: string | null,
    groupeWebSite: string | null;
    groupeColor?: string;
    groupeImg: string | "";
    groupePresidentFullName: string;
    groupeQualitySexLabel: string;
    groupeSeatsSharePercent: number;
};