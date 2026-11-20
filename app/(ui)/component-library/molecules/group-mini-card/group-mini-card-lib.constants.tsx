"use client"

import { GroupMiniCardLib } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

const themeOf = (code: string) => getGroupCardTheme(getCanonicalGroupCode(code));

export const GROUP_MINI_CARD_CODE = `<GroupMiniCardLib
    theme={getGroupCardTheme(getCanonicalGroupCode("LFI-NFP"))}
    chip="LFI-NFP"
    name="Prénom Nom"
    subtitle="La France insoumise"
    image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
/>
`;

export const GROUP_MINI_CARD_SIZES_CODE = `<GroupMiniCardLib theme={...} chip="EPR" name="Sans photo" subtitle="Silhouette" />
<GroupMiniCardLib theme={...} chip="RN" name="Taille md" subtitle="Panneau de détail" size="md" />
`;

export const getGroupMiniCardSections = () => [
    {
        title: "Usage basique (une couleur par groupe)",
        code: GROUP_MINI_CARD_CODE,
        component: (
            <div className="flex flex-wrap gap-4">
                {["LFI-NFP", "GDR", "ECOS", "SOC", "DEM", "EPR", "HOR", "LIOT", "DR", "UDDPLR", "RN", "NI-17"].map((code) => (
                    <GroupMiniCardLib
                        key={code}
                        theme={themeOf(code)}
                        chip={code}
                        name="Prénom Nom"
                        subtitle="Député"
                        image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
                    />
                ))}
            </div>
        ),
    },
    {
        title: "Sans photo et taille md",
        code: GROUP_MINI_CARD_SIZES_CODE,
        component: (
            <div className="flex flex-wrap items-end gap-4">
                <GroupMiniCardLib theme={themeOf("EPR")} chip="EPR" name="Sans photo" subtitle="Silhouette" />
                <GroupMiniCardLib theme={themeOf("RN")} chip="RN" name="Taille md" subtitle="Panneau de détail" size="md" />
            </div>
        ),
    },
];
