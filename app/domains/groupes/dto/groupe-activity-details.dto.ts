export type GroupeActivityDetailsDTO = {
    date: string;
    domain: 'vote' | 'scrutin' | 'amendement' | 'amendement_co';
    refId: string;
    meta: {
        type: string;
        [key: string]: any;
    };
};