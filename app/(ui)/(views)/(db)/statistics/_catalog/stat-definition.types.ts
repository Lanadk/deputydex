import { StatDataShape } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatDomain, StatScope } from "@/app/_shared/statistics/stat-scope.types";
import { FilterField } from "@/app/_shared/filtering/filter-bar.types";

/**
 * Descripteur d'UNE stat du catalogue Statistiques. Volontairement sans
 * fonction (fetch générique commun, voir fetch-stat-data.ts) : chaque entrée
 * est un objet pur, sérialisable — une future migration vers un catalogue
 * data-driven (défini en base plutôt que dans le code) n'a besoin de changer
 * que la SOURCE de ce tableau, pas ce contrat.
 *
 * À ne pas confondre avec ChartConfig/CardConfig/TableConfig
 * (block-section/*.types.ts) : ceux-là décrivent un block figé dans une page
 * précise (ex: groupes/[code]). StatDefinition décrit une stat adressable
 * indépendamment — recherchable, comparable, exportable — consommée par le
 * hub Statistiques. Voir app/5.STATS-CATALOG_client_side.md.
 */
export interface StatDefinition {
    /** Namespacé automatiquement par `defineStat` : "<domain>.<slug>" — unique dans tout le catalogue */
    id: string;
    /** Identifiant local au domaine, utilisé pour résoudre la stat côté serveur (STAT_HANDLERS) */
    slug: string;
    domain: StatDomain;
    scope: StatScope;

    title: string;
    category: string;
    keywords: string[];
    description?: string;
    /** Explication de comment la stat est calculée, affichée à la demande (feature "méthodologie") */
    methodology: string;

    dataShape: StatDataShape;
    unit?: string;

    /** scope === "aggregate" : filtres disponibles pour restreindre la population (réutilise FilterField de FilterBarLib) */
    populationFilters?: FilterField[];
    /** scope === "entity" : libellé de la sélection d'entité (ex: "Choisir un député") */
    entityIdLabel?: string;
}
