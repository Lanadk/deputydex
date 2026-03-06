import { BarChartLib } from "@/app/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { PieChartLib } from "@/app/component-library/molecules/chart/pie-chart/pie-chart-lib";
import { LineChartLib } from "@/app/component-library/molecules/chart/line-chart/line-chart-lib";
import { StackedBarChartLib } from "@/app/component-library/molecules/chart/bar-chart/stacked-bar-chart-lib";
import { ScatterChartLib } from "@/app/component-library/molecules/chart/point-chart/scatter-chart-lib";
import { DashedLineChartLib } from "@/app/component-library/molecules/chart/line-chart/dashed-line-chart-lib";
import { DonutChartLib } from "@/app/component-library/molecules/chart/pie-chart/donut-chart-lib";

const CODE_BAR_CHART_DEFAULT = `const monthlyVotes = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mars", value: 21 },
  { label: "Avr", value: 17 },
];

<BarChartLib
  title="Votes mensuels"
  subtitle="Série simple générique"
  data={monthlyVotes}
/>`;

const CODE_BAR_CHART_PARLIAMENT = `const votesParGroupe = [
  { label: "LFI-NFP", value: 72 },
  { label: "RN", value: 88 },
  { label: "EPR", value: 96 },
  { label: "SOC", value: 41 },
];

<BarChartLib
  title="Votes par groupe"
  subtitle="Répartition des votes exprimés"
  variant="parliament-group"
  data={votesParGroupe}
/>`;

const CODE_BAR_CHART_MULTI_DEFAULT = `const monthlyComparison = [
  { label: "Jan", majorite: 12, opposition: 18 },
  { label: "Fév", majorite: 15, opposition: 16 },
  { label: "Mars", majorite: 19, opposition: 14 },
];

<BarChartLib
  title="Comparaison mensuelle"
  subtitle="Multi-séries générique"
  data={monthlyComparison}
  series={[
    { dataKey: "majorite", label: "Majorité" },
    { dataKey: "opposition", label: "Opposition" },
  ]}
/>`;

const CODE_BAR_CHART_MULTI_PARLIAMENT = `const activiteMensuelle = [
  { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
  { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
  { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
];

<BarChartLib
  title="Activité mensuelle"
  subtitle="Comparaison par groupe"
  variant="parliament-group"
  data={activiteMensuelle}
  series={[
    { dataKey: "RN", label: "RN" },
    { dataKey: "EPR", label: "EPR" },
    { dataKey: "SOC", label: "SOC" },
  ]}
/>`;

const CODE_PIE_CHART_DEFAULT = `const participationData = [
  { label: "Présents", value: 421 },
  { label: "Absents", value: 156 },
  { label: "Excusés", value: 23 },
];

<PieChartLib
  title="Participation"
  subtitle="Répartition générique"
  data={participationData}
/>`;

const CODE_PIE_CHART_PARLIAMENT = `const votesParGroupe = [
  { label: "LFI-NFP", value: 72 },
  { label: "RN", value: 88 },
  { label: "EPR", value: 96 },
  { label: "SOC", value: 41 },
];

<PieChartLib
  title="Répartition"
  subtitle="Votes exprimés par groupe"
  variant="parliament-group"
  data={votesParGroupe}
/>`;

const CODE_DONUT_CHART_DEFAULT = `const presenceData = [
  { id: "present", label: "Présents", value: 421 },
  { id: "absent", label: "Absents", value: 156 },
];

<DonutChartLib
  title="Présence"
  data={presenceData}
  height={280}
  innerRadius={70}
  outerRadius={110}
/>`;

const CODE_DONUT_CHART_PARLIAMENT = `const repartitionSieges = [
  { id: "rn", label: "RN", value: 122 },
  { id: "epr", label: "EPR", value: 91 },
  { id: "lfi", label: "LFI-NFP", value: 71 },
  { id: "soc", label: "SOC", value: 69 },
];

<DonutChartLib
  title="Répartition des sièges"
  subtitle="Assemblée nationale"
  variant="parliament-group"
  data={repartitionSieges}
/>`;

const CODE_LINE_CHART_DEFAULT = `const evolutionData = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mars", value: 21 },
  { label: "Avr", value: 17 },
];

<LineChartLib
  title="Évolution"
  subtitle="Série simple générique"
  data={evolutionData}
/>`;

