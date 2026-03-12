import {Acteurs, Mandats, RefActeursPhotos} from "@/app/infrastructure/db/generated/prisma";

export type ActeurWithMandatsEntity = Acteurs & {
    mandats: Mandats[];
    photos: RefActeursPhotos[];
};
