import { Users, GraduationCap, Briefcase, Vote, ActivitySquare, ArrowLeftRight, BarChart3 } from "lucide-react";
import { STATISTICS_CHARTS_REGISTRY } from "./statistics-charts.registry";
import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {SectionBlock} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {STATISTICS_TABLE_REGISTRY} from "@/app/(ui)/(views)/db/statistics/statistics-tables.registry";
import {TableConfig} from "@/app/(ui)/component-library/types/table-config.types";
import {ChartConfig} from "@/app/(ui)/component-library/types/chart-config.types";
import {FilterField, SortOption} from "@/app/_shared/filtering/filter-bar.types";


//TODO VOIR 5.API-CACHE-STRATEGY.md

//Helper pour retrouver un ChartConfig par id
const stat = (id: string): ChartConfig => {
    const found = STATISTICS_CHARTS_REGISTRY.find((s) => s.id === id);
    if (!found) throw new Error(`StatConfig introuvable : ${id}`);
    return found;
};

//Helper
export const table = (id: string): TableConfig => {
    const found = STATISTICS_TABLE_REGISTRY.find((t) => t.id === id);
    if (!found) throw new Error(`TableConfig introuvable : ${id}`);
    return found;
};

export interface StatisticsSection extends AnchorSection {
    description: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock[];
}

//temporaire :
export const PROFESSIONS_SORT_OPTIONS: SortOption[] = [
    { id: "nom-asc",        label: "Nom A→Z",          field: "nom",       direction: "asc"  },
    { id: "nom-desc",       label: "Nom Z→A",          field: "nom",       direction: "desc" },
    { id: "famille-asc",    label: "Famille A→Z",      field: "famille",   direction: "asc"  },
    { id: "famille-desc",   label: "Famille Z→A",      field: "famille",   direction: "desc" },
    { id: "groupe-asc",     label: "Groupe A→Z",       field: "groupe",    direction: "asc"  },
    { id: "groupe-desc",    label: "Groupe Z→A",       field: "groupe",    direction: "desc" },
    { id: "profession-asc",    label: "Profession A→Z",       field: "groupe",    direction: "asc" },
    { id: "profession-desc",    label: "Profession Z→A",       field: "groupe",    direction: "desc" },
];

export const PROFESSIONS_FILTER_FIELDS: FilterField[] = [
    { field: "nom",       label: "Nom",       type: "string" },
    { field: "famille",   label: "Famille",   type: "enum",  enumValues: ["Juristes", "Enseignants", "Médecins", "Entrepreneurs", "Fonctionnaires"] },
    { field: "groupe",    label: "Groupe",    type: "enum",  enumValues: ["EPR", "SOC", "RN", "LFI-NFP"] },
    { field: "profession",  label: "Profession",    type: "enum",  enumValues: ["Professeure", "Cheffe d'ent.", "Fonctionnaire", "Avocat", "Médecin"] },
];

