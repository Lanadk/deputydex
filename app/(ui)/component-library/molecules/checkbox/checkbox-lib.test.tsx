import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxLib } from './checkbox-lib';
import '@testing-library/jest-dom';

describe('CheckboxLib', () => {
    it('renders unchecked by default', () => {
        render(<CheckboxLib isChecked={false} onToggle={jest.fn()} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    });

    it('renders checked', () => {
        render(<CheckboxLib isChecked={true} onToggle={jest.fn()} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('applies the checked class when checked', () => {
        render(<CheckboxLib isChecked={true} onToggle={jest.fn()} />);
        expect(screen.getByRole('checkbox')).toHaveClass('checkbox-lib--checked');
    });

    it('renders a label when provided', () => {
        render(<CheckboxLib isChecked={false} onToggle={jest.fn()} label="Répartition par âge" />);
        expect(screen.getByText('Répartition par âge')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        const onToggle = jest.fn();
        render(<CheckboxLib isChecked={false} onToggle={onToggle} />);

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('does not call onToggle when disabled', () => {
        const onToggle = jest.fn();
        render(<CheckboxLib isChecked={false} onToggle={onToggle} disabled />);

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onToggle).not.toHaveBeenCalled();
    });
});
