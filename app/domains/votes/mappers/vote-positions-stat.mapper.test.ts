import { mapVotePositionsStatToDTO } from "@/app/domains/votes/mappers/vote-positions-stat.mapper";

describe("mapVotePositionsStatToDTO", () => {
    it("maps the totals to Pour/Contre/Abstention/Non-votant items", () => {
        const dto = mapVotePositionsStatToDTO({
            total_pour: 210,
            total_contre: 180,
            total_abstentions: 40,
            total_non_votants: 147,
        });

        expect(dto).toEqual({
            items: [
                { label: "Pour", value: 210 },
                { label: "Contre", value: 180 },
                { label: "Abstention", value: 40 },
                { label: "Non-votant", value: 147 },
            ],
        });
    });
});
