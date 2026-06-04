import type { ReactElement } from 'react';
import styles from './PrecisionEngineering.module.scss';

// Mobile shows the 1-2-1 grid with specific feature text
const MOBILE_CARDS = [
  { id: 'hydration', icon: 'water_drop',  label: 'Hydration Ready',       description: 'Integrated 3L bladder sleeve with dual-exit ports.',                 variant: 'dark' as const  },
  { id: 'ipx6',      icon: 'verified_user',label: 'IPX6 Rated',            description: 'Weatherproof zippers & base.',                                       variant: 'default' as const   },
  { id: 'ergo',      icon: 'architecture',label: 'Ergo-Harness',          description: '3D molded spine adaptation.',                                        variant: 'default' as const },
  { id: 'loops',     icon: 'ac_unit',     label: 'Technical Loops',       description: 'Quick-deploy bungees for technical climbing tool attachment.',       variant: 'accent' as const },
];

export function PrecisionEngineering(): ReactElement {
  return (
    <section className={styles.section} aria-labelledby="precision-heading">
      <div className={styles.header}>
        <h2 id="precision-heading" className={styles.headline}>
          Precision Engineering
        </h2>
        <p className={styles.subtitle}>
          Every detail considered. Every material tested in the harshest
          environments on Earth.
        </p>
      </div>

      {/* ── Desktop bento grid ── */}
      <div className={styles.bento} aria-hidden="false">

        {/* Large image card */}
        <div className={styles['bento__card--large']}>
          <div className={styles['img-card']}>
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
              alt="Backpack laid flat with climbing gear"
              className={styles['img-card__image']}
              width={800}
              height={600}
              loading="lazy"
            />
            <div className={styles['img-card__overlay']}>
              <p className={styles['img-card__label']}>Modular Organization</p>
              <p className={styles['img-card__description']}>
                Customizable internal dividers for camera gear or climbing hardware.
              </p>
            </div>
          </div>
        </div>

        {/* Small image card */}
        <div className={styles['bento__card--image-sm']}>
          <div className={styles['img-card']}>
            <img
              src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80"
              alt="Pack hardware detail"
              className={styles['img-card__image']}
              width={600}
              height={400}
              loading="lazy"
            />
            <div className={styles['img-card__overlay']}>
              <p className={styles['img-card__label']}>ErgoSupport Tech</p>
              <p className={styles['img-card__description']}>
                Precision-engineered load transfer system.
              </p>
            </div>
          </div>
        </div>

        {/* Feature card 1 — top right */}
        <div className={styles['bento__card--feature-1']}>
          <div className={`${styles['feature-card']} ${styles['feature-card--default']}`}>
            <span className={`material-symbols-outlined ${styles['feature-card__icon']}`} aria-hidden="true">
              water_drop
            </span>
            <span className={styles['feature-card__label']}>Hydration Ready</span>
            <p className={styles['feature-card__description']}>
              Integrated 3L bladder sleeve with dual-exit ports.
            </p>
          </div>
        </div>

        {/* Feature card 2 — bottom middle */}
        <div className={styles['bento__card--feature-2']}>
          <div className={`${styles['feature-card']} ${styles['feature-card--accent']}`}>
            <span className={`material-symbols-outlined ${styles['feature-card__icon']}`} aria-hidden="true">
              storm
            </span>
            <span className={styles['feature-card__label']}>IPX6 Rated</span>
            <p className={styles['feature-card__description']}>
              Weatherproof zippers and TPU-coated base.
            </p>
          </div>
        </div>

        {/* Feature card 3 — bottom right */}
        <div className={styles['bento__card--feature-3']}>
          <div className={`${styles['feature-card']} ${styles['feature-card--dark']}`}>
            <span className={`material-symbols-outlined ${styles['feature-card__icon']}`} aria-hidden="true">
              architecture
            </span>
            <span className={styles['feature-card__label']}>Ergo-Harness</span>
            <p className={styles['feature-card__description']}>
              3D molded spine adaptation for all-day carry.
            </p>
          </div>
        </div>

      </div>

      {/* ── Mobile stacked cards ── */}
      <div className={styles['mobile-stack']}>
        {MOBILE_CARDS.map((card) => (
          <div
            key={card.id}
            className={`${styles['mobile-card']} ${styles[`mobile-card--${card.variant}`]}`}
          >
            <span
              className={`material-symbols-outlined ${styles['mobile-card__icon']}`}
              aria-hidden="true"
            >
              {card.icon}
            </span>
            <span className={styles['mobile-card__label']}>{card.label}</span>
            <p className={styles['mobile-card__description']}>{card.description}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
