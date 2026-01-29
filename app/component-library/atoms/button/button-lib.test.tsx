import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonLib } from './button-lib';
import { Plus } from 'lucide-react';
import '@testing-library/jest-dom';

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

    it('renders without text (icon only)', () => {
        render(<ButtonLib icon={Plus} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('renders with both icon and text', () => {
        render(<ButtonLib text="Add Item" icon={Plus} />);
        expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

});