import React from "react";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { ProportionBarLib } from "@/app/(ui)/component-library/molecules/proportion-bar/proportion-bar-lib";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { MotifEntree } from "@/app/domains/legislatures/motifs-entree";

const nombre = (n: number) => n.toLocaleString("fr-FR");

/** Une couleur de la palette des graphiques par motif d'entrée, stable d'une législature à l'autre. */
const COULEUR_MOTIF: Record<MotifEntree, string> = {
    gouvernement: "var(--chart-1)",
    "retour-gouvernement": "var(--chart-2)",
    demission: "var(--chart-3)",
    partielle: "var(--chart-4)",
    deces: "var(--chart-5)",
    mission: "var(--chart-6)",
    autre: "var(--chart-7)",
};

/** Chiffres clés de la législature, puis la répartition des entrées en cours de législature par motif. */
export function LegislatureChiffres({ chiffres }: { chiffres: LegislatureChiffresDTO }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                <KpiCardLib kpiValue={nombre(chiffres.dureeJours)} kpiLabel={chiffres.fin ? "jours" : "jours (en cours)"} />
                <KpiCardLib kpiValue={nombre(chiffres.scrutins)} kpiLabel="scrutins" />
                <KpiCardLib kpiValue={nombre(chiffres.gouvernements)} kpiLabel={chiffres.gouvernements > 1 ? "gouvernements" : "gouvernement"} />
                <KpiCardLib kpiValue={nombre(chiffres.deputesAyantSiege)} kpiLabel="députés ont siégé" />
                <KpiCardLib kpiValue={nombre(chiffres.entreesEnCours)} kpiLabel="entrées en cours de législature" />
            </div>

            {chiffres.entreesEnCours > 0 && (
                <div className="flex flex-col gap-3 rounded-lg border border-main bg-surface-2 p-5">
                    <div>
                        <p className="font-semibold">{nombre(chiffres.entreesEnCours)} députés entrés en cours de législature</p>
                        <p className="text-sm text-subtitle-accent">
                            Un siège qui se libère est repris par le suppléant, ou pourvu par une élection partielle.
                        </p>
                    </div>
                    <ProportionBarLib
                        ariaLabel={`Répartition des ${chiffres.entreesEnCours} entrées en cours de législature par motif`}
                        segments={chiffres.entreesParMotif.map((e) => ({ id: e.motif, label: e.libelle, value: e.nombre, color: COULEUR_MOTIF[e.motif] }))}
                    />
                </div>
            )}
        </div>
    );
}
