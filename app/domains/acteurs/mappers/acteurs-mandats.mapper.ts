import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";
import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";


export const toFicheDeputeDTO = (
    acteur: ActeurWithMandatsEntity,
): FicheDeputeDTO => {
    const mandat = acteur.mandats[0] ?? null;

    return {
        uid: acteur.uid,
        civilite: acteur.civilite ?? null,
        prenom: acteur.prenom ?? null,
        nom: acteur.nom ?? null,
        trigramme: acteur.trigramme ?? null,
        dateNaissance: acteur.date_naissance?.toISOString() ?? null,
        villeNaissance: acteur.ville_naissance ?? null,
        departementNaissance: acteur.departement_naissance ?? null,
        paysNaissance: acteur.pays_naissance ?? null,

        professionLibelle: acteur.profession_libelle ?? null,
        professionCategorie: acteur.profession_categorie ?? null,
        professionFamille: acteur.profession_famille ?? null,

        circonscription: mandat?.election_num_circo ?? null,
        departement: mandat?.election_departement ?? null,
        region: mandat?.election_region ?? null,
        premiereElection: mandat?.mandature_premiere_election ?? null,
        dateDebutMandat: mandat?.date_debut?.toISOString() ?? null,
        mandatsCount: acteur.mandats.length,

        uriHatvp: acteur.uri_hatvp ?? null,
        urlAssemblee: `https://www.assemblee-nationale.fr/dyn/deputes/${acteur.uid}`,
        image: acteur.photos[0]?.photoPath ?? null,
    };
};