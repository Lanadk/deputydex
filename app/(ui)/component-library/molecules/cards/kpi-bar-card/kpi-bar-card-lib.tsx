import {KpiBarCardItem} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";

type KpiBarCardLibProps = {
    title?: string;
    items: KpiBarCardItem[];
    /**
     * Base de calcul des barres.
     * Par défaut : 100
     */
    maxValue?: number;
    /**
     * Texte affiché en bas de carte
     */
    footer?: string;
    /**
     * Si true, on affiche un séparateur avant le footer
     */
    showFooterDivider?: boolean;
    className?: string;
};

export const KpiBarCardLib: React.FC<KpiBarCardLibProps> = ({
                                                                title,
                                                                items,
                                                                maxValue = 100,
                                                                footer,
                                                                showFooterDivider = true,
                                                                className = "",
                                                            }) => {
    const safeMax = maxValue <= 0 ? 100 : maxValue;

    return (
        <div className={`border border-main rounded-lg bg-surface-2 p-5 ${className}`}>
            {title && (
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-5">
                    {title}
                </h3>
            )}

            <div className="flex flex-col gap-4">
                {items.map((item, index) => {
                    const percentage = Math.max(0, Math.min((item.value / safeMax) * 100, 100));

                    return (
                        <div key={`${item.label}-${index}`} className="grid grid-cols-[1fr_140px_48px] items-center gap-4">
                            <span className="text-sm font-medium text-gray-900">
                                {item.label}
                            </span>

                            <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: item.color ?? "var(--accent)",
                                    }}
                                />
                            </div>

                            <span className="text-sm font-semibold text-right text-gray-900">
                                {item.displayValue ?? item.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            {footer && (
                <>
                    {showFooterDivider && (
                        <div className="my-5 border-t border-gray-300" />
                    )}
                    <p className="text-sm text-gray-700">{footer}</p>
                </>
            )}
        </div>
    );
};