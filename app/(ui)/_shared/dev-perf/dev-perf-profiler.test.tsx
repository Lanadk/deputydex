import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/*
 * Le <Profiler> de l'outil de perf n'enveloppe les blocs que si l'outil est
 * activé ; sinon le rendu est direct et aucune mesure n'est enregistrée.
 */
const mockRecord = jest.fn();
jest.mock("@/app/(ui)/_shared/dev-perf/dev-perf.client", () => ({ recordComponentRender: (...args: unknown[]) => mockRecord(...args) }));

function renderWith(enabled: boolean) {
    jest.resetModules();
    jest.doMock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: enabled, DEV_PERF_MAX_RECORDS: 2000 }));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DevPerfProfiler } = require("@/app/(ui)/_shared/dev-perf/dev-perf-profiler");
    render(<DevPerfProfiler type="chart:bar" id="chart-cohesion"><p>Graphique</p></DevPerfProfiler>);
}

describe("DevPerfProfiler", () => {
    beforeEach(() => mockRecord.mockClear());

    it("mesure le rendu sous « type|identifiant » quand l'outil est activé", () => {
        renderWith(true);

        expect(screen.getByText("Graphique")).toBeInTheDocument();
        expect(mockRecord).toHaveBeenCalledWith("chart:bar|chart-cohesion", "mount", expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number));
    });

    it("rend le contenu sans rien mesurer quand l'outil est désactivé", () => {
        renderWith(false);

        expect(screen.getByText("Graphique")).toBeInTheDocument();
        expect(mockRecord).not.toHaveBeenCalled();
    });
});
