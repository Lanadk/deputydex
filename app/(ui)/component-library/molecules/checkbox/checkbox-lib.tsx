import React from 'react';

export interface CheckboxLibProps {
    /** État de la case */
    isChecked: boolean;
    /** Callback lors du clic */
    onToggle: () => void;
    /** Label optionnel affiché à droite de la case */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
}

export const CheckboxLib: React.FC<CheckboxLibProps> = ({
                                                              isChecked,
                                                              onToggle,
                                                              label,
                                                              disabled = false,
                                                          }) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            disabled={disabled}
            className={`checkbox-lib ${isChecked ? 'checkbox-lib--checked' : ''}`}
            onClick={onToggle}
        >
            <span className="checkbox-lib__box">
                {isChecked && (
                    <svg className="checkbox-lib__check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            {label && <span className="checkbox-lib__label">{label}</span>}
        </button>
    );
};
