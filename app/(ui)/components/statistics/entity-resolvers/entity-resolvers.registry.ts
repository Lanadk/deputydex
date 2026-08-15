import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";
import { EntityResolver } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { GroupeEntityResolver } from "./groupes/groupe-entity-resolver";
import { ActeurEntityResolver } from "./acteurs/acteur-entity-resolver";

/**
 * Domaines exposant un choix "entité précise vs population" avant les
 * catégories. Un domaine absent de ce registre (votes, scrutins,
 * legislatures pour l'instant) saute directement aux catégories — ses stats
 * sont toutes "aggregate" sans entité à choisir.
 */
export const ENTITY_RESOLVERS: Partial<Record<StatDomain, EntityResolver>> = {
    groupes: GroupeEntityResolver,
    acteurs: ActeurEntityResolver,
};
