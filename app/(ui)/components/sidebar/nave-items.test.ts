import { isNavItemActive, NAVITEMS, SITE_LABEL } from "@/app/(ui)/components/sidebar/nave-items";

describe("NAVITEMS", () => {
    it("ordre du menu principal : des personnes vers l'Assemblée, puis le contexte et les analyses", () => {
        expect(NAVITEMS.filter((i) => i.section === "deputydex").map((i) => i.label)).toEqual([
            "Accueil", "DéputéDex", "Hémicycle", "Groupes", "Scrutins", "Législatures", "Statistiques",
        ]);
    });

    it("libellé du site accentué, comme le titre de la page", () => {
        expect(SITE_LABEL).toBe("DéputéDex");
        expect(NAVITEMS.find((i) => i.href === "/deputydex")?.label).toBe(SITE_LABEL);
    });
});

describe("isNavItemActive", () => {
    it("l'accueil n'est actif que sur « / » ; les autres entrées sur leurs sous-pages", () => {
        expect(isNavItemActive("/", "/")).toBe(true);
        expect(isNavItemActive("/", "/groupes")).toBe(false);
        expect(isNavItemActive("/groupes", "/groupes/EPR")).toBe(true);
    });
});
