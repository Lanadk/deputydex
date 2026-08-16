import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";
import { EntityResolver } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { GroupeEntityResolver } from "./groupes/groupe-entity-resolver";
import { ActeurEntityResolver } from "./acteurs/acteur-entity-resolver";
import { VotesEntityResolver } from "./votes/votes-entity-resolver";

/**
 * Domaines exposant un choix "entité précise vs population" avant les
 * catégories — ou, pour "votes" (pas d'entité, juste un filtre législature à
 * imposer, voir VotesEntityResolver), juste ce filtre. Un domaine absent de
 * ce registre (scrutins, legislatures pour l'instant) saute directement aux
 * catégories — voir `is-context-ready.ts` : `scrutins.participation`
 * (évolution toutes législatures confondues, volontairement) resterait
 * cassé par un filtre imposé au niveau du domaine entier, contrairement à
 * `votes` où TOUTES les stats sont par-législature.
 */
export const ENTITY_RESOLVERS: Partial<Record<StatDomain, EntityResolver>> = {
    groupes: GroupeEntityResolver,
    acteurs: ActeurEntityResolver,
    votes: VotesEntityResolver,
};
