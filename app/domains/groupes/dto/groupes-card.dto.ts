
export type GroupeCardDTO = {
    groupeId: string;
    groupeCode: string;
    groupeLabel: string;
    groupePresidentFullName: string;
    groupeQualitySexLabel: string;
    groupeCountMembers: number;
    groupeColor?: string;
    groupeImg?: string | null;
    groupeHref: string;
    groupePosition?: 'Droite' | 'Centre' | 'Gauche';
}