import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";
import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";

export const toFicheDeputeDTO = (
    acteur: ActeurWithMandatsEntity,
): FicheDeputeDTO => {
    const mandat = acteur.mandats.find(m => m.type_organe === 'ASSEMBLEE') ?? null;
    const groupeActuel = acteur.groupes?.[0];
    const parti = groupeActuel?.groupe?.partis?.[0];
    const enExercice = acteur.mandats.some(
        m => m.type_organe === 'ASSEMBLEE' && m.date_fin === null
    );

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

        groupePolitiqueCode: parti?.code ?? null,
        groupePolitiqueLibelle: parti?.libelle ?? null,

        enExercice,
        circonscription: mandat?.election_num_circo ?? null,
        departement: mandat?.election_departement ?? null,
        region: mandat?.election_region ?? null,
        premiereElection: mandat?.mandature_premiere_election ?? null,
        dateDebutMandat: mandat?.date_debut?.toISOString() ?? null,
        mandatsCount: acteur.mandats.filter(m => m.type_organe === 'ASSEMBLEE').length,

        uriHatvp: acteur.uri_hatvp ?? null,
        urlAssemblee: `https://www.assemblee-nationale.fr/dyn/deputes/${acteur.uid}`,
        image: acteur.photos[0]?.photoPath ?? null,

        mandats: acteur.mandats.map((m) => ({
            uid:           m.uid,
            typeOrgane:    m.type_organe,
            libQualite:    m.lib_qualite,
            libQualiteSex: m.lib_qualite_sex,
            organeUid:     m.organe_uid,
            legislature:   m.legislature,
            dateDebut:     m.date_debut.toISOString(),
            dateFin:       m.date_fin?.toISOString() ?? null,
            enCours:       m.date_fin === null,
        })),
    };
};