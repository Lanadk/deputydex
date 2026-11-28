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
    getReperesLegislaturesUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository as repo } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { PresenceTypePeriode } from "@/app/domains/presence/entities/presence-stats.entity";
import { PresenceStatItemDTO, PresenceStatSeriesDTO } from "@/app/domains/presence/dto/presence-stats.dto";
import { EchelleReperes } from "@/app/domains/presence/presence-reperes";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { lirePerimetreLegislature, PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";

/**
 * Présence moyenne de TOUS les députés (vues `agg_assemblee_presence*`), sur une
 * législature ou toutes législatures confondues (`filters.legislature =
 * "toutes"`, lignes legislature IS NULL des vues). Branchée dans deux domaines
 * du mode avancé, mêmes slugs : `acteurs` (« Tous les députés ») et
 * `legislatures`. Voir `presence-moyenne.stats.ts` côté catalogue.
 *
 * En « toutes », les courbes reçoivent des repères « Début de la Nᵉ
 * législature » calculés depuis `param_legislatures` (`echelle` = format de
 * leurs libellés).
 */
function presenceMoyenne<T>(
    run: (perimetre: PerimetreLegislature) => Promise<Result<T, "DB_ERROR">>,
    toRaw: (data: T) => RawStatData,
    echelle?: EchelleReperes,
): StatHandler {
    return async (params) => {
        const perimetre = lirePerimetreLegislature(params.filters?.legislature);
        if (perimetre == null) return err("INVALID_INPUT");

        const result = await run(perimetre);
        if (isErr(result)) return result;
        const raw = toRaw(result.data);
        if (perimetre !== TOUTES_LEGISLATURES || !echelle) return ok(raw);

        // Repères : une panne ne bloque pas la courbe, elle s'affiche sans.
        const reperes = await getReperesLegislaturesUseCase(repo, echelle, libellesDe(raw));
        return ok(isErr(reperes) || reperes.data.length === 0 ? raw : { ...raw, markers: reperes.data });
    };
}

/** Libellés de l'axe d'une donnée (points ou items de toutes les séries). */
function libellesDe(raw: RawStatData): string[] {
    if (raw.shape === "timeseries") return raw.points.map((p) => p.label);
    if (raw.shape === "multi-series") return Array.from(new Set(raw.series.flatMap((s) => s.items.map((i) => i.label))));
    return [];
}

const courbe = (data: { items: PresenceStatItemDTO[] } | { points: PresenceStatItemDTO[] }): RawStatData =>
    ({ shape: "timeseries", points: "items" in data ? data.items : data.points });
const series = (data: PresenceStatSeriesDTO): RawStatData => ({ shape: "multi-series", series: data.series });

function annuelle(type: PresenceTypePeriode, mesure: "jours" | "taux"): StatHandler {
    const handler = presenceMoyenne(
        (p) => (mesure === "jours" ? getAssembleePresenceAnnuelleUseCase(repo, type, p) : getAssembleePresenceTauxAnnuelUseCase(repo, type, p)),
        courbe,
        type === "mandat" ? undefined : type,
    );
    // Pas d'année de mandat toutes législatures confondues (voir la vue) : refusé plutôt qu'une courbe vide.
    return type === "mandat"
        ? async (params) => (params.filters?.legislature === TOUTES_LEGISLATURES ? err("INVALID_INPUT") : handler(params))
        : handler;
}

export const PRESENCE_MOYENNE_STAT_HANDLERS: Record<string, StatHandler> = {
    "presence-moyenne": presenceMoyenne((p) => getAssembleePresenceComposantesUseCase(repo, p), series),
    "presence-moyenne-evolution": presenceMoyenne((p) => getAssembleePresenceEvolutionUseCase(repo, p), courbe, "mois"),
    "presence-moyenne-jours-mensuels": presenceMoyenne((p) => getAssembleePresenceJoursMensuelsUseCase(repo, p), courbe, "mois"),
    "presence-moyenne-journaliere": presenceMoyenne((p) => getAssembleePresenceJournaliereUseCase(repo, p), series, "jour"),
    "presence-moyenne-deputes-presents": presenceMoyenne((p) => getAssembleePresenceDeputesPresentsUseCase(repo, p), courbe, "jour"),
    "presence-moyenne-jour-semaine": presenceMoyenne((p) => getAssembleePresenceJourSemaineUseCase(repo, p), series),
    "presence-moyenne-taux-annee-civile": annuelle("civile", "taux"),
    "presence-moyenne-taux-annee-parlementaire": annuelle("parlementaire", "taux"),
    "presence-moyenne-taux-annee-mandat": annuelle("mandat", "taux"),
    "presence-moyenne-jours-annee-civile": annuelle("civile", "jours"),
    "presence-moyenne-jours-annee-parlementaire": annuelle("parlementaire", "jours"),
    "presence-moyenne-jours-annee-mandat": annuelle("mandat", "jours"),
};
