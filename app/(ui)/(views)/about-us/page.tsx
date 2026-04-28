"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

type TeamMember = {
    name: string;
    role: string;
    description?: string;
    image?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    email?: string;
};

const TEAM: TeamMember[] = [
    {
        name: "Ton nom",
        role: "Full-stack developer",
        description: "Description",
        image: "/images/team/toi.jpg",
        github: "https://github.com/Lanadk",
        website: "",
        email: "contact@contact.com",
    },
    {
        name: "Ton associé",
        role: "Full-stack developer",
        description: "Description",
        image: "/images/team/associe.jpg",
        email: "contact@contact.com",
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

                        <div className="chart-lib__body grid grid-cols-1 md:grid-cols-2 gap-6">
                            {TEAM.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-surface-1 p-5 rounded-lg border border-main flex flex-col gap-4"
                                >
                                    {/* TOP (PHOTO + INFOS) */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-main/10">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-sm text-subtitle-accent">
                                                    ?
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="font-semibold">{member.name}</div>
                                            <div className="text-sm text-subtitle-accent">
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>

                                    {/* DESC */}
                                    {member.description && (
                                        <p className="text-sm text-subtitle-accent">
                                            {member.description}
                                        </p>
                                    )}

                                    {/* LINKS ICONS */}
                                    <div className="flex items-center gap-4 pt-1">
                                        {member.github && (
                                            <a href={member.github} target="_blank">
                                                <Github className="w-5 h-5 hover:text-accent transition" />
                                            </a>
                                        )}

                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank">
                                                <Linkedin className="w-5 h-5 hover:text-accent transition" />
                                            </a>
                                        )}

                                        {member.website && (
                                            <a href={member.website} target="_blank">
                                                <Globe className="w-5 h-5 hover:text-accent transition" />
                                            </a>
                                        )}

                                        {member.email && (
                                            <a href={`mailto:${member.email}`}>
                                                <Mail className="w-5 h-5 hover:text-accent transition" />
                                            </a>
                                        )}
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