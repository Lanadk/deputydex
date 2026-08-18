export type GroupeStatPariteDTO = { items: { label: string; value: number }[] };
export type GroupeStatEffectifsDTO = { items: { label: string; value: number }[] };
export type GroupeStatCohesionDTO = { points: { label: string; value: number }[] };
/** Un item "Pour"/"Contre"/"Abstention" par groupe — même forme que le shape `multi-series` de `RawStatData`. */
export type GroupeStatPositionsVoteDTO = { series: { name: string; items: { label: string; value: number }[] }[] };
/** Un item par groupe (label = code du groupe, value = taux d'expression en %). */
export type GroupeStatExpressionVotesDTO = { items: { label: string; value: number }[] };
/** Un item par groupe (label = code du groupe, value = taux de participation en %). */
export type GroupeStatParticipationDTO = { items: { label: string; value: number }[] };
/** Évolution mensuelle, pour UN groupe précis (scope entity) — même forme que `GroupeStatCohesionDTO`. */
export type GroupeStatParticipationEvolutionDTO = { points: { label: string; value: number }[] };
/** Évolution mensuelle, TOUS les groupes superposés (scope aggregate) — même forme que `GroupeStatPositionsVoteDTO`, une série par groupe. */
export type GroupeStatParticipationEvolutionTousDTO = { series: { name: string; items: { label: string; value: number }[] }[] };
/** Liste "brute" de groupes sélectionnables pour une législature (NI + groupes à 0 membre courant inclus). */
export type GroupeListDTO = { code: string; label: string }[];
