import React from "react";

type KpiCardLibProps = {
    kpiValue: string | number;
    kpiLabel: string;
}

export const KpiCardLib: React.FC<KpiCardLibProps> = ({
                                                             kpiValue,
                                                             kpiLabel,
                                                         }) => {
    return (
        <div className="border border-main rounded-lg bg-gray-100 p-4 text-center">
            <div className="text-xl font-semibold">{kpiValue}</div>
            <div className="text-sm text-gray-600">{kpiLabel}</div>
        </div>
    );
}