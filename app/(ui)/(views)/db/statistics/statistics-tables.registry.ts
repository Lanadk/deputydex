import {
    ACTEURS_FILTER_FIELDS,
    ACTEURS_SORT_OPTIONS,
} from "@/app/domains/acteurs/filters/acteurs.filters";
import {TableConfig} from "@/app/(ui)/component-library/types/table-config.types";

//Types métier
type ProfessionRow = {
    id: string;
    nom: string;
    profession: string;
    famille: string;
    groupe: string;
};

type DeputeActiviteRow = {
    id: string;
    nom: string;
    groupe: string;
    presence: number;
    amendements: number;
    propositions: number;
};

type ReelectionRow = {
    id: string;
    nom: string;
    groupe: string;
    mandats: number;
    reelu: boolean;
    score: number;
};

//Registry
export const STATISTICS_TABLE_REGISTRY: TableConfig<any>[] = [
    //Professions
    {
        id: "professions-deputes",
        title: "Professions déclarées",
        subtitle: "Député → profession → famille → groupe politique",
        gatewayFn: async (legislature: number) => {
            // TODO: remplacer par statisticsGateway.getProfessions(legislature)
            return [
                { id: "1", nom: "Jean Dupont",   profession: "Avocat",       famille: "Juristes",    groupe: "EPR" },
                { id: "2", nom: "Marie Martin",  profession: "Professeure",  famille: "Enseignants", groupe: "SOC" },
                { id: "3", nom: "Paul Bernard",  profession: "Médecin",      famille: "Médecins",    groupe: "RN"  },
                { id: "4", nom: "Lucie Moreau",  profession: "Cheffe d'ent.", famille: "Entrepreneurs", groupe: "EPR" },
                { id: "5", nom: "Ahmed Kader",   profession: "Fonctionnaire", famille: "Fonctionnaires", groupe: "LFI-NFP" },
            ] as ProfessionRow[];
        },
        columns: [
            { id: "nom",        header: "Député",             align: "center",   cell: (r: ProfessionRow) => r.nom        },
            { id: "profession", header: "Profession déclarée",align: "center",   cell: (r: ProfessionRow) => r.profession },
            { id: "famille",    header: "Famille",            align: "center", cell: (r: ProfessionRow) => r.famille    },
            { id: "groupe",     header: "Groupe",             align: "center", cell: (r: ProfessionRow) => r.groupe     },
        ],
        getRowKey: (r: ProfessionRow) => r.id,
        pagination: { pageSize: 15 },
        filter: {
            sortOptions: ACTEURS_SORT_OPTIONS,
            filterFields: ACTEURS_FILTER_FIELDS,
            applyMode: "auto",
        },
        export: {
            filenameBase: "professions_deputes",
            csvColumns: [
                { header: "id",         value: (r: ProfessionRow) => r.id         },
                { header: "nom",        value: (r: ProfessionRow) => r.nom        },
                { header: "profession", value: (r: ProfessionRow) => r.profession },
                { header: "famille",    value: (r: ProfessionRow) => r.famille    },
                { header: "groupe",     value: (r: ProfessionRow) => r.groupe     },
            ],
        },
    } as TableConfig<ProfessionRow>,

    //Activité parlementaire
    {
        id: "activite-deputes",
        title: "Activité parlementaire",
        subtitle: "Présence, amendements et propositions de loi par député",
        gatewayFn: async (legislature: number) => {
            // TODO: remplacer par statisticsGateway.getActivite(legislature)
            return [
                { id: "1", nom: "Jean Dupont",  groupe: "EPR",     presence: 92, amendements: 34, propositions: 5 },
                { id: "2", nom: "Marie Martin", groupe: "SOC",     presence: 78, amendements: 67, propositions: 3 },
                { id: "3", nom: "Paul Bernard", groupe: "RN",      presence: 61, amendements: 12, propositions: 1 },
                { id: "4", nom: "Lucie Moreau", groupe: "EPR",     presence: 88, amendements: 21, propositions: 7 },
                { id: "5", nom: "Ahmed Kader",  groupe: "LFI-NFP", presence: 95, amendements: 89, propositions: 4 },
            ] as DeputeActiviteRow[];
        },
        columns: [
            { id: "nom",          header: "Député",         align: "center",   cell: (r: DeputeActiviteRow) => r.nom                    },
            { id: "groupe",       header: "Groupe",         align: "center", cell: (r: DeputeActiviteRow) => r.groupe                  },
            { id: "presence",     header: "Présence (%)",   align: "center", cell: (r: DeputeActiviteRow) => `${r.presence} %`         },
            { id: "amendements",  header: "Amendements",    align: "center", cell: (r: DeputeActiviteRow) => r.amendements             },
            { id: "propositions", header: "Propositions",   align: "center", cell: (r: DeputeActiviteRow) => r.propositions            },
        ],
        getRowKey: (r: DeputeActiviteRow) => r.id,
        pagination: { pageSize: 10 },
        filter: {
            sortOptions: ACTEURS_SORT_OPTIONS,
            filterFields: ACTEURS_FILTER_FIELDS,
            applyMode: "auto",
        },
        export: {
            filenameBase: "activite_deputes",
            csvColumns: [
                { header: "id",           value: (r: DeputeActiviteRow) => r.id                    },
                { header: "nom",          value: (r: DeputeActiviteRow) => r.nom                   },
                { header: "groupe",       value: (r: DeputeActiviteRow) => r.groupe                },
                { header: "presence",     value: (r: DeputeActiviteRow) => String(r.presence)      },
                { header: "amendements",  value: (r: DeputeActiviteRow) => String(r.amendements)   },
                { header: "propositions", value: (r: DeputeActiviteRow) => String(r.propositions)  },
            ],
        },
    } as TableConfig<DeputeActiviteRow>,

    //Réélection
    {
        id: "reelection-16-17",
        title: "Réélection 16e → 17e",
        subtitle: "Députés sortants et leur résultat à la 17e législature",
        gatewayFn: async (_legislature: number) => {
            // TODO: remplacer par statisticsGateway.getReelection()
            return [
                { id: "1", nom: "Jean Dupont",  groupe: "EPR",     mandats: 3, reelu: true,  score: 58.4 },
                { id: "2", nom: "Marie Martin", groupe: "SOC",     mandats: 2, reelu: true,  score: 61.2 },
                { id: "3", nom: "Paul Bernard", groupe: "RN",      mandats: 1, reelu: false, score: 47.8 },
                { id: "4", nom: "Lucie Moreau", groupe: "EPR",     mandats: 4, reelu: true,  score: 72.1 },
                { id: "5", nom: "Ahmed Kader",  groupe: "LFI-NFP", mandats: 1, reelu: false, score: 44.3 },
            ] as ReelectionRow[];
        },
        columns: [
            { id: "nom",     header: "Député",    align: "center",   cell: (r: ReelectionRow) => r.nom                                    },
            { id: "groupe",  header: "Groupe",    align: "center", cell: (r: ReelectionRow) => r.groupe                                 },
            { id: "mandats", header: "Mandats",   align: "center", cell: (r: ReelectionRow) => r.mandats                                },
            { id: "reelu",   header: "Réélu",     align: "center", cell: (r: ReelectionRow) => r.reelu ? "✓" : "✗"                      },
            { id: "score",   header: "Score (%)", align: "center", cell: (r: ReelectionRow) => `${r.score.toFixed(1)} %`                },
        ],
        getRowKey: (r: ReelectionRow) => r.id,
        pagination: { pageSize: 10 },
        export: {
            filenameBase: "reelection_16_17",
            csvColumns: [
                { header: "id",      value: (r: ReelectionRow) => r.id                   },
                { header: "nom",     value: (r: ReelectionRow) => r.nom                  },
                { header: "groupe",  value: (r: ReelectionRow) => r.groupe               },
                { header: "mandats", value: (r: ReelectionRow) => String(r.mandats)      },
                { header: "reelu",   value: (r: ReelectionRow) => r.reelu ? "oui" : "non"},
                { header: "score",   value: (r: ReelectionRow) => String(r.score)        },
            ],
        },
    } as TableConfig<ReelectionRow>,

];