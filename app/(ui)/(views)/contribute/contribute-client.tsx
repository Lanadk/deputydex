"use client";

import React from "react";
import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {
    DifficultyGaugeLib,
    type DifficultyLevel
} from "@/app/(ui)/component-library/molecules/difficulty-gauge/difficulty-gauge-lib";
import {
    Bug,
    Lightbulb,
    GitPullRequest,
    Database,
    LayoutTemplate,
    ArrowRight,
    Download,
    FileCode2,
    DatabaseZap,
    BookMarked,
    Sparkles,
    BarChart3,
    CircleCheck,
    Boxes,
    ArrowLeftRight,
    Component,
    Timer,
    Table2,
    LayoutGrid,
    Hexagon,
    Workflow,
    Lock
} from "lucide-react";
import {FaGithub} from "react-icons/fa";

const ORG_URL = "https://github.com/Lanadk";
const FRONT_REPO_URL = `${ORG_URL}/deputydex`;
const DATA_REPO_URL = `${ORG_URL}/deputydex-data`;

type RepoCard = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    tagline: string;
    description: string;
    stack: string[];
    difficulty: DifficultyLevel;
    href: string;
};

const REPOS: RepoCard[] = [
    {
        icon: Database,
        name: "deputydex-data",
        tagline: "L’ETL — d’où viennent les chiffres",
        description:
            "Le pipeline qui va chercher les données publiques de l’Assemblée nationale, les nettoie, " +
            "les transforme et les recalcule en tables agrégées (stats par groupe, scrutins, votes…) " +
            "avant de les charger dans Postgres.",
        stack: ["Node.js", "SQL", "Postgres", "Open Data AN"],
        difficulty: 3,
        href: DATA_REPO_URL,
    },
    {
        icon: LayoutTemplate,
        name: "deputydex-front",
        tagline: "Ce repo — l’app, l’API, l’UI",
        description:
            "L’application Next.js que vous êtes en train de parcourir : les routes API, les cas d’usage " +
            "métier, et toute l’interface. Elle lit les données déjà calculées par l’ETL via Prisma.",
        stack: ["NextJS", "Prisma", "SQL", "Postgres", "Tailwind CSS"],
        difficulty: 3,
        href: FRONT_REPO_URL,
    },
];

type EtlTheme = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    description: string;
    difficulty: DifficultyLevel;
    path: string;
};

const ETL_THEMES: EtlTheme[] = [
    {
        icon: Download,
        name: "Téléchargement",
        description: "Récupère les archives XML/JSON de l’Assemblée nationale, par source et par législature.",
        difficulty: 2,
        path: "src/workflow/download",
    },
    {
        icon: FileCode2,
        name: "Parsing",
        description: "Transforme les XML/JSON bruts en JSON normalisé, domaine par domaine (acteurs, scrutins…).",
        difficulty: 3,
        path: "src/workflow/parser",
    },
    {
        icon: DatabaseZap,
        name: "Import",
        description: "Charge le JSON parsé en base, par étapes, jusqu’aux tables finales.",
        difficulty: 3,
        path: "src/workflow/import",
    },
    {
        icon: BookMarked,
        name: "Référentiels",
        description: "(Re)construit les tables de référence : groupes, types de scrutin, types d’organe…",
        difficulty: 2,
        path: "src/workflow/referentials",
    },
    {
        icon: Sparkles,
        name: "Enrichissement",
        description: "Complète des données déjà importées par jointure (ex. reconstitue l’historique des groupes d’un acteur depuis ses mandats).",
        difficulty: 2,
        path: "src/workflow/enrichment",
    },
    {
        icon: BarChart3,
        name: "Agrégation",
        description: "Calcule les statistiques consommées par le front : résultats par groupe, activité, calendrier…",
        difficulty: 4,
        path: "src/workflow/aggregat",
    },
];

type EtlArchitectureItem = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    description: string;
    difficulty: DifficultyLevel;
    href: string;
};

const ETL_ARCHITECTURE: EtlArchitectureItem[] = [
    {
        icon: Hexagon,
        name: "Découpage hexagonal léger",
        description: "Les workflows download et parser séparent la logique cœur de ses effets de bord et de son " +
            "point d’entrée CLI — une forme allégée de la même séparation contrat / implémentation que côté front.",
        difficulty: 2,
        href: `${DATA_REPO_URL}/tree/master/src/workflow/download`,
    },
    {
        icon: Workflow,
        name: "Moteur de pipeline",
        description: "Import, référentiels, enrichissement et agrégation tournent sur le même moteur générique, " +
            "qui exécute une série d’étapes en séquence jusqu’aux tables finales.",
        difficulty: 3,
        href: `${DATA_REPO_URL}/blob/master/src/workflow/_common/job/PipelineJob.ts`,
    },
    {
        icon: Lock,
        name: "Schéma & migrations Prisma",
        description: "Ce repo est l’unique propriétaire du schéma de base de données et de ses migrations. " +
            "Le front consomme le client généré, en lecture seule.",
        difficulty: 2,
        href: `${DATA_REPO_URL}/blob/master/prisma/schema.prisma`,
    },
];

