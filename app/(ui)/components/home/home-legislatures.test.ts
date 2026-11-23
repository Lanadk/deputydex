import {
    periodeLegislature,
    resumeLegislaturesCouvertes,
    sortLegislaturesCouvertes,
} from "@/app/(ui)/components/home/home-legislatures";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";

const L16: LegislatureDTO = { id: 16, number: 16, startDate: "2022-06-28", endDate: "2024-06-09" };
const L17: LegislatureDTO = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };

describe("home-legislatures", () => {
    it("trie de la plus ancienne à la plus récente", () => {
        expect(sortLegislaturesCouvertes([L17, L16]).map((l) => l.number)).toEqual([16, 17]);
    });

    it("période : années de début et de fin, ou « depuis » pour celle en cours", () => {
        expect(periodeLegislature(L16)).toBe("16ᵉ (2022 – 2024)");
        expect(periodeLegislature(L17)).toBe("17ᵉ (depuis 2024)");
        expect(periodeLegislature({ id: 1, number: 1, startDate: null, endDate: null })).toBe("1ʳᵉ");
    });

    it("résumé des législatures couvertes", () => {
        expect(resumeLegislaturesCouvertes([L17, L16])).toBe(
            "2 législatures couvertes : la 16ᵉ (2022 – 2024) et la 17ᵉ (depuis 2024)"
        );
        expect(resumeLegislaturesCouvertes([L17])).toBe("1 législature couverte : la 17ᵉ (depuis 2024)");
        expect(resumeLegislaturesCouvertes([])).toBeNull();
    });
});
