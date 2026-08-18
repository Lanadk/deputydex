import {
    CardConfig,
    CardDataWrapper, DeputeCardData, DeputeCardPairData, GroupCardData, GroupCardPairData, KpiBarCardData,
    KpiCardData, SummaryListCardData
} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import {KpiBarCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-bar-card/kpi-bar-card-lib";
import {SummaryListCardLib} from "@/app/(ui)/component-library/molecules/cards/summary-list-card/summary-list-card";
import {GroupCard} from "@/app/(ui)/components/groups/group-card";
import {DeputeMiniCard} from "@/app/(ui)/components/deputes/depute-mini-card";
import {getCanonicalGroupTheme} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

type BlockCardRendererProps = {
    config: CardConfig
    data: CardDataWrapper | null;
    loading: boolean;
};

/** Largeur commune imposée à chaque `GroupCard` — sinon chacune garde la largeur de son contenu (photo, libellé...) et deux cartes voisines n'ont aucune raison de faire la même taille. */
function GroupCardWithCaption({data}: {data: GroupCardData}) {
    return (
        <div className="flex w-56 shrink-0 flex-col items-center gap-2">
            <GroupCard
                code={data.code}
                libelle={data.libelle}
                nbMembers={data.nbMembers}
                president={data.president}
                sexPresidentType={data.sexPresidentType}
                position={data.position}
                href={data.href}
                image={data.image}
                theme={getCanonicalGroupTheme(data.code)}
            />
            {data.caption && (
                <span className="text-sm font-semibold text-subtitle-accent">{data.caption}</span>
            )}
        </div>
    );
}

/** Pendant de `GroupCardWithCaption` pour un `DeputeMiniCard` — même largeur imposée, même principe de légende. */
function DeputeCardWithCaption({data}: {data: DeputeCardData}) {
    return (
        <div className="flex w-56 shrink-0 flex-col items-center gap-2">
            <DeputeMiniCard
                uid={data.uid}
                fullName={data.fullName}
                groupeCode={data.groupeCode}
                age={data.age}
                image={data.image}
                href={data.href}
                theme={getCanonicalGroupTheme(data.groupeCode)}
            />
            {data.caption && (
                <span className="text-sm font-semibold text-subtitle-accent">{data.caption}</span>
            )}
        </div>
    );
}

export function BlockCardRenderer({config, data, loading}: BlockCardRendererProps) {
    if (!data || loading) return null;

    switch (config.displayType) {
        case 'kpi-card': {
            const d = data as { data: KpiCardData };
            return <KpiCardLib kpiValue={d.data.value} kpiLabel={d.data.label}/>;
        }
        case 'kpi-bar-card': {
            const d = data as { data: KpiBarCardData };
            return (
                <KpiBarCardLib
                    title={d.data.title}
                    items={d.data.items}
                    maxValue={d.data.maxValue}
                    footer={d.data.footer}
                    showFooterDivider={d.data.showFooterDivider}
                />
            );
        }
        case 'summary-list-card': {
            const d = data as { data: SummaryListCardData };
            return <SummaryListCardLib title={d.data.title} items={d.data.items}/>;
        }
        case 'group-card': {
            const d = data as { data: GroupCardData };
            return (
                <div className="flex justify-center">
                    <GroupCardWithCaption data={d.data}/>
                </div>
            );
        }
        case 'group-card-pair': {
            const d = data as { data: GroupCardPairData };
            return (
                <div className="flex flex-wrap justify-center gap-6">
                    {d.data.cards.map((c) => (
                        <GroupCardWithCaption key={c.code} data={c}/>
                    ))}
                </div>
            );
        }
        case 'depute-card': {
            const d = data as { data: DeputeCardData };
            return (
                <div className="flex justify-center">
                    <DeputeCardWithCaption data={d.data}/>
                </div>
            );
        }
        case 'depute-card-pair': {
            const d = data as { data: DeputeCardPairData };
            return (
                <div className="flex flex-wrap justify-center gap-6">
                    {d.data.cards.map((c) => (
                        <DeputeCardWithCaption key={c.uid} data={c}/>
                    ))}
                </div>
            );
        }
    }
}