type FrontArchitectureItem = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    description: string;
    difficulty: DifficultyLevel;
    href: string;
};

const FRONT_ARCHITECTURE: FrontArchitectureItem[] = [
    {
        icon: Boxes,
        name: "Clean Architecture (Hexagonale)",
        description: "Le socle de l’app : le domaine définit les contrats métier, l’infrastructure les implémente, " +
            "les routes API orchestrent l’entrée HTTP entre les deux.",
        difficulty: 2,
        href: `${FRONT_REPO_URL}/blob/main/app/1.CLEAN-ARCHI_server_side.md`,
    },
    {
        icon: Component,
        name: "Component Library (Atomic Design)",
        description: "Design system interne : des composants techniques génériques, assemblés en pages via des " +
            "templates.",
        difficulty: 3,
        href: `${FRONT_REPO_URL}/blob/main/app/3.COMPONENT-LIBRARY_client_side.md`,
    },
    {
        icon: LayoutGrid,
        name: "Sections config-driven",
        description: "Construit des pages entières depuis de la config : un registry associe chaque type de bloc " +
            "(chart, table, card…) à son composant de rendu.",
        difficulty: 4,
        href: `${FRONT_REPO_URL}/blob/main/app/4.CONFIG-DRIVEN_client_side.md`,
    },
    {
        icon: ArrowLeftRight,
        name: "Gateway Pattern (client-side)",
        description: "Chaque composant récupère ses données via un gateway fetch dédié, qui implémente le contrat " +
            "défini côté domaine.",
        difficulty: 2,
        href: `${FRONT_REPO_URL}/tree/main/app/(ui)/gateways`,
    },
    {
        icon: Table2,
        name: "Repositories & Prisma",
        description: "Les repositories combinent le client Prisma généré et des requêtes SQL écrites à la main sur " +
            "des tables agrégées.",
        difficulty: 3,
        href: `${FRONT_REPO_URL}/tree/main/app/infrastructure`,
    },
    {
        icon: Timer,
        name: "Stratégie de cache API",
        description: "Le cache des endpoints API est géré côté Route Handler.",
        difficulty: 2,
        href: `${FRONT_REPO_URL}/blob/main/app/5.API-CACHE-STRATEGY.md`,
    },
    {
        icon: CircleCheck,
        name: "Result Pattern",
        description: "Un fichier unique qui remplace les exceptions par un type Result explicite dans les use-cases.",
        difficulty: 1,
        href: `${FRONT_REPO_URL}/blob/main/app/2.RESULT-PATTERN_server_side.md`,
    },
];

type ContribWay = {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    description: string;
    href: string;
    cta: string;
};

const CONTRIB_WAYS: ContribWay[] = [
    {
        icon: Bug,
        title: "Signaler un bug",
        description: "Un chiffre qui semble faux, un comportement inattendu sur le site ? Ouvrez une issue détaillée.",
        href: `${FRONT_REPO_URL}/issues/new`,
        cta: "Ouvrir une issue",
    },
    {
        icon: Lightbulb,
        title: "Proposer une idée",
        description: "Une visualisation manquante, une donnée à croiser, une amélioration UX ? On est preneurs.",
        href: `${FRONT_REPO_URL}/issues/new`,
        cta: "Proposer une idée",
    },
    {
        icon: GitPullRequest,
        title: "Soumettre une PR",
        description: "Sur l’ETL ou sur le front : forkez le repo qui vous intéresse et ouvrez une pull request.",
        href: `${FRONT_REPO_URL}/pulls`,
        cta: "Voir les pull requests",
    },
];

