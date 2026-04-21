import {FilterField, SortOption} from "@/app/_shared/filtering/filter-bar.types";

export const GROUPE_MEMBERS_FILTER_FIELDS: FilterField[] = [

];

export const GROUPE_MEMBERS_SORT_OPTIONS: SortOption[] = [
    { id: "firstName_asc", label: "Prénom (A → Z)", field: "deputyFirstName", direction: "asc"},
    { id: "firstName_desc", label: "Prénom (Z → A)", field: "deputyFirstName", direction: "desc" },
    { id: "lastName_asc", label: "Nom (Z → A)", field: "deputyLastName", direction: "asc" },
    { id: "lastName_desc", label: "Nom (Z → A)", field: "deputyLastName", direction: "desc" },
    { id: "age_asc", label: "Age ↑", field: "age", direction: "asc" },
    { id: "asg_desc", label: "Age ↓", field: "age", direction: "desc" },
    { id: "since_asc", label: "Membre depuis ↑", field: "since", direction: "asc" },
    { id: "since_desc", label: "Membre depuis ↓", field: "since", direction: "desc" },
];