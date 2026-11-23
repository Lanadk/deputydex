import "server-only";

import { isOk, Result } from "@/app/_shared/result-pattern/result";
import { cachedRead, cachedResult } from "@/app/_shared/cache/cached-response";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputesTendancesDTO } from "@/app/domains/deputes/dto/deputes-tendances.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { ScrutinPlusSerreDTO } from "@/app/domains/scrutins/dto/scrutin-plus-serre.dto";
import type { HomeTabletFiche } from "@/app/(ui)/components/home/home-tablet-ecrans";
import { HOME_DERNIERS_VOTES } from "@/app/(ui)/components/home/home-mois.helpers";
import { parseScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { getAllLegislaturesUseCase } from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import { getLegislatureChiffresUseCase } from "@/app/domains/legislatures/use-cases/get-legislature-chiffres.use-case";
import { getDeputesCardsSampleUseCase } from "@/app/domains/deputes/use-cases/get-deputes-cards-sample.use-case";
import { getDeputesTendancesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-tendances.use-case";
import { getDeputeVoteStatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-vote-stats.use-case";
import { getDeputeActivityUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity.use-case";
import { getGroupeCardsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import { getScrutinsListUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-list.use-case";
import { getScrutinPlusSerreUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-plus-serre.use-case";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import { prismaLegislatureOrganisationRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";
import { prismaDeputesCardsRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-cards.repository";
import { prismaDeputesTendancesRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-tendances.repository";
import { prismaDeputeVoteStatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-vote-stats.repository";
import { prismaDeputeActivityRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-activity.repository";
import { prismaGroupesCardsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository";
import { prismaScrutinListRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository";
import { prismaScrutinsPeriodeRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-periode.repository";

/**
 * Données de l'accueil, lues côté serveur pour que la page arrive remplie
 * (référencement, aucun appel API au chargement). `null` : bloc indisponible
 * (erreur serveur, ou rien à montrer) — le client le charge alors lui-même.
 */
export type HomeData = {
    legislature: LegislatureDTO | null;
    legislatures: LegislatureDTO[] | null;
    cards: DeputesCardDTO[] | null;
    derniers: ScrutinListPageDTO | null;
    groupes: GroupeCardDTO[] | null;
    chiffres: LegislatureChiffresDTO | null;
    tendances: DeputesTendancesDTO | null;
    plusSerre: ScrutinPlusSerreDTO | null;
    fiche: HomeTabletFiche | null;
};

/** La donnée d'un Result réussi ; `null` en cas d'erreur (métier ou technique), journalisée. */
async function donnee<T>(lecture: () => Promise<Result<T, unknown>>): Promise<T | null> {
    try {
        const result = await lecture();
        return isOk(result) ? result.data : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Lit toutes les données de l'accueil pour la législature EN COURS (pas celle
 * du sélecteur), avec les mêmes use-cases et les mêmes clés de cache que les
 * routes API correspondantes : l'accueil et l'API partagent le cache serveur.
 */
export async function getHomeData(): Promise<HomeData> {
    const [legislature, legislatures] = await Promise.all([
        donnee(() => cachedResult(() => getCurrentLegislatureUseCase(prismaLegislaturesRepository), ["legislature-current"])),
        donnee(() => cachedResult(() => getAllLegislaturesUseCase(prismaLegislaturesRepository), ["legislatures-all"])),
    ]);

    const vide: HomeData = {
        legislature, legislatures,
        cards: null, derniers: null, groupes: null, chiffres: null, tendances: null, plusSerre: null, fiche: null,
    };
    if (!legislature) return vide;

    const numero = legislature.number;
    const n = String(numero);
    const aujourdhui = new Date().toISOString().slice(0, 10);
    const filtresDerniers = parseScrutinListFilters(numero, { pageSize: String(HOME_DERNIERS_VOTES) });

    const [cards, derniers, groupes, chiffres, tendances, plusSerre] = await Promise.all([
        donnee(() => cachedRead(() => getDeputesCardsSampleUseCase(prismaDeputesCardsRepository, numero), ["depute-cards-sample", n])),
        donnee(() => cachedResult(() => getScrutinsListUseCase(prismaScrutinListRepository, filtresDerniers), ["scrutins-list", JSON.stringify(filtresDerniers)])),
        donnee(() => cachedResult(() => getGroupeCardsUseCase(prismaGroupesCardsRepository, numero), ["groupe-cards", n])),
        donnee(() => cachedResult(() => getLegislatureChiffresUseCase(prismaLegislatureOrganisationRepository, numero, aujourdhui), ["legislature-chiffres", n, aujourdhui])),
        donnee(() => cachedResult(() => getDeputesTendancesUseCase(prismaDeputesTendancesRepository, numero), ["deputes-tendances", n])),
        donnee(() => cachedResult(() => getScrutinPlusSerreUseCase(prismaScrutinsPeriodeRepository, numero), ["scrutin-plus-serre", n])),
    ]);

    // Fiche miniature de la tablette : le député le plus assidu du mois, avec ses vraies données.
    const assidu = tendances?.assidu?.depute ?? null;
    let fiche: HomeTabletFiche | null = null;
    if (assidu) {
        const uid = assidu.deputeUID;
        const [stats, activite] = await Promise.all([
            donnee(() => cachedResult(() => getDeputeVoteStatsUseCase(prismaDeputeVoteStatsRepository, uid, numero), ["depute-vote-stats", uid, n])),
            donnee(() => cachedResult(() => getDeputeActivityUseCase(prismaDeputeActivityRepository, uid, numero), ["depute-activity", uid, n])),
        ]);
        fiche = stats && activite ? { depute: assidu, stats, activite } : null;
    }

    return { legislature, legislatures, cards, derniers, groupes, chiffres, tendances, plusSerre, fiche };
}
