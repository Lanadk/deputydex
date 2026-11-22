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

/** Une législature couverte par Députédex (dates AAAA-MM-JJ ; fin null = en cours). */
export type FriseLegislatureDTO = {
    numero: number;
    debut: string;
    fin: string | null;
    /** Close par une dissolution (référentiel des événements institutionnels). */
    finParDissolution: boolean;
};

/** Frise chronologique des législatures couvertes et des institutions en place. */
export type LegislaturesFriseDTO = {
    debut: string;
    /** Fin de l'axe : aujourd'hui. */
    fin: string;
    /** Législatures couvertes, de la plus récente à la plus ancienne. */
    legislatures: FriseLegislatureDTO[];
    couloirs: FriseCouloirDTO[];
    evenements: FriseEvenementDTO[];
};
