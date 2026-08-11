/**
 * Agrège coverage/coverage-summary.json (généré par `jest --coverage`, voir
 * coverageReporters dans jest.config.ts) par couche architecturale
 * (app/api, app/domains/use-cases, app/domains/mappers, app/infrastructure
 * repositories, app/(ui)/gateways, ...) plutôt qu'un seul pourcentage global
 * qui noie les couches bien testées dans celles qui ne le sont pas encore.
 *
 * Usage: npm run coverage:by-layer   (lance jest --coverage puis ce script)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Metric = { total: number; covered: number };
type FileSummary = { statements: Metric; branches: Metric; functions: Metric; lines: Metric };

const summaryPath = join(process.cwd(), "coverage", "coverage-summary.json");
const data: Record<string, FileSummary> = JSON.parse(readFileSync(summaryPath, "utf8"));

const buckets: Record<string, (p: string) => boolean> = {
    "API routes (app/api)": (p) => p.includes("/app/api/"),
    "Domain - use-cases": (p) => p.includes("/app/domains/") && p.includes("/use-cases/"),
    "Domain - mappers": (p) => p.includes("/app/domains/") && p.includes("/mappers/"),
    "Domain - autre (entities/dto/filters/gateways interfaces)": (p) =>
        p.includes("/app/domains/") && !p.includes("/use-cases/") && !p.includes("/mappers/"),
    "Repositories Prisma (app/infrastructure)": (p) => p.includes("/app/infrastructure/"),
    "Gateways client (app/(ui)/gateways)": (p) => p.includes("/app/(ui)/gateways/"),
    "Shared (app/_shared)": (p) => p.includes("/app/_shared/"),
    "UI - _shared adapter/registry/hook": (p) => p.includes("/app/(ui)/_shared/"),
    "UI - component-library": (p) => p.includes("/app/(ui)/component-library/"),
    "UI - autre (pages, layout, views)": (p) =>
        p.includes("/app/(ui)/") &&
        !p.includes("/app/(ui)/gateways/") &&
        !p.includes("/app/(ui)/_shared/") &&
        !p.includes("/app/(ui)/component-library/"),
    "App root (layout/page)": (p) => !p.includes("/app/(ui)/") && !p.includes("/app/api/") && !p.includes("/app/domains/") && !p.includes("/app/infrastructure/") && !p.includes("/app/_shared/"),
};

type Totals = Record<"statements" | "branches" | "functions" | "lines", [number, number]> & { files: number };

const totals: Record<string, Totals> = {};
for (const name of Object.keys(buckets)) {
    totals[name] = { statements: [0, 0], branches: [0, 0], functions: [0, 0], lines: [0, 0], files: 0 };
}

for (const [file, metrics] of Object.entries(data)) {
    if (file === "total") continue;
    const norm = file.replace(/\\/g, "/");
    for (const [name, test] of Object.entries(buckets)) {
        if (test(norm)) {
            totals[name].files++;
            for (const k of ["statements", "branches", "functions", "lines"] as const) {
                totals[name][k][0] += metrics[k].covered;
                totals[name][k][1] += metrics[k].total;
            }
            break;
        }
    }
}

function pct([covered, total]: [number, number]): string {
    return total === 0 ? "n/a" : `${((covered / total) * 100).toFixed(1)}%`;
}

// Table ASCII à largeur de colonne fixe (pas du markdown) : ce script tourne
// dans un terminal brut, pas dans un rendu markdown, donc les `|` doivent
// s'aligner tout seuls plutôt que de compter sur un renderer pour le faire.
const headers = ["Couche", "Fichiers", "Statements", "Branches", "Functions", "Lines"];
const rows: string[][] = [headers];
for (const [name, t] of Object.entries(totals)) {
    if (t.files === 0) continue;
    rows.push([name, String(t.files), pct(t.statements), pct(t.branches), pct(t.functions), pct(t.lines)]);
}

const widths = headers.map((_, col) => Math.max(...rows.map((row) => row[col].length)));

function printRow(row: string[]): void {
    const cells = row.map((cell, col) => cell.padEnd(widths[col]));
    console.log(`| ${cells.join(" | ")} |`);
}

function printSeparator(): void {
    const segments = widths.map((w) => "-".repeat(w + 2));
    console.log(`|${segments.join("|")}|`);
}

printRow(headers);
printSeparator();
for (const row of rows.slice(1)) printRow(row);
