"use client";

import React from "react";
import { Copyright, UserRound, Server, ShieldCheck, Database, Lock, Scale } from "lucide-react";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { AnchorLayout } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import { AnchorSectionBlockLib } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-block-lib";
import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

const CURRENT_YEAR = new Date().getFullYear();

const MENTIONS_LEGALES_SECTIONS: AnchorSection[] = [
    { id: "copyright", label: "Copyright", icon: Copyright },
    { id: "editeur", label: "Éditeur", icon: UserRound },
    { id: "hebergement", label: "Hébergement", icon: Server },
    { id: "propriete-intellectuelle", label: "Propriété intellectuelle", icon: ShieldCheck },
    { id: "licence-donnees", label: "Licence des données", icon: Database },
    { id: "donnees-personnelles", label: "Données personnelles", icon: Lock },
    { id: "responsabilite", label: "Responsabilité", icon: Scale },
];

export default function MentionsLegalesClient() {
    return (
        <AnchorLayout
            sections={MENTIONS_LEGALES_SECTIONS}
            navLabel="Sommaire"
            header={
                <div className="mb-8 border-b border-main pb-6 flex flex-col gap-4">
                    <PageHeaderLib
                        title="Mentions légales"
                        subtitle="Éditeur, hébergement, propriété intellectuelle, licence des données et gestion des données personnelles."
                    />
                </div>
            }
        >
            <div className="flex flex-col gap-10">

                {/* COPYRIGHT */}
                <AnchorSectionBlockLib id="copyright" title="Copyright" icon={Copyright} cols={1}>
                    <div className="flex flex-col gap-3">
                        <p>
                            © {CURRENT_YEAR} Députédex. Sauf mention contraire, l’interface, les visuels,
                            les textes et le code source du site sont la propriété de leurs auteurs et ne
                            peuvent être reproduits sans autorisation préalable.
                        </p>
                        <p className="text-subtitle-accent">
                            Les données parlementaires affichées ne sont pas concernées par ce copyright :
                            voir la section « Licence des données » ci-dessous.
                        </p>
                    </div>
                </AnchorSectionBlockLib>

                {/* EDITEUR */}
                <AnchorSectionBlockLib
                    id="editeur"
                    title="Éditeur du site"
                    description="Projet personnel"
                    icon={UserRound}
                    cols={2}
                >
                    <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                        <div className="font-semibold">Qui édite le site</div>
                        <p className="text-sm text-subtitle-accent">
                            Députédex est édité à titre non professionnel par Ottman BECUWE et Souheil NAOUEL.
                        </p>
                        <p className="text-sm text-subtitle-accent">
                            Directeur de la publication : Ottman BECUWE.
                        </p>
                    </div>

                    <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                        <div className="font-semibold">Contact &amp; anonymat</div>
                        <p className="text-sm text-subtitle-accent">
                            Contact :{" "}
                            <a
                                href="mailto:contact@ottmanbecuwe.com"
                                className="text-accent hover:underline"
                            >
                                contact@ottmanbecuwe.com
                            </a>
                        </p>
                        <p className="text-sm text-subtitle-accent">
                            Conformément à l’article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour
                            la confiance dans l’économie numérique, les éditeurs de ce site à titre non
                            professionnel ont communiqué leurs éléments d’identification personnelle à
                            l’hébergeur mentionné ci-dessous.
                        </p>
                    </div>
                </AnchorSectionBlockLib>

                {/* HEBERGEMENT */}
                <AnchorSectionBlockLib id="hebergement" title="Hébergement" icon={Server} cols={1}>
                    <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2 max-w-md">
                        <div className="font-semibold">OVHcloud (OVH SAS)</div>
                        <p className="text-sm text-subtitle-accent">
                            2 rue Kellermann, 59100 Roubaix, France
                        </p>
                        <p className="text-sm text-subtitle-accent">
                            Téléphone : 09 72 10 10 07 (numéro non surtaxé, également joignable au 1007
                            depuis la France).
                        </p>
                        <a
                            href="https://www.ovhcloud.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline text-sm"
                        >
                            ovhcloud.com
                        </a>
                    </div>
                </AnchorSectionBlockLib>

                {/* PROPRIETE INTELLECTUELLE */}
                <AnchorSectionBlockLib id="propriete-intellectuelle" title="Propriété intellectuelle" icon={ShieldCheck} cols={1}>
                    <div className="flex flex-col gap-3">
                        <p>
                            Le code source, la charte graphique, les composants d’interface et les
                            contenus éditoriaux propres à Députédex (hors données parlementaires) sont
                            protégés au titre du droit d’auteur et restent la propriété exclusive de
                            leurs auteurs. Toute reproduction, représentation ou réutilisation, totale
                            ou partielle, est interdite sans autorisation préalable.
                        </p>
                        <p>
                            Les marques, logos et le nom « Députédex » ne peuvent être utilisés sans
                            accord préalable des auteurs.
                        </p>
                    </div>
                </AnchorSectionBlockLib>

                {/* LICENCE DES DONNEES */}
                <AnchorSectionBlockLib
                    id="licence-donnees"
                    title="Licence des données"
                    description="Réutilisation des données publiques de l’Assemblée nationale"
                    icon={Database}
                    cols={1}
                >
                    <div className="flex flex-col gap-3">
                        <p>
                            Les données parlementaires affichées sur Députédex (députés, groupes,
                            mandats, scrutins, votes) proviennent de l’open data officiel de
                            l’Assemblée nationale, mis à disposition sous{" "}
                            <a
                                href="https://www.etalab.gouv.fr/licence-ouverte-open-licence/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                            >
                                Licence Ouverte / Open Licence (Etalab)
                            </a>. Elles restent librement réutilisables dans les conditions fixées par
                            cette licence, indépendamment du copyright applicable au site lui-même.
                        </p>
                        <p className="text-subtitle-accent">
                            Voir la page{" "}
                            <a href="/data-sources" className="text-accent hover:underline">
                                Sources de données
                            </a>{" "}
                            pour le détail des jeux de données utilisés.
                        </p>
                    </div>
                </AnchorSectionBlockLib>

                {/* DONNEES PERSONNELLES */}
                <AnchorSectionBlockLib id="donnees-personnelles" title="Données personnelles & cookies" icon={Lock} cols={2}>
                    <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                        <div className="font-semibold">Cookies &amp; traceurs</div>
                        <p className="text-sm text-subtitle-accent">
                            Députédex ne dépose aucun cookie de suivi ou de mesure d’audience et n’exploite
                            aucun outil de tracking publicitaire. Seule votre préférence d’affichage
                            (thème clair, sombre ou accessible) est mémorisée localement dans votre
                            navigateur (stockage local), sans transmission à un serveur tiers.
                        </p>
                    </div>

                    <div className="border border-main bg-surface-1 p-4 rounded-lg flex flex-col gap-2">
                        <div className="font-semibold">Données des député(e)s &amp; groupes</div>
                        <p className="text-sm text-subtitle-accent">
                            Les seules données à caractère personnel traitées par le site sont celles,
                            déjà publiques, relatives aux mandats des député(e)s de l’Assemblée nationale,
                            issues des sources listées ci-dessus.
                        </p>
                        <p className="text-sm text-subtitle-accent">
                            Ce traitement (identité, mandat, appartenance à un groupe politique) repose
                            sur l’intérêt légitime des éditeurs à assurer l’information et la transparence
                            de la vie parlementaire (article 6.1.f du RGPD), à partir de données déjà
                            rendues publiques par l’Assemblée nationale elle-même. Ces données sont
                            conservées le temps de leur pertinence informative, en cohérence avec leur
                            disponibilité dans les sources ouvertes citées ci-dessus, et ne font l’objet
                            d’aucune réutilisation à des fins commerciales ni d’aucune cession à des tiers.
                        </p>
                        <p className="text-sm text-subtitle-accent">
                            Toute personne concernée dispose, dans les conditions prévues par le RGPD,
                            d’un droit d’accès, de rectification et d’opposition sur les données la
                            concernant, qu’elle peut exercer auprès des éditeurs à l’adresse de contact
                            indiquée ci-dessus. Elle dispose également du droit d’introduire une
                            réclamation auprès de la Commission Nationale de l’Informatique et des
                            Libertés (CNIL).
                        </p>
                    </div>
                </AnchorSectionBlockLib>

                {/* RESPONSABILITE */}
                <AnchorSectionBlockLib id="responsabilite" title="Responsabilité" icon={Scale} cols={1}>
                    <div className="flex flex-col gap-3">
                        <p>
                            Députédex est un projet indépendant, développé à titre personnel, et n’est
                            affilié ni à l’Assemblée nationale ni à aucun parti ou groupe politique. Les
                            contenus sont fournis à titre informatif, sans garantie d’exhaustivité ou
                            d’absence d’erreur, et ne sauraient engager la responsabilité de leurs auteurs.
                        </p>
                        <p className="text-subtitle-accent">
                            En cas d’erreur constatée sur une donnée affichée, merci de la signaler via
                            l’adresse de contact indiquée ci-dessus.
                        </p>
                    </div>
                </AnchorSectionBlockLib>

            </div>
        </AnchorLayout>
    );
}
