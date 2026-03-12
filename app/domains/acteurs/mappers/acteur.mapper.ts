import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {toISODateOnly} from "@/app/_shared/utils/date";
import {Acteurs} from "@/app/infrastructure/db/generated/prisma";


export function mapActeurToDTO(a: Acteurs): ActeurDTO {
    return {
        id: String(a.uid),
        prenom: a.prenom ?? null,
        nom: a.nom ?? null,
        professionCategorie: a.profession_categorie ?? null,
        dateNaissance: toISODateOnly(a.date_naissance),
    };
}

export function mapActeursToDTO(list: Acteurs[]): ActeurDTO[] {
    return list.map(mapActeurToDTO);
}