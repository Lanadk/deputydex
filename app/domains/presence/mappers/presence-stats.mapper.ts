import {
    AssembleePresenceJourRow,
    AssembleePresenceJourSemaineRow,
    AssembleePresenceLegislatureRow,
    AssembleePresenceMoisRow,
    DeputePresenceLegislatureRow,
    DeputePresenceMoisRow,
    GroupePresenceAnneeRow,
    GroupePresenceMoisRow,
    GroupePresenceRow,
    PresenceAnneeRow,
    PresenceTypePeriode,
} from "@/app/domains/presence/entities/presence-stats.entity";
import {
    PresenceStatItemDTO,
    PresenceStatItemsDTO,
    PresenceStatPointsDTO,
    PresenceStatSeriesDTO,
} from "@/app/domains/presence/dto/presence-stats.dto";
import { jourLabel, jourSemaineLabel, legislatureLabel, moisLabel, periodeLabel } from "@/app/domains/presence/presence-labels";

/**
 * Conversions entité → DTO des statistiques de présence. Aucun tri ni filtre
 * ici (voir les use-cases) ; une valeur nulle (taux sans jour attendu) devient
 * un item absent plutôt qu'un 0 trompeur.
 */

function item(label: string, value: number | null): PresenceStatItemDTO[] {
    return value == null ? [] : [{ label, value }];
}

/** Jours de présence d'un député par source, une série par législature. */
export function mapDeputeSourcesToDTO(rows: DeputePresenceLegislatureRow[]): PresenceStatSeriesDTO {
    return {
        series: rows.map((r) => ({
            name: legislatureLabel(r.legislature),
            items: [
                { label: "1 · Tous jours de présence", value: r.jours_presence },
                { label: "2 · Avec un vote", value: r.jours_vote },
                { label: "3 · Avec une prise de parole", value: r.jours_debat },
                { label: "4 · En commission", value: r.jours_commission },
            ],
        })),
    };
}

/** Taux mensuel d'un député (toutes législatures, libellé « AAAA-MM »). */
export function mapDeputeMensuelleTauxToDTO(rows: DeputePresenceMoisRow[]): PresenceStatPointsDTO {
    return { points: rows.flatMap((r) => item(moisLabel(r.mois), r.taux_presence)) };
}

/** Jours de présence mensuels d'un député. */
export function mapDeputeMensuelleJoursToDTO(rows: DeputePresenceMoisRow[]): PresenceStatPointsDTO {
    return { points: rows.map((r) => ({ label: moisLabel(r.mois), value: r.jours_presence })) };
}

/** Jours de présence par mois, une période annuelle par item (« 17ᵉ · 2025-2026 »). */
export function mapAnneesToDTO(rows: PresenceAnneeRow[], type: PresenceTypePeriode): PresenceStatItemsDTO {
    return { items: rows.flatMap((r) => item(periodeLabel(r.legislature, r.periode, type), r.jours_presence_par_mois)) };
}

/** Taux de présence par groupe (label = CODE du groupe, convention des stats de groupes). */
export function mapGroupesTauxToDTO(rows: GroupePresenceRow[]): PresenceStatItemsDTO {
    return { items: rows.flatMap((r) => item(r.groupe_code, r.taux_presence)) };
}

/** Jours de présence par mois et par député, par groupe. */
export function mapGroupesJoursParMoisToDTO(rows: GroupePresenceRow[]): PresenceStatItemsDTO {
    return { items: rows.flatMap((r) => item(r.groupe_code, r.jours_presence_par_mois)) };
}

/** Taux mensuel d'un groupe. */
export function mapGroupeMensuelleToDTO(rows: GroupePresenceMoisRow[]): PresenceStatPointsDTO {
    return { points: rows.flatMap((r) => item(moisLabel(r.mois), r.taux_presence)) };
}

/** Une série par groupe (nom = CODE), un item par mois. */
export function mapGroupesMensuelleToDTO(rows: GroupePresenceMoisRow[]): PresenceStatSeriesDTO {
    const parGroupe = new Map<string, PresenceStatItemDTO[]>();
    for (const r of rows) {
        if (!parGroupe.has(r.groupe_code)) parGroupe.set(r.groupe_code, []);
        parGroupe.get(r.groupe_code)!.push(...item(moisLabel(r.mois), r.taux_presence));
    }
    return { series: Array.from(parGroupe, ([name, items]) => ({ name, items })) };
}

/** Une série par groupe (nom = CODE), un item par période annuelle. */
export function mapGroupesAnnuelleToDTO(rows: GroupePresenceAnneeRow[]): PresenceStatSeriesDTO {
    const parGroupe = new Map<string, PresenceStatItemDTO[]>();
    for (const r of rows) {
        if (!parGroupe.has(r.groupe_code)) parGroupe.set(r.groupe_code, []);
        parGroupe.get(r.groupe_code)!.push(...item(r.periode, r.jours_presence_par_mois));
    }
    return { series: Array.from(parGroupe, ([name, items]) => ({ name, items })) };
}

/** Taux de présence de l'Assemblée, un item par législature. */
export function mapAssembleeTauxParLegislatureToDTO(rows: AssembleePresenceLegislatureRow[]): PresenceStatItemsDTO {
    return { items: rows.flatMap((r) => item(legislatureLabel(r.legislature), r.taux_presence)) };
}

/** Composantes de la présence de l'Assemblée, une série par législature. */
export function mapAssembleeComposantesToDTO(rows: AssembleePresenceLegislatureRow[]): PresenceStatSeriesDTO {
    return {
        series: rows.map((r) => ({
            name: legislatureLabel(r.legislature),
            items: [
                ...item("1 · Présence (tous jours attendus)", r.taux_presence),
                ...item("2 · En séance", r.taux_presence_seance),
                ...item("3 · En commission", r.taux_presence_commission),
                ...item("4 · Excusés en commission", r.taux_excuses_commission),
                ...item("5 · Participation aux scrutins", r.taux_participation_scrutins),
            ],
        })),
    };
}

/** Taux mensuel de l'Assemblée. */
export function mapAssembleeMensuelleTauxToDTO(rows: AssembleePresenceMoisRow[]): PresenceStatPointsDTO {
    return { points: rows.flatMap((r) => item(moisLabel(r.mois), r.taux_presence)) };
}

/** Jours de présence d'un député, en moyenne, par mois. */
export function mapAssembleeMensuelleJoursToDTO(rows: AssembleePresenceMoisRow[]): PresenceStatPointsDTO {
    return { points: rows.flatMap((r) => item(moisLabel(r.mois), r.jours_presence_par_depute)) };
}

/** Présence en séance, jour par jour (libellé « AAAA-MM-JJ »). */
export function mapAssembleeJournaliereToDTO(rows: AssembleePresenceJourRow[]): PresenceStatPointsDTO {
    return { points: rows.flatMap((r) => item(jourLabel(r.jour), r.taux_presence_seance)) };
}

/** Présence par jour de la semaine, une série par législature (« 1 · Lundi »…). */
export function mapAssembleeJourSemaineToDTO(rows: AssembleePresenceJourSemaineRow[]): PresenceStatSeriesDTO {
    const parLegislature = new Map<number, PresenceStatItemDTO[]>();
    for (const r of rows) {
        if (!parLegislature.has(r.legislature)) parLegislature.set(r.legislature, []);
        parLegislature.get(r.legislature)!.push(...item(jourSemaineLabel(r.jour_semaine), r.taux_presence));
    }
    return { series: Array.from(parLegislature, ([leg, items]) => ({ name: legislatureLabel(leg), items })) };
}
