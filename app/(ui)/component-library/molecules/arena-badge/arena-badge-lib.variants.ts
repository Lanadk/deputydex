// Variants du badge d'arène : une forme, son relief (facettes) et ses couleurs.
// Géométrie dans une viewBox 0 0 100 100 ; les formes tiennent dans 8..92 pour
// laisser la place au cerclage (tracé épais autour de la forme).
// Les couleurs viennent de la palette (`--p1-*`, `--p2-*`), définie pour les
// trois thèmes dans `globals.css`.

export type ArenaBadgeVariant =
    | 'hemicycle'
    | 'eclair'
    | 'bouclier'
    | 'etoile'
    | 'feuille'
    | 'octogone'
    | 'engrenage'
    | 'lune'
    | 'cristal';

export type ArenaBadgeStyle = {
    /** Nom affiché par défaut sous le badge */
    name: string;
    /** Contour de la forme (path d) */
    shape: string;
    /** Lignes de relief tracées sur la face (path d) */
    facets: string;
    /** Dégradé de la face : clair → base → foncé */
    face: [string, string, string];
    /** Cerclage et couleur des facettes */
    rim: string;
    /** Sens du dégradé (diagonal par défaut) */
    gradient?: 'diagonal' | 'horizontal';
};

const round = (n: number) => Math.round(n * 100) / 100;

const pointAt = (cx: number, cy: number, r: number, deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
};

/** `count` sommets répartis sur un cercle, les rayons alternant selon `radii`. */
const radialPoints = (radii: number[], count: number, cx: number, cy: number, startDeg: number) =>
    Array.from({ length: count }, (_, i) =>
        pointAt(cx, cy, radii[i % radii.length], startDeg + (360 / count) * i),
    );

const polygon = (points: [number, number][]) =>
    `M${points.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;

const circle = (cx: number, cy: number, r: number) =>
    `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

const spokes = (center: [number, number], points: [number, number][]) =>
    points.map(([x, y]) => `M${center[0]} ${center[1]} L${x} ${y}`).join(' ');

const STAR_OUTER = radialPoints([40], 5, 50, 52, -90);
const STAR = radialPoints([40, 18], 10, 50, 52, -90);

const OCTAGON = radialPoints([42], 8, 50, 50, -67.5);
const OCTAGON_INNER = radialPoints([24], 8, 50, 50, -67.5);

const GEAR = radialPoints([42, 42, 33, 33], 32, 50, 50, -95.6);

export const ARENA_BADGE_STYLES: Record<ArenaBadgeVariant, ArenaBadgeStyle> = {
    hemicycle: {
        name: 'Badge Hémicycle',
        shape: 'M8 72 A42 42 0 0 1 92 72 Z',
        facets: 'M22 72 A28 28 0 0 1 78 72 M36 72 A14 14 0 0 1 64 72 M50 30 L50 44 M20 42 L30 52 M80 42 L70 52',
        face: ['var(--p2-3)', 'var(--p1-white-1)', 'var(--p2-1)'],
        rim: 'var(--p1-steel-3)',
        gradient: 'horizontal',
    },
    eclair: {
        name: 'Badge Éclair',
        shape: 'M60 6 L18 56 L46 56 L38 94 L82 40 L54 40 Z',
        facets: 'M54 40 L46 56 M60 6 L50 40',
        face: ['var(--p1-red-2)', 'var(--p1-red-3)', 'var(--p1-red-4)'],
        rim: 'var(--p1-red-4)',
    },
    bouclier: {
        name: 'Badge Bouclier',
        shape: 'M50 8 L86 20 L82 56 Q76 80 50 92 Q24 80 18 56 L14 20 Z',
        facets: 'M50 16 L50 84 M22 44 L78 44 M26 24 L50 16 L74 24',
        face: ['var(--p1-blue-3)', 'var(--p2-3)', 'var(--p1-blue-4)'],
        rim: 'var(--p1-blue-4)',
    },
    etoile: {
        name: 'Badge Étoile',
        shape: polygon(STAR),
        facets: spokes([50, 52], STAR_OUTER),
        face: ['var(--p2-4)', 'var(--p2-4)', 'var(--p2-5)'],
        rim: 'var(--p1-orange-4)',
    },
    feuille: {
        name: 'Badge Feuille',
        shape: 'M50 6 Q86 30 78 66 Q70 90 50 94 Q30 90 22 66 Q14 30 50 6 Z',
        facets: 'M50 18 L50 88 M50 40 L64 30 M50 40 L36 30 M50 58 L68 46 M50 58 L32 46 M50 74 L64 64 M50 74 L36 64',
        face: ['var(--p1-green-2)', 'var(--p1-green-3)', 'var(--p1-green-4)'],
        rim: 'var(--p1-green-4)',
    },
    octogone: {
        name: 'Badge Octogone',
        shape: polygon(OCTAGON),
        facets: `${polygon(OCTAGON_INNER)} ${OCTAGON.map(([x, y], i) => `M${x} ${y} L${OCTAGON_INNER[i][0]} ${OCTAGON_INNER[i][1]}`).join(' ')}`,
        face: ['var(--p1-white-1)', 'var(--p1-steel-1)', 'var(--p1-steel-2)'],
        rim: 'var(--p1-steel-3)',
    },
    engrenage: {
        name: 'Badge Engrenage',
        shape: polygon(GEAR),
        facets: `${circle(50, 50, 22)} ${circle(50, 50, 8)}`,
        face: ['var(--p2-4)', 'var(--p1-orange-3)', 'var(--p1-orange-4)'],
        rim: 'var(--p1-orange-4)',
    },
    lune: {
        name: 'Badge Lune',
        shape: 'M62 8 A42 42 0 1 0 92 62 A34 34 0 0 1 62 8 Z',
        facets: `${circle(32, 60, 5)} ${circle(46, 78, 4)} ${circle(26, 40, 3)}`,
        face: ['var(--p1-blue-3)', 'var(--p2-3)', 'var(--p1-steel-4)'],
        rim: 'var(--p1-blue-4)',
    },
    cristal: {
        name: 'Badge Cristal',
        shape: 'M30 14 L70 14 L92 38 L50 92 L8 38 Z',
        facets: 'M8 38 L92 38 M30 14 L40 38 L50 14 L60 38 L70 14 M40 38 L50 92 L60 38',
        face: ['var(--p1-blue-1)', 'var(--p1-blue-2)', 'var(--p1-blue-3)'],
        rim: 'var(--p1-blue-4)',
    },
};

export const ARENA_BADGE_VARIANTS = Object.keys(ARENA_BADGE_STYLES) as ArenaBadgeVariant[];