export const STATISTICS_SECTIONS: StatisticsSection[] = [
    //Démographie
    {
        id: "demographie",
        label: "Profil démographique",
        icon: Users,
        description: "Âge, genre, représentation régionale et évolution de la parité.",
        cols: 4,
        blocks: [
            // Paragraphe d'intro avec KPIs inline
            {
                type: "paragraph",
                colSpan: 2,
                items: [
                    {
                        type: "highlight",
                        content:
                            "L'Assemblée nationale reflète partiellement la démographie française, mais reste marquée par des sur-représentations notables sur l'âge et le genre.",
                    },
                    { type: "kpi", label: "Âge moyen",       value: "49,3 ans", trend: "down",    trendLabel: "−1,4 ans vs 16e" },
                    { type: "kpi", label: "Part de femmes",   value: "37,3 %",   trend: "up",      trendLabel: "+2,1 pts vs 16e" },
                    { type: "kpi", label: "Primo-députés",    value: "44 %",     trend: "up",      trendLabel: "+8 pts vs 16e"   },
                ],
            },
            // Charts
            { type: "stat", config: stat("age-distribution"),   colSpan: 2 },
            { type: "stat", config: stat("age-evolution-groupe"), colSpan: 4 },
            { type: "stat", config: stat("genre")                 , colSpan:    2   },
            { type: "stat", config: stat("genre-par-groupe"),        colSpan: 2        },
            { type: "stat", config: stat("geo-regions"),         colSpan: 1 },
            { type: "stat", config: stat("geo-regions"),         colSpan: 3 },
        ],
    },
    //Test tables
    {
        id: "test-tables",
        label: "Test — Tableaux",
        icon: BarChart3,
        description: "Démonstration des 4 configurations de tableau disponibles.",
        cols: 2,
        blocks: [

            // Pagination seule
            {
                type: "table" as const,
                colSpan: 2,
                ...table("reelection-16-17"),
                title: "Réélection 16e → 17e — pagination seule",
                subtitle: "Pas de filtre, pas d'export",
                filter: undefined,
                export: undefined,
            },

            // Filtre seul
            {
                type: "table" as const,
                colSpan: 2,
                ...table("activite-deputes"),
                id: "activite-deputes-filter",
                title: "Activité parlementaire — filtre seul",
                subtitle: "Pas de pagination, pas d'export",
                pagination: undefined,
                export: undefined,
            },

            // Export seul
            {
                type: "table" as const,
                colSpan: 2,
                ...table("professions-deputes"),
                id: "professions-export",
                title: "Professions déclarées — export seul",
                subtitle: "Pas de filtre, pas de pagination",
                pagination: undefined,
                filter: undefined,
            },

            // Tout combiné
            {
                type: "table" as const,
                colSpan: 2,
                ...table("professions-deputes"),
                filter: {
                    sortOptions: PROFESSIONS_SORT_OPTIONS,
                    filterFields: PROFESSIONS_FILTER_FIELDS,
                    applyMode: "auto",
                },
            },
        ],
    },

    //Formation
    {
        id: "formation",
        label: "Formation & Parcours",
        icon: GraduationCap,
        description: "Niveau de diplôme, grandes écoles et évolution entre législatures.",
        cols: 2,
        blocks: [
            {
                type: "paragraph",
                colSpan: 2,
                items: [
                    {
                        type: "text",
                        content:
                            "Les députés sont très diplômés comparés à la population générale. Près de 82 % sont titulaires d'un diplôme de niveau bac+3 ou supérieur, contre environ 24 % des Français.",
                    },
                    {
                        type: "list",
                        items: [
                            "Sciences Po reste l'école la plus représentée avec 89 anciens élèves.",
                            "La part des grandes écoles est en légère baisse (−2 pts) au profit des universités.",
                            "Le niveau de diplôme global progresse d'une législature à l'autre.",
                        ],
                    },
                ],
            },
            { type: "stat", config: stat("formation-niveau")          },
            { type: "stat", config: stat("formation-type")            },
            { type: "stat", config: stat("formation-grandes-ecoles"), colSpan: 2 },
        ],
    },

    //Profession
    {
        id: "profession",
        label: "Profession",
        icon: Briefcase,
        description: "Familles de profession, comparaison avec la population active et croisements.",
        cols: 2,
        blocks: [
            {
                type: "paragraph",
                colSpan: 2,
                items: [
                    {
                        type: "highlight",
                        content:
                            "Les ouvriers et employés — qui représentent 47 % de la population active — ne constituent que 3,1 % des députés. À l'inverse, les juristes (8,2 %) et les enseignants (11,6 %) sont massivement sur-représentés.",
                    },
                    { type: "kpi", label: "Enseignants",         value: "11,6 %", trend: "down",    trendLabel: "−1,8 pts" },
                    { type: "kpi", label: "Avocats / Juristes",  value: "8,2 %",  trend: "neutral"                        },
                    { type: "kpi", label: "Entrepreneurs",       value: "9,4 %",  trend: "up",      trendLabel: "+1,2 pts" },
                    { type: "kpi", label: "Ouvriers / Employés", value: "3,1 %",  trend: "up",      trendLabel: "+0,6 pts" },
                ],
            },
            { type: "stat", config: stat("profession-familles"),        colSpan: 2 },
            { type: "stat", config: stat("profession-vs-population"),   colSpan: 2 },
            { type: "stat", config: stat("profession-par-groupe"),      colSpan: 2 },
            { type: "stat", config: stat("profession-evolution"),       colSpan: 2 },
            { type: "stat", config: stat("profession-activite-croise")             },
            {
                type: "table" as const,
                colSpan: 2,
                id: "professions-deputes",
                title: "Tableau des professions déclarées",
                subtitle: "Député → profession déclarée → famille → groupe politique",
                gatewayFn: async (legislature: number) => [
                    { id: "1", nom: "Jean Dupont",  profession: "Avocat",      famille: "Juristes",    groupe: "EPR" },
                    { id: "2", nom: "Marie Martin", profession: "Professeure", famille: "Enseignants", groupe: "SOC" },
                    { id: "3", nom: "Paul Bernard", profession: "Médecin",     famille: "Médecins",    groupe: "RN"  },
                ],
                columns: [
                    { id: "nom",        header: "Député",              align: "center",   cell: (row: any) => row.nom        },
                    { id: "profession", header: "Profession déclarée", align: "center",   cell: (row: any) => row.profession },
                    { id: "famille",    header: "Famille",             align: "center", cell: (row: any) => row.famille    },
                    { id: "groupe",     header: "Groupe",              align: "center", cell: (row: any) => row.groupe     },
                ],
                getRowKey: (row: any) => row.id,
            },
        ],
    },


    //Élection
    {
        id: "election",
        label: "Élection & Mandat",
        icon: Vote,
        description: "Scores au scrutin, primo-députés, taux de réélection et mandats cumulés.",
        cols: 2,
        blocks: [
            { type: "stat", config: stat("election-scores-2eme-tour"),  colSpan: 2 },
            { type: "stat", config: stat("election-primo-deputes")                 },
            { type: "stat", config: stat("election-mandats-consecutifs")           },
            { type: "stat", config: stat("election-taux-reelection"),   colSpan: 2 },
        ],
    },

    //Activité parlementaire
    {
        id: "activite",
        label: "Activité parlementaire",
        icon: ActivitySquare,
        description: "Présence, amendements, votes et cohésion des groupes.",
        cols: 2,
        blocks: [
            {
                type: "paragraph",
                items: [
                    { type: "kpi", label: "Présence moyenne",  value: "71 %", trend: "up",     trendLabel: "+4 pts" },
                    { type: "kpi", label: "Cohésion de vote",  value: "88 %", trend: "neutral"                     },
                ],
            },
            { type: "stat", config: stat("activite-votes-par-groupe")              },
            { type: "stat", config: stat("activite-presence"),          colSpan: 2 },
            { type: "stat", config: stat("activite-presence-evolution"),colSpan: 2 },
            { type: "stat", config: stat("activite-cohesion")                      },
            { type: "stat", config: stat("activite-amendements-par-groupe")        },
        ],
    },

    //Mobilité
    {
        id: "mobilite",
        label: "Mobilité & Carrière",
        icon: ArrowLeftRight,
        description: "Changements de groupe et cumul de mandats locaux.",
        cols: 2,
        blocks: [
            { type: "stat", config: stat("mobilite-cumul")                      },
            { type: "stat", config: stat("mobilite-changements-groupe")         },
        ],
    },

    //Comparaisons
    {
        id: "comparaison",
        label: "Comparaisons 16e → 17e",
        icon: BarChart3,
        description: "Évolution transversale de tous les indicateurs entre les deux législatures.",
        cols: 2,
        blocks: [
            {
                type: "paragraph",
                colSpan: 2,
                items: [
                    {
                        type: "highlight",
                        content: "La 17e législature marque une rupture notable : taux de renouvellement record, montée du RN, légère progression de la parité.",
                    },
                    { type: "kpi", label: "Taux de renouvellement", value: "52 %", trend: "up", trendLabel: "+12 pts" },
                ],
            },
            { type: "stat", config: stat("comparaison-sieges"),          colSpan: 2 },
            { type: "stat", config: stat("comparaison-parite"),          colSpan: 2 },
            { type: "stat", config: stat("comparaison-age-moyen")                   },
            { type: "stat", config: stat("comparaison-primo")                       },
            { type: "stat", config: stat("comparaison-profession-delta"),colSpan: 2 },
        ],
    },
];