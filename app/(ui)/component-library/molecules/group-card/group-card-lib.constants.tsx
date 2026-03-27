"use client";

import { GroupCardLib } from "@/app/(ui)/component-library/molecules/group-card/group-card-lib";
import { PARLIAMENTARY_GROUP_THEME_REGISTRY } from "@/app/(ui)/theme/parliament-groups/group-theme.registry";

export const GROUP_CARD_CODE_BASIC = `import { GroupCardLib } from "@/app/(ui)/component-library/molecules/group-card/group-card-lib";
import { PARLIAMENTARY_GROUP_THEME_REGISTRY } from "@/app/(ui)/theme/parliament-groups/group-theme.registry";

<GroupCardLib
    code="RN"
    libelle="Rassemblement National"
    nb_membres={122}
    president="Marine Le Pen"
    position="Droite"
    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.RN}
/>`;

export const GROUP_CARD_CODE_WITH_LINK = `import { GroupCardLib } from "@/app/(ui)/component-library/molecules/group-card/group-card-lib";
import { PARLIAMENTARY_GROUP_THEME_REGISTRY } from "@/app/(ui)/theme/parliament-groups/group-theme.registry";

<GroupCardLib
    code="SOC"
    libelle="Socialistes et apparentés"
    nb_membres={69}
    president="Boris Vallaud"
    position="Gauche"
    href="/groupes/SOC"
    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.SOC}
/>`;

export const GROUP_CARD_CODE_MINIMAL = `import { GroupCardLib } from "@/app/(ui)/component-library/molecules/group-card/group-card-lib";
import { PARLIAMENTARY_GROUP_THEME_REGISTRY } from "@/app/(ui)/theme/parliament-groups/group-theme.registry";

<GroupCardLib
    code="NI"
    libelle="Non inscrit"
    nb_membres={7}
    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.DEFAULT}
/>`;

export const getGroupCardSections = () => [
    {
        title: "Usage basique",
        code: GROUP_CARD_CODE_BASIC,
        component: (
            <div className="max-w-sm">
                <GroupCardLib
                    code="RN"
                    libelle="Rassemblement National"
                    nb_membres={122}
                    president="Marine Le Pen"
                    position="Droite"
                    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.RN}
                />
            </div>
        ),
    },
    {
        title: "Avec redirection",
        code: GROUP_CARD_CODE_WITH_LINK,
        component: (
            <div className="max-w-sm">
                <GroupCardLib
                    code="SOC"
                    libelle="Socialistes et apparentés"
                    nb_membres={69}
                    president="Boris Vallaud"
                    position="Gauche"
                    href="/groupes/SOC"
                    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.SOC}
                />
            </div>
        ),
    },
    {
        title: "Version minimale",
        code: GROUP_CARD_CODE_MINIMAL,
        component: (
            <div className="max-w-sm">
                <GroupCardLib
                    code="NI"
                    libelle="Non inscrit"
                    nb_membres={7}
                    theme={PARLIAMENTARY_GROUP_THEME_REGISTRY.DEFAULT}
                />
            </div>
        ),
    },
];