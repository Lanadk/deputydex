import {ActeurDTO} from "@/app/lib/dto/acteur.dto";
import {toISODateOnly} from "@/app/lib/utils/utils";


export function mapActeurToDTO(a: any): ActeurDTO {
    return {
        id: String(a.uid),
        prenom: a.prenom ?? null,
        nom: a.nom ?? null,
        profession_categorie: a.profession_categorie ?? null,
        date_naissance: toISODateOnly(a.date_naissance),
    };
}

export function mapActeursToDTO(list: any[]): ActeurDTO[] {
    return list.map(mapActeurToDTO);
}