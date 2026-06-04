import type { ReactElement } from 'react';
import type { DescriptionPanelProps } from './DescriptionPanel.types';
import styles from './DescriptionPanel.module.scss';

export function DescriptionPanel({ data }: DescriptionPanelProps): ReactElement {
  return (
    <div className={styles.panel}>
      <div className={styles['image-wrapper']}>
        <img
          src={data.image}
          alt={data.imageAlt}
          className={styles.image}
          width={800}
          height={600}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.headline}>{data.headline}</h2>
        <p className={styles.body}>{data.body}</p>
        <ul className={styles.features} aria-label="Key features">
          {data.features.map((feature) => (
            <li key={feature.id} className={styles.feature}>
              <span
                className={`material-symbols-outlined ${styles['feature__icon']}`}
                aria-hidden="true"
              >
                check_circle
              </span>
              <span className={styles['feature__text']}>
                <span className={styles['feature__label']}>{feature.label}: </span>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
