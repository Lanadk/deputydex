import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/kpi-card/kpi-card-lib";

export type GroupeHeaderProps = {
    groupeInfos: GroupeInfosDTO;
}

export const GroupeHeader: React.FC<GroupeHeaderProps> = ({groupeInfos}: GroupeHeaderProps) => {
    const rank = `${groupeInfos.groupeRank}e`;

    return (
        <div className="relative w-full rounded-xl p-4 sm:p-6 overflow-hidden">
            {/* Bandeau de couleur */}
            <div
                className="absolute top-0 left-0 h-3 w-full"
                style={{ backgroundColor: groupeInfos.groupeColor }}
            />

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                {/* LOGO */}
                <div className="flex items-center justify-center shrink-0 w-36 h-36 self-center sm:self-auto">
                    <img
                        src={groupeInfos.groupeImg}
                        alt={groupeInfos.groupeLabel}
                        className="border border-main w-full h-full object-contain rounded-xl"
                    />
                </div>

                {/* CONTENU */}
                <div className="flex flex-col flex-1 min-w-0 gap-4 h-full p-2">
                    {/* LIGNE 1 */}
                    <div className="flex items-center gap-2">
                        <h1 className="flex-1 text-3xl font-semibold">
                            {groupeInfos.groupeLabel}
                        </h1>

                        <div className="flex gap-2">
                            <BadgeLib
                                text={groupeInfos.groupeCode}
                                style={{ backgroundColor: groupeInfos.groupeColor }}
                            />
                            {groupeInfos.groupePosition && (
                                <BadgeLib
                                    text={groupeInfos.groupePosition}
                                    variant="secondary"
                                />
                            )}
                        </div>
                    </div>
                    {/* LIGNE 2 */}
                    <div className="text-sm sm:text-base text-gray-600">
                        {groupeInfos.groupeQualitySexLabel} · {groupeInfos.groupePresidentFullName} · Législature {groupeInfos.legislature}
                    </div>
                    {/* LIGNE 3 */}
                    <div className="flex flex-wrap gap-2">
                        <BadgeLib text={`Fondé en ${groupeInfos.groupeYearOfCreation}`} variant="secondary"/>
                        <a
                            href={groupeInfos.groupeWebSite}
                            className="px-3 py-1 rounded-full border text-sm hover:bg-gray-50"
                        >
                            Site officiel ↗
                        </a>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <KpiCardLib
                    kpiValue={groupeInfos.groupeCountMembers}
                    kpiLabel="membres"
                />
                <KpiCardLib
                    kpiValue={rank}
                    kpiLabel="rang (nombre de membres)"
                />
                <KpiCardLib
                    kpiValue={groupeInfos.groupeSeatsSharePercent + '%'}
                    kpiLabel="de l'hémicycle"
                />
                <KpiCardLib
                    kpiValue="+4"
                    kpiLabel="vs 16e"
                />
            </div>
        </div>
    );
};