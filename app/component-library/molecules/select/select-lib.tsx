import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectLibProps {
  /** Label optionnel affiché au-dessus du select */
  label?: string;
  /** Liste des options */
  options: SelectOption[];
  /** Valeur sélectionnée */
  value: string;
  /** Callback lors du changement de valeur */
  onChange: (value: string) => void;
  /** Placeholder (première option désactivée) */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Classes CSS supplémentaires */
  className?: string;
}

export const SelectLib: React.FC<SelectLibProps> = ({
                                                      label,
                                                      options,
                                                      value,
                                                      onChange,
                                                      placeholder = 'Sélectionner une option',
                                                      disabled = false,
                                                      required = false,
                                                      className = '',
                                                    }) => {
  return (
      <div className={`select-wrapper ${className}`}>
        {label && (
            <label className="select-label">
              {label}
              {required && <span className="select-required">*</span>}
            </label>
        )}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className="select-lib"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>
      </div>
  );
};