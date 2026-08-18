import { useEffect, useState } from "react";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { INSIGHT_RESOLVERS } from "@/app/(ui)/_shared/statistics/insights/insight-resolvers.registry";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

/**
 * Résout le texte d'analyse d'une stat déjà chargée (voir insight.types.ts),
 * ou `null` si la stat n'a pas de resolver enregistré, ou si le resolver
 * juge qu'il n'y a rien d'intéressant à dire.
 */
export function useStatInsight(
    definition: StatDefinition,
    context: StatFetchParams,
    data: RawStatData | null
): string | null {
    const [insight, setInsight] = useState<string | null>(null);
    const resolver = INSIGHT_RESOLVERS[definition.id];
    const contextKey = JSON.stringify(context);

    useEffect(() => {
        // Pas de setState synchrone ici (react-hooks/set-state-in-effect) —
        // la valeur retournée ci-dessous masque de toute façon `insight` tant
        // que resolver/data ne sont pas prêts.
        if (!resolver || !data) return;

        let cancelled = false;
        resolver(definition, context, data)
            .then((text) => {
                if (!cancelled) setInsight(text);
            })
            .catch(() => {
                if (!cancelled) setInsight(null);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [definition.id, contextKey, data, resolver]);

    return resolver && data ? insight : null;
}
