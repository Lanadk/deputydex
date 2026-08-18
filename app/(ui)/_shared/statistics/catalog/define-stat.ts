import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";

/**
 * Construit une StatDefinition avec un id namespacé "<domain>.<slug>",
 * garanti unique par construction — deux domaines ne peuvent pas collisionner
 * quand le catalogue agrège tous les registries (voir stats-catalog.ts).
 */
export function defineStat(
    domain: StatDomain,
    slug: string,
    def: Omit<StatDefinition, "id" | "slug" | "domain">
): StatDefinition {
    return { ...def, id: `${domain}.${slug}`, slug, domain };
}
