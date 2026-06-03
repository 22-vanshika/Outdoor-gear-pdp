import type { ReactElement } from 'react';
import type { ColourSwatchProps } from './ColourSwatch.types';
import styles from './ColourSwatch.module.scss';

export function ColourSwatch({ colours, activeColourId, onSelect }: ColourSwatchProps): ReactElement {
  const activeColour = colours.find((c) => c.id === activeColourId);

  return (
    <div>
      <p className={styles.label}>
        Color:{' '}
        <span className={styles['label__value']}>
          {activeColour?.label ?? ''}
        </span>
      </p>
      <div className={styles.swatches} role="group" aria-label="Colour options">
        {colours.map((colour) => (
          <button
            key={colour.id}
            className={`${styles.swatch} ${activeColourId === colour.id ? styles['swatch--active'] : ''}`}
            onClick={() => onSelect(colour.id)}
            aria-label={`Select colour ${colour.label}`}
            aria-pressed={activeColourId === colour.id}
          >
            <span
              className={styles['swatch__inner']}
              style={{ backgroundColor: colour.hex }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
