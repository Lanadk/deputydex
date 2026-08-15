import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// RenderStatChart monte de vrais charts MUI x-charts (ResizeObserver etc.),
// non testés sous jsdom ailleurs dans le repo — on le remplace par un
// placeholder pour isoler l'orchestration propre à StatViewerLib (fetch,
// format-switcher, export, méthodologie) de la correction du rendu chart.
jest.mock("@/app/(ui)/(views)/(db)/statistics/_catalog/render-stat-chart", () => ({
    RenderStatChart: ({ data, displayType, loading }: { data: { shape: string } | null; displayType: string | null; loading: boolean }) => (
        <div data-testid="chart-placeholder">
            {loading ? "loading" : JSON.stringify({ shape: data?.shape ?? null, displayType })}
        </div>
    ),
}));

jest.mock("@/app/(ui)/gateways/statistics/statistics.gateway", () => ({
    statisticsGateway: { fetchStat: jest.fn() },
}));

import { StatViewerLib } from "@/app/(ui)/components/statistics/stat-viewer-lib";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

const fetchStat = statisticsGateway.fetchStat as jest.Mock;

const AGE_DISTRIBUTION: StatDefinition = {
    id: "acteurs.age-distribution",
    slug: "age-distribution",
    domain: "acteurs",
    scope: "aggregate",
    title: "Répartition par tranche d'âge",
    category: "Démographie",
    keywords: [],
    methodology: "Calculé à partir de la date de naissance.",
    dataShape: "distribution",
};

const SCALAR_STAT: StatDefinition = {
    ...AGE_DISTRIBUTION,
    id: "acteurs.count",
    slug: "count",
    title: "Nombre de députés",
    dataShape: "scalar",
};

describe("StatViewerLib", () => {
    afterEach(() => jest.resetAllMocks());

    it("renders the stat title", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [] });
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType={null} onDisplayTypeChange={jest.fn()} />);

        expect(screen.getByText("Répartition par tranche d'âge")).toBeInTheDocument();
        await waitFor(() => expect(fetchStat).toHaveBeenCalled());
    });

    it("fetches the stat for the given definition and context", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [{ label: "<30", value: 1 }] });
        render(
            <StatViewerLib
                definition={AGE_DISTRIBUTION}
                context={{ filters: { legislature: 17 } }}
                displayType={null}
                onDisplayTypeChange={jest.fn()}
            />
        );

        await waitFor(() =>
            expect(fetchStat).toHaveBeenCalledWith("acteurs", "age-distribution", { filters: { legislature: 17 } })
        );
    });

    it("resolves to the first compatible display type when none is chosen yet", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [] });
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType={null} onDisplayTypeChange={jest.fn()} />);

        await waitFor(() =>
            expect(screen.getByTestId("chart-placeholder")).toHaveTextContent('"displayType":"bar"')
        );
    });

    it("shows a format switcher with the compatible display types for the stat's shape", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [] });
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType="bar" onDisplayTypeChange={jest.fn()} />);

        expect(screen.getByText("Barres")).toBeInTheDocument();
        expect(screen.getByText("Camembert")).toBeInTheDocument();
        expect(screen.getByText("Donut")).toBeInTheDocument();
        await waitFor(() => expect(fetchStat).toHaveBeenCalled());
    });

    it("calls onDisplayTypeChange when the format is changed", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [] });
        const onDisplayTypeChange = jest.fn();
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType="bar" onDisplayTypeChange={onDisplayTypeChange} />);

        fireEvent.change(screen.getByDisplayValue("Barres"), { target: { value: "donut" } });

        expect(onDisplayTypeChange).toHaveBeenCalledWith("donut");
        await waitFor(() => expect(fetchStat).toHaveBeenCalled());
    });

    it("does not show a format switcher for a scalar stat (no compatible chart formats)", async () => {
        fetchStat.mockResolvedValue({ shape: "scalar", value: 577, label: "députés" });
        render(<StatViewerLib definition={SCALAR_STAT} context={{}} displayType={null} onDisplayTypeChange={jest.fn()} />);

        expect(screen.queryByText("Barres")).not.toBeInTheDocument();
        await waitFor(() => expect(fetchStat).toHaveBeenCalled());
    });

    it("shows the methodology text behind a disclosure", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [] });
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType={null} onDisplayTypeChange={jest.fn()} />);

        expect(screen.getByText("Calculé à partir de la date de naissance.")).toBeInTheDocument();
        await waitFor(() => expect(fetchStat).toHaveBeenCalled());
    });

    it("only enables export once the data has loaded", async () => {
        fetchStat.mockResolvedValue({ shape: "distribution", items: [{ label: "<30", value: 1 }] });
        render(<StatViewerLib definition={AGE_DISTRIBUTION} context={{}} displayType={null} onDisplayTypeChange={jest.fn()} />);

        expect(screen.queryByText("Exporter CSV")).not.toBeInTheDocument();

        await waitFor(() => expect(screen.getByText("Exporter CSV")).toBeInTheDocument());
    });
});
