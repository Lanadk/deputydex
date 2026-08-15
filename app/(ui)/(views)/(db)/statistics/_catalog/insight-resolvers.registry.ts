import { InsightResolver } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insight.types";
import { groupesPariteInsight } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insights/groupes-parite.insight";

/**
 * Un insight par id de StatDefinition (pas par domaine/forme — voir
 * insight.types.ts). Une stat absente de ce registre s'affiche sans texte,
 * jamais avec un texte générique ou à moitié rempli.
 */
export const INSIGHT_RESOLVERS: Partial<Record<string, InsightResolver>> = {
    "groupes.parite": groupesPariteInsight,
};
