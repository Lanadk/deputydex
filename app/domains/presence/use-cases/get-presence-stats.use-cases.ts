import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import { PresenceComposante, PresenceTypePeriode } from "@/app/domains/presence/entities/presence-stats.entity";
import {
    PresenceStatItemDTO,
    PresenceStatItemsDTO,
    PresenceStatPointsDTO,
    PresenceStatSeriesDTO,
} from "@/app/domains/presence/dto/presence-stats.dto";
import {
    mapAnneesTauxToDTO,
    mapAnneesToDTO,
    mapAssembleeDeputesPresentsToDTO,
    mapAssembleeComposantesToDTO,
    mapAssembleeJournaliereToDTO,
    mapAssembleeJourSemaineToDTO,
    mapAssembleeMensuelleJoursToDTO,
    mapAssembleeMensuelleTauxToDTO,
    mapAssembleeTauxParLegislatureToDTO,
    mapDeputeMensuelleJoursToDTO,
    mapDeputeMensuelleTauxToDTO,
    mapDeputeSourcesToDTO,
    mapGroupeMensuelleToDTO,
    mapGroupesComposantesToDTO,
    mapGroupesComposanteToDTO,
    mapGroupesAnnuelleToDTO,
    mapGroupesJoursParMoisToDTO,
    mapGroupesMensuelleToDTO,
    mapGroupesTauxToDTO,
} from "@/app/domains/presence/mappers/presence-stats.mapper";

/**
 * Use-cases des statistiques de présence (catalogue Statistiques et Chiffres
 * clés). Chacun : lookup repository → mapper → ordre d'affichage. L'ordre est
 * une règle métier, fixée ici (fonctions de tri exportées) et pas en SQL.
 */

type PresenceResult<T> = Promise<Result<T, "DB_ERROR">>;
type Annee = Exclude<PresenceTypePeriode, "mandat">;

/** Classement : valeur décroissante, puis libellé pour départager. */
export function sortParValeurDecroissante(items: PresenceStatItemDTO[]): PresenceStatItemDTO[] {
    return [...items].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "fr"));
}

/** Chronologie / ordre naturel des libellés (« AAAA-MM », « 17ᵉ · 2025-2026 », « 1 · Lundi »). */
export function sortParLibelle(items: PresenceStatItemDTO[]): PresenceStatItemDTO[] {
    return [...items].sort((a, b) => a.label.localeCompare(b.label));
}

/** Séries triées par nom, items de chaque série par libellé. */
export function sortSeries(dto: PresenceStatSeriesDTO): PresenceStatSeriesDTO {
    return {
        series: [...dto.series]
            .sort((a, b) => a.name.localeCompare(b.name, "fr"))
            .map((s) => ({ name: s.name, items: sortParLibelle(s.items) })),
    };
}

async function lire<R, T>(fetch: () => Promise<R>, toDTO: (rows: R) => T): PresenceResult<T> {
    const result = await fromRepository(fetch);
    if (isErr(result)) return result;
    return ok(toDTO(result.data));
}

const points = (dto: PresenceStatPointsDTO): PresenceStatPointsDTO => ({ points: sortParLibelle(dto.points) });
const chronologie = (dto: PresenceStatItemsDTO): PresenceStatItemsDTO => ({ items: sortParLibelle(dto.items) });
const classement = (dto: PresenceStatItemsDTO): PresenceStatItemsDTO => ({ items: sortParValeurDecroissante(dto.items) });

// ── Député (toutes ses législatures) ─────────────────────────────────────────

export function getDeputePresenceSourcesUseCase(repo: IPresenceStatsRepository, acteurUid: string): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getDeputeParLegislature(acteurUid), (rows) => sortSeries(mapDeputeSourcesToDTO(rows)));
}

export function getDeputePresenceEvolutionUseCase(repo: IPresenceStatsRepository, acteurUid: string): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getDeputeMensuelle(acteurUid), (rows) => points(mapDeputeMensuelleTauxToDTO(rows)));
}

export function getDeputePresenceJoursMensuelsUseCase(repo: IPresenceStatsRepository, acteurUid: string): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getDeputeMensuelle(acteurUid), (rows) => points(mapDeputeMensuelleJoursToDTO(rows)));
}

