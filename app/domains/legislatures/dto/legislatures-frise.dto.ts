/** Une période sur la frise (dates AAAA-MM-JJ ; fin null = en cours). */
export type FrisePeriodeDTO = {
    id: string;
    libelle: string;
    detail: string | null;
    debut: string;
    fin: string | null;
    href: string | null;
};

export type FriseCouloirId = "presidence" | "legislatures" | "gouvernements" | "assemblee";

export type FriseCouloirDTO = {
    id: FriseCouloirId;
    libelle: string;
    periodes: FrisePeriodeDTO[];
};

export type FriseEvenementDTO = {
    date: string;
    libelle: string;
};

/** Frise chronologique des législatures couvertes et des institutions en place. */
export type LegislaturesFriseDTO = {
    debut: string;
    fin: string;
    couloirs: FriseCouloirDTO[];
    evenements: FriseEvenementDTO[];
};
