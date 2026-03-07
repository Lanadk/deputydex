import {
    DEFAULT_GROUP_THEME_KEY,
    PARLIAMENTARY_GROUP_THEME_REGISTRY,
} from "./group-theme.registry";
import type { GroupTheme } from "./group-theme.types";

export type ChartColorVariant = "default" | "parliament-group";

const GROUP_ALIASES: Record<string, string> = {
    // actuels
    RASSEMBLEMENT_NATIONAL: "RN",
    ENSEMBLE_POUR_LA_REPUBLIQUE: "EPR",
    LA_FRANCE_INSOUMISE_NFP: "LFI_NFP",
    SOCIALISTES_ET_APPARENTES: "SOC",
    DROITE_REPUBLICAINE: "DR",
    ECOLOGISTE_ET_SOCIAL: "ECOS",
    LES_DEMOCRATES: "DEM",
    HORIZONS_INDEPENDANTS: "HOR",
    LIBERTES_INDEPENDANTS_OUTRE_MER_ET_TERRITOIRES: "LIOT",
    GAUCHE_DEMOCRATE_ET_REPUBLICAINE: "GDR",
    UNION_DES_DROITES_POUR_LA_REPUBLIQUE: "UDDPLR",

    // 16e législature
    DEMOCRATE_MODEM_ET_INDEPENDANTS: "DEM",
    ECOLOGISTE_NUPES: "ECOS",
    GAUCHE_DEMOCRATE_ET_REPUBLICAINE_NUPES: "GDR",
    HORIZONS_ET_APPARENTES: "HOR",
    LA_FRANCE_INSOUMISE_NUPES: "LFI_NFP",
    LES_REPUBLICAINS: "DR",
    RENAISSANCE: "EPR",
    SOCIALISTES_ET_APPARENTES_NUPES: "SOC",
    SOCIALISTES_ET_APPARENTES_A: "SOC",

    // sigles historiques / variantes
    RE: "EPR",
    LFI: "LFI_NFP",
    LFI_NUPES: "LFI_NFP",
    LFI_NFP: "LFI_NFP",
    SOC_A: "SOC",
    ECOLO: "ECOS",
    GDR_NUPES: "GDR",
    LR: "DR",
    MODEM: "DEM",
};

function normalizeGroupKey(value: string | null | undefined): string {
    return (value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase()
        .replace(/&/g, " ET ")
        .replace(/['’]/g, "")
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function getGroupTheme(group: string | null | undefined): GroupTheme {
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

export function isParliamentGroupVariant(
    variant: ChartColorVariant | null | undefined,
): boolean {
    return variant === "parliament-group";
}

export function getGroupChartColor(group: string | null | undefined): string {
    return getGroupTheme(group).chart;
}

export function getGroupBadgeStyles(group: string | null | undefined) {
    const theme = getGroupTheme(group);

    return {
        backgroundColor: theme.badgeBg,
        color: theme.badgeText,
        borderColor: theme.border,
    };
}

export function getGroupCardTheme(group: string | null | undefined): GroupTheme {
    return getGroupTheme(group);
}

export function mapGroupsToChartData<T extends { label: string; value: number }>(
    items: T[],
) {
    return items.map((item) => ({
        ...item,
        id: item.label,
        color: getGroupChartColor(item.label),
    }));
}

export function mapSeriesToGroupColors<T extends { label: string }>(
    series: T[],
): Array<T & { color: string }> {
    return series.map((item) => ({
        ...item,
        color: getGroupChartColor(item.label),
    }));
}

export function getSingleSeriesGroupColor(
    variant: ChartColorVariant | null | undefined,
    groupLabel: string | null | undefined,
): string | undefined {
    if (!isParliamentGroupVariant(variant) || !groupLabel) {
        return undefined;
    }

    return getGroupChartColor(groupLabel);
}