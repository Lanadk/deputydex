import { err, isErr, isOk, ok, unwrap, unwrapOr, unwrapOrElse } from "@/app/_shared/result-pattern/result";

describe("ok / err", () => {
    it("ok() wraps a value as a success result", () => {
        expect(ok(42)).toEqual({ success: true, data: 42 });
    });

    it("err() wraps a value as a failure result", () => {
        expect(err("BOOM")).toEqual({ success: false, error: "BOOM" });
    });
});

describe("isOk / isErr", () => {
    it("narrows correctly for a success result", () => {
        const result = ok(42);
        expect(isOk(result)).toBe(true);
        expect(isErr(result)).toBe(false);
    });

    it("narrows correctly for a failure result", () => {
        const result = err("BOOM");
        expect(isOk(result)).toBe(false);
        expect(isErr(result)).toBe(true);
    });
});

describe("unwrap", () => {
    it("returns the data for a success result", () => {
        expect(unwrap(ok(42))).toBe(42);
    });

    it("throws the error for a failure result", () => {
        expect(() => unwrap(err(new Error("BOOM")))).toThrow("BOOM");
    });
});

describe("unwrapOr", () => {
    it("returns the data for a success result", () => {
        expect(unwrapOr(ok(42), 0)).toBe(42);
    });

    it("returns the default value for a failure result", () => {
        expect(unwrapOr(err("BOOM"), 0)).toBe(0);
    });
});

describe("unwrapOrElse", () => {
    it("returns the data for a success result without calling the fallback", () => {
        const fn = jest.fn();
        expect(unwrapOrElse(ok(42), fn)).toBe(42);
        expect(fn).not.toHaveBeenCalled();
    });

    it("calls the fallback with the error for a failure result", () => {
        const fn = jest.fn().mockReturnValue(-1);
        expect(unwrapOrElse(err("BOOM"), fn)).toBe(-1);
        expect(fn).toHaveBeenCalledWith("BOOM");
    });
});