const CODE_LINE_CHART_PARLIAMENT = `const evolutionSoc = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mars", value: 21 },
  { label: "Avr", value: 17 },
];

<LineChartLib
  title="Évolution du groupe SOC"
  subtitle="Série simple avec couleur métier"
  variant="parliament-group"
  groupLabel="SOC"
  data={evolutionSoc}
/>`;

const CODE_LINE_CHART_MULTI_DEFAULT = `const lineComparison = [
  { label: "Jan", majorite: 12, opposition: 18 },
  { label: "Fév", majorite: 15, opposition: 16 },
  { label: "Mars", majorite: 19, opposition: 14 },
  { label: "Avr", majorite: 17, opposition: 13 },
];

<LineChartLib
  title="Évolution comparée"
  subtitle="Multi-séries générique"
  data={lineComparison}
  series={[
    { dataKey: "majorite", label: "Majorité" },
    { dataKey: "opposition", label: "Opposition" },
  ]}
/>`;

const CODE_LINE_CHART_MULTI_PARLIAMENT = `const lineGroups = [
  { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
  { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
  { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
  { label: "Avr", RN: 17, EPR: 12, SOC: 15 },
];

<LineChartLib
  title="Évolution des groupes"
  subtitle="Multi-séries métier"
  variant="parliament-group"
  data={lineGroups}
  series={[
    { dataKey: "RN", label: "RN" },
    { dataKey: "EPR", label: "EPR" },
    { dataKey: "SOC", label: "SOC" },
  ]}
/>`;

const CODE_DASHED_LINE_CHART_DEFAULT = `const monthlyEstimate = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mars", value: 21 },
  { label: "Avr", value: 17 },
];

<DashedLineChartLib
  title="Activité mensuelle estimée"
  subtitle="Version générique"
  data={monthlyEstimate}
/>`;

const CODE_DASHED_LINE_CHART_PARLIAMENT = `const monthlyEstimateEpr = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mars", value: 21 },
  { label: "Avr", value: 17 },
];

<DashedLineChartLib
  title="Activité mensuelle estimée EPR"
  subtitle="Version métier"
  variant="parliament-group"
  groupLabel="EPR"
  data={monthlyEstimateEpr}
/>`;

const CODE_DASHED_LINE_CHART_MULTI_DEFAULT = `const dashedComparison = [
  { label: "Jan", projectionA: 12, projectionB: 18 },
  { label: "Fév", projectionA: 15, projectionB: 16 },
  { label: "Mars", projectionA: 19, projectionB: 14 },
  { label: "Avr", projectionA: 17, projectionB: 13 },
];

<DashedLineChartLib
  title="Projection comparée"
  subtitle="Multi-séries générique"
  data={dashedComparison}
  series={[
    { dataKey: "projectionA", label: "Projection A" },
    { dataKey: "projectionB", label: "Projection B" },
  ]}
/>`;

const CODE_DASHED_LINE_CHART_MULTI_PARLIAMENT = `const dashedGroups = [
  { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
  { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
  { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
  { label: "Avr", RN: 17, EPR: 12, SOC: 15 },
];

<DashedLineChartLib
  title="Projection des groupes"
  subtitle="Multi-séries métier"
  variant="parliament-group"
  data={dashedGroups}
  series={[
    { dataKey: "RN", label: "RN" },
    { dataKey: "EPR", label: "EPR" },
    { dataKey: "SOC", label: "SOC" },
  ]}
/>`;

const CODE_STACKED_CHART = `const votesStackedData = [
  { label: "LFI-NFP", pour: 12, contre: 30, abstention: 4 },
  { label: "EPR", pour: 40, contre: 8, abstention: 2 },
  { label: "RN", pour: 9, contre: 27, abstention: 6 },
];

<StackedBarChartLib
  title="Votes par groupe"
  subtitle="Pour / Contre / Abstention"
  data={votesStackedData}
/>`;

