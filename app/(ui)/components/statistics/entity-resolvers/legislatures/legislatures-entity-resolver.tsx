"use client";

import React from "react";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { VotesEntityResolver } from "@/app/(ui)/components/statistics/entity-resolvers/votes/votes-entity-resolver";

/**
 * Domaine "legislatures" : pas d'entité, juste le choix de la législature
 * (16ᵉ, 17ᵉ…) — exactement le sélecteur de VotesEntityResolver, réutilisé tel
 * quel. Il pilote la présence moyenne détaillée (`presence-moyenne-*`) ;
 * `parite` et `presence`, comparaisons ENTRE législatures, l'ignorent et
 * affichent toujours toutes les législatures (même effet de bord assumé que
 * pour `scrutins.participation`, voir entity-resolvers.registry.ts).
 */
export const LegislaturesEntityResolver: React.FC<EntityResolverProps> = (props) => <VotesEntityResolver {...props} />;
