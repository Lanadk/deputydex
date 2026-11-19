import React from "react";
import {BadgeLib} from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import {SummaryListItem} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";

type SummaryListCardLibProps = {
    title?: string;
    items: SummaryListItem[];
};

export const SummaryListCardLib: React.FC<SummaryListCardLibProps> = ({title, items}) => (
    <div className="chart-lib border border-main rounded-lg bg-surface-2 p-5">
        {title && (
            <h3 className="text-xs font-bold uppercase tracking-wide text-secondary mb-4">
                {title}
            </h3>
        )}
        <div className="flex flex-col divide-y divide-main">
            {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex flex-col gap-0.5">
                        {item.href ? (
                            <a className="summary-list-card__link text-sm text-primary" href={item.href} target="_blank" rel="noopener noreferrer">
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-sm text-primary">{item.label}</span>
                        )}
                        {item.secondaryLink && (
                            <a className="summary-list-card__link text-xs text-subtitle-accent" href={item.secondaryLink.href} target="_blank" rel="noopener noreferrer">
                                {item.secondaryLink.label}
                            </a>
                        )}
                    </span>
                    {"badge" in item
                        ? <BadgeLib {...item.badge} />
                        : <span className="text-sm font-medium text-secondary">{item.value}</span>
                    }
                </div>
            ))}
        </div>
    </div>
);