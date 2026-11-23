import React from "react";
import { ArrowUpRight, Armchair, CalendarDays, Grid3x3, Landmark, Layers, LucideIcon, Vote } from "lucide-react";
import { BentoGridLib, BentoTileLib, BentoTileLibProps } from "@/app/(ui)/component-library/molecules/bento/bento-lib";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import { AsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";

const nombre = (n: number) => n.toLocaleString("fr-FR");

export type ChiffreAssemblee = {
    valeur: number;
    libelle: string;
    /** Ce que la rubrique liée permet de faire (ou un complément sans lien). */
    detail: string;
    /** Rubrique du site que le chiffre ouvre ; chacune n'apparaît qu'une fois. */
    href?: string;
    icon: LucideIcon;
    /** Couleur de la tuile (palette des graphiques). */
    couleur: string;
    taille?: Pick<BentoTileLibProps, "colSpan">;
};

/**
 * Les chiffres de l'Assemblée pour la législature en cours (données réelles),
 * chacun porte d'entrée de sa rubrique : députés ayant siégé (DéputéDex),
 * sièges occupés = somme des effectifs des groupes (hémicycle), groupes,
 * scrutins, gouvernements (législatures), puis la durée, sans lien.
 */
export function chiffresAssemblee(chiffres: LegislatureChiffresDTO, groupes: GroupeCardDTO[]): ChiffreAssemblee[] {
    const siegesOccupes = groupes.reduce((total, g) => total + g.groupeCountMembers, 0);
    const nbGroupes = groupes.filter((g) => g.groupeCountMembers > 0).length;
    return [
        {
            valeur: chiffres.deputesAyantSiege, libelle: "députés ont siégé",
            detail: "La fiche de chaque député : mandat, groupe, votes et activité.",
            href: "/deputydex", icon: Grid3x3, couleur: "var(--chart-1)", taille: { colSpan: 2 },
        },
        ...(siegesOccupes > 0 ? [{
            valeur: siegesOccupes, libelle: "sièges occupés",
            detail: "L'hémicycle groupe par groupe, et la présidence au perchoir.",
            href: "/hemicycle", icon: Armchair, couleur: "var(--chart-2)",
        }] : []),
        ...(nbGroupes > 0 ? [{
            valeur: nbGroupes, libelle: nbGroupes > 1 ? "groupes politiques" : "groupe politique",
            detail: "Composition, poids et façon de voter de chaque groupe.",
            href: "/groupes", icon: Layers, couleur: "var(--chart-3)",
        }] : []),
        {
            valeur: chiffres.scrutins, libelle: "scrutins publics",
            detail: "Chaque vote : son résultat, la position de chaque groupe et de chaque député.",
            href: "/scrutins", icon: Vote, couleur: "var(--chart-4)",
        },
        {
            valeur: chiffres.gouvernements, libelle: chiffres.gouvernements > 1 ? "gouvernements" : "gouvernement",
            detail: "Qui gouvernait, qui présidait : la chronologie des institutions.",
            href: "/legislatures", icon: Landmark, couleur: "var(--chart-5)",
        },
        {
            valeur: chiffres.dureeJours, libelle: chiffres.fin ? "jours de législature" : "jours depuis le début",
            detail: chiffres.fin ? "Législature terminée." : "Et ça continue.",
            icon: CalendarDays, couleur: "var(--chart-6)", taille: { colSpan: 2 },
        },
    ];
}

/**
 * « L'Assemblée en chiffres » : grands chiffres colorés en grille bento, chacun
 * ouvrant sa rubrique (icône et couleur de la rubrique). Remplace l'ancienne
 * liste « Explorer » : mêmes destinations, sans doublon.
 */
export function HomeAssembleeChiffres({ numero, chiffres, groupes }: {
    numero: number;
    chiffres: AsyncData<LegislatureChiffresDTO>;
    groupes: GroupeCardDTO[];
}) {
    return (
        <section className="home-section" aria-labelledby="home-chiffres">
            <header className="home-section__header">
                <span className="home-section__kicker">Explorer · {libelleLegislature(numero)}</span>
                <h2 id="home-chiffres" className="home-section__title">L&apos;Assemblée en chiffres</h2>
                <p className="home-section__lead">Chaque chiffre ouvre sa rubrique.</p>
            </header>

            {chiffres.error ? (
                <ErrorStateLib message="Les chiffres de l'Assemblée n'ont pas pu être chargés." onRetry={chiffres.retry} />
            ) : (
                <BentoGridLib columns={4} rowMinHeight={170}>
                    {!chiffres.data
                        ? Array.from({ length: 6 }, (_, i) => <BentoTileLib key={i} colSpan={i === 0 || i === 5 ? 2 : 1} variant="solid" loading />)
                        : chiffresAssemblee(chiffres.data, groupes).map(({ valeur, libelle, detail, href, icon: Icon, couleur, taille }) => (
                            <BentoTileLib
                                key={libelle}
                                {...taille}
                                href={href}
                                variant="solid"
                                className="home-chiffre"
                                style={{ "--home-tile-color": couleur } as React.CSSProperties}
                            >
                                <span className="home-tile__icon home-chiffre__icone" aria-hidden="true"><Icon size={20} /></span>
                                {href && <ArrowUpRight className="home-actu__fleche" size={20} aria-hidden="true" />}
                                <span className="home-chiffre__valeur">{nombre(valeur)}</span>
                                <span className="home-chiffre__libelle">{libelle}</span>
                                <span className="home-chiffre__detail">{detail}</span>
                            </BentoTileLib>
                        ))}
                </BentoGridLib>
            )}
        </section>
    );
}
