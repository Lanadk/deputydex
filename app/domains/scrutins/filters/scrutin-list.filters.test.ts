import { parseScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";

describe("parseScrutinListFilters", () => {
    it("applique les valeurs par défaut : scrutins importants, page 1, 20 par page", () => {
        expect(parseScrutinListFilters(17, {})).toEqual({
            legislature: 17,
            portee: "importants",
            recherche: null,
            resultat: null,
            type: null,
            objet: null,
            page: 1,
            pageSize: 20,
        });
    });

    it("garde les valeurs valides", () => {
        const filters = parseScrutinListFilters(16, {
            portee: "tous", resultat: "rejete", type: "SPS", objet: "amendement", page: "3", pageSize: "10",
        });
        expect(filters).toMatchObject({ legislature: 16, portee: "tous", resultat: "rejete", type: "SPS", objet: "amendement", page: 3, pageSize: 10 });
    });

    it("ignore les valeurs inconnues (dont l'option « tous » de l'UI) plutôt que d'échouer", () => {
        const filters = parseScrutinListFilters(17, { portee: "x", resultat: "tous", type: "spo", objet: "loi", page: "-2", pageSize: "abc" });
        expect(filters).toMatchObject({ portee: "importants", resultat: null, type: null, objet: null, page: 1, pageSize: 20 });
    });

    it("plafonne la taille de page", () => {
        expect(parseScrutinListFilters(17, { pageSize: "1000" }).pageSize).toBe(50);
    });

    it("normalise la recherche : minuscules, sans accents, apostrophe droite, espaces réduits", () => {
        expect(parseScrutinListFilters(17, { q: "  Sécurité   SOCIALE l’État " }).recherche).toBe("securite sociale l'etat");
        expect(parseScrutinListFilters(17, { q: "   " }).recherche).toBeNull();
    });
});
