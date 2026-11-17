/**
 * Plan de salle de l'hémicycle, dans un repère 1000×520 de centre (500, 505) :
 * 12 rangées concentriques de rayon 150 → 455, sièges par rangée
 * proportionnels au rayon (le reste va à la dernière rangée).
 *
 * Tous les sièges sont triés par angle décroissant (gauche → droite) puis par
 * rayon croissant, puis découpés en blocs consécutifs, un par groupe, dans
 * l'ordre reçu (déjà trié gauche → droite).
 *
 * Positions en % de la boîte pour rester fluide.
 */
export type HemicycleSeat = {
    groupeCode: string;
    /** Rang du siège dans son groupe — futur index du député (concordance siège ↔ député). */
    rank: number;
    /** Rang global du siège, sert au délai d'apparition. */
    index: number;
    left: number;
    top: number;
    /** Rotation en degrés pour orienter la mini-carte vers l'extérieur. */
    rotate: number;
};

const WIDTH = 1000;
const HEIGHT = 520;
const CENTER_X = 500;
const CENTER_Y = 505;
const ROWS = 12;
const R_MIN = 150;
const R_MAX = 455;

type Point = { theta: number; radius: number; x: number; y: number };

function computeSeatPoints(total: number): Point[] {
    const radii = Array.from({ length: ROWS }, (_, k) => R_MIN + (k * (R_MAX - R_MIN)) / (ROWS - 1));
    const sum = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map((r) => Math.round((total * r) / sum));
    counts[ROWS - 1] = Math.max(0, counts[ROWS - 1] + total - counts.reduce((a, b) => a + b, 0));

    const points: Point[] = [];
    radii.forEach((radius, k) => {
        for (let j = 0; j < counts[k]; j++) {
            const theta = Math.PI * (1 - (j + 0.5) / counts[k]);
            points.push({
                theta,
                radius,
                x: CENTER_X + radius * Math.cos(theta),
                y: CENTER_Y - radius * Math.sin(theta),
            });
        }
    });

    return points.sort((p, q) => q.theta - p.theta || p.radius - q.radius).slice(0, total);
}

export function computeHemicycleSeats(groupes: { code: string; count: number }[]): HemicycleSeat[] {
    const total = groupes.reduce((sum, g) => sum + g.count, 0);
    if (total <= 0) return [];

    const points = computeSeatPoints(total);
    const seats: HemicycleSeat[] = [];
    let index = 0;

    for (const groupe of groupes) {
        for (let rank = 0; rank < groupe.count; rank++) {
            const p = points[index];
            seats.push({
                groupeCode: groupe.code,
                rank,
                index,
                left: (p.x / WIDTH) * 100,
                top: (p.y / HEIGHT) * 100,
                rotate: 90 - (p.theta * 180) / Math.PI,
            });
            index++;
        }
    }

    return seats;
}
