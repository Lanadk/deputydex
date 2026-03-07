export const axisTextColor = "var(--foreground)";
export const axisLineColor = "var(--border-main)";
export const gridColor = "var(--border-main)";

export const cartesianChartSx = {
    "& .MuiChartsAxis-root .MuiChartsAxis-line": {
        stroke: axisLineColor,
    },

    "& .MuiChartsAxis-root .MuiChartsAxis-tick": {
        stroke: axisLineColor,
    },

    "& .MuiChartsGrid-root .MuiChartsGrid-line": {
        stroke: gridColor,
    },

    "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
        fill: axisTextColor,
    },

    "& .MuiChartsAxis-root .MuiChartsAxis-label": {
        fill: axisTextColor,
    },

    "& .MuiChartsLegend-root": {
        color: axisTextColor,
    },

    "& .MuiChartsLegend-root text": {
        fill: axisTextColor,
    },

    "& .MuiChartsAxisHighlight-root": {
        stroke: axisTextColor,
    },
} as const;

export const polarChartSx = {
    "& .MuiChartsLegend-root": {
        color: axisTextColor,
    },
    "& .MuiChartsLegend-label": {
        fill: axisTextColor,
        color: axisTextColor,
    },
    "& .MuiChartsLegend-root text": {
        fill: axisTextColor,
    },
    "& .MuiChartsLegend-root .MuiTypography-root": {
        color: axisTextColor,
    },
} as const;