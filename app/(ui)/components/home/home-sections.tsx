import React from "react";
import Link from "next/link";
import { ArrowRight, Armchair, Grid3x3, Landmark, Layers, LucideIcon, Vote } from "lucide-react";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import { AsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";
import { KEY_FIGURE_THEMES } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

const nombre = (n: number) => n.toLocaleString("fr-FR");

/** En-tête de section de l'accueil : sur-titre, titre, chapeau. */
function HomeSectionHeader({ id, kicker, title, lead }: { id: string; kicker: string; title: string; lead?: React.ReactNode }) {
    return (
        <header className="home-section__header">
            <span className="home-section__kicker">{kicker}</span>
            <h2 id={id} className="home-section__title">{title}</h2>
            {lead && <p className="home-section__lead">{lead}</p>}
        </header>
    );
}

/** Tuile cliquable : icône colorée, titre, texte. */
function HomeTile({ href, icon: Icon, title, text, color }: { href: string; icon: LucideIcon; title: string; text: string; color: string }) {
    return (
        <Link href={href} className="home-tile" style={{ "--home-tile-color": color } as React.CSSProperties}>
            <span className="home-tile__icon" aria-hidden="true"><Icon size={20} /></span>
            <span className="home-tile__title">{title}</span>
            <span className="home-tile__text">{text}</span>
        </Link>
    );
}

/** Chiffres clés de la législature en cours (lue en base, pas celle du sélecteur). */
export function HomeChiffres({ numero, chiffres }: { numero: number; chiffres: AsyncData<LegislatureChiffresDTO> }) {
    const titre = libelleLegislature(numero);
    return (
        <section className="home-section" aria-labelledby="home-chiffres">
            <HomeSectionHeader id="home-chiffres" kicker="En ce moment" title={`La ${titre} en chiffres`} />
            {chiffres.error ? (
                <ErrorStateLib message="Les chiffres de la législature n'ont pas pu être chargés." onRetry={chiffres.retry} />
            ) : !chiffres.data ? (
                <div className="flex justify-center py-8"><SpinnerLib /></div>
            ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <KpiCardLib kpiValue={nombre(chiffres.data.scrutins)} kpiLabel="scrutins publics" />
                    <KpiCardLib kpiValue={nombre(chiffres.data.deputesAyantSiege)} kpiLabel="députés ont siégé" />
                    <KpiCardLib kpiValue={nombre(chiffres.data.gouvernements)} kpiLabel={chiffres.data.gouvernements > 1 ? "gouvernements" : "gouvernement"} />
                    <KpiCardLib kpiValue={nombre(chiffres.data.dureeJours)} kpiLabel={chiffres.data.fin ? "jours" : "jours depuis son début"} />
                </div>
            )}
            <Link href="/legislatures" className="home-section__more">
                Chronologie, gouvernements et organigrammes <ArrowRight size={16} aria-hidden="true" />
            </Link>
        </section>
    );
}

export const HOME_EXPLORER: { href: string; icon: LucideIcon; title: string; text: string; color: string }[] = [
    { href: "/deputydex", icon: Grid3x3, title: "Les députés", text: "La fiche de chaque député : mandat, groupe, votes et activité.", color: "var(--chart-1)" },
    { href: "/hemicycle", icon: Armchair, title: "L'hémicycle", text: "Les 577 sièges, groupe par groupe, et la présidence au perchoir.", color: "var(--chart-2)" },
    { href: "/groupes", icon: Layers, title: "Les groupes", text: "Composition, poids et façon de voter de chaque groupe parlementaire.", color: "var(--chart-3)" },
    { href: "/scrutins", icon: Vote, title: "Les scrutins", text: "Chaque vote public : son résultat, et la position de chaque groupe et de chaque député.", color: "var(--chart-4)" },
    { href: "/legislatures", icon: Landmark, title: "Les législatures", text: "Qui gouvernait, qui présidait : la chronologie et l'organisation des institutions.", color: "var(--chart-5)" },
];

/** Les rubriques du site. */
export function HomeExplorer() {
    return (
        <section className="home-section" aria-labelledby="home-explorer">
            <HomeSectionHeader id="home-explorer" kicker="Explorer" title="Toute l'Assemblée, en quelques clics" />
            <div className="home-grid">
                {HOME_EXPLORER.map((item) => <HomeTile key={item.href} {...item} />)}
            </div>
        </section>
    );
}

/** Thèmes mis en avant sur l'accueil, dans cet ordre (seuls ceux qui ont du contenu sont montrés). */
export const HOME_THEMES_MIS_EN_AVANT = [
    "femmes-assemblee",
    "age-des-deputes",
    "cohesion-groupes",
    "proximite-entre-groupes",
    "participation-presence",
    "categories-socio-pro",
];

/** Thèmes « Chiffres clés » à montrer : ceux de la liste qui ont une page réelle. */
export function themesMisEnAvant() {
    const prets = KEY_FIGURE_THEMES.filter((t) => t.sections.length > 0);
    return {
        total: prets.length,
        themes: HOME_THEMES_MIS_EN_AVANT
            .map((slug) => prets.find((t) => t.slug === slug))
            .filter((t): t is (typeof prets)[number] => t !== undefined),
    };
}

/** Vitrine des statistiques : donner envie d'ouvrir les graphes. */
export function HomeStatistiques() {
    const { total, themes } = themesMisEnAvant();
    return (
        <section className="home-section home-section--stats" aria-labelledby="home-stats">
            <HomeSectionHeader
                id="home-stats"
                kicker="Statistiques"
                title="Des graphes pour comprendre l'Assemblée"
                lead={<>Qui sont les député·es, comment votent les groupes, qui vote avec qui : {total} thèmes expliqués en graphiques, et un mode avancé pour tout explorer, comparer deux législatures ou deux groupes, et exporter les données.</>}
            />
            <div className="home-grid">
                {themes.map((t, i) => (
                    <HomeTile
                        key={t.slug}
                        href={`/statistics/chiffres-cles/${t.slug}`}
                        icon={t.icon}
                        title={t.title}
                        text={t.teaser}
                        color={`var(--chart-${(i % 8) + 1})`}
                    />
                ))}
            </div>
            <div className="home-section__actions">
                <Link href="/statistics/chiffres-cles" className="home-section__more">
                    Tous les chiffres clés <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/statistics/avance" className="home-section__more">
                    Le mode avancé <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
