import React from "react";

export type BaseProps = {
    /** Texte du badge */
    text: string;
};

export type VariantProps = BaseProps & {
    variant?: 'primary' | 'secondary' | 'tertiary';
    className?: never;
    style?: never;
};

export type CustomProps = BaseProps & {
    style?: React.CSSProperties;
    variant?: never;
};

export type BadgeLibProps = VariantProps | CustomProps;


export const BadgeLib: React.FC<BadgeLibProps> = ({
                                                      text,
                                                      variant = '',
                                                      style,
                                                  }) => {
    // Badge personnalisé : couleurs passées par `style`, sans classe de variante.
    const isCustom = !!style;

    return (
        <span
            className={
                isCustom
                    ? `badge-lib`
                    : `badge-lib badge-lib--${variant}`
            }
            style={style}
        >
            {text}
        </span>
    );
}