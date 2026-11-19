import { mapDeputeRecentVoteEntityToDTO } from "@/app/domains/deputes/mappers/depute-recent-vote.mapper";

describe("mapDeputeRecentVoteEntityToDTO", () => {
    it("links the scrutin to its page on the AN site", () => {
        const dto = mapDeputeRecentVoteEntityToDTO({
            scrutin_uid: "VTANR5L17V3878",
            scrutin_numero: "3878",
            titre: "l'amendement n° 119 de M. de Courson…",
            date_scrutin: new Date("2025-11-18"),
            position: "contre",
            groupe_position: "pour",
        }, 17);

        expect(dto.lienAN).toBe("https://www.assemblee-nationale.fr/dyn/17/scrutins/3878");
        expect(dto.isRebel).toBe(true);
    });

    it("has no link when the scrutin number is unknown", () => {
        const dto = mapDeputeRecentVoteEntityToDTO({
            scrutin_uid: "VTANR5L17V1",
            scrutin_numero: null,
            titre: null,
            date_scrutin: null,
            position: "pour",
            groupe_position: null,
        }, 17);

        expect(dto.lienAN).toBeNull();
    });
});
