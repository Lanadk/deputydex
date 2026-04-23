import {
    DepartementElectionRow, DepartemenBirthtRow,
    ProfessionCategorieRow,
    ProfessionFamilleRow, PaysNaissanceRow, TrancheAgeRow, ExtremeAgeRow
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-composition.repository";

export type GroupeCompositionEntity = {
    groupeCountMembers: number;
    averageAge: number | null;
    averageCumulatedYears: number | null;
    parite: {
        nb_hommes: number;
        nb_femmes: number;
        nb_total: number;
        pct_hommes: number;
        pct_femmes: number;
    } | null;
    topDepartementsElection: DepartementElectionRow[];
    topPaysNaissance: PaysNaissanceRow[];
    topDepartementsNaissance: DepartemenBirthtRow[];
    professionFamilles: ProfessionFamilleRow[];
    professionCategories: ProfessionCategorieRow[];
    trancheAge: TrancheAgeRow[];
    extremes: {
        plusAge?: ExtremeAgeRow;
        plusJeune?: ExtremeAgeRow;
    };
};