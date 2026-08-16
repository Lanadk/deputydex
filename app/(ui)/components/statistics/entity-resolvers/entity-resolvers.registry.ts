import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";
import { EntityResolver } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { GroupeEntityResolver } from "./groupes/groupe-entity-resolver";
import { ActeurEntityResolver } from "./acteurs/acteur-entity-resolver";
import { VotesEntityResolver } from "./votes/votes-entity-resolver";
import { ScrutinsEntityResolver } from "./scrutins/scrutins-entity-resolver";

/**
 * Domaines exposant un choix "entité précise vs population" avant les
 * catégories — ou, pour "votes"/"scrutins" (pas d'entité, juste un filtre
 * législature à imposer, voir VotesEntityResolver/ScrutinsEntityResolver),
 * juste ce filtre. "legislatures" reste absent de ce registre : sa seule
 * stat (`legislatures.parite`) est une évolution volontairement toutes
 * législatures confondues, un filtre imposé n'aurait pas de sens.
 *
 * Effet de bord assumé sur "scrutins" : `scrutins.participation` (elle aussi
 * volontairement toutes législatures confondues, comme `legislatures.parite`)
 * se retrouve gated par ce même filtre — un clic de plus qui ne change rien
 * à ce qu'elle affiche ensuite — accepté pour que `scrutins.total` (qui, lui,
 * en a réellement besoin) cesse de fetcher sans filtre. Le gate est par
 * domaine, pas par stat (voir `is-context-ready.ts`) : impossible de cibler
 * une seule des deux stats sans un changement plus large de StatPicker.
 */
export const ENTITY_RESOLVERS: Partial<Record<StatDomain, EntityResolver>> = {
    groupes: GroupeEntityResolver,
    acteurs: ActeurEntityResolver,
    votes: VotesEntityResolver,
    scrutins: ScrutinsEntityResolver,
};
