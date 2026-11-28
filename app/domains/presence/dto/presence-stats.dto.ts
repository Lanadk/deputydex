/** Item libellé / valeur (shape `distribution` / `timeseries` du catalogue Statistiques). */
export interface PresenceStatItemDTO {
    label: string;
    value: number;
}

export interface PresenceStatItemsDTO {
    items: PresenceStatItemDTO[];
}

export interface PresenceStatPointsDTO {
    points: PresenceStatItemDTO[];
}

export interface PresenceStatSeriesDTO {
    series: { name: string; items: PresenceStatItemDTO[] }[];
}
