"use client"

import { ExpandableCardItem, ExpandableCardLib } from "@/app/(ui)/component-library/molecules/expandable-card/expandable-card-lib";

const DEMO_ITEMS: ExpandableCardItem[] = [
    {
        id: "am-12",
        label: "n° I-12",
        group: "Projet de loi n° 324 · 1ère lecture AN",
        context: "Article 3",
        status: "Adopté",
        tone: "success",
        date: "15/10/2024",
        summary: "Cet amendement vise à relever le plafond de l'exonération prévue à l'article 3.",
        href: "https://www.assemblee-nationale.fr/",
    },
    {
        id: "am-40",
        label: "n° I-40",
        group: "Projet de loi n° 512 · Nouvelle lecture AN",
        context: "Après l'article 5",
        status: "Rejeté",
        date: "16/10/2024",
        summary: "Amendement d'appel sur le financement des collectivités.",
    },
];

const delay = <T,>(value: T, ms = 600) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const EXPANDABLE_CARD_CODE_DEFAULT = `<ExpandableCardLib
  title="Projet de loi de finances pour 2025"
  href="https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N50198"
  subtitle="Projet de loi de finances de l'année"
  badges={["Rapporteur pour avis · 1ère lecture AN"]}
  stats={[
    { label: "déposés", value: 65 },
    { label: "adoptés", value: 15 },
    { label: "co-signés", value: 2375 },
  ]}
  itemsLabel="Amendements déposés"
  // Les éléments consécutifs de même \`group\` sont réunis sous un titre (ici : un par texte)
  loadItems={() => gateway.getItems()}
/>`;

export const EXPANDABLE_CARD_CODE_EMPTY = `<ExpandableCardLib
  title="Proposition de loi visant à …"
  stats={[{ label: "co-signés", value: 12 }]}
  itemsLabel="Amendements déposés"
  emptyLabel="Aucun amendement déposé par ce député sur ce dossier."
  loadItems={async () => []}
/>`;

export const EXPANDABLE_CARD_CODE_ERROR = `<ExpandableCardLib
  title="Dossier indisponible"
  itemsLabel="Amendements déposés"
  loadItems={() => Promise.reject(new Error("réseau"))}
/>`;

export const getExpandableCardSections = () => [
    {
        title: "Par défaut (détail chargé au dépliage, groupé par texte)",
        code: EXPANDABLE_CARD_CODE_DEFAULT,
        component: (
            <ExpandableCardLib
                title="Projet de loi de finances pour 2025"
                href="https://www.assemblee-nationale.fr/"
                subtitle="Projet de loi de finances de l'année"
                badges={["Rapporteur pour avis · 1ère lecture AN"]}
                stats={[
                    { label: "déposés", value: 65 },
                    { label: "adoptés", value: 15 },
                    { label: "co-signés", value: 2375 },
                ]}
                itemsLabel="Amendements déposés"
                loadItems={() => delay(DEMO_ITEMS)}
            />
        ),
    },
    {
        title: "Détail vide",
        code: EXPANDABLE_CARD_CODE_EMPTY,
        component: (
            <ExpandableCardLib
                title="Proposition de loi visant à …"
                stats={[{ label: "co-signés", value: 12 }]}
                itemsLabel="Amendements déposés"
                emptyLabel="Aucun amendement déposé par ce député sur ce dossier."
                loadItems={() => delay<ExpandableCardItem[]>([])}
            />
        ),
    },
    {
        title: "Erreur de chargement",
        code: EXPANDABLE_CARD_CODE_ERROR,
        component: (
            <ExpandableCardLib
                title="Dossier indisponible"
                itemsLabel="Amendements déposés"
                loadItems={() => delay(null).then(() => Promise.reject(new Error("réseau")))}
            />
        ),
    },
];
