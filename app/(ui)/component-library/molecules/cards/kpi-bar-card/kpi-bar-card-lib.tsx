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
                <h3 className="text-sm font-bold uppercase tracking-wide mb-5">
                    {title}
                </h3>
            )}

            <div className="flex flex-col gap-4">
                {items.map((item, index) => {
                    const percentage = Math.max(0, Math.min((item.value / safeMax) * 100, 100));

                    return (
                        // Libellé prioritaire, barre limitée à 35 % de la ligne (≈ 140 px sur une carte large),
                        // valeur à sa largeur : la ligne tient dans la carte même sur un petit écran (320 px).
                        <div key={`${item.label}-${index}`} className="grid grid-cols-[minmax(0,1fr)_minmax(2.5rem,35%)_auto] items-center gap-3 sm:gap-4">
                            <span className="text-sm font-medium break-words">
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

                            <span className="min-w-8 text-sm font-semibold text-right tabular-nums">
                                {item.displayValue ?? item.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            {footer && (
                <>
                    {showFooterDivider && (
                        <div className="my-5 border-t border-main" />
                    )}
                    <p className="text-sm text-subtitle-accent">{footer}</p>
                </>
            )}
        </div>
    );
};