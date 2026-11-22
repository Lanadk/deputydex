import React from "react";
import { formatJourLongFr } from "@/app/_shared/utils/date";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";
import { FriseLegislatureDTO } from "@/app/domains/legislatures/dto/legislatures-frise.dto";

/** Durée lisible entre deux dates AAAA-MM-JJ : « 1 an et 11 mois », « 4 mois ». */
export function dureeLisible(debut: string, fin: string): string {
    const [ad, md, jd] = debut.split("-").map(Number);
    const [af, mf, jf] = fin.split("-").map(Number);
    const mois = Math.max(0, (af - ad) * 12 + (mf - md) - (jf < jd ? 1 : 0));
    const ans = Math.floor(mois / 12);
    const reste = mois % 12;
    const partAns = ans ? `${ans} an${ans > 1 ? "s" : ""}` : "";
    const partMois = reste || !ans ? `${reste} mois` : "";
    return [partAns, partMois].filter(Boolean).join(" et ");
}

/**
 * Les législatures dont Députédex contient les données : une carte chacune
 * (statut, dates, durée, fin par dissolution). `aujourdhui` : date AAAA-MM-JJ.
 */
export function LegislaturesCouvertes({ legislatures, aujourdhui }: { legislatures: FriseLegislatureDTO[]; aujourdhui: string }) {
    if (!legislatures.length) return null;

    return (
        <div className="flex flex-col gap-3">
            <div>
                <h3 className="text-lg font-semibold">Les législatures présentes dans Députédex</h3>
                <p className="text-sm text-subtitle-accent">Députés, votes et chiffres de ce site portent sur ces périodes.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
                {legislatures.map((l) => {
                    const enCours = l.fin === null;
                    return (
                        <li key={l.numero} className="flex flex-col gap-1 rounded-lg border border-main bg-surface-2 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-base font-semibold">{libelleLegislature(l.numero)}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enCours ? "bg-accent text-white" : "bg-surface-3 text-subtitle-accent"}`}>
                                    {enCours ? "En cours" : "Terminée"}
                                </span>
                            </div>
                            <p className="text-sm">
                                {l.fin === null
                                    ? <>Depuis le <strong>{formatJourLongFr(l.debut)}</strong></>
                                    : <>Du <strong>{formatJourLongFr(l.debut)}</strong> au <strong>{formatJourLongFr(l.fin)}</strong></>}
                            </p>
                            <p className="text-sm text-subtitle-accent">
                                {l.fin === null ? `${dureeLisible(l.debut, aujourdhui)} à ce jour` : `Durée : ${dureeLisible(l.debut, l.fin)}`}
                                {l.finParDissolution && " · interrompue par une dissolution"}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
