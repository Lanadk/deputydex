import { sanitizeFilterBarQuery } from "@/app/_shared/filtering/filter-bar-sanitize";

const OPTS = {
    allowedFilterFields: ["nom", "prenom"],
    allowedSortFields: ["nom", "date_naissance"],
};

describe("sanitizeFilterBarQuery — orderBy", () => {
    it("keeps whitelisted sort fields with a valid direction", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [{ nom: "asc" }], where: {} },
            OPTS
        );
        expect(result.orderBy).toEqual([{ nom: "asc" }]);
    });

    it("drops sort rules on fields that are not whitelisted", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [{ not_whitelisted: "asc" }], where: {} },
            OPTS
        );
        expect(result.orderBy).toEqual([]);
    });

    it("drops sort rules with an invalid direction", () => {
        const result = sanitizeFilterBarQuery(
            // @ts-expect-error volontairement invalide pour tester le garde-fou runtime
            { orderBy: [{ nom: "sideways" }], where: {} },
            OPTS
        );
        expect(result.orderBy).toEqual([]);
    });

    it("returns an empty array when orderBy is not an array", () => {
        const result = sanitizeFilterBarQuery(
            // @ts-expect-error input malformé volontaire
            { orderBy: "not-an-array", where: {} },
            OPTS
        );
        expect(result.orderBy).toEqual([]);
    });
});

describe("sanitizeFilterBarQuery — where", () => {
    it("keeps a single condition on a whitelisted field with an allowed operator", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [], where: { nom: { contains: "a" } } },
            OPTS
        );
        expect(result.where).toEqual({ nom: { contains: "a" } });
    });

    it("drops a condition on a field that is not whitelisted", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [], where: { secret_field: { contains: "a" } } },
            OPTS
        );
        expect(result.where).toEqual({});
    });

    it("drops a condition using an operator that is not whitelisted", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [], where: { nom: { notAnOperator: "a" } } },
            OPTS
        );
        expect(result.where).toEqual({});
    });

    it("keeps only the whitelisted conditions inside an AND array", () => {
        const result = sanitizeFilterBarQuery(
            {
                orderBy: [],
                where: {
                    AND: [
                        { nom: { contains: "a" } },
                        { secret_field: { contains: "b" } },
                        { prenom: { equals: "Jean" } },
                    ],
                },
            },
            OPTS
        );
        expect(result.where).toEqual({
            AND: [{ nom: { contains: "a" } }, { prenom: { equals: "Jean" } }],
        });
    });

    it("unwraps an AND array down to a single condition when only one survives sanitization", () => {
        const result = sanitizeFilterBarQuery(
            {
                orderBy: [],
                where: { AND: [{ nom: { contains: "a" } }, { secret_field: { contains: "b" } }] },
            },
            OPTS
        );
        expect(result.where).toEqual({ nom: { contains: "a" } });
    });

    it("returns an empty object when where is empty or entirely filtered out", () => {
        expect(sanitizeFilterBarQuery({ orderBy: [], where: {} }, OPTS).where).toEqual({});
        expect(
            sanitizeFilterBarQuery(
                { orderBy: [], where: { secret_field: { contains: "a" } } },
                OPTS
            ).where
        ).toEqual({});
    });

    it("respects a custom allowedOperators list instead of the default set", () => {
        const result = sanitizeFilterBarQuery(
            { orderBy: [], where: { nom: { contains: "a" } } },
            { ...OPTS, allowedOperators: ["equals"] }
        );
        expect(result.where).toEqual({});
    });
});
