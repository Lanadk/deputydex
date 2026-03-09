import { ChartConfig } from "../../../component-library/template/block-section/chart-config.types";

/**
 * STATS_REGISTRY
 * Source of truth des statistiques affichées sur la page /statistiques.
 * Chaque entrée est un StatConfig branché sur une gatewayFn async.
 *
 * Convention :
 *  - id        : kebab-case unique
 *  - theme     : doit correspondre à un StatisticsSectionConfig.id
 *  - gatewayFn : remplacer les données mock par un vrai appel API Next.js
 */
export const STATS_REGISTRY: ChartConfig[] = [

    // ══════════════════════════════════════════════════════════════════════════
    // DÉMOGRAPHIE
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'age-distribution',
        title: 'Répartition par tranche d\'âge',
        subtitle: 'Nombre de députés par tranche de 10 ans',
        theme: 'demographie',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: legislature === 17
                ? [
                    { label: '<30',   value: 12  },
                    { label: '30–39', value: 87  },
                    { label: '40–49', value: 156 },
                    { label: '50–59', value: 189 },
                    { label: '60–69', value: 93  },
                    { label: '70+',   value: 40  },
                ]
                : [
                    { label: '<30',   value: 8   },
                    { label: '30–39', value: 72  },
                    { label: '40–49', value: 140 },
                    { label: '50–59', value: 201 },
                    { label: '60–69', value: 110 },
                    { label: '70+',   value: 46  },
                ],
        }),
    },
    {
        id: 'age-evolution-groupe',
        title: 'Âge moyen par groupe politique',
        subtitle: 'Comparaison entre groupes',
        theme: 'demographie',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      value: 44.2 },
                    { label: 'EPR',     value: 51.8 },
                    { label: 'LFI-NFP', value: 42.1 },
                    { label: 'SOC',     value: 55.3 },
                    { label: 'Écolo',   value: 46.7 },
                ]
                : [
                    { label: 'RN',      value: 42.0 },
                    { label: 'EPR',     value: 52.4 },
                    { label: 'LFI-NFP', value: 41.5 },
                    { label: 'SOC',     value: 56.1 },
                    { label: 'Écolo',   value: 47.2 },
                ],
        }),
    },
    {
        id: 'genre',
        title: 'Répartition hommes / femmes',
        subtitle: 'Part de chaque genre parmi les 577 députés',
        theme: 'demographie',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'donut',
            data: legislature === 17
                ? [{ label: 'Hommes', value: 361 }, { label: 'Femmes', value: 216 }]
                : [{ label: 'Hommes', value: 390 }, { label: 'Femmes', value: 187 }],
        }),
    },
    {
        id: 'genre-par-groupe',
        title: 'Parité par groupe politique',
        subtitle: '% de femmes dans chaque groupe',
        theme: 'demographie',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      value: 32 },
                    { label: 'EPR',     value: 40 },
                    { label: 'LFI-NFP', value: 48 },
                    { label: 'SOC',     value: 52 },
                    { label: 'Écolo',   value: 55 },
                ]
                : [
                    { label: 'RN',      value: 28 },
                    { label: 'EPR',     value: 38 },
                    { label: 'LFI-NFP', value: 44 },
                    { label: 'SOC',     value: 49 },
                    { label: 'Écolo',   value: 51 },
                ],
        }),
    },
    {
        id: 'geo-regions',
        title: 'Députés par région',
        subtitle: 'Nombre de sièges par région administrative',
        theme: 'demographie',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: 'Île-de-France',  value: 94 },
                { label: 'Auvergne-RA',    value: 60 },
                { label: 'Hauts-de-France',value: 52 },
                { label: 'Occitanie',      value: 49 },
                { label: 'Grand Est',      value: 48 },
                { label: 'PACA',           value: 43 },
                { label: 'Normandie',      value: 30 },
                { label: 'Bretagne',       value: 27 },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // FORMATION
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'formation-niveau',
        title: 'Niveau de diplôme',
        subtitle: '% de diplômés par niveau (global)',
        theme: 'formation',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: legislature === 17
                ? [
                    { label: 'Bac+5 et +', value: 58 },
                    { label: 'Bac+3/4',    value: 24 },
                    { label: 'Bac+2',      value: 9  },
                    { label: 'Bac',        value: 6  },
                    { label: 'Sans bac',   value: 3  },
                ]
                : [
                    { label: 'Bac+5 et +', value: 55 },
                    { label: 'Bac+3/4',    value: 24 },
                    { label: 'Bac+2',      value: 10 },
                    { label: 'Bac',        value: 7  },
                    { label: 'Sans bac',   value: 4  },
                ],
        }),
    },
    {
        id: 'formation-grandes-ecoles',
        title: 'Top écoles représentées',
        subtitle: 'Nombre de diplômés parmi les députés',
        theme: 'formation',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: 'Sciences Po',     value: 89 },
                { label: 'ENA / INSP',      value: 34 },
                { label: 'HEC',             value: 28 },
                { label: 'ENS',             value: 21 },
                { label: 'Polytechnique',   value: 14 },
                { label: 'Centrale',        value: 11 },
                { label: 'ESSEC',           value: 9  },
                { label: 'ESCP',            value: 7  },
            ],
        }),
    },
    {
        id: 'formation-type',
        title: 'Grandes écoles vs universités',
        subtitle: '% de diplômés par type d\'établissement',
        theme: 'formation',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'donut',
            data: legislature === 17
                ? [
                    { label: 'Grandes écoles', value: 34 },
                    { label: 'Université',     value: 48 },
                    { label: 'Autre / NC',     value: 18 },
                ]
                : [
                    { label: 'Grandes écoles', value: 36 },
                    { label: 'Université',     value: 46 },
                    { label: 'Autre / NC',     value: 18 },
                ],
        }),
    },
    {
        id: 'formation-evolution',
        title: 'Évolution du niveau de diplôme',
        subtitle: 'Part des bac+5 et + — 16e vs 17e',
        theme: 'formation',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: '16e législature', value: 55 },
                { label: '17e législature', value: 58 },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // PROFESSION
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'profession-familles',
        title: 'Familles de profession',
        subtitle: '% par grande famille (global)',
        theme: 'profession',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: legislature === 17
                ? [
                    { label: 'Enseignants',         value: 11.6 },
                    { label: 'Entrepreneurs',       value: 9.4  },
                    { label: 'Avocats / Juristes',  value: 8.2  },
                    { label: 'Fonctionnaires',      value: 13.5 },
                    { label: 'Médecins',            value: 7.3  },
                    { label: 'Cadres privés',       value: 12.1 },
                    { label: 'Élus / Militants',    value: 18.4 },
                    { label: 'Ouvriers / Employés', value: 3.1  },
                    { label: 'Agriculture',         value: 2.8  },
                    { label: 'Autres',              value: 13.6 },
                ]
                : [
                    { label: 'Enseignants',         value: 13.4 },
                    { label: 'Entrepreneurs',       value: 8.2  },
                    { label: 'Avocats / Juristes',  value: 8.0  },
                    { label: 'Fonctionnaires',      value: 14.1 },
                    { label: 'Médecins',            value: 7.1  },
                    { label: 'Cadres privés',       value: 11.8 },
                    { label: 'Élus / Militants',    value: 16.2 },
                    { label: 'Ouvriers / Employés', value: 2.5  },
                    { label: 'Agriculture',         value: 3.0  },
                    { label: 'Autres',              value: 15.7 },
                ],
        }),
    },
    {
        id: 'profession-vs-population',
        title: 'Comparaison avec la population active',
        subtitle: 'Sur / sous-représentation par famille (en pts)',
        theme: 'profession',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar-multi',
            data: [
                { label: 'Enseignants',         deputes: 11.6, population: 5.1  },
                { label: 'Avocats / Juristes',  deputes: 8.2,  population: 0.2  },
                { label: 'Médecins',            deputes: 7.3,  population: 0.8  },
                { label: 'Entrepreneurs',       deputes: 9.4,  population: 6.2  },
                { label: 'Cadres privés',       deputes: 12.1, population: 11.3 },
                { label: 'Fonctionnaires',      deputes: 13.5, population: 19.8 },
                { label: 'Ouvriers / Employés', deputes: 3.1,  population: 47.0 },
            ],
            series: [
                { dataKey: 'deputes',    label: 'Députés (%)' },
                { dataKey: 'population', label: 'Pop. active (%)' },
            ],
        }),
    },
    {
        id: 'profession-par-groupe',
        title: 'Profession par groupe politique',
        subtitle: '% d\'enseignants, juristes, entrepreneurs par groupe',
        theme: 'profession',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar-multi',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      enseignants: 8,  juristes: 5,  entrepreneurs: 12 },
                    { label: 'EPR',     enseignants: 9,  juristes: 11, entrepreneurs: 14 },
                    { label: 'LFI-NFP', enseignants: 18, juristes: 7,  entrepreneurs: 4  },
                    { label: 'SOC',     enseignants: 21, juristes: 12, entrepreneurs: 6  },
                    { label: 'Écolo',   enseignants: 16, juristes: 8,  entrepreneurs: 5  },
                ]
                : [
                    { label: 'RN',      enseignants: 7,  juristes: 4,  entrepreneurs: 11 },
                    { label: 'EPR',     enseignants: 10, juristes: 12, entrepreneurs: 13 },
                    { label: 'LFI-NFP', enseignants: 20, juristes: 6,  entrepreneurs: 3  },
                    { label: 'SOC',     enseignants: 23, juristes: 11, entrepreneurs: 5  },
                    { label: 'Écolo',   enseignants: 17, juristes: 7,  entrepreneurs: 4  },
                ],
            series: [
                { dataKey: 'enseignants',  label: 'Enseignants' },
                { dataKey: 'juristes',     label: 'Juristes' },
                { dataKey: 'entrepreneurs',label: 'Entrepreneurs' },
            ],
        }),
    },
    {
        id: 'profession-evolution',
        title: 'Évolution 16e → 17e par famille',
        subtitle: 'Delta en points de pourcentage',
        theme: 'profession',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: 'Entrepreneurs',       value:  1.2  },
                { label: 'Ouvriers / Employés', value:  0.6  },
                { label: 'Élus / Militants',    value:  2.2  },
                { label: 'Cadres privés',       value:  0.3  },
                { label: 'Enseignants',         value: -1.8  },
                { label: 'Fonctionnaires',      value: -0.6  },
                { label: 'Agriculture',         value: -0.2  },
                { label: 'Avocats / Juristes',  value:  0.2  },
            ],
        }),
    },
    {
        id: 'profession-activite-croise',
        title: 'Profession × Activité parlementaire',
        subtitle: 'Amendements déposés vs présence par famille',
        theme: 'profession',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'scatter',
            xLabel: 'Amendements déposés (moy.)',
            yLabel: 'Présence (%)',
            series: [
                {
                    id: 'enseignants',
                    label: 'Enseignants',
                    data: [{ id: 'e1', x: 112, y: 88 }, { id: 'e2', x: 98, y: 91 }],
                },
                {
                    id: 'juristes',
                    label: 'Juristes',
                    data: [{ id: 'j1', x: 74, y: 93 }, { id: 'j2', x: 82, y: 89 }],
                },
                {
                    id: 'entrepreneurs',
                    label: 'Entrepreneurs',
                    data: [{ id: 'b1', x: 44, y: 85 }, { id: 'b2', x: 61, y: 79 }],
                },
                {
                    id: 'fonctionnaires',
                    label: 'Fonctionnaires',
                    data: [{ id: 'f1', x: 55, y: 90 }, { id: 'f2', x: 48, y: 94 }],
                },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // ÉLECTION
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'election-scores-2eme-tour',
        title: 'Distribution des scores au 2e tour',
        subtitle: '% des voix exprimées — par tranche',
        theme: 'election',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: legislature === 17
                ? [
                    { label: '50–55 %', value: 178 },
                    { label: '55–60 %', value: 142 },
                    { label: '60–70 %', value: 98  },
                    { label: '70–80 %', value: 54  },
                    { label: '80 %+',   value: 21  },
                ]
                : [
                    { label: '50–55 %', value: 162 },
                    { label: '55–60 %', value: 155 },
                    { label: '60–70 %', value: 107 },
                    { label: '70–80 %', value: 61  },
                    { label: '80 %+',   value: 19  },
                ],
        }),
    },
    {
        id: 'election-primo-deputes',
        title: 'Primo-députés par groupe',
        subtitle: '% de nouveaux élus dans chaque groupe',
        theme: 'election',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      value: 52 },
                    { label: 'EPR',     value: 41 },
                    { label: 'LFI-NFP', value: 49 },
                    { label: 'SOC',     value: 38 },
                    { label: 'Écolo',   value: 61 },
                ]
                : [
                    { label: 'RN',      value: 62 },
                    { label: 'EPR',     value: 47 },
                    { label: 'LFI-NFP', value: 71 },
                    { label: 'SOC',     value: 33 },
                    { label: 'Écolo',   value: 55 },
                ],
        }),
    },
    {
        id: 'election-mandats-consecutifs',
        title: 'Nombre de mandats consécutifs',
        subtitle: 'Répartition globale',
        theme: 'election',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'donut',
            data: legislature === 17
                ? [
                    { label: '1er mandat',  value: 254 },
                    { label: '2e mandat',   value: 162 },
                    { label: '3e mandat',   value: 98  },
                    { label: '4e mandat +', value: 63  },
                ]
                : [
                    { label: '1er mandat',  value: 210 },
                    { label: '2e mandat',   value: 175 },
                    { label: '3e mandat',   value: 112 },
                    { label: '4e mandat +', value: 80  },
                ],
        }),
    },
    {
        id: 'election-taux-reelection',
        title: 'Taux de réélection 16e → 17e',
        subtitle: '% de députés sortants réélus par groupe',
        theme: 'election',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: [
                { label: 'RN',      value: 58 },
                { label: 'EPR',     value: 63 },
                { label: 'LFI-NFP', value: 47 },
                { label: 'SOC',     value: 71 },
                { label: 'Écolo',   value: 39 },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // ACTIVITÉ PARLEMENTAIRE
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'activite-presence',
        title: 'Présence en séance plénière',
        subtitle: 'Taux de présence moyen par groupe',
        theme: 'activite',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      value: 68 },
                    { label: 'EPR',     value: 79 },
                    { label: 'LFI-NFP', value: 74 },
                    { label: 'SOC',     value: 77 },
                    { label: 'Écolo',   value: 82 },
                ]
                : [
                    { label: 'RN',      value: 64 },
                    { label: 'EPR',     value: 76 },
                    { label: 'LFI-NFP', value: 71 },
                    { label: 'SOC',     value: 75 },
                    { label: 'Écolo',   value: 80 },
                ],
        }),
    },
    {
        id: 'activite-presence-evolution',
        title: 'Évolution de la présence',
        subtitle: 'Taux mensuel par groupe — 17e législature',
        theme: 'activite',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'line-multi',
            variant: 'parliament-group',
            data: [
                { label: 'Jan',   RN: 68, EPR: 79, 'LFI-NFP': 74, SOC: 77 },
                { label: 'Fév',   RN: 65, EPR: 81, 'LFI-NFP': 76, SOC: 75 },
                { label: 'Mars',  RN: 71, EPR: 78, 'LFI-NFP': 73, SOC: 78 },
                { label: 'Avr',   RN: 69, EPR: 80, 'LFI-NFP': 77, SOC: 74 },
                { label: 'Mai',   RN: 67, EPR: 77, 'LFI-NFP': 72, SOC: 76 },
                { label: 'Juin',  RN: 64, EPR: 75, 'LFI-NFP': 70, SOC: 73 },
            ],
            series: [
                { dataKey: 'RN',      label: 'RN'      },
                { dataKey: 'EPR',     label: 'EPR'     },
                { dataKey: 'LFI-NFP', label: 'LFI-NFP' },
                { dataKey: 'SOC',     label: 'SOC'     },
            ],
        }),
    },
    {
        id: 'activite-cohesion',
        title: 'Cohésion de vote par groupe',
        subtitle: '% de votes conformes à la ligne de groupe',
        theme: 'activite',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            variant: 'parliament-group',
            data: legislature === 17
                ? [
                    { label: 'RN',      value: 94 },
                    { label: 'EPR',     value: 88 },
                    { label: 'LFI-NFP', value: 91 },
                    { label: 'SOC',     value: 82 },
                    { label: 'Écolo',   value: 79 },
                ]
                : [
                    { label: 'RN',      value: 96 },
                    { label: 'EPR',     value: 90 },
                    { label: 'LFI-NFP', value: 89 },
                    { label: 'SOC',     value: 84 },
                    { label: 'Écolo',   value: 77 },
                ],
        }),
    },
    {
        id: 'activite-amendements-par-groupe',
        title: 'Amendements déposés par groupe',
        subtitle: 'Évolution mensuelle',
        theme: 'activite',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'line-multi',
            variant: 'parliament-group',
            data: [
                { label: 'Jan',   RN: 12, EPR: 18, 'LFI-NFP': 9  },
                { label: 'Fév',   RN: 15, EPR: 16, 'LFI-NFP': 11 },
                { label: 'Mars',  RN: 19, EPR: 14, 'LFI-NFP': 13 },
                { label: 'Avr',   RN: 17, EPR: 12, 'LFI-NFP': 15 },
                { label: 'Mai',   RN: 14, EPR: 15, 'LFI-NFP': 12 },
                { label: 'Juin',  RN: 11, EPR: 17, 'LFI-NFP': 10 },
            ],
            series: [
                { dataKey: 'RN',      label: 'RN'      },
                { dataKey: 'EPR',     label: 'EPR'     },
                { dataKey: 'LFI-NFP', label: 'LFI-NFP' },
            ],
        }),
    },
    {
        id: 'activite-votes-par-groupe',
        title: 'Votes Pour / Contre / Abstention',
        subtitle: 'Répartition par groupe politique',
        theme: 'activite',
        gatewayFn: async (legislature) => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'stacked-bar',
            data: legislature === 17
                ? [
                    { label: 'LFI-NFP', pour: 12, contre: 30, abstention: 4 },
                    { label: 'EPR',     pour: 40, contre: 8,  abstention: 2 },
                    { label: 'RN',      pour: 9,  contre: 27, abstention: 6 },
                    { label: 'SOC',     pour: 18, contre: 15, abstention: 8 },
                ]
                : [
                    { label: 'LFI-NFP', pour: 8,  contre: 35, abstention: 3 },
                    { label: 'EPR',     pour: 44, contre: 6,  abstention: 1 },
                    { label: 'RN',      pour: 11, contre: 22, abstention: 9 },
                    { label: 'SOC',     pour: 21, contre: 12, abstention: 6 },
                ],
            series: [
                { dataKey: 'pour',        label: 'Pour',        stack: 'votes' },
                { dataKey: 'contre',      label: 'Contre',      stack: 'votes' },
                { dataKey: 'abstention',  label: 'Abstention',  stack: 'votes' },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MOBILITÉ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'mobilite-cumul',
        title: 'Cumul avec un mandat local',
        subtitle: '% de députés cumulant par type de mandat',
        theme: 'mobilite',
        gatewayFn: async (legislature) => ({//a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: legislature === 17
                ? [
                    { label: 'Maire',               value: 14 },
                    { label: 'Conseiller régional',  value: 8  },
                    { label: 'Conseiller dép.',      value: 6  },
                    { label: 'Conseiller municipal', value: 12 },
                    { label: 'Aucun mandat',         value: 60 },
                ]
                : [
                    { label: 'Maire',               value: 18 },
                    { label: 'Conseiller régional',  value: 10 },
                    { label: 'Conseiller dép.',      value: 8  },
                    { label: 'Conseiller municipal', value: 16 },
                    { label: 'Aucun mandat',         value: 48 },
                ],
        }),
    },
    {
        id: 'mobilite-changements-groupe',
        title: 'Changements de groupe en cours de législature',
        subtitle: 'Flux entre groupes politiques',
        theme: 'mobilite',
        gatewayFn: async () => ({
            type: 'bar',
            variant: 'parliament-group',
            data: [
                { label: 'Vers RN',       value: 4  },
                { label: 'Vers EPR',      value: 9  },
                { label: 'Vers LFI-NFP',  value: 3  },
                { label: 'Vers SOC',      value: 6  },
                { label: 'Non-inscrits',  value: 14 },
            ],
        }),
    },

    // ══════════════════════════════════════════════════════════════════════════
    // COMPARAISONS 16e → 17e
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'comparaison-sieges',
        title: 'Répartition des sièges par groupe',
        subtitle: '16e vs 17e législature',
        theme: 'comparaison',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar-multi',
            variant: 'parliament-group',
            data: [
                { label: 'RN',      '16e': 89,  '17e': 122 },
                { label: 'EPR',     '16e': 105, '17e': 91  },
                { label: 'LFI-NFP', '16e': 75,  '17e': 71  },
                { label: 'SOC',     '16e': 64,  '17e': 69  },
                { label: 'Autres',  '16e': 244, '17e': 224 },
            ],
            series: [
                { dataKey: '16e', label: '16e législature' },
                { dataKey: '17e', label: '17e législature' },
            ],
        }),
    },
    {
        id: 'comparaison-parite',
        title: 'Évolution de la parité',
        subtitle: 'Part de femmes 16e vs 17e',
        theme: 'comparaison',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar-multi',
            variant: 'parliament-group',
            data: [
                { label: 'RN',      '16e': 28, '17e': 32 },
                { label: 'EPR',     '16e': 38, '17e': 40 },
                { label: 'LFI-NFP', '16e': 44, '17e': 48 },
                { label: 'SOC',     '16e': 49, '17e': 52 },
                { label: 'Écolo',   '16e': 51, '17e': 55 },
            ],
            series: [
                { dataKey: '16e', label: '16e législature' },
                { dataKey: '17e', label: '17e législature' },
            ],
        }),
    },
    {
        id: 'comparaison-age-moyen',
        title: 'Évolution de l\'âge moyen',
        subtitle: 'Âge moyen global 16e vs 17e',
        theme: 'comparaison',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: '16e législature', value: 50.7 },
                { label: '17e législature', value: 49.3 },
            ],
        }),
    },
    {
        id: 'comparaison-primo',
        title: 'Taux de primo-députés',
        subtitle: 'Renouvellement 16e vs 17e',
        theme: 'comparaison',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: '16e législature', value: 36 },
                { label: '17e législature', value: 44 },
            ],
        }),
    },
    {
        id: 'comparaison-profession-delta',
        title: 'Familles de profession — delta',
        subtitle: 'Progression / régression 16e → 17e (en pts)',
        theme: 'comparaison',
        gatewayFn: async () => ({ //a remplacer par les vrais appels gateway de l'api
            type: 'bar',
            data: [
                { label: 'Élus / Militants',    value:  2.2  },
                { label: 'Entrepreneurs',       value:  1.2  },
                { label: 'Ouvriers / Employés', value:  0.6  },
                { label: 'Avocats / Juristes',  value:  0.2  },
                { label: 'Cadres privés',       value:  0.3  },
                { label: 'Agriculture',         value: -0.2  },
                { label: 'Fonctionnaires',      value: -0.6  },
                { label: 'Enseignants',         value: -1.8  },
            ],
        }),
    },
];