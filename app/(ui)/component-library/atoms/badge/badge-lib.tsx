import React from "react";

export type BaseProps = {
    /** Identificateur */
    key?: string;
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
                                                      key,
                                                      text,
                                                      variant = '',
                                                      style,
                                                  }) => {
    const isCustom = !!style && !!variant;

    return (
        <span
            key={key}
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