import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityPicker } from '@/components/product/QuantityPicker';

describe('QuantityPicker', () => {
  it('renders current quantity value', () => {
    render(<QuantityPicker value={1} min={1} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toHaveTextContent('1');
  });

  it('decrement button is disabled at minimum', () => {
    render(<QuantityPicker value={1} min={1} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled();
  });

  it('increment button is disabled at maximum', () => {
    render(<QuantityPicker value={5} min={1} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
  });

  it('calls onChange with incremented value', async () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={2} min={1} max={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with decremented value', async () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={3} min={1} max={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('does not call onChange below minimum', async () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={1} min={1} max={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange above maximum', async () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={5} min={1} max={5} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects stock cap — max set to stock level', () => {
    render(<QuantityPicker value={2} min={1} max={2} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
  });

  it('has correct aria attributes on spinbutton', () => {
    render(<QuantityPicker value={3} min={1} max={8} onChange={vi.fn()} />);
    const spinbutton = screen.getByRole('spinbutton');
    expect(spinbutton).toHaveAttribute('aria-valuenow', '3');
    expect(spinbutton).toHaveAttribute('aria-valuemin', '1');
    expect(spinbutton).toHaveAttribute('aria-valuemax', '8');
  });
});
