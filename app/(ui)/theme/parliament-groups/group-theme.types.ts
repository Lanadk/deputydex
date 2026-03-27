export type GroupTheme = {
    bg: [string, string, string];
    text: string;
    border: string;
    holo: [string, string, string];

    chart: string;
    badgeBg: string;
    badgeBgDeep?: string;
    badgeText: string;
};

export type GroupThemeRegistry = Record<string, GroupTheme>;