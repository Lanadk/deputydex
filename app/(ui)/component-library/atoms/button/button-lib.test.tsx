import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ButtonLib } from './button-lib';
import { Plus } from 'lucide-react';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('ButtonLib', () => {
    it('renders with text', () => {
        render(<ButtonLib text="Click me" />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders primary variant by default', () => {
        render(<ButtonLib text="Primary" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-lib--primary');
    });

    it('renders secondary variant', () => {
        render(<ButtonLib text="Secondary" variant="secondary" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-lib--secondary');
    });

    it('renders tertiary variant', () => {
        render(<ButtonLib text="Tertiary" variant="tertiary" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-lib--tertiary');
    });

    it('renders with icon', () => {
        render(<ButtonLib text="Add" icon={Plus} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<ButtonLib text="Click" onClick={handleClick} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders icon-only button with ariaLabel', () => {
        render(<ButtonLib icon={Plus} ariaLabel="Add item" />);
        const button = screen.getByRole('button', { name: 'Add item' });
        expect(button).toBeInTheDocument();
    });

    it('renders with both icon and text', () => {
        render(<ButtonLib text="Add Item" icon={Plus} />);
        expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('sets aria-label attribute on the button', () => {
        render(<ButtonLib text="Save" ariaLabel="Save document" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Save document');
    });

    it('marks icon as aria-hidden', () => {
        render(<ButtonLib icon={Plus} ariaLabel="Add" />);
        const button = screen.getByRole('button');
        const iconWrapper = button.querySelector('span[aria-hidden="true"]');
        expect(iconWrapper).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
        render(<ButtonLib text="Styled" className="custom-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-lib');
        expect(button).toHaveClass('custom-class');
    });

    it('passes through native button attributes', () => {
        render(<ButtonLib text="Submit" type="submit" disabled />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).toBeDisabled();
    });

    it('defaults type to button', () => {
        render(<ButtonLib text="Default" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    describe('axe accessibility', () => {
        it('has no a11y violations (text-only)', async () => {
            const { container } = render(<ButtonLib text="Save" />);
            expect(await axe(container)).toHaveNoViolations();
        });

        it('has no a11y violations (icon-only with ariaLabel)', async () => {
            const { container } = render(<ButtonLib icon={Plus} ariaLabel="Add item" />);
            expect(await axe(container)).toHaveNoViolations();
        });

        it('has no a11y violations (icon + text)', async () => {
            const { container } = render(<ButtonLib text="Add" icon={Plus} />);
            expect(await axe(container)).toHaveNoViolations();
        });
    });
});
