import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {toISODateOnly} from "@/app/_shared/utils/date";
import {ActeurEntity} from "@/app/domains/acteurs/entities/acteurs.entity";


export function mapActeurToDTO(a: ActeurEntity): ActeurDTO {
    return {
        id: String(a.uid),
        prenom: a.prenom ?? null,
        nom: a.nom ?? null,
        professionCategorie: a.profession_categorie ?? null,
        dateNaissance: toISODateOnly(a.date_naissance),
    };
}

export function mapActeursToDTO(list: ActeurEntity[]): ActeurDTO[] {
    return list.map(mapActeurToDTO);
}