import React from 'react';
import {IconLibType} from "@/app/(ui)/component-library/types/icons.types";

type BaseProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
    icon?: IconLibType;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
};

type ButtonLibProps =
    | (BaseProps & { text: string; ariaLabel?: string })
    | (BaseProps & { text?: undefined; ariaLabel: string });

export const ButtonLib: React.FC<ButtonLibProps> = ({
                                                        text,
                                                        ariaLabel,
                                                        icon: Icon,
                                                        variant = 'primary',
                                                        size = 'medium',
                                                        className,
                                                        type = "button",
                                                        disabled = false,
                                                        ...rest
                                                    }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`gap-2 btn-lib btn-lib--${variant} btn-lib--${size}${className ? ` ${className}` : ''}`}
            {...rest}
        >
            {Icon && <span aria-hidden="true"><Icon size={size === 'small' ? 16 : size === 'large' ? 24 : 20}/></span>}
            {text && <span>{text}</span>}
        </button>
    );
};
