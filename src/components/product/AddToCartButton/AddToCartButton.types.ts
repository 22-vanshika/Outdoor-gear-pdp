export type AddToCartState = 'idle' | 'loading' | 'success' | 'error';

export interface AddToCartButtonProps {
  state: AddToCartState;
  isSoldOut: boolean;
  onClick: () => void;
}
