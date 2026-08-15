import React from "react";

export type KpiCardSize = "md" | "sm";

type KpiCardLibProps = {
    kpiValue: string | number;
    kpiLabel: string;
    size?: KpiCardSize;
}

const VALUE_SIZE_CLASS: Record<KpiCardSize, string> = {
    md: "text-xl font-semibold",
    sm: "text-sm font-semibold",
};

const LABEL_SIZE_CLASS: Record<KpiCardSize, string> = {
    md: "text-sm text-gray-600",
    sm: "text-xs text-gray-600",
};

export const KpiCardLib: React.FC<KpiCardLibProps> = ({
                                                             kpiValue,
                                                             kpiLabel,
                                                             size = "md",
                                                         }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-1 border border-main rounded-lg bg-surface-2 p-4 text-center">
            <div className={`${VALUE_SIZE_CLASS[size]} break-words`}>{kpiValue}</div>
            <div className={LABEL_SIZE_CLASS[size]}>{kpiLabel}</div>
        </div>
    );
}