import {
    DEFAULT_GROUP_THEME_KEY,
    PARLIAMENTARY_GROUP_THEME_REGISTRY,
} from "./group-theme.registry";
import type { GroupTheme } from "./group-theme.types";

export type ChartColorVariant = "default" | "parliament-group";

const GROUP_ALIASES: Record<string, string> = {
    // codes SQL directs
    RN: "RN",
    EPR: "EPR",
    RE: "EPR",
    LFI_NFP: "LFI_NFP",
    LFI_NUPES: "LFI_NFP",
    SOC: "SOC",
    SOC_NUPES: "SOC",
    DR: "DR",
    LR: "DR",
    ECOS: "ECOS",
    ECOLO: "ECOS",
    DEM: "DEM",
    HOR: "HOR",
    LIOT: "LIOT",
    GDR: "GDR",
    GDR_NUPES: "GDR",
    UDDPLR: "UDDPLR",
    UDR: "UDDPLR",
    NI: "DEFAULT",
    NI_16: "DEFAULT",
    NI_17: "DEFAULT",

    //17e législature
    RASSEMBLEMENT_NATIONAL: "RN",
    ENSEMBLE_POUR_LA_REPUBLIQUE: "EPR",
    LA_FRANCE_INSOUMISE_NFP: "LFI_NFP",
    SOCIALISTES_ET_APPARENTES: "SOC",
    DROITE_REPUBLICAINE: "DR",
    ECOLOGISTE_ET_SOCIAL: "ECOS",
    LES_DEMOCRATES: "DEM",
    HORIZONS_ET_INDEPENDANTS: "HOR",
    LIBERTES_INDEPENDANTS_OUTRE_MER_ET_TERRITOIRES: "LIOT",
    GAUCHE_DEMOCRATE_ET_REPUBLICAINE: "GDR",
    UNION_DES_DROITES_POUR_LA_REPUBLIQUE_BIS: "UDDPLR",
    UNION_DES_DROITES_POUR_LA_REPUBLIQUE: "UDDPLR",
    NON_INSCRITS: "DEFAULT",
    NON_INSCRITS_GROUPE_TECHNIQUE: "DEFAULT",

    // 16e législature
    DEMOCRATE_MODEM_ET_INDEPENDANTS: "DEM",
    ECOLOGISTE_NUPES: "ECOS",
    GAUCHE_DEMOCRATE_ET_REPUBLICAINE_NUPES: "GDR",
    HORIZONS_ET_APPARENTES: "HOR",
    LA_FRANCE_INSOUMISE_NUPES: "LFI_NFP",
    LES_REPUBLICAINS: "DR",
    RENAISSANCE: "EPR",
    SOCIALISTES_ET_APPARENTES_NUPES: "SOC",
};

export const GROUP_COMPOSITION_MAP: Record<string, string> = {
    "LFI-NFP":    "LFI-NFP",
    "LFI-NUPES":  "LFI-NFP",

    "SOC":        "SOC",
    "SOC-NUPES":  "SOC",

    "UDR":        "UDDPLR",
    "UDDPLR":     "UDDPLR",

    "ECOS":       "ECOS",
    "ECOLO-NUPES":"ECOS",

    "EPR":        "EPR",
    "RE":         "EPR",

    "NI":         "DEFAULT",
    "NI-16":      "DEFAULT",
    "NI-17":      "DEFAULT",
};

export function getCanonicalGroupCode(code: string | null | undefined): string {
    return GROUP_COMPOSITION_MAP[code ?? ""] ?? (code ?? "DEFAULT");
}

function normalizeGroupKey(value: string | null | undefined): string {
    return (value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase()
        .replace(/&/g, " ET ")
        .replace(/['']/g, "")
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function getGroupTheme(group: string | null | undefined): GroupTheme {
    const normalized = normalizeGroupKey(group);

    if (PARLIAMENTARY_GROUP_THEME_REGISTRY[normalized]) {
        return PARLIAMENTARY_GROUP_THEME_REGISTRY[normalized];
    }

    const aliasKey = GROUP_ALIASES[normalized] ?? DEFAULT_GROUP_THEME_KEY;

    return (
        PARLIAMENTARY_GROUP_THEME_REGISTRY[aliasKey] ??
        PARLIAMENTARY_GROUP_THEME_REGISTRY[DEFAULT_GROUP_THEME_KEY]
    );
}

export function getCanonicalGroupTheme(group: string | null | undefined): GroupTheme {
    const canonical = getCanonicalGroupCode(group);
    return getGroupTheme(canonical);
}

export function isParliamentGroupVariant(
    variant: ChartColorVariant | null | undefined,
): boolean {
    return variant === "parliament-group";
}

export function getCanonicalGroupChartColor(group: string | null | undefined): string {
    return getCanonicalGroupTheme(group).chart;
}


export function getGroupCardTheme(group: string | null | undefined): GroupTheme {
    return getGroupTheme(group);
}


export function mapSeriesToGroupColors<T extends { label: string }>(
    series: T[],
): Array<T & { color: string }> {
    return series.map((item) => ({
        ...item,
        color: getCanonicalGroupChartColor(item.label),
    }));
}

export function getSingleSeriesGroupColor(
    variant: ChartColorVariant | null | undefined,
    groupLabel: string | null | undefined,
): string | undefined {
    if (!isParliamentGroupVariant(variant) || !groupLabel) {
        return undefined;
    }

    return getCanonicalGroupChartColor(groupLabel);
}