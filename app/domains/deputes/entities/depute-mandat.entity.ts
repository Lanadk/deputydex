export type DeputeMandatEntity = {
    uid: string;
    type_organe: string;
    lib_qualite: string;
    date_debut: Date;
    date_fin: Date | null;
    organe_uid: string;
    legislature: number;
};
