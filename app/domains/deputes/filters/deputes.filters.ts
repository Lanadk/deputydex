import {FilterField, SortOption} from "@/app/_shared/filtering/filter-bar.types";

export const DEPUTIES_FILTER_FIELDS: FilterField[] = [
    { field: "groupePosition", label: "Position", type: "select",
        selectOptions: [
            { value: "Gauche", label: "Gauche" },
            { value: "Centre", label: "Centre" },
            { value: "Droite", label: "Droite" },
        ],
    },
];

export const DEPUTIES_SORT_OPTIONS: SortOption[] = [
    { id: "libelle_asc", label: "Libellé (A → Z)", field: "groupeLabel", direction: "asc"},
    { id: "libelle_desc", label: "Libellé (Z → A)", field: "groupeLabel", direction: "desc" },
    { id: "nb_membres_asc", label: "Nombre de membres ↑", field: "groupeCountMembers", direction: "asc" },
    { id: "nb_membres_desc", label: "Nombre de membres ↓", field: "groupeCountMembers", direction: "desc" },
];