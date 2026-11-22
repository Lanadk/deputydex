import { getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

describe("getGroupCardTheme — normalisation du nom de groupe", () => {
    it("reconnaît un libellé complet (accents, ponctuation, espaces)", () => {
        expect(getGroupCardTheme("Libertés, Indépendants, Outre-mer et Territoires")).toBe(getGroupCardTheme("LIOT"));
    });

    it("ignore la ponctuation en début et en fin de libellé", () => {
        expect(getGroupCardTheme(" (Écologiste & Social) ")).toBe(getGroupCardTheme("ECOS"));
        expect(getGroupCardTheme("--Écologiste et Social--")).toBe(getGroupCardTheme("ECOS"));
    });

    it("retombe sur le thème par défaut pour un libellé vide ou inconnu", () => {
        expect(getGroupCardTheme("")).toBe(getGroupCardTheme(null));
        expect(getGroupCardTheme("___")).toBe(getGroupCardTheme(null));
        expect(getGroupCardTheme("Groupe inconnu")).toBe(getGroupCardTheme(null));
    });
});
