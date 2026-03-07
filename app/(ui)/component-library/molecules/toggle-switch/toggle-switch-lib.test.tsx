import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleSwitchLib } from './toggle-switch-lib';
import '@testing-library/jest-dom';

describe('ToggleSwitchLib', () => {
    it('renders without label', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).toBeInTheDocument();
    });

    it('renders with label', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} label="Wi-Fi" />);
        expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    });

    it('applies active class when isActive is true', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={true} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).toHaveClass('toggle-switch--active');
    });

    it('does not apply active class when isActive is false', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).not.toHaveClass('toggle-switch--active');
    });

    it('has correct aria-checked attribute when active', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={true} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('has correct aria-checked attribute when inactive', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onToggle when clicked', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);

        const toggle = screen.getByRole('switch');
        fireEvent.click(toggle);

        expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle multiple times', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);

        const toggle = screen.getByRole('switch');
        fireEvent.click(toggle);
        fireEvent.click(toggle);
        fireEvent.click(toggle);

        expect(handleToggle).toHaveBeenCalledTimes(3);
    });

    it('renders button with correct type', () => {
        const handleToggle = jest.fn();
        render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const toggle = screen.getByRole('switch');
        expect(toggle).toHaveAttribute('type', 'button');
    });

    it('renders slider span element', () => {
        const handleToggle = jest.fn();
        const { container } = render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const slider = container.querySelector('.toggle-switch__slider');
        expect(slider).toBeInTheDocument();
    });

    it('applies wrapper class', () => {
        const handleToggle = jest.fn();
        const { container } = render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const wrapper = container.querySelector('.toggle-switch-wrapper');
        expect(wrapper).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
        const handleToggle = jest.fn();
        const { container } = render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} />);
        const label = container.querySelector('.toggle-switch__label');
        expect(label).not.toBeInTheDocument();
    });

    it('renders with different labels', () => {
        const handleToggle = jest.fn();
        const { rerender } = render(<ToggleSwitchLib isActive={false} onToggle={handleToggle} label="Bluetooth" />);
        expect(screen.getByText('Bluetooth')).toBeInTheDocument();

        rerender(<ToggleSwitchLib isActive={false} onToggle={handleToggle} label="Notifications" />);
        expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
});