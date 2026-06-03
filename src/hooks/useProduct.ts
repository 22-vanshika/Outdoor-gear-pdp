import { useReducer, useEffect } from 'react';
import { fetchProductById } from '@/services';
import type { EnrichedProduct } from '@/types';

interface UseProductReturn {
  product: EnrichedProduct | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'fetch_start' }
  | { type: 'fetch_success'; product: EnrichedProduct }
  | { type: 'fetch_error'; error: string };

function reducer(_state: UseProductReturn, action: Action): UseProductReturn {
  switch (action.type) {
    case 'fetch_start':
      return { product: null, isLoading: true, error: null };
    case 'fetch_success':
      return { product: action.product, isLoading: false, error: null };
    case 'fetch_error':
      return { product: null, isLoading: false, error: action.error };
  }
}

const initialState: UseProductReturn = { product: null, isLoading: true, error: null };

export function useProduct(id: string): UseProductReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'fetch_start' });

    fetchProductById(id)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', product: data });
      })
      .catch((err: Error) => {
        if (!cancelled) dispatch({ type: 'fetch_error', error: err.message });
      });

    return () => { cancelled = true; };
  }, [id]);

  return state;
}
