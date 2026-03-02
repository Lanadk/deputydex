"use client"

import DeputyCard from "@/app/component-library/molecules/deputy-card/deputy-card";

export const DEPUTYCARD_CODE = `<DeputyCard
    parti="LFI"
    nom="toto"
    image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
/>
`

export const getDeputyCardSections = () => [
    {
        title: "Usage basique",
        code: DEPUTYCARD_CODE,
        component: (
            <DeputyCard
                nom="toto"
                parti="LFI"
                image="/tribun/16/photos_deputes_nobg/001_Damien_Abad.png"
            />
        )
    }
]