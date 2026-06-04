import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SizeSelector } from '@/components/product/SizeSelector';
import type { Size } from '@/types';

const SIZES: Size[] = [
  { id: '20l', label: '20L', description: 'Standard',  stock: 8, status: 'available' },
  { id: '30l', label: '30L', description: 'Low Stock', stock: 2, status: 'low_stock' },
  { id: '40l', label: '40L', description: 'Sold Out',  stock: 0, status: 'sold_out'  },
];

describe('SizeSelector', () => {
  it('renders all size buttons', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /20L/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /30L/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /40L/i })).toBeInTheDocument();
  });

  it('sold-out size button is disabled', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /40L/i })).toBeDisabled();
  });

  it('sold-out size button has aria-disabled="true"', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /40L/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('sold-out size button does not call onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /40L/i }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('available size button calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /30L/i }));
    expect(onSelect).toHaveBeenCalledWith('30l');
  });

  it('active size button has aria-pressed="true"', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /20L/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('inactive size button has aria-pressed="false"', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /30L/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('low stock size shows stock count', () => {
    render(<SizeSelector sizes={SIZES} activeSizeId="20l" onSelect={vi.fn()} />);
    expect(screen.getByText(/only 2 left/i)).toBeInTheDocument();
  });
});
