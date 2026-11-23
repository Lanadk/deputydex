import React from "react";
import { ArrowRight, ArrowUpRight, Vote } from "lucide-react";
import { BentoGridLib, BentoTileLib, BentoTileLibProps } from "@/app/(ui)/component-library/molecules/bento/bento-lib";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import { AsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { scrutinResultatColor } from "@/app/(ui)/_shared/adapter/scrutin-resultat.adapter";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { DeputesTendancesDTO, DeputeTendanceDTO } from "@/app/domains/deputes/dto/deputes-tendances.dto";
import { ScrutinListPageDTO, ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { ScrutinPlusSerreDTO } from "@/app/domains/scrutins/dto/scrutin-plus-serre.dto";
import { capitalizeFirst } from "@/app/_shared/utils/string";
import {
    jourCourt,
    periodeCourte,
    phraseEcart,
    uniteAmendements,
    uniteAssidu,
    uniteRebelle,
} from "@/app/(ui)/components/home/home-mois.helpers";

const nombre = (n: number | null) => (n ?? 0).toLocaleString("fr-FR");
const titreScrutin = (s: ScrutinListItemDTO) => capitalizeFirst(s.titre ?? s.objet.libelle);
const verdict = (isAdopte: boolean) => (isAdopte ? "Adopté" : "Rejeté");

/**
 * Taille de chaque tuile (l'ordre des tuiles + ces tailles dessinent la grille),
 * et fond opaque (`solid`) pour toutes, sauf l'appel à l'action, pleine couleur.
 */
type Taille = Pick<BentoTileLibProps, "colSpan" | "rowSpan" | "variant">;
const TAILLES = {
    vote: { colSpan: 2, rowSpan: 2, variant: "solid" },
    serre: { colSpan: 2, variant: "solid" },
    assidu: { variant: "solid" },
    rebelle: { variant: "solid" },
    autres: { colSpan: 2, variant: "solid" },
    amendements: { variant: "solid" },
    cta: { variant: "accent" },
} as const satisfies Record<string, Taille>;

/** Tuile en erreur : message et « Réessayer » à la place de la tuile. */
const Erreur = ({ taille, message, onRetry }: { taille: Taille; message: string; onRetry: () => void }) => (
    <BentoTileLib {...taille} className="home-actu__erreur">
        <ErrorStateLib message={message} onRetry={onRetry} />
    </BentoTileLib>
);

/** Tuile sans donnée : son intitulé et un message. */
const Vide = ({ taille, label, message }: { taille: Taille; label: string; message: string }) => (
    <BentoTileLib {...taille}>
        <span className="home-actu__label">{label}</span>
        <span className="home-actu__vide">{message}</span>
    </BentoTileLib>
);

const Fleche = () => <ArrowUpRight className="home-actu__fleche" size={20} aria-hidden="true" />;

/** Barre pour / contre / abstention, proportionnelle aux voix. */
function BarreVotes({ s }: { s: ScrutinListItemDTO }) {
    const total = Math.max((s.pour ?? 0) + (s.contre ?? 0) + (s.abstentions ?? 0), 1);
    const part = (n: number | null) => `${((n ?? 0) / total) * 100}%`;
    return (
        <span className="home-actu__barre" aria-hidden="true">
            <span style={{ width: part(s.pour), background: "var(--vote-pour)" }} />
            <span style={{ width: part(s.contre), background: "var(--vote-contre)" }} />
            <span style={{ width: part(s.abstentions), background: "var(--vote-abstention)" }} />
        </span>
    );
}

/** Le dernier vote important, en grand. */
function VoteVedette({ s }: { s: ScrutinListItemDTO }) {
    return (
        <BentoTileLib {...TAILLES.vote} href={`/scrutins/${s.uid}`}>
            <span className="home-actu__label">Dernier vote important</span>
            <span className="home-actu__verdict" style={{ color: scrutinResultatColor(s.resultat.isAdopte) }}>
                {verdict(s.resultat.isAdopte)}
            </span>
            <span className="home-actu__vote-titre">{titreScrutin(s)}</span>
            <span className="home-actu__vote-bas">
                <BarreVotes s={s} />
                <span className="home-actu__decompte">
                    <span><strong style={{ color: "var(--vote-pour)" }}>{nombre(s.pour)}</strong> pour</span>
                    <span><strong style={{ color: "var(--vote-contre)" }}>{nombre(s.contre)}</strong> contre</span>
                    <span><strong style={{ color: "var(--vote-abstention)" }}>{nombre(s.abstentions)}</strong> abstentions</span>
                </span>
                <span className="home-actu__meta">
                    {s.date && <span>{jourCourt(s.date)}</span>}
                    <span className="home-actu__tag">{s.objet.libelle}</span>
                    {s.type.libelle && <span className="home-actu__tag">{capitalizeFirst(s.type.libelle)}</span>}
                </span>
            </span>
            <Fleche />
        </BentoTileLib>
    );
}

/** Les votes importants précédents, en liste compacte (chaque ligne est un lien). */
function VotesPrecedents({ items }: { items: ScrutinListItemDTO[] }) {
    return (
        <BentoTileLib {...TAILLES.autres}>
            <span className="home-actu__label">Juste avant</span>
            <ul className="home-actu__liste">
                {items.map((s) => (
                    <li key={s.uid}>
                        <a href={`/scrutins/${s.uid}`} className="home-actu__ligne">
                            <span className="home-actu__pastille" style={{ background: scrutinResultatColor(s.resultat.isAdopte) }} />
                            <span className="min-w-0">
                                <span className="home-actu__ligne-titre">{titreScrutin(s)}</span>
                                <span className="home-actu__ligne-meta">
                                    {verdict(s.resultat.isAdopte)}{s.date ? ` · ${jourCourt(s.date)}` : ""}
                                </span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </BentoTileLib>
    );
}

/** Le scrutin le plus serré : le score en très grand, et une balance pour / contre. */
function PlusSerre({ data }: { data: ScrutinPlusSerreDTO }) {
    const { scrutin: s, ecart } = data;
    if (!s || ecart === null) {
        return <Vide taille={TAILLES.serre} label="Le plus serré du mois" message="Aucun scrutin assez suivi sur la période." />;
    }
    const pour = s.pour ?? 0;
    const total = Math.max(pour + (s.contre ?? 0), 1);
    return (
        <BentoTileLib {...TAILLES.serre} href={`/scrutins/${s.uid}`}>
            <span className="home-actu__label">Le plus serré du mois</span>
            <span className="home-actu__score">
                <span style={{ color: "var(--vote-pour)" }}>{nombre(s.pour)}</span>
                <span className="home-actu__score-sep">–</span>
                <span style={{ color: "var(--vote-contre)" }}>{nombre(s.contre)}</span>
            </span>
            <span className="home-actu__balance" aria-hidden="true">
                <span style={{ width: `${(pour / total) * 100}%` }} />
            </span>
            <span className="home-actu__serre-verdict">{phraseEcart(s.resultat.isAdopte, ecart)}</span>
            <span className="home-actu__serre-titre">{titreScrutin(s)}</span>
            <Fleche />
        </BentoTileLib>
    );
}

/**
 * Un député en tête d'un classement, façon carte de joueur : portrait détouré
 * sur le dégradé de son groupe, grand chiffre, nom et groupe.
 */
function DeputeTile({ taille, label, record, unite }: { taille: Taille; label: string; record: DeputeTendanceDTO | null; unite: (valeur: number) => string }) {
    if (!record) return <Vide taille={taille} label={label} message="Pas de données sur la période." />;
    const { depute, valeur } = record;
    const theme = getGroupCardTheme(getCanonicalGroupCode(depute.deputeGroupeCode));
    return (
        <BentoTileLib
            {...taille}
            href={`/deputes/${depute.deputeUID}`}
            className="home-actu__depute"
            style={{ "--home-actu-g1": theme.bg[0], "--home-actu-g2": theme.bg[1] } as React.CSSProperties}
        >
            <span className="home-actu__portrait" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element -- photos servies telles quelles, comme sur les cartes */}
                {depute.deputeImage && <img src={depute.deputeImage} alt="" loading="lazy" />}
            </span>
            <span className="home-actu__depute-texte">
                <span className="home-actu__label">{label}</span>
                <span className="home-actu__chiffre">{nombre(valeur)}</span>
                <span className="home-actu__unite">{unite(valeur)}</span>
                <span className="home-actu__nom">{depute.deputeFullName}</span>
                <span className="home-actu__groupe">{depute.deputeGroupeCode}</span>
            </span>
        </BentoTileLib>
    );
}

type HomeMoisProps = {
    derniers: AsyncData<ScrutinListPageDTO>;
    tendances: AsyncData<DeputesTendancesDTO>;
    plusSerre: AsyncData<ScrutinPlusSerreDTO>;
};

/**
 * L'actu de l'Assemblée, sur les 30 jours qui finissent au dernier scrutin,
 * en grille bento (`BentoGridLib`) : le dernier vote important en grand, le
 * plus serré, les records des députés (assidu, rebelle, amendements), les votes
 * précédents. Chaque tuile gère son chargement (reflet) et son erreur (« Réessayer »).
 */
export function HomeMois({ derniers, tendances, plusSerre }: HomeMoisProps) {
    const periode = tendances.data?.periode ?? plusSerre.data?.periode ?? null;
    const t = tendances.data;
    const [vedette, ...precedents] = derniers.data?.items ?? [];

    const deputes = (taille: Taille, label: string, choix: (d: DeputesTendancesDTO) => DeputeTendanceDTO | null, unite: (v: number) => string) =>
        tendances.error ? <Erreur taille={taille} message="Indisponible pour l'instant." onRetry={tendances.retry} />
            : !t ? <BentoTileLib {...taille} loading />
                : <DeputeTile taille={taille} label={label} record={choix(t)} unite={unite} />;

    return (
        <section className="home-actu" aria-labelledby="home-actu-titre">
            <header className="home-actu__header">
                <span className="home-actu__live"><span className="home-actu__live-dot" aria-hidden="true" /> L&apos;actu de l&apos;Assemblée</span>
                <h2 id="home-actu-titre" className="home-actu__titre">Ce mois-ci à l&apos;Assemblée</h2>
                {periode && (
                    <p className="home-actu__periode">
                        {periodeCourte(periode)}
                        {t && t.scrutins > 0 && <> · {nombre(t.scrutins)} scrutins publics</>}
                    </p>
                )}
            </header>

            <BentoGridLib columns={4} fill>
                {derniers.error ? <Erreur taille={TAILLES.vote} message="Les derniers votes n'ont pas pu être chargés." onRetry={derniers.retry} />
                    : !derniers.data ? <BentoTileLib {...TAILLES.vote} loading />
                        : vedette ? <VoteVedette s={vedette} />
                            : <Vide taille={TAILLES.vote} label="Dernier vote important" message="Aucun scrutin important pour l'instant." />}

                {plusSerre.error ? <Erreur taille={TAILLES.serre} message="Indisponible pour l'instant." onRetry={plusSerre.retry} />
                    : !plusSerre.data ? <BentoTileLib {...TAILLES.serre} loading />
                        : <PlusSerre data={plusSerre.data} />}

                {deputes(TAILLES.assidu, "Le plus assidu", (d) => d.assidu, (v) => uniteAssidu(v, t?.scrutins ?? 0))}
                {deputes(TAILLES.rebelle, "Le rebelle du mois", (d) => d.rebelle, uniteRebelle)}

                {/* En erreur, la tuile du dernier vote affiche déjà « Réessayer » pour toute la liste. */}
                {derniers.error ? null
                    : !derniers.data ? <BentoTileLib {...TAILLES.autres} loading />
                        : precedents.length > 0 ? <VotesPrecedents items={precedents} />
                            : <Vide taille={TAILLES.autres} label="Juste avant" message="Pas d'autre vote important récent." />}

                {deputes(TAILLES.amendements, "Le plus d'amendements", (d) => d.amendements, uniteAmendements)}

                <BentoTileLib {...TAILLES.cta} href="/scrutins" className="home-actu__cta">
                    {/* Même icône que la rubrique Scrutins du menu, en grand, en décor. */}
                    <Vote className="home-actu__cta-logo" aria-hidden="true" strokeWidth={1.5} />
                    <span className="home-actu__cta-titre">Tous les scrutins</span>
                    <span className="home-actu__cta-texte">Chercher un vote, voir qui a voté quoi.</span>
                    <ArrowRight className="home-actu__cta-fleche" size={28} aria-hidden="true" />
                </BentoTileLib>
            </BentoGridLib>

            <p className="home-actu__note">
                Assiduité : scrutins publics où le député a voté pour, contre ou s&apos;est abstenu — elle ne mesure ni le
                travail en commission ni les missions hors de l&apos;hémicycle. Rebelle : vote exprimé différent de la
                position majoritaire de son groupe.
            </p>
        </section>
    );
}
