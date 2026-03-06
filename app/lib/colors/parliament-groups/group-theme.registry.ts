import type { GroupThemeRegistry } from "./group-theme.types";

export const DEFAULT_GROUP_THEME_KEY = "DEFAULT";

export const PARLIAMENTARY_GROUP_THEME_REGISTRY: GroupThemeRegistry = {
    RN: {
        key: "RN",
        label: "Rassemblement National",
        bg: ["#003189", "#003189", "#003189"],
        text: "#ffffff",
        border: "#003189",
        holo: ["#001a4d", "#003189", "#001a4d"],
        chart: "#003189",
        badgeBg: "#003189",
        badgeText: "#ffffff",
    },

    EPR: {
        key: "EPR",
        label: "Ensemble pour la République",
        bg: ["#ffbe00", "#ff9400", "#ffbe00"],
        text: "#1a1a1a",
        border: "#ff9400",
        holo: ["#1a0e00", "#3d2200", "#1a0e00"],
        chart: "#ff9400",
        badgeBg: "#ff9400",
        badgeText: "#1a1a1a",
    },

    LFI_NFP: {
        key: "LFI_NFP",
        label: "La France insoumise - NFP",
        bg: ["#cc0000", "#ff0000", "#cc0000"],
        text: "#ffffff",
        border: "#ff0000",
        holo: ["#1a0000", "#3d0000", "#1a0000"],
        chart: "#ff0000",
        badgeBg: "#ff0000",
        badgeText: "#ffffff",
    },

    SOC: {
        key: "SOC",
        label: "Socialistes et apparentés",
        bg: ["#ff69b4", "#e91e8c", "#ff69b4"],
        text: "#ffffff",
        border: "#e91e8c",
        holo: ["#1a0011", "#3d0029", "#1a0011"],
        chart: "#e91e8c",
        badgeBg: "#e91e8c",
        badgeText: "#ffffff",
    },

    DR: {
        key: "DR",
        label: "Droite Républicaine",
        bg: ["#0066cc", "#003f8a", "#0066cc"],
        text: "#ffffff",
        border: "#0066cc",
        holo: ["#001433", "#003f8a", "#001433"],
        chart: "#0066cc",
        badgeBg: "#0066cc",
        badgeText: "#ffffff",
    },

    ECOS: {
        key: "ECOS",
        label: "Écologiste et Social",
        bg: ["#2d9b2d", "#1a7a1a", "#2d9b2d"],
        text: "#ffffff",
        border: "#2d9b2d",
        holo: ["#001a00", "#0d330d", "#001a00"],
        chart: "#2d9b2d",
        badgeBg: "#2d9b2d",
        badgeText: "#ffffff",
    },

    DEM: {
        key: "DEM",
        label: "Les Démocrates",
        bg: ["#ff8c00", "#cc6600", "#ff8c00"],
        text: "#ffffff",
        border: "#ff8c00",
        holo: ["#1a0900", "#331200", "#1a0900"],
        chart: "#ff8c00",
        badgeBg: "#ff8c00",
        badgeText: "#ffffff",
    },

    HOR: {
        key: "HOR",
        label: "Horizons & Indépendants",
        bg: ["#00b4d8", "#0077b6", "#00b4d8"],
        text: "#ffffff",
        border: "#00b4d8",
        holo: ["#001a26", "#003347", "#001a26"],
        chart: "#00b4d8",
        badgeBg: "#00b4d8",
        badgeText: "#ffffff",
    },

    LIOT: {
        key: "LIOT",
        label: "Libertés, Indépendants, Outre-mer et Territoires",
        bg: ["#00a0e3", "#0077b6", "#00a0e3"],
        text: "#ffffff",
        border: "#00a0e3",
        holo: ["#001a26", "#003347", "#001a26"],
        chart: "#00a0e3",
        badgeBg: "#00a0e3",
        badgeText: "#ffffff",
    },

    GDR: {
        key: "GDR",
        label: "Gauche Démocrate et Républicaine",
        bg: ["#b71c1c", "#8b0000", "#b71c1c"],
        text: "#ffffff",
        border: "#b71c1c",
        holo: ["#1a0000", "#2d0000", "#1a0000"],
        chart: "#b71c1c",
        badgeBg: "#b71c1c",
        badgeText: "#ffffff",
    },

    UDDPLR: {
        key: "UDDPLR",
        label: "Union des droites pour la République",
        bg: ["#1f4b99", "#173b7a", "#1f4b99"],
        text: "#ffffff",
        border: "#1f4b99",
        holo: ["#0b1733", "#13264d", "#0b1733"],
        chart: "#1f4b99",
        badgeBg: "#1f4b99",
        badgeText: "#ffffff",
    },

    DEFAULT: {
        key: "DEFAULT",
        label: "Autre groupe",
        bg: ["#a82028", "#ffde00", "#2b5aa6"],
        text: "#ffffff",
        border: "#ffde00",
        holo: ["#0d1a2e", "#152238", "#0d1a2e"],
        chart: "#2b5aa6",
        badgeBg: "#223244",
        badgeText: "#ffffff",
    },
};