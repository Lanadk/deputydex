import { fromRepository } from "@/app/_shared/result-pattern/app-error";

describe("fromRepository", () => {
    it("wraps the repository value in ok()", async () => {
        expect(await fromRepository(async () => [1, 2])).toEqual({ success: true, data: [1, 2] });
    });

    it("keeps null as a value (the use-case decides whether it means NOT_FOUND)", async () => {
        expect(await fromRepository(async () => null)).toEqual({ success: true, data: null });
    });

    it("turns a repository exception into err('DB_ERROR') and logs it", async () => {
        const log = jest.spyOn(console, "error").mockImplementation(() => {});
        const failure = new Error("Failed to fetch", { cause: new Error("relation does not exist") });

        const result = await fromRepository(async () => { throw failure; });

        expect(result).toEqual({ success: false, error: "DB_ERROR" });
        expect(log).toHaveBeenCalledWith(failure);
        log.mockRestore();
    });
});
