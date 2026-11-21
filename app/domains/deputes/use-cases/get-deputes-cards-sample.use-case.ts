import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputesCardsRepository } from "@/app/domains/deputes/repositories/IDeputesCardsRepository";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { mapDeputesCardsToDTOs } from "@/app/domains/deputes/mappers/deputes-cards.mapper";

/** Taille par défaut : le mur de l'accueil fait 7 colonnes × 8 cartes. */
export const DEPUTES_CARDS_SAMPLE_SIZE = 56;

/** Hash FNV-1a 32 bits : stable, sans dépendance, suffisant pour un tirage déterministe. */
function hash(value: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

/**
 * Échantillon représentatif des cartes : chaque groupe reçoit un nombre de
 * cartes proportionnel à son effectif (méthode du plus fort reste), puis on
 * garde dans chaque groupe les députés au plus petit hash.
 *
 * Le tirage est DÉTERMINISTE (hash de `seed:uid`) : la même législature
 * donne toujours le même échantillon, même sans cache serveur actif. L'ordre
 * de sortie suit aussi le hash, pour mélanger les groupes sur le mur.
 *
 * Les cartes sans groupe (députés ayant quitté l'Assemblée) sont exclues.
 */
export function sampleDeputesCards(
    cards: DeputesCardDTO[],
    size: number,
    seed: string
): DeputesCardDTO[] {
    const eligible = cards.filter((c) => c.deputeGroupeCode);
    if (size <= 0 || eligible.length === 0) return [];
    if (eligible.length <= size) return sortByHash(eligible, seed);

    const byGroupe = new Map<string, DeputesCardDTO[]>();
    for (const card of eligible) {
        const list = byGroupe.get(card.deputeGroupeCode) ?? [];
        list.push(card);
        byGroupe.set(card.deputeGroupeCode, list);
    }

    const quotas = [...byGroupe.entries()].map(([code, list]) => {
        const exact = (size * list.length) / eligible.length;
        return { code, list, take: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });

    let missing = size - quotas.reduce((sum, q) => sum + q.take, 0);
    const byRemainder = [...quotas].sort(
        (a, b) => b.remainder - a.remainder || a.code.localeCompare(b.code)
    );
    for (const q of byRemainder) {
        if (missing === 0) break;
        q.take += 1;
        missing -= 1;
    }

    const picked = quotas.flatMap((q) => sortByHash(q.list, seed).slice(0, q.take));
    return sortByHash(picked, `${seed}:order`);
}

function sortByHash(cards: DeputesCardDTO[], seed: string): DeputesCardDTO[] {
    return [...cards].sort(
        (a, b) => hash(`${seed}:${a.deputeUID}`) - hash(`${seed}:${b.deputeUID}`)
    );
}

export async function getDeputesCardsSampleUseCase(
    repository: IDeputesCardsRepository,
    legislature: number,
    size: number = DEPUTES_CARDS_SAMPLE_SIZE
): Promise<Result<DeputesCardDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeCards(legislature);
        return ok(sampleDeputesCards(mapDeputesCardsToDTOs(entities), size, String(legislature)));
    } catch {
        return err("ERROR");
    }
}
