export type GroupeStatPariteDTO = { items: { label: string; value: number }[] };
export type GroupeStatEffectifsDTO = { items: { label: string; value: number }[] };
export type GroupeStatCohesionDTO = { points: { label: string; value: number }[] };
/** Un item "Pour"/"Contre"/"Abstention" par groupe — même forme que le shape `multi-series` de `RawStatData`. */
export type GroupeStatPositionsVoteDTO = { series: { name: string; items: { label: string; value: number }[] }[] };
/** Un item par groupe (label = code du groupe, value = taux d'expression en %). */
export type GroupeStatExpressionVotesDTO = { items: { label: string; value: number }[] };
