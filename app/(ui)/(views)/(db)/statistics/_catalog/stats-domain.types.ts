import { IconLibType } from "@/app/(ui)/component-library/types/icons.types";
import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

export interface StatDomainModule {
    id: StatDomain;
    label: string;
    icon: IconLibType;
    /** Vide tant que le backend du domaine n'existe pas (ex: votes, scrutins) */
    stats: StatDefinition[];
}
