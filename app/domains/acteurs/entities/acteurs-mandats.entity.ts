import {
    Acteurs,
    ActeursGroupes,
    GroupesParlementaires,
    Mandats,
    RefActeursPhotos, RefPartisPolitiques
} from "@/app/infrastructure/db/generated/prisma";

export type ActeurWithMandatsEntity = Acteurs & {
    mandats: Mandats[];
    photos: RefActeursPhotos[];
    groupes: (ActeursGroupes & {
        groupe: GroupesParlementaires & {
            partis: RefPartisPolitiques[];
        };
    })[];
};
