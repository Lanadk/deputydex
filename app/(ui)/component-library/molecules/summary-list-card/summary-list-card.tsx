import React from "react";
import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {SummaryListItem} from "@/app/(ui)/component-library/template/block-section/card-config.types";

type SummaryListCardLibProps = {
    title?: string;
    items: SummaryListItem[];
};

export const SummaryListCardLib: React.FC<SummaryListCardLibProps> = ({ title, items }) => (
    <div className="chart-lib border border-main rounded-lg bg-surface p-5">
        {title && (
            <h3 className="text-xs font-bold uppercase tracking-wide text-secondary mb-4">
                {title}
            </h3>
        )}
        <div className="flex flex-col divide-y divide-main">
            {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-primary">{item.label}</span>
                    {"badge" in item
                        ? <BadgeLib {...item.badge} />
                        : <span className="text-sm font-medium text-secondary">{item.value}</span>
                    }
                </div>
            ))}
        </div>
    </div>
);