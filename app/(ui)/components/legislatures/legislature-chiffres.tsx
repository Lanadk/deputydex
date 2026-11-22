import React from "react";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";

const nombre = (n: number) => n.toLocaleString("fr-FR");

/** Chiffres clés de la législature, puis les entrées en cours de législature par cause. */
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

            {chiffres.entreesParCause.length > 0 && (
                <div className="border border-main rounded-lg bg-surface-2 p-4">
                    <p className="mb-2 text-sm font-semibold">Pourquoi des députés sont entrés en cours de législature</p>
                    <ul className="flex flex-col gap-1 text-sm">
                        {chiffres.entreesParCause.map((e) => (
                            <li key={e.cause} className="flex justify-between gap-4">
                                <span className="first-letter:uppercase">{e.cause}</span>
                                <span className="font-semibold tabular-nums">{nombre(e.nombre)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
