import { StatDomain, StatFetchParams, StatScope } from "@/app/_shared/statistics/stat-scope.types";
import { ENTITY_RESOLVERS } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry";

/**
 * Un contexte n'est "prêt" que si tout ce qu'un EntityResolver impose est
 * renseigné : une entité en scope "entity" (`context.entityId`), une
 * législature en scope "aggregate" (`context.filters.legislature`) — dès
 * qu'un resolver existe pour ce domaine. Sans resolver (votes/scrutins/
 * legislatures aujourd'hui), rien à attendre : toujours prêt.
 *
 * Source de vérité unique pour deux usages : ne pas afficher les catégories
 * du picker avant que ce soit prêt (StatPicker), et ne pas fetcher un
 * StatViewer avec des paramètres incomplets — ce qui ferait échouer la
 * requête serveur (entityId/legislature manquants).
 */
export function isContextReady(domain: StatDomain, scope: StatScope, context: StatFetchParams): boolean {
    if (!ENTITY_RESOLVERS[domain]) return true;
    return scope === "entity" ? !!context.entityId : context.filters?.legislature != null;
}
