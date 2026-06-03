import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types';
import { STORAGE_KEYS } from '@/constants';

// ─── Storage helpers ──────────────────────────────────────────────────────────

function readCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch {
    // Storage unavailable — fail silently
  }
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, colourId: string, sizeId: string) => void;
  updateQuantity: (productId: number, colourId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): ReactElement {
  // Lazy initialiser — reads localStorage once at mount, no flash-of-empty-cart
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());


  const addItem = useCallback((incoming: CartItem): void => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === incoming.productId &&
          i.colourId === incoming.colourId &&
          i.sizeId === incoming.sizeId
      );
      const next = existing
        ? prev.map((i) =>
            i.productId === incoming.productId &&
            i.colourId === incoming.colourId &&
            i.sizeId === incoming.sizeId
              ? { ...i, quantity: i.quantity + incoming.quantity }
              : i
          )
        : [...prev, incoming];
      writeCartToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback(
    (productId: number, colourId: string, sizeId: string): void => {
      setItems((prev) => {
        const next = prev.filter(
          (i) =>
            !(i.productId === productId &&
              i.colourId === colourId &&
              i.sizeId === sizeId)
        );
        writeCartToStorage(next);
        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, colourId: string, sizeId: string, quantity: number): void => {
      setItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter(
                (i) =>
                  !(i.productId === productId &&
                    i.colourId === colourId &&
                    i.sizeId === sizeId)
              )
            : prev.map((i) =>
                i.productId === productId &&
                i.colourId === colourId &&
                i.sizeId === sizeId
                  ? { ...i, quantity }
                  : i
              );
        writeCartToStorage(next);
        return next;
      });
    },
    []
  );

  const clearCart = useCallback((): void => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
    } catch {
      // Storage unavailable — fail silently
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return ctx;
}
