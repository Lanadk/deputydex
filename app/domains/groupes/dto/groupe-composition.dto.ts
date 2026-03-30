export type GroupeBreakdownItem = {
    label: string;
    acteursCount: number;
    percentInGroupe: number;
};

export type GroupeCompositionDto = {
    groupeCountActifMembers?: number;
    groupeAverageMemberAge?: number;
    groupeAverageFemmePercent?: number;
    groupeAverageCumulatedMandat?: number;
    groupeParite: {
        homme: number;
        femme: number;
    };
    groupeTopDepartements?: {
        label: string;
        count: number;
    }[];
    groupeProfessionFamilles?: {
        totalActeursCount: number;
        data: GroupeBreakdownItem[];
    };
    groupeProfessionCategories?: {
        totalActeursCount: number;
        data: GroupeBreakdownItem[];
    };
};