import {FilterField, SortOption} from "@/app/component-library/molecules/filter-bar/filter-bar.types";

export const ACTEURS_FILTER_FIELDS: FilterField[] = [
    { field: 'nom',                   label: 'Nom',                  type: 'string' },
    { field: 'prenom',                label: 'Prénom',               type: 'string' },
    { field: 'nom_alpha',             label: 'Nom alpha',            type: 'string' },
    { field: 'trigramme',             label: 'Trigramme',            type: 'string' },
    { field: 'civilite',              label: 'Civilité',             type: 'enum',   enumValues: ['M.', 'Mme'] },
    { field: 'date_naissance',        label: 'Date de naissance',    type: 'date'   },
    { field: 'ville_naissance',       label: 'Ville de naissance',   type: 'string' },
    { field: 'departement_naissance', label: 'Département',          type: 'string' },
    { field: 'pays_naissance',        label: 'Pays de naissance',    type: 'string' },
    { field: 'date_deces',            label: 'Date de décès',        type: 'date'   },
    { field: 'profession_libelle',    label: 'Profession',           type: 'string' },
    { field: 'profession_categorie',  label: 'Catégorie profession', type: 'select', selectOptions: [
            { value: 'Parlementaire',         label: 'Parlementaire'         },
            { value: 'Membre du gouvernement', label: 'Membre du gouvernement' },
            { value: 'Personnalité politique', label: 'Personnalité politique' },
            { value: 'Haute fonction publique', label: 'Haute fonction publique' },
            { value: 'Médecin',               label: 'Médecin'               },
            { value: 'Avocat',                label: 'Avocat'                },
            { value: 'Enseignant',            label: 'Enseignant'            },
        ]},
    { field: 'profession_famille',    label: 'Famille profession',   type: 'select', selectOptions: [
            { value: 'Professions juridiques et assimilées', label: 'Professions juridiques' },
            { value: 'Professions de la santé',              label: 'Professions de la santé' },
            { value: 'Cadres de la fonction publique',       label: 'Fonction publique'       },
            { value: 'Enseignants',                          label: 'Enseignants'             },
            { value: 'Agriculteurs exploitants',             label: 'Agriculteurs'            },
        ]},
    { field: 'legislature_snapshot',  label: 'Législature',          type: 'number' },
];

export const ACTEURS_SORT_OPTIONS: SortOption[] = [
    { id: 'nom-asc',          label: 'Nom A → Z',      field: 'nom',          direction: 'asc'  },
    { id: 'nom-desc',         label: 'Nom Z → A',      field: 'nom',          direction: 'desc' },
    { id: 'prenom-asc',       label: 'Prénom A → Z',   field: 'prenom',       direction: 'asc'  },
    { id: 'prenom-desc',      label: 'Prénom Z → A',   field: 'prenom',       direction: 'desc' },
    { id: 'naissance-asc',    label: 'Naissance ↑',    field: 'date_naissance', direction: 'asc'  },
    { id: 'naissance-desc',   label: 'Naissance ↓',    field: 'date_naissance', direction: 'desc' },
];