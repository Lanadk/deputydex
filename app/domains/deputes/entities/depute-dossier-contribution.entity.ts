export type DeputeDossierContributionEntity = {
    dossier_uid: string;
    dossier_titre: string;
    dossier_legislature: number;
    procedure_libelle: string | null;
    nb_deposes: bigint | number;
    nb_adoptes: bigint | number;
    nb_cosignes: bigint | number;
    is_initiateur: boolean;
    roles_rapporteur: string[];
    derniere_activite: Date | null;
};
