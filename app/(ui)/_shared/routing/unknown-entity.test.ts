import { isUnknownEntity } from "@/app/(ui)/_shared/routing/unknown-entity";
import { err, ok } from "@/app/_shared/result-pattern/result";

describe("isUnknownEntity", () => {
    it("answers 404 when the entity never existed in any legislature", () => {
        expect(isUnknownEntity(ok([]))).toBe(true);
    });

    it("does not answer 404 when the entity existed in at least one legislature (even an old one)", () => {
        expect(isUnknownEntity(ok([16]))).toBe(false);
        expect(isUnknownEntity(ok([16, 17]))).toBe(false);
    });

    it("never turns a database error into a 404", () => {
        expect(isUnknownEntity(err("DB_ERROR"))).toBe(false);
    });
});
