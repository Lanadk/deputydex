"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { AvatarLib } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { Mail, Globe } from "lucide-react";
import { FaGithub, FaGitlab, FaLinkedin } from "react-icons/fa";
import type { IconLibType } from "@/app/(ui)/component-library/types/icons.types";

type SocialLink = {
    icon: IconLibType;
    label: string;
    href: string;
};

type TeamMember = {
    name: string;
    role: string;
    description?: string;
    image?: string;
    links: SocialLink[];
};

const TEAM: TeamMember[] = [
    {
        name: "Ottman BECUWE",
        role: "Full-stack developer",
        description: "Développeur logiciel orienté backend et architecture, spécialisé dans la conception, " +
            "la maintenance et l’évolution d’applications Java et NodeJs. Sensible aux problématiques de fiabilité, " +
            "de performance et de qualité logicielle, avec une forte culture DevOps.",
        image: "/assets/imgs/team/toto.jpg",
        links: [
            { icon: FaGithub, label: "GitHub", href: "https://github.com/Lanadk" },
            { icon: FaGitlab, label: "GitLab", href: "https://gitlab.com/ottmanbecuwe" },
            { icon: Globe, label: "Site perso", href: "https://ottmanbecuwe.com" },
            { icon: Mail, label: "Email", href: "mailto:contact@ottmanbecuwe.com" },
        ],
    },
    {
        name: "Souheil NAOUEL",
        role: "Full-stack developer",
        description: "",
        image: "/assets/imgs/team/le_S.jpg",
        links: [
            { icon: FaGithub, label: "GitHub", href: "https://github.com/Syo-Nara" },
            { icon: FaLinkedin, label: "LinkedIn", href: "https://fr.linkedin.com/in/souheil-naouel-13795413b" },
        ],
    },
];

export default function AboutUsPage() {
    return (
        <BaseLayout>
            {/* HEADER */}
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="À propos"
                    subtitle="Découvrez le projet Députédex, sa mission et les personnes qui le construisent."
                />
            </div>

            <PageContentLib>
                <main className="flex flex-col gap-8">

                    {/* PROJET */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Le projet</div>
                            <div className="chart-lib__subtitle">
                                Une plateforme d’exploration des données parlementaires
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Députédex est une application permettant d’explorer, comprendre et analyser
                                les données publiques de l’Assemblée nationale.
                            </p>

                            <p>
                                Le projet vise à rendre accessibles des informations complexes (députés,
                                groupes politiques, scrutins, amendements) à travers une interface claire
                                et des visualisations interactives.
                            </p>

                            <p className="text-subtitle-accent">
                                Toutes les données proviennent de sources officielles et sont traitées via
                                une pipeline ETL dédiée.
                            </p>
                        </div>
                    </section>

                    {/* MISSION */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">Notre mission</div>
                            <div className="chart-lib__subtitle">
                                Neutralité et transparence des données publiques
                            </div>
                        </div>

                        <div className="chart-lib__body flex flex-col gap-3">
                            <p>
                                Députédex a pour objectif de rendre accessibles les données parlementaires
                                sans interprétation politique, biais éditorial ou filtrage implicite.
                            </p>

                            <p>
                                Nous visons une <span className="font-semibold">neutralité absolue</span> dans la
                                restitution des informations, en garantissant une transparence totale sur les
                                sources, les traitements et les transformations appliquées aux données.
                            </p>

                            <p className="text-subtitle-accent">
                                Chaque donnée affichée peut être retracée jusqu’à sa source officielle,
                                afin de permettre une compréhension claire et vérifiable.
                            </p>
                        </div>
                    </section>

                    {/* EQUIPE */}
                    <section className="chart-lib">
                        <div className="chart-lib__header">
                            <div className="chart-lib__title">L’équipe</div>
                        </div>

                        <div className="chart-lib__body grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6">
                            {TEAM.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-surface-1 p-5 rounded-lg border border-main flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4"
                                >
                                    {/* PHOTO */}
                                    <AvatarLib
                                        src={member.image}
                                        name={member.name}
                                        size="picture"
                                    />

                                    <div className="flex flex-col items-center sm:items-start gap-3 min-w-0">
                                        {/* INFOS */}
                                        <div>
                                            <div className="font-semibold">{member.name}</div>
                                            <div className="text-sm text-subtitle-accent">
                                                {member.role}
                                            </div>
                                        </div>

                                        {/* DESC */}
                                        {member.description && (
                                            <p className="text-sm text-subtitle-accent">
                                                {member.description}
                                            </p>
                                        )}

                                        {/* LIENS */}
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                                            {member.links.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.label}
                                                >
                                                    <ButtonLib
                                                        icon={link.icon}
                                                        variant="tertiary"
                                                        size="small"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </PageContentLib>
        </BaseLayout>
    );
}