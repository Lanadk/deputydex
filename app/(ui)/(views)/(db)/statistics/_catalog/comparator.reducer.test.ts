import { comparatorReducer } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.reducer";
import { ComparatorState, INITIAL_COMPARATOR_STATE } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.types";
import { StatDomainModule } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-domain.types";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { Users } from "lucide-react";

function makeStat(overrides: Partial<StatDefinition>): StatDefinition {
    return {
        id: "acteurs.dummy",
        slug: "dummy",
        domain: "acteurs",
        scope: "aggregate",
        title: "Dummy",
        category: "Test",
        keywords: [],
        methodology: "",
        dataShape: "distribution",
        ...overrides,
    };
}

const AGE_DISTRIBUTION = makeStat({ id: "acteurs.age-distribution", slug: "age-distribution" });
const PARITE = makeStat({ id: "acteurs.parite", slug: "parite" });
const GROUPE_ENTITY = makeStat({ id: "groupes.infos", slug: "infos", domain: "groupes", scope: "entity" });
const ACTEUR_ENTITY = makeStat({ id: "acteurs.profil", slug: "profil", scope: "entity" });

const CATALOG: StatDomainModule[] = [
    { id: "acteurs", label: "Députés", icon: Users, stats: [AGE_DISTRIBUTION, PARITE, ACTEUR_ENTITY] },
    { id: "groupes", label: "Groupes", icon: Users, stats: [GROUPE_ENTITY] },
    { id: "votes", label: "Votes", icon: Users, stats: [] },
    { id: "scrutins", label: "Scrutins", icon: Users, stats: [] },
    { id: "legislatures", label: "Législatures", icon: Users, stats: [] },
];

function reduce(state: ComparatorState, action: Parameters<typeof comparatorReducer>[1]) {
    return comparatorReducer(state, action, CATALOG);
}

