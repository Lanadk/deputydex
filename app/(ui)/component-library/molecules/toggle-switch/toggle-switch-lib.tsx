import React from 'react';

export interface ToggleSwitchLibProps {
    /** État du toggle (actif ou non) */
    isActive: boolean;
    /** Callback lors du toggle */
    onToggle: () => void;
    /** Label optionnel affiché à côté du toggle (à droite) */
    label?: string;
    /** Taille du toggle */
    size?: 'small' | 'medium';
}

export const ToggleSwitchLib: React.FC<ToggleSwitchLibProps> = ({
                                                                    isActive,
                                                                    onToggle,
                                                                    label,
                                                                    size = 'medium'
                                                                }) => {
    return (
        <div className="toggle-switch-wrapper">
            <button
                type="button"
                role="switch"
                aria-checked={isActive}
                className={`toggle-switch toggle-switch--${size} ${isActive ? 'toggle-switch--active' : ''}`}
                onClick={onToggle}
            >
                <span className={`toggle-switch__slider toggle-switch__slider--${size}`} />
            </button>
            {label && <span className="toggle-switch__label">{label}</span>}
        </div>
    );
};