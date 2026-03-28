import {
    Acteurs,
    ActeursGroupes,
    GroupesParlementaires,
    Mandats,
    RefActeursPhotos, RefGroupes,
} from "@/app/infrastructure/db/generated/prisma";

export type ActeurWithMandatsEntity = Acteurs & {
    mandats: Mandats[];
    photos: RefActeursPhotos[];
    groupes: (ActeursGroupes & {
        groupe: GroupesParlementaires & {
            refGroupes: RefGroupes[];
        };
    })[];
};
