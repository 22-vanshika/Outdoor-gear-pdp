import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from '@/components/product/AddToCartButton';

describe('AddToCartButton', () => {
  it('renders Add to Cart in idle state', () => {
    render(
      <AddToCartButton state="idle" isSoldOut={false} isMaxedOut={false} onClick={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('is disabled and shows Sold Out when isSoldOut is true', () => {
    render(
      <AddToCartButton state="idle" isSoldOut={true} isMaxedOut={false} onClick={vi.fn()} />
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/sold out/i);
  });

  it('is disabled and shows Max Added when isMaxedOut is true', () => {
    render(
      <AddToCartButton state="idle" isSoldOut={false} isMaxedOut={true} onClick={vi.fn()} />
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/max added/i);
  });

  it('is disabled and shows Adding... in loading state', () => {
    render(
      <AddToCartButton state="loading" isSoldOut={false} isMaxedOut={false} onClick={vi.fn()} />
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/adding/i);
  });

  it('shows error state correctly', () => {
    render(
      <AddToCartButton state="error" isSoldOut={false} isMaxedOut={false} onClick={vi.fn()} />
    );
    expect(screen.getByRole('button')).toHaveTextContent(/try again/i);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <AddToCartButton state="idle" isSoldOut={true} isMaxedOut={false} onClick={onClick} />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick when enabled', async () => {
    const onClick = vi.fn();
    render(
      <AddToCartButton state="idle" isSoldOut={false} isMaxedOut={false} onClick={onClick} />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
