import { ActivityCalendarDay } from "@/app/_shared/calendar/activity-calendar-day.dto";

const DAY_MS = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/**
 * Grille d'activité miniature (façon calendrier de contributions) : les
 * `semaines` dernières semaines jusqu'au dernier jour d'activité connu, une
 * colonne par semaine (lundi → dimanche), chaque case au niveau 0-4 du jour
 * (0 = aucune activité). Les jours après le dernier jour connu valent -1
 * (case non affichée). Sans activité : grille vide.
 */
export function grilleActivite(jours: ActivityCalendarDay[], semaines: number): number[][] {
    if (!jours.length) return [];
    const niveaux = new Map(jours.map((j) => [j.date.slice(0, 10), j.level]));
    const dernier = Date.parse(`${jours.reduce((max, j) => (j.date > max ? j.date : max), "").slice(0, 10)}T00:00:00Z`);
    // Lundi de la semaine du dernier jour (getUTCDay : 0 = dimanche).
    const lundiFin = dernier - ((new Date(dernier).getUTCDay() + 6) % 7) * DAY_MS;
    const debut = lundiFin - (semaines - 1) * 7 * DAY_MS;

    return Array.from({ length: semaines }, (_, s) =>
        Array.from({ length: 7 }, (_, d) => {
            const t = debut + (s * 7 + d) * DAY_MS;
            return t > dernier ? -1 : (niveaux.get(iso(t)) ?? 0);
        })
    );
}
