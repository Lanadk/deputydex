export interface GroupeProximitePaireDTO {
    groupeACode: string;
    groupeALabel: string;
    groupeBCode: string;
    groupeBLabel: string;
    /** En %, arrondi à 1 décimale */
    tauxProximite: number;
    nbScrutinsCommuns: number;
}

/** Proximité d'un groupe avec le groupe de référence du gouvernement — l'autre membre de la paire, vu depuis ce groupe de référence. */
export interface GroupeProximiteGouvernementDTO {
    groupeCode: string;
    groupeLabel: string;
    /** En %, arrondi à 1 décimale */
    tauxProximite: number;
    nbScrutinsCommuns: number;
}

export interface GroupesProximiteDTO {
    /** Trié par tauxProximite décroissant */
    paires: GroupeProximitePaireDTO[];
    plusProches: GroupeProximitePaireDTO | null;
    plusEloignes: GroupeProximitePaireDTO | null;
    /** null = pas de groupe de référence connu pour cette législature (voir `groupe-gouvernement-reference.constants.ts`). */
    gouvernementReference: { code: string; label: string } | null;
    /** Trié par tauxProximite décroissant — vide si `gouvernementReference` est null. */
    proximiteGouvernement: GroupeProximiteGouvernementDTO[];
}
