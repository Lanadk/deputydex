import React from "react";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

export type DeputeHeaderProps = {
    identity: DeputeIdentityDTO;
};

export const DeputeHeader: React.FC<DeputeHeaderProps> = ({ identity }) => {
    const groupCode = getCanonicalGroupCode(identity.groupeCode ?? "");
    const theme = getGroupCardTheme(groupCode);
    const badgeColor = theme.badgeBg;

    const circonscription = [identity.numCirco ? `${identity.numCirco}e circ.` : null, identity.departement, identity.region]
        .filter(Boolean)
        .join(" · ");

    const genre = identity.civilite === "M." ? "Homme" : identity.civilite === "Mme" ? "Femme" : null;

    return (
        <div className="relative w-full rounded-xl p-4 sm:p-6 overflow-hidden">
            {/* Bandeau couleur groupe */}
            <div
                className="absolute top-0 left-0 h-3 w-full"
                style={{ backgroundColor: badgeColor }}
            />

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
                {/* PHOTO */}
                <div className="flex items-center justify-center shrink-0 w-32 h-40 self-center sm:self-start">
                    {identity.photoUrl ? (
                        <img
                            src={identity.photoUrl}
                            alt={`${identity.prenom} ${identity.nom}`}
                            className="w-full h-full object-cover rounded-xl border border-main"
                        />
                    ) : (
                        <div
                            className="w-full h-full rounded-xl border border-main flex items-center justify-center text-4xl font-bold"
                            style={{ backgroundColor: "var(--surface-3)", color: badgeColor }}
                        >
                            {(identity.prenom?.[0] ?? "") + (identity.nom?.[0] ?? "")}
                        </div>
                    )}
                </div>

                {/* CONTENU */}
                <div className="flex flex-col flex-1 min-w-0 gap-4 p-2">
                    {/* Ligne 1 : nom + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-semibold flex-1 min-w-0">
                            {identity.prenom} {identity.nom}
                        </h1>
                        {identity.groupeCode && (
                            <BadgeLib
                                text={identity.groupeCode}
                                style={{ color: "white", backgroundColor: badgeColor }}
                            />
                        )}
                        {genre && <BadgeLib text={genre} variant="secondary" />}
                    </div>

                    {/* Ligne 2 : groupe + circonscription */}
                    <div className="text-sm sm:text-base" style={{ color: "var(--subtitle-accent)" }}>
                        {[identity.groupeLabel, circonscription].filter(Boolean).join(" · ")}
                    </div>

                    {/* Ligne 3 : badges secondaires + lien AN */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {identity.age && (
                            <BadgeLib text={`${identity.age} ans`} variant="secondary" />
                        )}
                        {identity.professionLibelle && (
                            <BadgeLib text={identity.professionLibelle} variant="tertiary" />
                        )}
                        <a
                            href={identity.lienAN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-full border border-main text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: "var(--foreground)" }}
                        >
                            Fiche AN ↗
                        </a>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <KpiCardLib
                    kpiValue={`${identity.legislature}e`}
                    kpiLabel="législature"
                />
                <KpiCardLib
                    kpiValue={identity.numCirco ? `${identity.numCirco}e` : "—"}
                    kpiLabel="circonscription"
                />
                <KpiCardLib
                    kpiValue={identity.departement ?? "—"}
                    kpiLabel="département"
                />
                <KpiCardLib
                    kpiValue={identity.region ?? "—"}
                    kpiLabel="région"
                />
            </div>
        </div>
    );
};
