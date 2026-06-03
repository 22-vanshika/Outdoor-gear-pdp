import { useState, type ReactElement } from 'react';
import type { NavbarProps } from './Navbar.types';
import { useCartContext } from '@/stores';
import styles from './Navbar.module.scss';

const NAV_LINKS = [
  { label: 'Shop All', href: '#' },
  { label: 'Apparel', href: '#' },
  { label: 'Equipment', href: '#', active: true },
  { label: 'Journal', href: '#' },
];

export function Navbar({ onMenuToggle }: NavbarProps): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCartContext();

  const handleMenuToggle = (): void => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  return (
    <header className={styles.navbar}>
      {/* Mobile Hamburger Menu */}
      <button
        className={styles['menu-toggle']}
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={styles['menu-icon']} />
      </button>

      {/* Brand */}
      <div className={styles.brand}>
        <a href="/" className={styles['brand-link']}>
          EXTERIOR GEAR
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles['nav-desktop']}>
        <ul className={styles['nav-list']}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a 
                href={link.href} 
                className={`${styles['nav-link']} ${link.active ? styles['nav-link--active'] : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Icons */}
      <div className={styles['icons-group']}>
        <button
          className={styles['icon-btn']}
          aria-label="User account"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>
        <button
          className={styles['icon-btn']}
          aria-label="Shopping cart"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          {totalItems > 0 && (
            <span className={styles['cart-badge']}>{totalItems}</span>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <nav className={styles['nav-mobile']}>
          <ul className={styles['nav-list']}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a 
                  href={link.href} 
                  className={`${styles['nav-link']} ${link.active ? styles['nav-link--active'] : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