const CODE_SCATTER_CHART_DEFAULT = `const genericScatterSeries = [
  {
    id: "serie-a",
    label: "Série A",
    data: [
      { id: "a-1", x: 12, y: 45 },
      { id: "a-2", x: 18, y: 38 },
      { id: "a-3", x: 25, y: 61 },
    ],
  },
  {
    id: "serie-b",
    label: "Série B",
    data: [
      { id: "b-1", x: 10, y: 52 },
      { id: "b-2", x: 22, y: 48 },
      { id: "b-3", x: 29, y: 57 },
    ],
  },
];

<ScatterChartLib
  title="Nuage de points"
  subtitle="Version générique"
  xLabel="Axe X"
  yLabel="Axe Y"
  series={genericScatterSeries}
/>`;

const CODE_SCATTER_CHART_PARLIAMENT = `const activitySeries = [
  {
    id: "lfi",
    label: "LFI-NFP",
    data: [
      { id: "lfi-1", x: 128, y: 91 },
      { id: "lfi-2", x: 154, y: 83 },
      { id: "lfi-3", x: 98, y: 89 },
    ],
  },
  {
    id: "epr",
    label: "EPR",
    data: [
      { id: "epr-1", x: 77, y: 95 },
      { id: "epr-2", x: 66, y: 93 },
      { id: "epr-3", x: 12, y: 97 },
    ],
  },
  {
    id: "rn",
    label: "RN",
    data: [
      { id: "rn-1", x: 42, y: 88 },
      { id: "rn-2", x: 185, y: 64 },
      { id: "rn-3", x: 21, y: 72 },
    ],
  },
];

<ScatterChartLib
  title="Activité parlementaire"
  subtitle="Amendements déposés vs présence"
  variant="parliament-group"
  xLabel="Amendements déposés"
  yLabel="Présence (%)"
  series={activitySeries}
/>`;

const votesParGroupe = [
    { label: "LFI-NFP", value: 72 },
    { label: "RN", value: 88 },
    { label: "EPR", value: 96 },
    { label: "SOC", value: 41 },
];

const monthlyVotes = [
    { label: "Jan", value: 12 },
    { label: "Fév", value: 18 },
    { label: "Mars", value: 21 },
    { label: "Avr", value: 17 },
];

const monthlyComparison = [
    { label: "Jan", majorite: 12, opposition: 18 },
    { label: "Fév", majorite: 15, opposition: 16 },
    { label: "Mars", majorite: 19, opposition: 14 },
];

