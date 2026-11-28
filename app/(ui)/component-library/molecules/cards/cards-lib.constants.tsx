import {KpiCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import {KpiBarCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-bar-card/kpi-bar-card-lib";
import {SummaryListCardLib} from "@/app/(ui)/component-library/molecules/cards/summary-list-card/summary-list-card";
import {ScoreCardLib} from "@/app/(ui)/component-library/molecules/cards/score-card/score-card-lib";
import {ScoreBreakdownCardLib} from "@/app/(ui)/component-library/molecules/cards/score-breakdown-card/score-breakdown-card-lib";

const KPI_CODE_SIMPLE_USAGE = `<KpiCardLib
    kpiValue="88"
    kpiLabel="membres"
/>`

const KPI_CODE_SMALL_USAGE = `<KpiCardLib
    size="sm"
    kpiValue="Cadres de la fonction publique, professions intellectuelles et artistiques"
    kpiLabel="catégorie"
/>`

const KPI_BAR_CARD_SIMPLE_USAGE = `<KpiBarCardLib
    title='Parité'
    items={[
        { label: 'Femmes', value: 50},
        { label: 'Hommes', value: 50},
    ]}
    maxValue={100}
/>`

const KPI_BAR_CARD_FOOTER_USAGE = `<KpiBarCardLib
    title='Parité'
    items={[
        { label: 'Femmes', value: 50},
        { label: 'Hommes', value: 50},
    ]}
    maxValue={100}
    footer='Donnée du 09/10/2022'
    showFooterDivider={true}
/>`

const SCORE_CARD_USAGE = `<ScoreCardLib
    title="Score"
    score={59}
    verdict="Dans la moyenne"
    caption="Mieux que 64 % des députés de la législature"
    badge="Aperçu"
/>`

const SCORE_BREAKDOWN_CARD_USAGE = `<ScoreBreakdownCardLib
    title="Détail du score"
    items={[
        { label: "Présence", description: "Jours présents parmi les jours attendus.", poids: 30, score: 72 },
        { label: "Participation aux votes", poids: 25, score: 58 },
        { label: "Interventions en séance", poids: 15, score: null },
    ]}
    footer="Chaque composante apporte poids × sous-score ÷ 100 points."
/>`

const SUMMARY_LIST_CARD_SIMPLE_USAGE = `<SummaryListCardLib
    title="Députés"
    items={[
        { label: "Femmes", value: 25 },
        { label: "Hommes", value: 25 },
    ]}
/>`

const SUMMARY_LIST_CARD_BADGE_USAGE = `<SummaryListCardLib
    title="Derniers votes"
    items={[
        { label: "Projet de loi de finances — vote solennel", badge: { text: "Pour", variant: "primary" } },
        { label: "Motion de censure", badge: { text: "Contre", variant: "secondary" } },
        { label: "Amendement n° 119", badge: { text: "Abstention", variant: "tertiary" } },
        { label: "Texte avec lien", href: "https://www.assemblee-nationale.fr", badge: { text: "Pour", variant: "primary" } },
    ]}
/>`


export const getCardsSections = () => [
    {
        title: 'KPI Card Simple usage',
        code: KPI_CODE_SIMPLE_USAGE,
        component: (
            <KpiCardLib
                kpiValue="88"
                kpiLabel="membres"
            />
        )
    },
    {
        title: 'KPI Card small usage (valeur texte long)',
        code: KPI_CODE_SMALL_USAGE,
        component: (
            <div className="w-40">
                <KpiCardLib
                    size="sm"
                    kpiValue="Cadres de la fonction publique, professions intellectuelles et artistiques"
                    kpiLabel="catégorie"
                />
            </div>
        )
    },
    {
        title: 'KPI Bar card simple usage',
        code: KPI_BAR_CARD_SIMPLE_USAGE,
        component: (
            <KpiBarCardLib
                title='Parité'
                items={[
                    {label: 'Femmes', value: 50},
                    {label: 'Hommes', value: 50},
                ]}
                maxValue={100}
            />
        )
    },
    {
        title: 'KPI Bar card footer usage',
        code: KPI_BAR_CARD_FOOTER_USAGE,
        component: (
            <KpiBarCardLib
                title='Parité'
                items={[
                    {label: 'Femmes', value: 50},
                    {label: 'Hommes', value: 50},
                ]}
                maxValue={100}
                footer='Donnée du 09/10/2022'
                showFooterDivider={true}
            />
        )
    },
    {
        title: 'Score card (score sur 100, verdict, badge)',
        code: SCORE_CARD_USAGE,
        component: (
            <div className="w-64">
                <ScoreCardLib
                    title="Score"
                    score={59}
                    verdict="Dans la moyenne"
                    caption="Mieux que 64 % des députés de la législature"
                    badge="Aperçu"
                />
            </div>
        )
    },
    {
        title: 'Score breakdown card (détail par composante)',
        code: SCORE_BREAKDOWN_CARD_USAGE,
        component: (
            <ScoreBreakdownCardLib
                title="Détail du score"
                items={[
                    {label: "Présence", description: "Jours présents parmi les jours attendus.", poids: 30, score: 72},
                    {label: "Participation aux votes", poids: 25, score: 58},
                    {label: "Interventions en séance", poids: 15, score: null},
                ]}
                footer="Chaque composante apporte poids × sous-score ÷ 100 points."
            />
        )
    },
    {
        title: 'Summary list card simple usage',
        code: SUMMARY_LIST_CARD_SIMPLE_USAGE,
        component: (
            <SummaryListCardLib
                title='Députes'
                items={[
                    {label: 'Femmes', value: 25},
                    {label: 'Femmes', value: 25},
                    {label: 'Hommes', value: 25},
                    {label: 'Hommes', value: 25},
                ]}
            />
        )
    },
    {
        title: 'Summary list card badge usage',
        code: SUMMARY_LIST_CARD_BADGE_USAGE,
        component: (
            <SummaryListCardLib
                title='Derniers votes'
                items={[
                    {label: 'Projet de loi de finances — vote solennel', badge: {text: 'Pour', variant: 'primary'}},
                    {label: 'Motion de censure', badge: {text: 'Contre', variant: 'secondary'}},
                    {label: 'Amendement n° 119', badge: {text: 'Abstention', variant: 'tertiary'}},
                    {label: 'Texte avec lien', href: 'https://www.assemblee-nationale.fr', badge: {text: 'Pour', variant: 'primary'}},
                ]}
            />
        )
    },
];