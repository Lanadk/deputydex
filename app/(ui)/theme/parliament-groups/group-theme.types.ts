export type GroupTheme = {
    key: string;
    label: string;

    bg: [string, string, string];
    text: string;
    border: string;
    holo: [string, string, string];

    chart: string;
    badgeBg: string;
    badgeText: string;
};

export type GroupThemeRegistry = Record<string, GroupTheme>;