import { Users, Vote, ClipboardList, CalendarDays } from "lucide-react";
import { MdOutlineGroups2 } from "react-icons/md";
import { StatDomainModule } from "@/app/(ui)/_shared/statistics/catalog/stats-domain.types";
import { ACTEURS_STATS } from "@/app/(ui)/_shared/statistics/catalog/domains/acteurs/registry";
import { GROUPES_STATS } from "@/app/(ui)/_shared/statistics/catalog/domains/groupes/registry";
import { VOTES_STATS } from "@/app/(ui)/_shared/statistics/catalog/domains/votes/registry";
import { SCRUTINS_STATS } from "@/app/(ui)/_shared/statistics/catalog/domains/scrutins/registry";
import { LEGISLATURES_STATS } from "@/app/(ui)/_shared/statistics/catalog/domains/legislatures/registry";

/**
 * Catalogue global : agrège les registries des 5 domaines en un seul espace
 * de recherche/comparaison. C'est le SEUL point d'entrée pour parcourir
 * "toutes les stats" — la page Statistiques ne doit jamais importer un
 * registry de domaine directement.
 */
export const STATS_CATALOG: StatDomainModule[] = [
    { id: "acteurs", label: "Députés", icon: Users, stats: ACTEURS_STATS },
    { id: "groupes", label: "Groupes parlementaires", icon: MdOutlineGroups2, stats: GROUPES_STATS },
    { id: "votes", label: "Votes", icon: Vote, stats: VOTES_STATS },
    { id: "scrutins", label: "Scrutins", icon: ClipboardList, stats: SCRUTINS_STATS },
    { id: "legislatures", label: "Législatures", icon: CalendarDays, stats: LEGISLATURES_STATS },
];