const activiteMensuelle = [
    { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
    { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
    { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
];

const participationData = [
    { label: "Présents", value: 421 },
    { label: "Absents", value: 156 },
    { label: "Excusés", value: 23 },
];

const presenceData = [
    { id: "present", label: "Présents", value: 421 },
    { id: "absent", label: "Absents", value: 156 },
];

const repartitionSieges = [
    { id: "rn", label: "RN", value: 122 },
    { id: "epr", label: "EPR", value: 91 },
    { id: "lfi", label: "LFI-NFP", value: 71 },
    { id: "soc", label: "SOC", value: 69 },
];

const evolutionData = [
    { label: "Jan", value: 12 },
    { label: "Fév", value: 18 },
    { label: "Mars", value: 21 },
    { label: "Avr", value: 17 },
];

const lineComparison = [
    { label: "Jan", majorite: 12, opposition: 18 },
    { label: "Fév", majorite: 15, opposition: 16 },
    { label: "Mars", majorite: 19, opposition: 14 },
    { label: "Avr", majorite: 17, opposition: 13 },
];

const lineGroups = [
    { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
    { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
    { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
    { label: "Avr", RN: 17, EPR: 12, SOC: 15 },
];

const dashedComparison = [
    { label: "Jan", projectionA: 12, projectionB: 18 },
    { label: "Fév", projectionA: 15, projectionB: 16 },
    { label: "Mars", projectionA: 19, projectionB: 14 },
    { label: "Avr", projectionA: 17, projectionB: 13 },
];

const dashedGroups = [
    { label: "Jan", RN: 12, EPR: 18, SOC: 9 },
    { label: "Fév", RN: 15, EPR: 16, SOC: 11 },
    { label: "Mars", RN: 19, EPR: 14, SOC: 13 },
    { label: "Avr", RN: 17, EPR: 12, SOC: 15 },
];

const votesStackedData = [
    { label: "LFI-NFP", pour: 12, contre: 30, abstention: 4 },
    { label: "EPR", pour: 40, contre: 8, abstention: 2 },
    { label: "RN", pour: 9, contre: 27, abstention: 6 },
];

const genericScatterSeries = [
    {
        id: "serie-a",
        label: "Série A",
        data: [
            { id: "a-1", x: 12, y: 45 },
            { id: "a-2", x: 18, y: 38 },
            { id: "a-3", x: 25, y: 61 },
        ],
    },
    {
        id: "serie-b",
        label: "Série B",
        data: [
            { id: "b-1", x: 10, y: 52 },
            { id: "b-2", x: 22, y: 48 },
            { id: "b-3", x: 29, y: 57 },
        ],
    },
];

const activitySeries = [
    {
        id: "lfi",
        label: "LFI-NFP",
        data: [
            { id: "lfi-1", x: 128, y: 91 },
            { id: "lfi-2", x: 154, y: 83 },
            { id: "lfi-3", x: 98, y: 89 },
        ],
    },
    {
        id: "epr",
        label: "EPR",
        data: [
            { id: "epr-1", x: 77, y: 95 },
            { id: "epr-2", x: 66, y: 93 },
            { id: "epr-3", x: 12, y: 97 },
            { id: "epr-4", x: 15, y: 100 },
            { id: "epr-5", x: 45, y: 29 },
        ],
    },
    {
        id: "rn",
        label: "RN",
        data: [
            { id: "rn-1", x: 42, y: 88 },
            { id: "rn-2", x: 185, y: 64 },
            { id: "rn-3", x: 21, y: 72 },
        ],
    },
];

export const getChartSection = () => [
    {
        title: "Bar chart · simple · default",
        code: CODE_BAR_CHART_DEFAULT,
        component: (
            <BarChartLib
                title="Votes mensuels"
                subtitle="Série simple générique"
                data={monthlyVotes}
            />
        ),
    },
    {
        title: "Bar chart · simple · parliament-group",
        code: CODE_BAR_CHART_PARLIAMENT,
        component: (
            <BarChartLib
                title="Votes par groupe"
                subtitle="Répartition des votes exprimés"
                variant="parliament-group"
                data={votesParGroupe}
            />
        ),
    },
    {
        title: "Bar chart · multi-series · default",
        code: CODE_BAR_CHART_MULTI_DEFAULT,
        component: (
            <BarChartLib
                title="Comparaison mensuelle"
                subtitle="Multi-séries générique"
                data={monthlyComparison}
                series={[
                    { dataKey: "majorite", label: "Majorité" },
                    { dataKey: "opposition", label: "Opposition" },
                ]}
            />
        ),
    },
    {
        title: "Bar chart · multi-series · parliament-group",
        code: CODE_BAR_CHART_MULTI_PARLIAMENT,
        component: (
            <BarChartLib
                title="Activité mensuelle"
                subtitle="Comparaison par groupe"
                variant="parliament-group"
                data={activiteMensuelle}
                series={[
                    { dataKey: "RN", label: "RN" },
                    { dataKey: "EPR", label: "EPR" },
                    { dataKey: "SOC", label: "SOC" },
                ]}
            />
        ),
    },
    {
        title: "Pie chart · default",
        code: CODE_PIE_CHART_DEFAULT,
        component: (
            <PieChartLib
                title="Participation"
                subtitle="Répartition générique"
                data={participationData}
            />
        ),
    },
    {
        title: "Pie chart · parliament-group",
        code: CODE_PIE_CHART_PARLIAMENT,
        component: (
            <PieChartLib
                title="Répartition"
                subtitle="Votes exprimés par groupe"
                variant="parliament-group"
                data={votesParGroupe}
            />
        ),
    },
    {
        title: "Donut chart · default",
        code: CODE_DONUT_CHART_DEFAULT,
        component: (
            <DonutChartLib
                title="Présence"
                data={presenceData}
                height={280}
                innerRadius={70}
                outerRadius={110}
            />
        ),
    },
    {
        title: "Donut chart · parliament-group",
        code: CODE_DONUT_CHART_PARLIAMENT,
        component: (
            <DonutChartLib
                title="Répartition des sièges"
                subtitle="Assemblée nationale"
                variant="parliament-group"
                data={repartitionSieges}
            />
        ),
    },
    {
        title: "Line chart · simple · default",
        code: CODE_LINE_CHART_DEFAULT,
        component: (
            <LineChartLib
                title="Évolution"
                subtitle="Série simple générique"
                data={evolutionData}
            />
        ),
    },
    {
        title: "Line chart · simple · parliament-group",
        code: CODE_LINE_CHART_PARLIAMENT,
        component: (
            <LineChartLib
                title="Évolution du groupe SOC"
                subtitle="Série simple avec couleur métier"
                variant="parliament-group"
                groupLabel="SOC"
                data={evolutionData}
            />
        ),
    },
    {
        title: "Line chart · multi-series · default",
        code: CODE_LINE_CHART_MULTI_DEFAULT,
        component: (
            <LineChartLib
                title="Évolution comparée"
                subtitle="Multi-séries générique"
                data={lineComparison}
                series={[
                    { dataKey: "majorite", label: "Majorité" },
                    { dataKey: "opposition", label: "Opposition" },
                ]}
            />
        ),
    },
    {
        title: "Line chart · multi-series · parliament-group",
        code: CODE_LINE_CHART_MULTI_PARLIAMENT,
        component: (
            <LineChartLib
                title="Évolution des groupes"
                subtitle="Multi-séries métier"
                variant="parliament-group"
                data={lineGroups}
                series={[
                    { dataKey: "RN", label: "RN" },
                    { dataKey: "EPR", label: "EPR" },
                    { dataKey: "SOC", label: "SOC" },
                ]}
            />
        ),
    },
    {
        title: "Stacked bar chart",
        code: CODE_STACKED_CHART,
        component: (
            <StackedBarChartLib
                title="Votes par groupe"
                subtitle="Pour / Contre / Abstention"
                data={votesStackedData}
            />
        ),
    },
    {
        title: "Dashed line chart · default",
        code: CODE_DASHED_LINE_CHART_DEFAULT,
        component: (
            <DashedLineChartLib
                title="Activité mensuelle estimée"
                subtitle="Version générique"
                data={evolutionData}
            />
        ),
    },
    {
        title: "Dashed line chart · parliament-group",
        code: CODE_DASHED_LINE_CHART_PARLIAMENT,
        component: (
            <DashedLineChartLib
                title="Activité mensuelle estimée EPR"
                subtitle="Version métier"
                variant="parliament-group"
                groupLabel="EPR"
                data={evolutionData}
            />
        ),
    },
    {
        title: "Dashed line chart · multi-series · default",
        code: CODE_DASHED_LINE_CHART_MULTI_DEFAULT,
        component: (
            <DashedLineChartLib
                title="Projection comparée"
                subtitle="Multi-séries générique"
                data={dashedComparison}
                series={[
                    { dataKey: "projectionA", label: "Projection A" },
                    { dataKey: "projectionB", label: "Projection B" },
                ]}
            />
        ),
    },
    {
        title: "Dashed line chart · multi-series · parliament-group",
        code: CODE_DASHED_LINE_CHART_MULTI_PARLIAMENT,
        component: (
            <DashedLineChartLib
                title="Projection des groupes"
                subtitle="Multi-séries métier"
                variant="parliament-group"
                data={dashedGroups}
                series={[
                    { dataKey: "RN", label: "RN" },
                    { dataKey: "EPR", label: "EPR" },
                    { dataKey: "SOC", label: "SOC" },
                ]}
            />
        ),
    },
    {
        title: "Scatter chart · default",
        code: CODE_SCATTER_CHART_DEFAULT,
        component: (
            <ScatterChartLib
                title="Nuage de points"
                subtitle="Version générique"
                xLabel="Axe X"
                yLabel="Axe Y"
                series={genericScatterSeries}
            />
        ),
    },
    {
        title: "Scatter chart · parliament-group",
        code: CODE_SCATTER_CHART_PARLIAMENT,
        component: (
            <ScatterChartLib
                title="Activité parlementaire"
                subtitle="Amendements déposés vs présence"
                variant="parliament-group"
                xLabel="Amendements déposés"
                yLabel="Présence (%)"
                series={activitySeries}
            />
        ),
    },
];