import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { compareGroupesGaucheDroite } from "@/app/domains/groupes/constants/groupe-ordre-hemicycle.constants";
import { getGroupFullLabel } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { normalizeForSearch } from "@/app/_shared/utils/string";

export type HemicycleGroupe = {
    /** Code brut du groupe (ex: "LFI-NFP", "NI-17") — sert au filtre `/deputydex?groupe=`. */
    code: string;
    /** Libellé court affiché sur la légende et les cartes (ex: "LFI-NFP", "NI"). */
    shortLabel: string;
    /** Libellé complet, issu du front (`getGroupFullLabel`), à défaut celui de l'API. */
    label: string;
    count: number;
    /** Ex: "Présidente du groupe : Mathilde Panot" — null si pas de présidence (NI). */
    presidence: string | null;
    presidentFullName: string | null;
    /** Carte du président·e parmi les membres du groupe (pour `DeputyCard`) — null si introuvable. */
    president: DeputesCardDTO | null;
    /** Ex: "Présidente du groupe" — affiché sous le nom sur la carte. */
    presidentRole: string | null;
};

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
                presidence: presidentRole ? `${presidentRole} : ${presidentFullName}` : null,
                presidentFullName,
                president: president ?? null,
                presidentRole,
            };
        });
}
