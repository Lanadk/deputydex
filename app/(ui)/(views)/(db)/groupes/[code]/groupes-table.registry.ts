import {TableConfig} from "@/app/(ui)/component-library/template/block-section/table-config.types";

type DeputeActiviteRow = {
    id: string;
    nom: string;
    groupe: string;
    presence: number;
    amendements: number;
    propositions: number;
};

export const GROUPE_TABLE_REGISTRY: TableConfig<any>[] = [{
    id: "groupe-members-table",
    gatewayFn: async (legislature: number) => {
        // TODO: remplacer par statisticsGateway.getActivite(legislature)
        return [
            {id: "1", nom: "Jean Dupont", groupe: "EPR", presence: 92, amendements: 34, propositions: 5},
            {id: "2", nom: "Marie Martin", groupe: "SOC", presence: 78, amendements: 67, propositions: 3},
            {id: "3", nom: "Paul Bernard", groupe: "RN", presence: 61, amendements: 12, propositions: 1},
            {id: "4", nom: "Lucie Moreau", groupe: "EPR", presence: 88, amendements: 21, propositions: 7},
            {id: "5", nom: "Ahmed Kader", groupe: "LFI-NFP", presence: 95, amendements: 89, propositions: 4},
        ] as DeputeActiviteRow[];
    },
    columns: [
        {id: "nom", header: "Député", align: "center", cell: (r: DeputeActiviteRow) => r.nom},
        {id: "groupe", header: "Groupe", align: "center", cell: (r: DeputeActiviteRow) => r.groupe},
        {id: "presence", header: "Présence (%)", align: "center", cell: (r: DeputeActiviteRow) => `${r.presence} %`},
        {id: "amendements", header: "Amendements", align: "center", cell: (r: DeputeActiviteRow) => r.amendements},
        {id: "propositions", header: "Propositions", align: "center", cell: (r: DeputeActiviteRow) => r.propositions},
    ],
    getRowKey: (r: DeputeActiviteRow) => r.id,
    pagination: {pageSize: 10},
} as TableConfig<DeputeActiviteRow>,
];