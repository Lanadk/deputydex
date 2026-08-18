import { StatDomain, StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

const DOMAIN_AGGREGATE_LABELS: Record<StatDomain, string> = {
    acteurs: "Tous les députés",
    groupes: "Tous les groupes",
    votes: "Tous les votes",
    scrutins: "Tous les scrutins",
    legislatures: "Toutes les législatures",
};

/**
 * Libellé humain d'un contexte de comparaison ("RN — 17ᵉ législature",
 * "Amélie Durand", "Tous les groupes — 16ᵉ législature"...) au lieu du
 * générique "Contexte A/B" qui ne dit rien de ce qu'on compare réellement.
 * `entityLabel` est déposé dans `filters` par les EntityResolvers au moment
 * du choix (voir groupe-entity-resolver.tsx / acteur-entity-resolver.tsx).
 */
export function buildContextLabel(domain: StatDomain | null, context: StatFetchParams, fallback: string): string {
    if (!domain) return fallback;

    const legislature = context.filters?.legislature as number | undefined;
    const legislatureSuffix = legislature ? ` — ${legislature}ᵉ législature` : "";

    if (context.entityId) {
        const entityLabel = (context.filters?.entityLabel as string | undefined) ?? context.entityId;
        return `${entityLabel}${legislatureSuffix}`;
    }

    if (legislature) {
        return `${DOMAIN_AGGREGATE_LABELS[domain]}${legislatureSuffix}`;
    }

    return fallback;
}
