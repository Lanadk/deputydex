import { err, isErr, ok, Result } from "@/app/_shared/result-pattern/result";
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
import { prismaPresenceStatsRepository as repo } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { PresenceTypePeriode } from "@/app/domains/presence/entities/presence-stats.entity";
import { PresenceStatItemDTO, PresenceStatSeriesDTO } from "@/app/domains/presence/dto/presence-stats.dto";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

/**
 * Présence moyenne de TOUS les députés d'UNE législature (vues
 * `agg_assemblee_presence*`). Branchée dans deux domaines du mode avancé,
 * mêmes slugs : `acteurs` (« Tous les députés ») et `legislatures` — chacun
 * impose le choix d'une législature via son EntityResolver. Voir
 * `presence-moyenne.stats.ts` côté catalogue.
 */
function presenceMoyenne<T>(
    run: (legislature: number) => Promise<Result<T, "DB_ERROR">>,
    toRaw: (data: T) => RawStatData,
): StatHandler {
    return async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");
        const result = await run(legislature);
        if (isErr(result)) return result;
        return ok(toRaw(result.data));
    };
}

const courbe = (data: { items: PresenceStatItemDTO[] } | { points: PresenceStatItemDTO[] }): RawStatData =>
    ({ shape: "timeseries", points: "items" in data ? data.items : data.points });
const series = (data: PresenceStatSeriesDTO): RawStatData => ({ shape: "multi-series", series: data.series });

function annuelle(type: PresenceTypePeriode, mesure: "jours" | "taux"): StatHandler {
    return presenceMoyenne(
        (leg) => (mesure === "jours" ? getAssembleePresenceAnnuelleUseCase(repo, type, leg) : getAssembleePresenceTauxAnnuelUseCase(repo, type, leg)),
        courbe,
    );
}

export const PRESENCE_MOYENNE_STAT_HANDLERS: Record<string, StatHandler> = {
    "presence-moyenne": presenceMoyenne((leg) => getAssembleePresenceComposantesUseCase(repo, leg), series),
    "presence-moyenne-evolution": presenceMoyenne((leg) => getAssembleePresenceEvolutionUseCase(repo, leg), courbe),
    "presence-moyenne-jours-mensuels": presenceMoyenne((leg) => getAssembleePresenceJoursMensuelsUseCase(repo, leg), courbe),
    "presence-moyenne-journaliere": presenceMoyenne((leg) => getAssembleePresenceJournaliereUseCase(repo, leg), series),
    "presence-moyenne-deputes-presents": presenceMoyenne((leg) => getAssembleePresenceDeputesPresentsUseCase(repo, leg), courbe),
    "presence-moyenne-jour-semaine": presenceMoyenne((leg) => getAssembleePresenceJourSemaineUseCase(repo, leg), series),
    "presence-moyenne-taux-annee-civile": annuelle("civile", "taux"),
    "presence-moyenne-taux-annee-parlementaire": annuelle("parlementaire", "taux"),
    "presence-moyenne-taux-annee-mandat": annuelle("mandat", "taux"),
    "presence-moyenne-jours-annee-civile": annuelle("civile", "jours"),
    "presence-moyenne-jours-annee-parlementaire": annuelle("parlementaire", "jours"),
    "presence-moyenne-jours-annee-mandat": annuelle("mandat", "jours"),
};
