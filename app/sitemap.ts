import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/_shared/seo/seo.config";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import { getGroupeCardsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import { prismaGroupesCardsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { KEY_FIGURE_THEMES } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/deputydex`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/groupes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/statistics`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/statistics/chiffres-cles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/statistics/avance`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/data-sources`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contribute`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/donations`, changeFrequency: "monthly", priority: 0.3 },
];

/**
 * Une entrée par thème "Chiffres clés" ayant du contenu réel
 * (`theme.sections.length > 0`) — un thème encore vide affiche juste
 * "Bientôt disponible" (voir `[theme]/theme-page-client.tsx`), pas assez de
 * contenu pour justifier une indexation. Dérivé de `KEY_FIGURE_THEMES`
 * plutôt que listé en dur : un thème qui gagne son contenu apparaît ici
 * automatiquement, sans y penser.
 */
function getChiffresClesRoutes(): MetadataRoute.Sitemap {
    return KEY_FIGURE_THEMES.filter((theme) => theme.sections.length > 0).map((theme) => ({
        url: `${SITE_URL}/statistics/chiffres-cles/${theme.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));
}

async function getGroupeRoutes(): Promise<MetadataRoute.Sitemap> {
    try {
        const legislatureResult = await getCurrentLegislatureUseCase(prismaLegislaturesRepository);
        if (!isOk(legislatureResult)) return [];

        const cardsResult = await getGroupeCardsUseCase(
            prismaGroupesCardsRepository,
            legislatureResult.data.number
        );
        if (!isOk(cardsResult)) return [];

        return cardsResult.data.map((groupe) => ({
            url: `${SITE_URL}/groupes/${groupe.groupeCode}`,
            changeFrequency: "daily" as const,
            priority: 0.6,
        }));
    } catch (e) {
        // Le sitemap ne doit jamais faire échouer le build si la DB est injoignable.
        console.error("sitemap: failed to fetch groupe routes", e);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const groupeRoutes = await getGroupeRoutes();
    return [...STATIC_ROUTES, ...getChiffresClesRoutes(), ...groupeRoutes];
}
