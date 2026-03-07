import React from 'react';

export interface InputLibProps {
  /** Label optionnel affiché au-dessus de l'input */
  label?: string;
  /** Placeholder de l'input */
  placeholder?: string;
  /** Valeur de l'input */
  value: string;
  /** Callback lors du changement de valeur */
  onChange: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
}

export const InputLib: React.FC<InputLibProps> = ({
                                                    label,
                                                    placeholder = '',
                                                    value,
                                                    onChange,
                                                    disabled = false,
                                                    required = false
                                                  }) => {
  return (
      <div className={`input-wrapper`}>
        {label && (
            <label className="input-label">
              {label}
              {required && <span className="input-required">*</span>}
            </label>
        )}
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className="input-lib"
        />
      </div>
  );
};