export default function ContributeClient() {
    return (
        <BaseLayout>
            {/* HEADER */}
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Contribuer"
                    subtitle="Députédex est un projet open source, réparti sur deux dépôts. Curieux de savoir comment
                    les données sont calculées, ou envie de mettre les mains dans le code ? C’est par ici."
                />
            </div>

            <PageContentLib>
                <main className="flex flex-col gap-8">

                    {/* COMMENT CONTRIBUER */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Comment contribuer</div>
                        </div>

                        <div className="chart-lib__body grid grid-cols-1 md:grid-cols-3 gap-4">
                            {CONTRIB_WAYS.map((way) => (
                                <div
                                    key={way.title}
                                    className="bg-surface-1 border border-main rounded-lg p-4 flex flex-col gap-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <way.icon size={18} className="text-accent"/>
                                        <span className="font-semibold">{way.title}</span>
                                    </div>

                                    <p className="text-sm text-subtitle-accent flex-1">
                                        {way.description}
                                    </p>

                                    <a href={way.href} target="_blank" rel="noopener noreferrer" className="self-start">
                                        <ButtonLib text={way.cta} variant="tertiary" size="small"/>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* DEUX REPOS */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Deux dépôts, deux rôles</div>
                            <div className="chart-lib__subtitle">
                                L’ETL calcule les données, le front les affiche
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-4">
                            <p>
                                Si vous êtes développeur, voici comment le site est construit : le projet
                                est volontairement séparé en deux dépôts distincts, avec chacun sa
                                responsabilité propre :
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {REPOS.map((repo) => (
                                    <div
                                        key={repo.name}
                                        className="border border-main bg-surface-1 rounded-lg p-4 flex flex-col gap-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <repo.icon size={18} className="text-accent shrink-0"/>
                                                <span className="font-mono font-semibold truncate">{repo.name}</span>
                                            </div>
                                            <DifficultyGaugeLib level={repo.difficulty} size="small"/>
                                        </div>

                                        <div className="text-sm font-medium text-subtitle-accent">
                                            {repo.tagline}
                                        </div>

                                        <p className="text-sm text-subtitle-accent flex-1">
                                            {repo.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {repo.stack.map((tech) => (
                                                <BadgeLib key={tech} text={tech} variant="secondary"/>
                                            ))}
                                        </div>

                                        <a href={repo.href} target="_blank" rel="noopener noreferrer"
                                           className="self-start">
                                            <ButtonLib icon={FaGithub} text="Voir le repo" variant="tertiary"
                                                       size="small"/>
                                        </a>
                                    </div>
                                ))}
                            </div>

                            <p className="text-subtitle-accent text-sm flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 shrink-0"/>
                                Envie de comprendre comment un chiffre est obtenu ? Direction{" "}
                                <code>deputydex-data</code>. Envie d’améliorer une page ou une visualisation ?
                                Direction <code>deputydex-front</code>
                            </p>
                        </div>
                    </section>

                    {/* THEMES ETL */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Les grands thèmes du pipeline ETL</div>
                            <div className="chart-lib__subtitle">
                                Ce que fait l’ETL, étape par étape
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-4">
                            <p>
                                Le pipeline <code>deputydex-data</code> traverse plusieurs étapes, chacune isolée
                                dans son propre dossier. Voici de quoi elles parlent, et à quel point elles sont
                                corsées pour un premier contact — pas de quoi être découragé, chaque thème se
                                comprend indépendamment des autres.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ETL_THEMES.map((theme) => (
                                    <a
                                        key={theme.name}
                                        href={`${DATA_REPO_URL}/tree/master/${theme.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            <theme.icon size={16} className="text-accent shrink-0"/>
                                            <span className="font-semibold text-sm">{theme.name}</span>
                                        </div>

                                        <p className="text-sm text-subtitle-accent flex-1">
                                            {theme.description}
                                        </p>

                                        <DifficultyGaugeLib level={theme.difficulty} size="small"/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ARCHITECTURE ETL */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">L’architecture abordée (ETL)</div>
                            <div className="chart-lib__subtitle">
                                Les patterns techniques qui reviennent d’un workflow à l’autre
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ETL_ARCHITECTURE.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon size={16} className="text-accent shrink-0"/>
                                            <span className="font-semibold text-sm">{item.name}</span>
                                        </div>

                                        <p className="text-sm text-subtitle-accent flex-1">
                                            {item.description}
                                        </p>

                                        <DifficultyGaugeLib level={item.difficulty} size="small"/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ARCHITECTURE FRONT */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">L’architecture abordée (front)</div>
                            <div className="chart-lib__subtitle">
                                Les concepts techniques qui structurent le code
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {FRONT_ARCHITECTURE.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon size={16} className="text-accent shrink-0"/>
                                            <span className="font-semibold text-sm">{item.name}</span>
                                        </div>

                                        <p className="text-sm text-subtitle-accent flex-1">
                                            {item.description}
                                        </p>

                                        <DifficultyGaugeLib level={item.difficulty} size="small"/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                </main>
            </PageContentLib>
        </BaseLayout>
    );
}
