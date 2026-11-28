import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";
import { StatMarker } from "@/app/_shared/statistics/raw-stat-data.types";
import { EchelleReperes, reperesLegislatures } from "@/app/domains/presence/presence-reperes";
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
    mapComposantesToDTO,
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

// ── Député (périmètre : absent = une série par législature ; un numéro ; « toutes » = combiné) ──

export function getDeputePresenceSourcesUseCase(repo: IPresenceStatsRepository, acteurUid: string, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getDeputeParLegislature(acteurUid, perimetre), (rows) => sortSeries(mapDeputeSourcesToDTO(rows)));
}

/** Taux global et composantes (séance, commission, excusés, scrutins), une série par législature. */
export function getDeputePresenceComposantesUseCase(repo: IPresenceStatsRepository, acteurUid: string, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getDeputeParLegislature(acteurUid, perimetre), (rows) => sortSeries(mapComposantesToDTO(rows)));
}

export function getDeputePresenceEvolutionUseCase(repo: IPresenceStatsRepository, acteurUid: string, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getDeputeMensuelle(acteurUid, perimetre), (rows) => points(mapDeputeMensuelleTauxToDTO(rows)));
}

export function getDeputePresenceJoursMensuelsUseCase(repo: IPresenceStatsRepository, acteurUid: string, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getDeputeMensuelle(acteurUid, perimetre), (rows) => points(mapDeputeMensuelleJoursToDTO(rows)));
}

export function getDeputePresenceAnnuelleUseCase(repo: IPresenceStatsRepository, acteurUid: string, type: PresenceTypePeriode, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getDeputeAnnuelle(acteurUid, type, perimetre), (rows) => chronologie(mapAnneesToDTO(rows, type)));
}

/** Date FR (JJ/MM/AAAA) d'une colonne DATE Postgres, renvoyée à minuit UTC par Prisma. */
function dateFr(date: Date): string {
    return date.toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Accord : « attendu » / « attendus ». */
const accord = (n: number, mot: string) => `${mot}${n > 1 ? "s" : ""}`;

/**
 * Contexte à afficher sous les graphes de présence d'un député, une mention
 * par législature : prise de fonction et volume sur lequel portent les taux —
 * « 17ᵉ législature : en fonction depuis le 26/07/2026 · 33 jours attendus,
 * 7 présents ». Toujours affiché : un taux sur 33 jours ne se lit pas comme
 * un taux sur 600. `null` si le député n'a aucun jour de mandat connu.
 */
export async function getDeputePresenceContexteUseCase(repo: IPresenceStatsRepository, acteurUid: string, perimetre?: PerimetreLegislature): PresenceResult<string | null> {
    // « toutes » : on liste quand même chaque législature (prise de fonction propre à chacune).
    const legislature = typeof perimetre === "number" ? perimetre : undefined;
    const result = await fromRepository(() =>
        Promise.all([repo.getDeputeDebutsMandat(acteurUid, legislature), repo.getDeputeParLegislature(acteurUid, legislature)])
    );
    if (isErr(result)) return result;
    const [debuts, totaux] = result.data;

    // Lignes par législature seulement (pas la ligne « toutes ») : une mention chacune.
    const legislatures = Array.from(new Set([...debuts, ...totaux].map((r) => r.legislature)))
        .filter((leg): leg is number => leg != null)
        .sort((a, b) => a - b);
    if (legislatures.length === 0) return ok(null);

    return ok(
        legislatures
            .map((leg) => {
                const debut = debuts.find((d) => d.legislature === leg);
                const total = totaux.find((t) => t.legislature === leg);
                const parts = [
                    debut && `en fonction depuis le ${dateFr(debut.debut_mandat)}`,
                    total &&
                        `${total.jours_attendus} ${accord(total.jours_attendus, "jour")} ${accord(total.jours_attendus, "attendu")}, ` +
                        `${total.jours_presents} ${accord(total.jours_presents, "présent")}`,
                ].filter(Boolean);
                return `${leg}ᵉ législature : ${parts.join(" · ")}`;
            })
            .join(" — ")
    );
}
// ── Groupes (une législature, ou « toutes » : chaque groupe de chaque législature à part) ──

export function getGroupesPresenceUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(perimetre), (rows) => classement(mapGroupesTauxToDTO(rows, perimetre === TOUTES_LEGISLATURES)));
}

