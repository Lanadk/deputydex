import React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { KEY_FIGURE_THEMES } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";
import { TypeStat, typeStatCouleur, typeStatEncre } from "@/app/(ui)/_shared/adapter/stat-type.adapter";

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

/** Tuile cliquable : icône dans une pastille teintée au « type » du thème (encre lisible), titre, texte. */
function HomeTile({ href, icon: Icon, title, text, type }: { href: string; icon: LucideIcon; title: string; text: string; type: TypeStat }) {
    return (
        <Link
            href={href}
            className="home-tile home-tile--type"
            style={{ "--home-tile-color": typeStatCouleur(type), "--home-tile-ink": typeStatEncre(type) } as React.CSSProperties}
        >
            <span className="home-tile__icon" aria-hidden="true"><Icon size={20} /></span>
            <span className="home-tile__title">{title}</span>
            <span className="home-tile__text">{text}</span>
        </Link>
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
                lead={<>Profil des député·es, positions de vote et proximités entre groupes : {total} thèmes expliqués en graphiques.</>}
            />
            <div className="home-grid">
                {themes.map((t) => (
                    <HomeTile
                        key={t.slug}
                        href={`/statistics/chiffres-cles/${t.slug}`}
                        icon={t.icon}
                        title={t.title}
                        text={t.teaser}
                        type={t.color}
                    />
                ))}
            </div>
            <Link href="/statistics/chiffres-cles" className="home-section__more">
                Tous les chiffres clés <ArrowRight size={16} aria-hidden="true" />
            </Link>
        </section>
    );
}
