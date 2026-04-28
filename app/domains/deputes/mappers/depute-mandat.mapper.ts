import { DeputeMandatEntity } from "@/app/domains/deputes/entities/depute-mandat.entity";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";

function computeDureeAns(dateDebut: Date, dateFin: Date | null): number | null {
    const end = dateFin ?? new Date();
    const ms = end.getTime() - dateDebut.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
}

export function mapDeputeMandatEntityToDTO(entity: DeputeMandatEntity): DeputeMandatDTO {
    return {
        uid: entity.uid,
        typeOrgane: entity.type_organe,
        libQualite: entity.lib_qualite,
        dateDebut: entity.date_debut.toISOString(),
        dateFin: entity.date_fin?.toISOString() ?? null,
        organeUid: entity.organe_uid,
        legislature: entity.legislature,
        dureeAns: computeDureeAns(entity.date_debut, entity.date_fin),
    };
}

export function mapDeputeMandatsEntitiesToDTOs(entities: DeputeMandatEntity[]): DeputeMandatDTO[] {
    return entities.map(mapDeputeMandatEntityToDTO);
}