/** Classement des groupes sur UNE composante (séance, commission, excusés, scrutins), taux décroissant. */
export function getGroupesPresenceComposanteUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature, composante: PresenceComposante): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(perimetre), (rows) => classement(mapGroupesComposanteToDTO(rows, composante, perimetre === TOUTES_LEGISLATURES)));
}

/** Toutes les composantes par groupe : une série par composante (ordre d'affichage), groupes par ordre alphabétique de code. */
export function getGroupesPresenceComposantesUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupes(perimetre), (rows) => sortSeries(mapGroupesComposantesToDTO(rows, perimetre === TOUTES_LEGISLATURES)));
}
export function getGroupesPresenceJoursParMoisUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getGroupes(perimetre), (rows) => classement(mapGroupesJoursParMoisToDTO(rows, perimetre === TOUTES_LEGISLATURES)));
}

export function getGroupesPresenceEvolutionUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupesMensuelle(perimetre), (rows) => sortSeries(mapGroupesMensuelleToDTO(rows, perimetre === TOUTES_LEGISLATURES)));
}

export function getGroupePresenceEvolutionUseCase(repo: IPresenceStatsRepository, code: string, legislature: number): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getGroupeMensuelle(code, legislature), (rows) => points(mapGroupeMensuelleToDTO(rows)));
}

export function getGroupesPresenceAnnuelleUseCase(repo: IPresenceStatsRepository, perimetre: PerimetreLegislature, type: Annee): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getGroupesAnnuelle(perimetre, type), (rows) => sortSeries(mapGroupesAnnuelleToDTO(rows, perimetre === TOUTES_LEGISLATURES)));
}

// ── Assemblée (périmètre : une législature, « toutes », ou absent = une ligne par législature) ──

export function getAssembleePresenceParLegislatureUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssemblee(perimetre), (rows) => chronologie(mapAssembleeTauxParLegislatureToDTO(rows)));
}

export function getAssembleePresenceComposantesUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssemblee(perimetre), (rows) => sortSeries(mapAssembleeComposantesToDTO(rows)));
}

export function getAssembleePresenceEvolutionUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeMensuelle(perimetre), (rows) => points(mapAssembleeMensuelleTauxToDTO(rows)));
}

export function getAssembleePresenceJoursMensuelsUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeMensuelle(perimetre), (rows) => points(mapAssembleeMensuelleJoursToDTO(rows)));
}

/** Jours de présence par mois, par année (civile, parlementaire ou de mandat — cette dernière par rang). */
export function getAssembleePresenceAnnuelleUseCase(repo: IPresenceStatsRepository, type: PresenceTypePeriode, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssembleeAnnuelle(type, perimetre), (rows) => chronologie(mapAnneesToDTO(rows, type)));
}

/** Taux de présence, par année (civile, parlementaire ou de mandat). */
export function getAssembleePresenceTauxAnnuelUseCase(repo: IPresenceStatsRepository, type: PresenceTypePeriode, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatItemsDTO> {
    return lire(() => repo.getAssembleeAnnuelle(type, perimetre), (rows) => chronologie(mapAnneesTauxToDTO(rows, type)));
}

/** Jour par jour : présence en séance et présence tous lieux (deux séries). */
export function getAssembleePresenceJournaliereUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssembleeJournaliere(perimetre), (rows) => sortSeries(mapAssembleeJournaliereToDTO(rows)));
}

/** Nombre de députés présents, jour par jour. */
export function getAssembleePresenceDeputesPresentsUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatPointsDTO> {
    return lire(() => repo.getAssembleeJournaliere(perimetre), (rows) => points(mapAssembleeDeputesPresentsToDTO(rows)));
}

export function getAssembleePresenceJourSemaineUseCase(repo: IPresenceStatsRepository, perimetre?: PerimetreLegislature): PresenceResult<PresenceStatSeriesDTO> {
    return lire(() => repo.getAssembleeJourSemaine(perimetre), (rows) => sortSeries(mapAssembleeJourSemaineToDTO(rows)));
}

/**
 * Repères « Début de la Nᵉ législature » à poser sur une courbe toutes
 * législatures, dans l'échelle de ses libellés (voir presence-reperes.ts).
 */
export function getReperesLegislaturesUseCase(repo: IPresenceStatsRepository, echelle: EchelleReperes, libelles: string[]): PresenceResult<StatMarker[]> {
    return lire(() => repo.getDebutsLegislatures(), (debuts) => reperesLegislatures(debuts, echelle, libelles));
}
