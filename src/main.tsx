import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '@/stores';
import './styles/main.scss';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
);