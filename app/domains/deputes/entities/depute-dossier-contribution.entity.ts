export type DeputeDossierContributionEntity = {
    dossier_uid: string;
    dossier_titre: string;
    dossier_legislature: number;
    procedure_libelle: string | null;
    nb_deposes: bigint | number;
    nb_adoptes: bigint | number;
    nb_cosignes: bigint | number;
    is_auteur_texte: boolean;
    is_cosignataire_texte: boolean;
    /** jsonb : un élément par rôle distinct ; `etape` = code de l'étape racine (AN1, SN1, CMP…) */
    rapporteurs: { type: string | null; etape: string }[];
    derniere_activite: Date | null;
};
