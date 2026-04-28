"use client"


import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";

export const DEPUTYCARD_CODE = `<DeputyCard
    groupe="LFI"
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
                <DeputyCard uid="demo-1" nom="Thivauetjr ehjrkedjdje"
                               groupe="LFI"
                               image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
                               role="Député"
                />
                <DeputyCard uid="demo-2" nom="Titi"
                               groupe="RN"
                               image="/tribun/16/photos_deputes_nobg/026_Anne-Laure_Babault.png"
                               role="Député"
                />
                <DeputyCard uid="demo-3" nom="Tata Micron"
                               groupe="RE"
                               image="/tribun/16/photos_deputes_nobg/010_Henri_Alfandari.png"
                               role="Président"
                />
                <DeputyCard uid="demo-4" nom="Toto Micron"
                               groupe="SOC"
                               image="/tribun/16/photos_deputes_nobg/032_Christophe_Barthès.png"
                               role="Gouvernement"
                />
                <DeputyCard uid="demo-5" nom="toto"
                               groupe="ECOS"
                               image="/tribun/16/photos_deputes_nobg/111_Agnès_Carel.png"
                               role="Ministre"
                />
            </div>
        )
    },
]