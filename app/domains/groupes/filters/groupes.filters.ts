import {FilterField, SortOption} from "@/app/_shared/filtering/filter-bar.types";

export const GROUPS_FILTER_FIELDS: FilterField[] = [
    { field: "position", label: "Position", type: "select",
        selectOptions: [
            { value: "Gauche", label: "Gauche" },
            { value: "Centre", label: "Centre" },
            { value: "Droite", label: "Droite" },
        ],
    },
];

export const GROUPS_SORT_OPTIONS: SortOption[] = [
    { id: "libelle_asc", label: "Libellé (A → Z)", field: "libelle", direction: "asc"},
    { id: "libelle_desc", label: "Libellé (Z → A)", field: "libelle", direction: "desc" },
    { id: "nb_membres_asc", label: "Nombre de membres ↑", field: "nb_membres", direction: "asc" },
    { id: "nb_membres_desc", label: "Nombre de membres ↓", field: "nb_membres", direction: "desc" },
];