export function getDeputePresenceAnnuelleUseCase(repo: IPresenceStatsRepository, acteurUid: string, type: PresenceTypePeriode): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getDeputeAnnuelle(acteurUid, type), (rows) => chronologie(mapAnneesToDTO(rows, type)));
}

// ── Groupes (une législature) ────────────────────────────────────────────────

export function getGroupesPresenceUseCase(repo: IPresenceStatsRepository, legislature: number): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(legislature), (rows) => classement(mapGroupesTauxToDTO(rows)));
}

/** Classement des groupes sur UNE composante (séance, commission, excusés, scrutins), taux décroissant. */
export function getGroupesPresenceComposanteUseCase(repo: IPresenceStatsRepository, legislature: number, composante: PresenceComposante): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(legislature), (rows) => classement(mapGroupesComposanteToDTO(rows, composante)));
}

/** Toutes les composantes par groupe : une série par composante (ordre d'affichage), groupes par ordre alphabétique de code. */
export function getGroupesPresenceComposantesUseCase(repo: IPresenceStatsRepository, legislature: number): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupes(legislature), (rows) => sortSeries(mapGroupesComposantesToDTO(rows)));
}
export function getGroupesPresenceJoursParMoisUseCase(repo: IPresenceStatsRepository, legislature: number): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(legislature), (rows) => classement(mapGroupesJoursParMoisToDTO(rows)));
}

export function getGroupesPresenceEvolutionUseCase(repo: IPresenceStatsRepository, legislature: number): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupesMensuelle(legislature), (rows) => sortSeries(mapGroupesMensuelleToDTO(rows)));
}

export function getGroupePresenceEvolutionUseCase(repo: IPresenceStatsRepository, code: string, legislature: number): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getGroupeMensuelle(code, legislature), (rows) => points(mapGroupeMensuelleToDTO(rows)));
}

export function getGroupesPresenceAnnuelleUseCase(repo: IPresenceStatsRepository, legislature: number, type: Annee): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupesAnnuelle(legislature, type), (rows) => sortSeries(mapGroupesAnnuelleToDTO(rows)));
}

// ── Assemblée (législature optionnelle : absente = toutes) ───────────────────

export function getAssembleePresenceParLegislatureUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssemblee(legislature), (rows) => chronologie(mapAssembleeTauxParLegislatureToDTO(rows)));
}

export function getAssembleePresenceComposantesUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssemblee(legislature), (rows) => sortSeries(mapAssembleeComposantesToDTO(rows)));
}

export function getAssembleePresenceEvolutionUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeMensuelle(legislature), (rows) => points(mapAssembleeMensuelleTauxToDTO(rows)));
}

export function getAssembleePresenceJoursMensuelsUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeMensuelle(legislature), (rows) => points(mapAssembleeMensuelleJoursToDTO(rows)));
}

/** Jours de présence par mois, par année (civile, parlementaire ou de mandat — cette dernière par rang). */
export function getAssembleePresenceAnnuelleUseCase(repo: IPresenceStatsRepository, type: PresenceTypePeriode, legislature?: number): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssembleeAnnuelle(type, legislature), (rows) => chronologie(mapAnneesToDTO(rows, type)));
}

/** Taux de présence, par année (civile, parlementaire ou de mandat). */
export function getAssembleePresenceTauxAnnuelUseCase(repo: IPresenceStatsRepository, type: PresenceTypePeriode, legislature?: number): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssembleeAnnuelle(type, legislature), (rows) => chronologie(mapAnneesTauxToDTO(rows, type)));
}

/** Jour par jour : présence en séance et présence tous lieux (deux séries). */
export function getAssembleePresenceJournaliereUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssembleeJournaliere(legislature), (rows) => sortSeries(mapAssembleeJournaliereToDTO(rows)));
}

/** Nombre de députés présents, jour par jour. */
export function getAssembleePresenceDeputesPresentsUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeJournaliere(legislature), (rows) => points(mapAssembleeDeputesPresentsToDTO(rows)));
}

export function getAssembleePresenceJourSemaineUseCase(repo: IPresenceStatsRepository, legislature?: number): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssembleeJourSemaine(legislature), (rows) => sortSeries(mapAssembleeJourSemaineToDTO(rows)));
}
