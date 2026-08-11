import { mapActeurToDTO, mapActeursToDTO } from "@/app/domains/acteurs/mappers/acteur.mapper";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";

describe("mapActeurToDTO", () => {
    it("maps a full entity to its DTO shape (uid stringified, date formatted as yyyy-mm-dd)", () => {
        const entity: ActeurEntity = {
            uid: "PA1",
            prenom: "Jean",
            nom: "Dupont",
            profession_categorie: "Parlementaire",
            date_naissance: new Date("1970-06-15T00:00:00Z"),
        };

        expect(mapActeurToDTO(entity)).toEqual({
            id: "PA1",
            prenom: "Jean",
            nom: "Dupont",
            professionCategorie: "Parlementaire",
            dateNaissance: "1970-06-15",
        });
    });

    it("passes through null fields as null rather than throwing or defaulting", () => {
        const entity: ActeurEntity = {
            uid: "PA2",
            prenom: null,
            nom: null,
            profession_categorie: null,
            date_naissance: null,
        };

        expect(mapActeurToDTO(entity)).toEqual({
            id: "PA2",
            prenom: null,
            nom: null,
            professionCategorie: null,
            dateNaissance: null,
        });
    });
});

describe("mapActeursToDTO", () => {
    it("maps an empty list to an empty list", () => {
        expect(mapActeursToDTO([])).toEqual([]);
    });

    it("maps each entity in the list independently, preserving order", () => {
        const entities: ActeurEntity[] = [
            { uid: "PA1", prenom: "Jean", nom: "Dupont", profession_categorie: null, date_naissance: null },
            { uid: "PA2", prenom: "Marie", nom: "Martin", profession_categorie: null, date_naissance: null },
        ];

        expect(mapActeursToDTO(entities).map((d) => d.id)).toEqual(["PA1", "PA2"]);
    });
});
