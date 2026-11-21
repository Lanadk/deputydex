/** Siège à afficher, dans l'ordre de la salle (de la gauche vers la droite). */
export type HemicycleSeatData = {
    id: string;
    /** Catégorie du siège (ex. position de vote) : sert à la mise en avant depuis la légende */
    key: string;
    color: string;
    /** Première ligne de l'info-bulle (ex. nom du député) */
    label: string;
    /** Seconde ligne de l'info-bulle (ex. groupe · vote) */
    sublabel?: string;
    /** Page ouverte au clic sur le siège */
    href?: string;
    /** Photo affichée dans l'info-bulle (avatar) ; initiales du `label` à défaut */
    image?: string;
    /** Couleurs de l'info-bulle (ex. thème du groupe du député) ; couleurs du site à défaut */
    tooltipTheme?: HemicycleTooltipTheme;
};

export type HemicycleTooltipTheme = {
    /** Fond (couleur ou dégradé CSS) */
    background: string;
    /** Texte, lisible sur `background` */
    text: string;
    border: string;
};

export type HemicycleLegendItem = {
    key: string;
    label: string;
    color: string;
    count?: number;
};

/** Bloc "hemicycle" : plan 3D de la salle, un siège coloré par député (voir `ScrutinHemicyclePlan`). */
export type HemicycleConfig = {
    id: string;
    /** Titre optionnel, centré au-dessus du plan */
    title?: string;
    subtitle?: string;
};

/** Donnée posée sous `dataMap[config.id]` par le `gatewayFn` de la section. */
export type HemicycleDataWrapper = {
    /** Sièges dans l'ordre de la salle, de la gauche vers la droite */
    seats: HemicycleSeatData[];
    legend?: HemicycleLegendItem[];
    ariaLabel: string;
};
