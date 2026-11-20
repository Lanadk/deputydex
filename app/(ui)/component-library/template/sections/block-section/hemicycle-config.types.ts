import { HemicycleLibLegendItem, HemicycleLibSeat } from "@/app/(ui)/component-library/molecules/hemicycle/hemicycle-lib";

/** Bloc "hemicycle" : plan de la salle, un point coloré par siège (voir `HemicycleLib`). */
export type HemicycleConfig = {
    id: string;
    title?: string;
    subtitle?: string;
};

/** Donnée posée sous `dataMap[config.id]` par le `gatewayFn` de la section. */
export type HemicycleDataWrapper = {
    /** Sièges dans l'ordre de la salle, de la gauche vers la droite */
    seats: HemicycleLibSeat[];
    legend?: HemicycleLibLegendItem[];
    ariaLabel: string;
};
