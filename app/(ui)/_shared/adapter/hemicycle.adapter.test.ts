import { buildHemicycleGroupes } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";

function depute(uid: string, groupe: string, name = uid): DeputesCardDTO {
    return { deputeUID: uid, deputeFullName: name, deputeGroupeCode: groupe, deputeImage: `/img/${uid}.png` };
}

function groupe(code: string, overrides: Partial<GroupeCardDTO> = {}): GroupeCardDTO {
    return {
        groupeId: code,
        groupeCode: code,
        groupeLabel: `API ${code}`,
        groupePresidentFullName: "",
        groupeQualitySexLabel: "",
        groupeCountMembers: 999,
        groupeHref: `/groupes/${code}`,
        ...overrides,
    };
}

describe("buildHemicycleGroupes", () => {
    it("counts members from the deputy cards, ignores cards without a group, orders left → right", () => {
        const result = buildHemicycleGroupes(
            [depute("1", "RN"), depute("2", "RN"), depute("3", "LFI-NFP"), depute("4", "NI-17"), depute("5", "")],
            [groupe("RN"), groupe("LFI-NFP"), groupe("NI-17"), groupe("UDR")]
        );

        expect(result.map((g) => [g.code, g.count])).toEqual([["LFI-NFP", 1], ["RN", 2], ["NI-17", 1]]);
    });

    it("uses the front labels, falling back to the API label, and shortens NI codes", () => {
        const [lfi, inconnu, ni] = buildHemicycleGroupes(
            [depute("1", "LFI-NFP"), depute("2", "XYZ"), depute("3", "NI-17")],
            [groupe("XYZ")]
        );

        expect(lfi.label).toBe("La France insoumise");
        expect(inconnu.label).toBe("API XYZ");
        expect(ni).toMatchObject({ shortLabel: "NI", label: "Non inscrits", presidence: null });
    });

    it("builds the presidency line and finds the president's photo among the members", () => {
        const [lfi] = buildHemicycleGroupes(
            [depute("PA1", "LFI-NFP", "Mathilde Panot")],
            [groupe("LFI-NFP", { groupePresidentFullName: "Mathilde Panot", groupeQualitySexLabel: "Présidente du" })]
        );

        expect(lfi.presidence).toBe("Présidente du groupe : Mathilde Panot");
        expect(lfi.presidentRole).toBe("Présidente du groupe");
        expect(lfi.president).toMatchObject({ deputeUID: "PA1", deputeImage: "/img/PA1.png" });
    });
});
