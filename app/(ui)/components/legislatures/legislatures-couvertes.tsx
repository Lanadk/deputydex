import React from "react";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";

export type LegislatureCouverte = { number: number; startDate: string | null; endDate: string | null };

const DATE_LONGUE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** « 28 juin 2022 » (date ISO, sans décalage de fuseau). */
export const dateLongue = (iso: string) => DATE_LONGUE.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));

/** Durée lisible entre deux dates ISO : « 1 an et 11 mois », « 4 mois ». */
export function dureeLisible(debut: string, fin: string): string {
    const [ad, md, jd] = debut.slice(0, 10).split("-").map(Number);
    const [af, mf, jf] = fin.slice(0, 10).split("-").map(Number);
    let mois = (af - ad) * 12 + (mf - md) - (jf < jd ? 1 : 0);
    if (mois < 0) mois = 0;
    const ans = Math.floor(mois / 12);
    const reste = mois % 12;
    const partAns = ans ? `${ans} an${ans > 1 ? "s" : ""}` : "";
    const partMois = reste || !ans ? `${reste} mois` : "";
    return [partAns, partMois].filter(Boolean).join(" et ");
}

/** Une législature dure cinq ans ; une fin plus précoce ne peut venir que d'une dissolution. */
const DUREE_NORMALE_MOIS = 5 * 12 - 1;
const finAnticipee = (debut: string, fin: string) => {
    const [ad, md] = debut.split("-").map(Number);
    const [af, mf] = fin.split("-").map(Number);
    return (af - ad) * 12 + (mf - md) < DUREE_NORMALE_MOIS;
};

/** Les législatures dont Députédex contient les données : une carte chacune (statut, dates, durée). */
export function LegislaturesCouvertes({ legislatures, aujourdhui }: { legislatures: LegislatureCouverte[]; aujourdhui: string }) {
    const triees = [...legislatures].filter((l) => l.startDate).sort((a, b) => b.number - a.number);
    if (!triees.length) return null;

    return (
        <div className="flex flex-col gap-3">
            <div>
                <h3 className="text-lg font-semibold">Les législatures présentes dans Députédex</h3>
                <p className="text-sm text-subtitle-accent">Députés, votes et chiffres de ce site portent sur ces périodes.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
                {triees.map((l) => {
                    const debut = l.startDate!;
                    const enCours = !l.endDate;
                    const fin = l.endDate ?? aujourdhui;
                    return (
                        <li key={l.number} className="flex flex-col gap-1 rounded-lg border border-main bg-surface-2 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-base font-semibold">{libelleLegislature(l.number)}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enCours ? "bg-accent text-white" : "bg-surface-3 text-subtitle-accent"}`}>
                                    {enCours ? "En cours" : "Terminée"}
                                </span>
                            </div>
                            <p className="text-sm">
                                {enCours
                                    ? <>Depuis le <strong>{dateLongue(debut)}</strong></>
                                    : <>Du <strong>{dateLongue(debut)}</strong> au <strong>{dateLongue(fin)}</strong></>}
                            </p>
                            <p className="text-sm text-subtitle-accent">
                                {enCours ? `${dureeLisible(debut, fin)} à ce jour` : `Durée : ${dureeLisible(debut, fin)}`}
                                {!enCours && finAnticipee(debut.slice(0, 10), fin.slice(0, 10)) && " · interrompue par une dissolution"}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
