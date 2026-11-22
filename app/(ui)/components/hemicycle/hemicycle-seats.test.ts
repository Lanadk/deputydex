import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";

describe("computeHemicycleSeats", () => {
    const groupes = [
        { code: "LFI-NFP", count: 71 },
        { code: "EPR", count: 90 },
        { code: "RN", count: 122 },
        { code: "NI-17", count: 10 },
    ];

    it("creates exactly one seat per member, ranked inside each group", () => {
        const seats = computeHemicycleSeats(groupes);

        expect(seats).toHaveLength(293);
        expect(seats.filter((s) => s.groupeCode === "RN").map((s) => s.rank)).toEqual([...Array(122).keys()]);
    });

    it("keeps every seat inside the 1000×520 box", () => {
        for (const seat of computeHemicycleSeats(groupes)) {
            expect(seat.left).toBeGreaterThanOrEqual(0);
            expect(seat.left).toBeLessThanOrEqual(100);
            expect(seat.top).toBeGreaterThanOrEqual(0);
            expect(seat.top).toBeLessThanOrEqual(100);
        }
    });

    it("lays the groups out from left to right in the given order", () => {
        const seats = computeHemicycleSeats(groupes);
        const meanLeft = (code: string) => {
            const own = seats.filter((s) => s.groupeCode === code);
            return own.reduce((sum, s) => sum + s.left, 0) / own.length;
        };

        expect(meanLeft("LFI-NFP")).toBeLessThan(meanLeft("EPR"));
        expect(meanLeft("EPR")).toBeLessThan(meanLeft("RN"));
        expect(meanLeft("RN")).toBeLessThan(meanLeft("NI-17"));
    });

    it("puts the presidency on the perchoir: one seat out of its group's block, same total", () => {
        const seats = computeHemicycleSeats(groupes, { groupeCode: "EPR" });
        const perchoir = seats.filter((s) => s.perchoir);

        expect(seats).toHaveLength(293);
        expect(perchoir).toHaveLength(1);
        expect(perchoir[0]).toMatchObject({ groupeCode: "EPR", rank: 89, left: 50, rotate: 0 });
        // Sur l'axe, devant la première rangée : plus bas que les sièges du centre de l'hémicycle.
        const auCentre = seats.filter((s) => !s.perchoir && Math.abs(s.left - 50) < 5);
        expect(auCentre.length).toBeGreaterThan(0);
        expect(perchoir[0].top).toBeGreaterThan(Math.max(...auCentre.map((s) => s.top)));
        // Les rangs restent uniques dans le groupe (clé du siège, concordance siège ↔ député).
        expect(new Set(seats.filter((s) => s.groupeCode === "EPR").map((s) => s.rank)).size).toBe(90);
    });

    it("ignores a perchoir group that is absent from the assembly", () => {
        expect(computeHemicycleSeats(groupes, { groupeCode: "INCONNU" }).some((s) => s.perchoir)).toBe(false);
    });

    it("handles the real 577 seats and an empty assembly", () => {
        expect(computeHemicycleSeats([{ code: "X", count: 577 }])).toHaveLength(577);
        expect(computeHemicycleSeats([])).toEqual([]);
    });
});
