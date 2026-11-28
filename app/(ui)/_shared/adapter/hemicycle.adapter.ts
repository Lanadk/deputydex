import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { PresidenceAssembleeDTO } from "@/app/domains/legislatures/dto/presidence-assemblee.dto";
import { compareGroupesGaucheDroite } from "@/app/domains/groupes/constants/groupe-ordre-hemicycle.constants";
import { getCanonicalGroupTheme, getGroupFullLabel } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { normalizeForSearch } from "@/app/_shared/utils/string";
import { HemicycleTooltipTheme } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";

/** Info-bulle d'un siège aux couleurs du groupe du député (thème « non-inscrits » à défaut). */
export function groupeTooltipTheme(groupeCode: string | null): HemicycleTooltipTheme {
    const theme = getCanonicalGroupTheme(groupeCode);
    return { background: `linear-gradient(135deg, ${theme.bg[0]}, ${theme.bg[1]})`, text: theme.text, border: theme.border };
}

export type HemicycleGroupe = {
    /** Code brut du groupe (ex: "LFI-NFP", "NI-17") — sert au filtre `/deputydex?groupe=`. */
    code: string;
    /** Libellé court affiché sur la légende et les cartes (ex: "LFI-NFP", "NI"). */
    shortLabel: string;
    /** Libellé complet, issu du front (`getGroupFullLabel`), à défaut celui de l'API. */
    label: string;
    count: number;
    /** Cartes des membres (`count` cartes) : un député par siège du groupe. */
    membres: DeputesCardDTO[];
    /** Ex: "Présidente du groupe : Mathilde Panot" — null si pas de présidence (NI). */
    presidence: string | null;
    presidentFullName: string | null;
    /** Carte du président·e parmi les membres du groupe (pour `DeputyCard`) — null si introuvable. */
    president: DeputesCardDTO | null;
    /** Ex: "Présidente du groupe" — affiché sous le nom sur la carte. */
    presidentRole: string | null;
};

/** Présidence de l'Assemblée, telle qu'affichée sur l'hémicycle : sa carte de député et son groupe (perchoir). */
export type HemicyclePerchoir = {
    presidence: PresidenceAssembleeDTO;
    /** Carte du député (affichée au survol du perchoir). */
    carte: DeputesCardDTO;
    /** Groupe du perchoir (couleur du siège). */
    groupeCode: string;
};

/** Libellé de la fonction, sous le nom sur la carte du perchoir. */
export const ROLE_PERCHOIR = "Présidence de l'Assemblée nationale";

/**
 * Retrouve la présidence parmi les cartes députés de la législature, pour placer
 * son siège au perchoir. Null sans présidence, ou si sa carte est introuvable ou
 * sans groupe : elle reste alors à sa place dans les rangées.
 */
export function buildHemicyclePerchoir(
    presidence: PresidenceAssembleeDTO | null,
    deputes: DeputesCardDTO[]
): HemicyclePerchoir | null {
    if (!presidence) return null;
    const carte = deputes.find((d) => d.deputeUID === presidence.uid);
    if (!carte?.deputeGroupeCode) return null;
    return { presidence, carte, groupeCode: carte.deputeGroupeCode };
}

function getShortLabel(code: string): string {
    return code === "NI" || code.startsWith("NI-") ? "NI" : code;
}

function getLabel(code: string, apiLabel: string | undefined): string {
    const frontLabel = getGroupFullLabel(code);
    if (frontLabel && frontLabel !== code) return frontLabel;
    return apiLabel || code;
}

/**
 * Compose les groupes affichés dans l'hémicycle à partir des deux routes
 * existantes :
 * - effectifs = cartes députés regroupées par code de groupe (même source que
 *   `/deputydex`, donc même total). Les cartes sans groupe (députés partis)
 *   ne siègent pas et sont ignorées ;
 * - présidence = cartes de groupe (`/api/groupes/cards`).
 *
 * Les groupes sans membre (ex: UDR, renommé en UDDPLR) n'apparaissent pas,
 * puisqu'aucune carte député ne les porte. Ordre : gauche → droite.
 */
export function buildHemicycleGroupes(
    deputes: DeputesCardDTO[],
    groupes: GroupeCardDTO[]
): HemicycleGroupe[] {
    const membersByCode = new Map<string, DeputesCardDTO[]>();
    for (const depute of deputes) {
        if (!depute.deputeGroupeCode) continue;
        const members = membersByCode.get(depute.deputeGroupeCode) ?? [];
        members.push(depute);
        membersByCode.set(depute.deputeGroupeCode, members);
    }

    const groupeByCode = new Map(groupes.map((g) => [g.groupeCode, g]));

    return [...membersByCode.entries()]
        .sort(([a], [b]) => compareGroupesGaucheDroite(a, b))
        .map(([code, members]) => {
            const groupe = groupeByCode.get(code);
            const presidentFullName = groupe?.groupePresidentFullName?.trim() || null;
            const president = presidentFullName
                ? members.find((m) => normalizeForSearch(m.deputeFullName) === normalizeForSearch(presidentFullName))
                : undefined;

            const presidentRole = presidentFullName
                ? `${groupe?.groupeQualitySexLabel || "Présidence du"} groupe`
                : null;

            return {
                code,
                shortLabel: getShortLabel(code),
                label: getLabel(code, groupe?.groupeLabel),
                count: members.length,
                membres: members,
                presidence: presidentRole ? `${presidentRole} : ${presidentFullName}` : null,
                presidentFullName,
                president: president ?? null,
                presidentRole,
            };
        });
}
