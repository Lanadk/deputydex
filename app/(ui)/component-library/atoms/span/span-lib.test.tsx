import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpanLib } from './span-lib';
import '@testing-library/jest-dom';

describe('SpanLib', () => {

    it('renders with children text', () => {
        render(<SpanLib>Hello World</SpanLib>);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('applies span-lib class by default', () => {
        render(<SpanLib>Test</SpanLib>);
        const span = screen.getByText('Test');
        expect(span).toHaveClass('span-lib');
    });

    it('applies clickable class when onClick is provided', () => {
        const handleClick = jest.fn();
        render(<SpanLib onClick={handleClick}>Clickable</SpanLib>);
        const span = screen.getByText('Clickable');
        expect(span).toHaveClass('span-lib--clickable');
    });

    it('does not apply clickable class without onClick', () => {
        render(<SpanLib>Not Clickable</SpanLib>);
        const span = screen.getByText('Not Clickable');
        expect(span).not.toHaveClass('span-lib--clickable');
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<SpanLib onClick={handleClick}>Click me</SpanLib>);

        const span = screen.getByText('Click me');
        fireEvent.click(span);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times', () => {
        const handleClick = jest.fn();
        render(<SpanLib onClick={handleClick}>Click me</SpanLib>);

        const span = screen.getByText('Click me');
        fireEvent.click(span);
        fireEvent.click(span);
        fireEvent.click(span);

        expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('works without onClick handler', () => {
        render(<SpanLib>No Handler</SpanLib>);
        const span = screen.getByText('No Handler');

        expect(() => fireEvent.click(span)).not.toThrow();
    });

    it('renders with React elements as children', () => {
        render(
            <SpanLib>
                <strong>Bold</strong> text
            </SpanLib>
        );
        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByText(/text/)).toBeInTheDocument();
    });

    it('renders with icons as children', () => {
        render(
            <SpanLib>
                🎉 Icon
            </SpanLib>
        );
        expect(screen.getByText(/🎉 Icon/)).toBeInTheDocument();
    });
});