describe("comparatorReducer", () => {
    it("starts empty, single context, no selection", () => {
        expect(INITIAL_COMPARATOR_STATE).toEqual({
            mode: "single",
            selectedStatIds: [],
            contexts: [{}],
            displayTypes: [{}],
        });
    });

    describe("TOGGLE_STAT", () => {
        it("adds a stat freely when nothing is selected yet", () => {
            const result = reduce(INITIAL_COMPARATOR_STATE, { type: "TOGGLE_STAT", definitionId: "acteurs.age-distribution" });
            expect(result.selectedStatIds).toEqual(["acteurs.age-distribution"]);
        });

        it("accumulates a compatible stat (same domain + scope) alongside an existing one", () => {
            const state: ComparatorState = { ...INITIAL_COMPARATOR_STATE, selectedStatIds: ["acteurs.age-distribution"] };
            const result = reduce(state, { type: "TOGGLE_STAT", definitionId: "acteurs.parite" });
            expect(result.selectedStatIds).toEqual(["acteurs.age-distribution", "acteurs.parite"]);
        });

        it("ignores a stat with a different scope than the current selection", () => {
            const state: ComparatorState = { ...INITIAL_COMPARATOR_STATE, selectedStatIds: ["acteurs.age-distribution"] };
            const result = reduce(state, { type: "TOGGLE_STAT", definitionId: "acteurs.profil" });
            expect(result).toBe(state);
        });

        it("ignores a stat with a different domain than the current selection", () => {
            const state: ComparatorState = { ...INITIAL_COMPARATOR_STATE, selectedStatIds: ["acteurs.age-distribution"] };
            const result = reduce(state, { type: "TOGGLE_STAT", definitionId: "groupes.infos" });
            expect(result).toBe(state);
        });

        it("ignores an unknown definitionId", () => {
            const result = reduce(INITIAL_COMPARATOR_STATE, { type: "TOGGLE_STAT", definitionId: "unknown.id" });
            expect(result).toBe(INITIAL_COMPARATOR_STATE);
        });

        it("removes an already-selected stat and its per-context display types", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution", "acteurs.parite"],
                contexts: [{}, { filters: { legislature: 16 } }],
                displayTypes: [
                    { "acteurs.age-distribution": "bar", "acteurs.parite": "donut" },
                    { "acteurs.age-distribution": "pie" },
                ],
            };

            const result = reduce(state, { type: "TOGGLE_STAT", definitionId: "acteurs.age-distribution" });

            expect(result.selectedStatIds).toEqual(["acteurs.parite"]);
            expect(result.displayTypes).toEqual([{ "acteurs.parite": "donut" }, {}]);
        });
    });

    describe("CLEAR_SELECTION", () => {
        it("empties selectedStatIds and every context's display types", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{}, {}],
                displayTypes: [{ "acteurs.age-distribution": "bar" }, { "acteurs.age-distribution": "donut" }],
            };

            const result = reduce(state, { type: "CLEAR_SELECTION" });

            expect(result.selectedStatIds).toEqual([]);
            expect(result.displayTypes).toEqual([{}, {}]);
        });
    });

    describe("ENABLE_SPLIT", () => {
        it("starts context 1 empty (domain/scope restent verrouillés via selectedStatIds, pas via context) but clones displayTypes", () => {
            const state: ComparatorState = {
                mode: "single",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{ filters: { legislature: 17 } }],
                displayTypes: [{ "acteurs.age-distribution": "bar" }],
            };

            const result = reduce(state, { type: "ENABLE_SPLIT" });

            expect(result.mode).toBe("split");
            expect(result.contexts).toEqual([{ filters: { legislature: 17 } }, {}]);
            expect(result.displayTypes).toEqual([
                { "acteurs.age-distribution": "bar" },
                { "acteurs.age-distribution": "bar" },
            ]);
            expect(result.displayTypes[1]).not.toBe(result.displayTypes[0]);
        });

        it("is a no-op when already split", () => {
            const state: ComparatorState = { ...INITIAL_COMPARATOR_STATE, mode: "split", contexts: [{}, {}], displayTypes: [{}, {}] };
            expect(reduce(state, { type: "ENABLE_SPLIT" })).toBe(state);
        });
    });

    describe("DISABLE_SPLIT", () => {
        it("collapses back to context 0 only", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{ filters: { legislature: 17 } }, { filters: { legislature: 16 } }],
                displayTypes: [{ "acteurs.age-distribution": "bar" }, { "acteurs.age-distribution": "donut" }],
            };

            const result = reduce(state, { type: "DISABLE_SPLIT" });

            expect(result.mode).toBe("single");
            expect(result.contexts).toEqual([{ filters: { legislature: 17 } }]);
            expect(result.displayTypes).toEqual([{ "acteurs.age-distribution": "bar" }]);
        });

        it("is a no-op when already single", () => {
            expect(reduce(INITIAL_COMPARATOR_STATE, { type: "DISABLE_SPLIT" })).toBe(INITIAL_COMPARATOR_STATE);
        });
    });

    describe("UPDATE_CONTEXT", () => {
        it("replaces the params of a given context, leaving the other untouched", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: [],
                contexts: [{ filters: { legislature: 17 } }, { filters: { legislature: 17 } }],
                displayTypes: [{}, {}],
            };

            const result = reduce(state, { type: "UPDATE_CONTEXT", contextIndex: 1, params: { filters: { legislature: 16 } } });

            expect(result.contexts).toEqual([{ filters: { legislature: 17 } }, { filters: { legislature: 16 } }]);
        });

        it("is a no-op on an out-of-range context index", () => {
            expect(reduce(INITIAL_COMPARATOR_STATE, { type: "UPDATE_CONTEXT", contextIndex: 1, params: {} })).toBe(INITIAL_COMPARATOR_STATE);
        });
    });

    describe("RESET_CONTEXT", () => {
        it("empties only the targeted context, keeping the selection, when another context still has data", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{ filters: { legislature: 17 } }, { filters: { legislature: 16 } }],
                displayTypes: [{ "acteurs.age-distribution": "bar" }, { "acteurs.age-distribution": "donut" }],
            };

            const result = reduce(state, { type: "RESET_CONTEXT", contextIndex: 0 });

            expect(result.contexts).toEqual([{}, { filters: { legislature: 16 } }]);
            expect(result.selectedStatIds).toEqual(["acteurs.age-distribution"]);
            expect(result.displayTypes).toEqual([{ "acteurs.age-distribution": "bar" }, { "acteurs.age-distribution": "donut" }]);
        });

        it("also clears the shared selection once every context ends up empty", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{}, { filters: { legislature: 16 } }],
                displayTypes: [{}, { "acteurs.age-distribution": "donut" }],
            };

            const result = reduce(state, { type: "RESET_CONTEXT", contextIndex: 1 });

            expect(result.contexts).toEqual([{}, {}]);
            expect(result.selectedStatIds).toEqual([]);
            expect(result.displayTypes).toEqual([{}, {}]);
        });

        it("clears the selection in single mode too (the lone context is always 'every context')", () => {
            const state: ComparatorState = {
                mode: "single",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{ filters: { legislature: 17 } }],
                displayTypes: [{ "acteurs.age-distribution": "bar" }],
            };

            const result = reduce(state, { type: "RESET_CONTEXT", contextIndex: 0 });

            expect(result.contexts).toEqual([{}]);
            expect(result.selectedStatIds).toEqual([]);
            expect(result.displayTypes).toEqual([{}]);
        });

        it("is a no-op on an out-of-range context index", () => {
            expect(reduce(INITIAL_COMPARATOR_STATE, { type: "RESET_CONTEXT", contextIndex: 1 })).toBe(INITIAL_COMPARATOR_STATE);
        });
    });

    describe("SET_DISPLAY_TYPE", () => {
        it("sets the display type independently per context for the same stat", () => {
            const state: ComparatorState = {
                mode: "split",
                selectedStatIds: ["acteurs.age-distribution"],
                contexts: [{}, {}],
                displayTypes: [{ "acteurs.age-distribution": "bar" }, { "acteurs.age-distribution": "bar" }],
            };

            const result = reduce(state, {
                type: "SET_DISPLAY_TYPE",
                contextIndex: 1,
                definitionId: "acteurs.age-distribution",
                displayType: "donut",
            });

            expect(result.displayTypes[0]).toEqual({ "acteurs.age-distribution": "bar" });
            expect(result.displayTypes[1]).toEqual({ "acteurs.age-distribution": "donut" });
        });

        it("is a no-op on an out-of-range context index", () => {
            const result = reduce(INITIAL_COMPARATOR_STATE, {
                type: "SET_DISPLAY_TYPE",
                contextIndex: 1,
                definitionId: "acteurs.age-distribution",
                displayType: "bar",
            });
            expect(result).toBe(INITIAL_COMPARATOR_STATE);
        });
    });
});
