import React from "react";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { formatDateOnlyFr } from "@/app/_shared/utils/date";
import { capitalizeFirst } from "@/app/_shared/utils/string";

const RESULTAT_COLORS = { adopte: "#16a34a", rejete: "#dc2626" };

export type ScrutinHeaderProps = {
    scrutin: ScrutinDetailDTO;
};

export const ScrutinHeader: React.FC<ScrutinHeaderProps> = ({ scrutin }) => {
    const resultatColor = scrutin.resultat.isAdopte ? RESULTAT_COLORS.adopte : RESULTAT_COLORS.rejete;
    const date = formatDateOnlyFr(scrutin.date);

    return (
        <div className="relative w-full rounded-xl p-4 sm:p-6 overflow-hidden">
            {/* Bandeau de couleur : résultat du scrutin */}
            <div className="absolute top-0 left-0 h-3 w-full" style={{ backgroundColor: resultatColor }} />

            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="flex-1 text-3xl font-semibold">
                        Scrutin {scrutin.numero ? `n° ${scrutin.numero}` : ""}
                    </h1>
                    {scrutin.resultat.libelle && (
                        <BadgeLib
                            text={scrutin.resultat.libelle}
                            style={{ color: "white", backgroundColor: resultatColor }}
                        />
                    )}
                </div>

                {scrutin.titre && <p className="text-base sm:text-lg">{capitalizeFirst(scrutin.titre)}</p>}

                <div className="flex flex-wrap items-center gap-2">
                    {date && <BadgeLib text={date} variant="secondary" />}
                    {scrutin.type.libelle && <BadgeLib text={capitalizeFirst(scrutin.type.libelle)} variant="secondary" />}
                    <BadgeLib text={`${scrutin.legislature}e législature`} variant="secondary" />
                    {scrutin.lienAN && (
                        <a
                            href={scrutin.lienAN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border text-sm hover:bg-gray-50"
                        >
                            Sur le site de l&apos;Assemblée ↗
                        </a>
                    )}
                </div>

                {scrutin.typeMajorite && (
                    <p className="text-sm text-gray-600">{scrutin.typeMajorite}</p>
                )}
            </div>
        </div>
    );
};
