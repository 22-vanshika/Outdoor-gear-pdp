import { useState, type ReactElement } from 'react';
import styles from './Footer.module.scss';

const SHOP_LINKS = [
  { label: 'Sustainability',    href: '#' },
  { label: 'Track Order',       href: '#' },
  { label: 'Shipping & Returns',href: '#' },
];

const SUPPORT_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact',        href: '#' },
  { label: 'FAQs',           href: '#' },
];

const ALL_LINKS = [...SHOP_LINKS, ...SUPPORT_LINKS];

export function Footer(): ReactElement {
  const [email, setEmail] = useState<string>('');

  function handleNewsletterSubmit(e: React.FormEvent): void {
    e.preventDefault();
    setEmail('');
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* Brand */}
          <div>
            <p className={styles['brand__name']}>Exterior Gear</p>
            <p className={styles['brand__tagline']}>
              Crafting technical tools for the modern explorer.
              Built for the elements, designed for life.
            </p>
          </div>

          {/* Shop — desktop only column */}
          <div className={styles['desktop-col']}>
            <p className={styles['col__heading']}>Shop</p>
            <ul className={styles['col__links']}>
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles['col__link']}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — desktop only column */}
          <div className={styles['desktop-col']}>
            <p className={styles['col__heading']}>Support</p>
            <ul className={styles['col__links']}>
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles['col__link']}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className={styles['newsletter__heading']}>Newsletter</p>
            <form
              className={styles['newsletter__form']}
              onSubmit={handleNewsletterSubmit}
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                className={styles['newsletter__input']}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className={styles['newsletter__btn']}
                aria-label="Subscribe to newsletter"
              >
                <span
                  className={`material-symbols-outlined ${styles['newsletter__icon']}`}
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>
            </form>
          </div>

        </div>

        {/* Mobile links grid — shown only on mobile */}
        <div className={styles['mobile-links']} aria-label="Footer links">
          {ALL_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles['col__link']}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p className={styles['copyright__text']}>
            © 2026 Exterior Gear. Built for the Elements.
          </p>
        </div>
      </div>
    </footer>
  );
}
