export type GroupeBreakdownItem = {
    label: string;
    acteursCount: number;
    percentInGroupe: number;
};

export type GroupeCompositionDTO = {
    groupeCountActifMembers?: number;
    groupeAverageMemberAge?: number;
    groupeAverageFemmePercent?: number;
    groupeAverageCumulatedMandat?: number;
    groupeTrancheAge?: GroupeBreakdownItem[];
    groupeParite: {
        homme: number;
        femme: number;
    };
    groupeTopDepartementsElection?: {
        label: string;
        count: number;
    }[];
    groupeTopDepartementsNaissance?: {
        label: string;
        count: number;
    }[];
    groupeTopPaysNaissance?: {
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
    groupeExtremes?: {
        plusAge?: {
            nom: string;
            age: number;
        };
        plusJeune?: {
            nom: string;
            age: number;
        };
    }
};