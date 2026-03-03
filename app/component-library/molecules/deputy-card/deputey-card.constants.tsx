"use client"

import DeputyCard from "@/app/component-library/molecules/deputy-card/deputy-card";

export const DEPUTYCARD_CODE = `<DeputyCard
    parti="LFI"
    nom="toto"
    image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
/>
`

// useWindowVirtualizer si on veut display plein de card dans une page windows
export const getDeputyCardSections = () => [
    {
        title: "Usage basique",
        code: DEPUTYCARD_CODE,
        component: (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start">
                <DeputyCard nom="Thivauetjr ehjrkedjdje"
                            parti="LFI"
                            image="/tribun/16/photos_deputes_no_bg/001_Damien_Abad.png"
                            role="Député"
                />
                <DeputyCard nom="Titi"
                            parti="RN"
                            image="/tribun/16/photos_deputes_no_bg/026_Anne-Laure_Babault.png"
                            role="Député"
                />
                <DeputyCard nom="Tata Micron"
                            parti="RE"
                            image="/tribun/16/photos_deputes_no_bg/010_Henri_Alfandari.png"
                            role="Président"
                />
                <DeputyCard nom="Toto Micron"
                            parti="PS"
                            image="/tribun/16/photos_deputes_no_bg/032_Christophe_Barthès.png"
                            role="Gouvernement"
                />
                <DeputyCard nom="toto" parti="EELV" image="/tribun/16/photos_deputes_no_bg/111_Agnès_Carel.png" role="Ministre"/>
            </div>
        )
    },
]