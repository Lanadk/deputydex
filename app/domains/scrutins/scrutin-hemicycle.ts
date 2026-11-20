import { ScrutinSiegeEntity } from "@/app/domains/scrutins/entities/scrutin-siege.entity";
import { ScrutinHemicycleDTO, ScrutinSiegeDTO, ScrutinSiegePosition } from "@/app/domains/scrutins/dto/scrutin-hemicycle.dto";
import { votePositionLabel } from "@/app/domains/scrutins/vote-position";

const POSITIONS: readonly ScrutinSiegePosition[] = ["pour", "contre", "abstention", "non_votant", "absent"];

function siegePosition(position: string | null): ScrutinSiegePosition {
    if (position === null) return "absent";
    return (POSITIONS as readonly string[]).includes(position) ? (position as ScrutinSiegePosition) : "non_votant";
}

/**
 * Hémicycle d'un scrutin, à partir des sièges réels des députés en mandat ce jour-là :
 *
 * - un siège par numéro : quand deux mandats se chevauchent sur le même siège
 *   (jour de renouvellement), on garde le député qui a voté, à défaut le premier par uid ;
 * - sièges rangés de la gauche vers la droite de la salle : dans la numérotation de l'AN,
 *   les numéros élevés sont à gauche ;
 * - un député sans vote enregistré est « absent ».
 */
export function buildScrutinHemicycle(entities: ScrutinSiegeEntity[]): ScrutinHemicycleDTO {
    const parPlace = new Map<number, ScrutinSiegeEntity>();
    for (const entity of entities) {
        const current = parPlace.get(entity.place);
        const prefere =
            !current ||
            (entity.position !== null && current.position === null) ||
            ((entity.position !== null) === (current.position !== null) && entity.depute_uid < current.depute_uid);
        if (prefere) parPlace.set(entity.place, entity);
    }

    const sieges: ScrutinSiegeDTO[] = [...parPlace.values()]
        .sort((a, b) => b.place - a.place)
        .map((e) => {
            const position = siegePosition(e.position);
            return {
                place: e.place,
                deputeUid: e.depute_uid,
                nomComplet: [e.prenom, e.nom].filter(Boolean).join(" ") || e.depute_uid,
                groupeCode: e.groupe_code,
                groupeLabel: e.groupe_label ?? e.groupe_code,
                position,
                positionLabel: position === "absent" ? "Absent" : votePositionLabel(position),
            };
        });

    const totaux = Object.fromEntries(POSITIONS.map((p) => [p, 0])) as Record<ScrutinSiegePosition, number>;
    for (const siege of sieges) totaux[siege.position]++;

    return { sieges, totaux };
}
