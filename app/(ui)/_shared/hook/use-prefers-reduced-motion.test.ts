import { act, renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "@/app/(ui)/_shared/hook/use-prefers-reduced-motion";

describe("usePrefersReducedMotion", () => {
    it("suit la préférence en direct", () => {
        let ecouteur: () => void = () => {};
        const media = {
            matches: true,
            addEventListener: jest.fn((_: string, cb: () => void) => { ecouteur = cb; }),
            removeEventListener: jest.fn(),
        };
        window.matchMedia = jest.fn().mockReturnValue(media) as unknown as typeof window.matchMedia;

        const { result, unmount } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(true);

        media.matches = false;
        act(() => ecouteur());
        expect(result.current).toBe(false);

        unmount();
        expect(media.removeEventListener).toHaveBeenCalled();
    });
});
