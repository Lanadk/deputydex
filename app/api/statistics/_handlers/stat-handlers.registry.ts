import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import { ACTEURS_STAT_HANDLERS } from "@/app/api/statistics/_handlers/acteurs.handlers";
import { GROUPES_STAT_HANDLERS } from "@/app/api/statistics/_handlers/groupes.handlers";
import { VOTES_STAT_HANDLERS } from "@/app/api/statistics/_handlers/votes.handlers";
import { SCRUTINS_STAT_HANDLERS } from "@/app/api/statistics/_handlers/scrutins.handlers";
import { LEGISLATURES_STAT_HANDLERS } from "@/app/api/statistics/_handlers/legislatures.handlers";

/**
 * Registre SERVEUR des stats du catalogue : symétrique du registre client
 * (StatDefinition[] sous _shared/statistics/catalog/domains/<domain>/registry.ts)
 * mais branchant use-case + repository Prisma au lieu de title/category/keywords.
 * Un fichier par domaine (`acteurs.handlers.ts`, `groupes.handlers.ts`...),
 * assemblés ici — seul `route.ts` importe ce registre, jamais un handler de
 * domaine directement. Ajouter une stat = une entrée dans le fichier du bon
 * domaine + une entrée dans le registry client — jamais une nouvelle route.
 */
export const STAT_HANDLERS: Record<string, Record<string, StatHandler>> = {
    acteurs: ACTEURS_STAT_HANDLERS,
    groupes: GROUPES_STAT_HANDLERS,
    votes: VOTES_STAT_HANDLERS,
    scrutins: SCRUTINS_STAT_HANDLERS,
    legislatures: LEGISLATURES_STAT_HANDLERS,
};
