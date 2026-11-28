import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import {
    getAssembleePresenceAnnuelleUseCase,
    getAssembleePresenceComposantesUseCase,
    getAssembleePresenceDeputesPresentsUseCase,
    getAssembleePresenceEvolutionUseCase,
    getAssembleePresenceJournaliereUseCase,
    getAssembleePresenceJoursMensuelsUseCase,
    getAssembleePresenceJourSemaineUseCase,
    getAssembleePresenceTauxAnnuelUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { courbe, parPerimetre, sansToutes, series } from "@/app/api/statistics/_handlers/presence-handlers.helpers";
import { prismaPresenceStatsRepository as repo } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { PresenceTypePeriode } from "@/app/domains/presence/entities/presence-stats.entity";

/**
 * Présence moyenne de TOUS les députés (vues `agg_assemblee_presence*`), sur une
 * législature ou toutes législatures confondues (`filters.legislature =
 * "toutes"`, lignes legislature IS NULL des vues). Branchée dans deux domaines
 * du mode avancé, mêmes slugs : `acteurs` (« Tous les députés ») et
 * `legislatures`. Voir `presence-moyenne.stats.ts` côté catalogue.
 */

function annuelle(type: PresenceTypePeriode, mesure: "jours" | "taux"): StatHandler {
    const handler = parPerimetre(
        (p) => (mesure === "jours" ? getAssembleePresenceAnnuelleUseCase(repo, type, p) : getAssembleePresenceTauxAnnuelUseCase(repo, type, p)),
        courbe,
        type === "mandat" ? undefined : type,
    );
    // Pas d'année de mandat toutes législatures confondues (voir la vue) : refusé plutôt qu'une courbe vide.
    return type === "mandat" ? sansToutes(handler) : handler;
}

export const PRESENCE_MOYENNE_STAT_HANDLERS: Record<string, StatHandler> = {
    "presence-moyenne": parPerimetre((p) => getAssembleePresenceComposantesUseCase(repo, p), series),
    "presence-moyenne-evolution": parPerimetre((p) => getAssembleePresenceEvolutionUseCase(repo, p), courbe, "mois"),
    "presence-moyenne-jours-mensuels": parPerimetre((p) => getAssembleePresenceJoursMensuelsUseCase(repo, p), courbe, "mois"),
    "presence-moyenne-journaliere": parPerimetre((p) => getAssembleePresenceJournaliereUseCase(repo, p), series, "jour"),
    "presence-moyenne-deputes-presents": parPerimetre((p) => getAssembleePresenceDeputesPresentsUseCase(repo, p), courbe, "jour"),
    "presence-moyenne-jour-semaine": parPerimetre((p) => getAssembleePresenceJourSemaineUseCase(repo, p), series),
    "presence-moyenne-taux-annee-civile": annuelle("civile", "taux"),
    "presence-moyenne-taux-annee-parlementaire": annuelle("parlementaire", "taux"),
    "presence-moyenne-taux-annee-mandat": annuelle("mandat", "taux"),
    "presence-moyenne-jours-annee-civile": annuelle("civile", "jours"),
    "presence-moyenne-jours-annee-parlementaire": annuelle("parlementaire", "jours"),
    "presence-moyenne-jours-annee-mandat": annuelle("mandat", "jours"),
};
