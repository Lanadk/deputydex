import { findStatDefinition, getComparableStats, groupStatsByCategory } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog.helpers";
import { StatDomainModule } from "@/app/(ui)/_shared/statistics/catalog/stats-domain.types";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
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

describe("findStatDefinition", () => {
    it("finds a stat by id across all domains", () => {
        expect(findStatDefinition(CATALOG, "groupes.infos")).toEqual(GROUPE_ENTITY);
    });

    it("returns null when the id doesn't exist", () => {
        expect(findStatDefinition(CATALOG, "unknown.id")).toBeNull();
    });
});

describe("getComparableStats", () => {
    it("returns the whole catalog when there is no constraint", () => {
        expect(getComparableStats(CATALOG, null)).toHaveLength(4);
    });

    it("filters to stats matching both domain and scope", () => {
        const result = getComparableStats(CATALOG, { domain: "acteurs", scope: "aggregate" });
        expect(result).toEqual([AGE_DISTRIBUTION, PARITE]);
    });

    it("excludes same-domain stats with a different scope", () => {
        const result = getComparableStats(CATALOG, { domain: "acteurs", scope: "entity" });
        expect(result).toEqual([ACTEUR_ENTITY]);
    });

    it("excludes same-scope stats from a different domain", () => {
        const result = getComparableStats(CATALOG, { domain: "groupes", scope: "entity" });
        expect(result).toEqual([GROUPE_ENTITY]);
    });

    it("returns an empty array when nothing matches", () => {
        expect(getComparableStats(CATALOG, { domain: "votes", scope: "aggregate" })).toEqual([]);
    });
});

describe("groupStatsByCategory", () => {
    it("groups stats under their category, preserving first-seen order", () => {
        const cohesion1 = makeStat({ id: "acteurs.cohesion-1", category: "Cohésion" });
        const demo = makeStat({ id: "acteurs.demo", category: "Démographie" });
        const cohesion2 = makeStat({ id: "acteurs.cohesion-2", category: "Cohésion" });

        const groups = groupStatsByCategory([cohesion1, demo, cohesion2]);

        expect(groups).toEqual([
            { category: "Cohésion", stats: [cohesion1, cohesion2] },
            { category: "Démographie", stats: [demo] },
        ]);
    });

    it("returns an empty array for an empty input", () => {
        expect(groupStatsByCategory([])).toEqual([]);
    });
});
