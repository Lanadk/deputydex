"use client"

import {AnchorLayout} from "@/app/(ui)/component-library/template/anchor-section/anchor-layout";
import {STATISTICS_SECTIONS} from "@/app/(ui)/(views)/(db)/statistics/statistics-sections.config";


export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AnchorLayout
            title="Statistiques parlementaires"
            subtitle="Découvrez les données clés sur l'activité parlementaire : lois, amendements, interventions, et plus encore. Explorez les tendances et les chiffres marquants de la législature en cours."
            sections={STATISTICS_SECTIONS}
        >
            {children}
        </AnchorLayout>
    );
}