"use client"

import { ArenaBadgeLib } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib";
import {
    ARENA_BADGE_VARIANTS,
    ArenaBadgeVariant,
} from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.variants";

// Proposition de succès pour les députés (POC) : règles à valider et à
// calculer côté deputydex-data avant tout branchement sur les fiches.
export const DEPUTY_ACHIEVEMENTS_PROPOSAL: { variant: ArenaBadgeVariant; label: string; rule: string }[] = [
    { variant: 'hemicycle', label: "Pilier de l'hémicycle", rule: 'A participé à plus de 90 % des scrutins publics de la législature.' },
    { variant: 'eclair', label: 'Frondeur', rule: "A voté contre la position majoritaire de son groupe sur au moins 50 scrutins." },
    { variant: 'bouclier', label: 'Fidèle au groupe', rule: 'A suivi la position majoritaire de son groupe dans 99 % de ses votes.' },
    { variant: 'etoile', label: 'Voix décisive', rule: "A voté sur un scrutin tranché à moins de 5 voix d'écart, du côté du résultat." },
    { variant: 'feuille', label: 'Plume législative', rule: 'A déposé plus de 100 amendements.' },
    { variant: 'octogone', label: 'Vétéran', rule: 'A siégé dans au moins 3 législatures.' },
    { variant: 'engrenage', label: 'Rouage', rule: 'A contribué à 10 dossiers ou plus (auteur, rapporteur…).' },
    { variant: 'lune', label: 'Noctambule', rule: 'A voté lors de 20 scrutins tenus après minuit.' },
    { variant: 'cristal', label: 'Rapporteur', rule: "A été rapporteur d'un texte adopté définitivement." },
];

export const ARENA_BADGE_CODE_VARIANTS = ARENA_BADGE_VARIANTS
    .map((variant) => `<ArenaBadgeLib variant="${variant}" />`)
    .join('\n');

export const ARENA_BADGE_CODE_ACHIEVEMENTS = `<ArenaBadgeLib variant="eclair" label="Frondeur" />
<ArenaBadgeLib variant="octogone" label="Vétéran" />`;

export const ARENA_BADGE_CODE_SIZES = `<ArenaBadgeLib variant="etoile" size={48} hideLabel />
<ArenaBadgeLib variant="etoile" size={96} hideLabel />
<ArenaBadgeLib variant="etoile" size={144} hideLabel />`;

export const ARENA_BADGE_CODE_LOCKED = `<ArenaBadgeLib variant="hemicycle" label="Pilier de l'hémicycle" />
<ArenaBadgeLib variant="lune" label="Noctambule" locked />`;

export const ARENA_BADGE_CODE_CASE = `<div className="arena-badge-case">
  <ArenaBadgeLib variant="hemicycle" size={56} hideLabel />
  <ArenaBadgeLib variant="eclair" size={56} hideLabel />
  <ArenaBadgeLib variant="bouclier" size={56} hideLabel locked />
  …
</div>`;

const EARNED: ArenaBadgeVariant[] = ['hemicycle', 'eclair', 'feuille', 'octogone', 'cristal'];

export const getArenaBadgeSections = () => [
    {
        title: "Badges d'arène — les 9 variants",
        code: ARENA_BADGE_CODE_VARIANTS,
        component: (
            <div className="flex flex-wrap gap-6">
                {ARENA_BADGE_VARIANTS.map((variant) => (
                    <ArenaBadgeLib key={variant} variant={variant} />
                ))}
            </div>
        ),
    },
    {
        title: "Badges d'arène — succès des députés (proposition)",
        code: ARENA_BADGE_CODE_ACHIEVEMENTS,
        component: (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEPUTY_ACHIEVEMENTS_PROPOSAL.map(({ variant, label, rule }) => (
                    <li key={variant} className="flex items-center gap-4">
                        <ArenaBadgeLib variant={variant} label={label} size={72} hideLabel />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rule}</p>
                        </div>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        title: "Badges d'arène — tailles",
        code: ARENA_BADGE_CODE_SIZES,
        component: (
            <div className="flex items-end gap-6">
                <ArenaBadgeLib variant="etoile" size={48} hideLabel />
                <ArenaBadgeLib variant="etoile" size={96} hideLabel />
                <ArenaBadgeLib variant="etoile" size={144} hideLabel />
            </div>
        ),
    },
    {
        title: "Badges d'arène — obtenu / non obtenu",
        code: ARENA_BADGE_CODE_LOCKED,
        component: (
            <div className="flex gap-6">
                <ArenaBadgeLib variant="hemicycle" label="Pilier de l'hémicycle" />
                <ArenaBadgeLib variant="lune" label="Noctambule" locked />
            </div>
        ),
    },
    {
        title: "Badges d'arène — étui d'un député",
        code: ARENA_BADGE_CODE_CASE,
        component: (
            <div className="arena-badge-case">
                {ARENA_BADGE_VARIANTS.map((variant) => (
                    <ArenaBadgeLib
                        key={variant}
                        variant={variant}
                        size={56}
                        hideLabel
                        locked={!EARNED.includes(variant)}
                    />
                ))}
            </div>
        ),
    },
];
