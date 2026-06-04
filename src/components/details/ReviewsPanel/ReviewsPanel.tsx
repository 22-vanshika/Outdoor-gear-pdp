import type { ReactElement } from 'react';
import type { ReviewsPanelProps } from './ReviewsPanel.types';
import styles from './ReviewsPanel.module.scss';

function renderStars(rating: number): ReactElement[] {
  return Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`material-symbols-outlined ${styles['star-icon']}`}
      style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
      aria-hidden="true"
    >
      star
    </span>
  ));
}

export function ReviewsPanel({ reviews }: ReviewsPanelProps): ReactElement {
  return (
    <div className={styles.panel}>
      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles['rating-block']}>
          <span className={styles['rating-score']}>{reviews.averageRating}</span>
          <div className={styles.stars} aria-label={`${reviews.averageRating} out of 5 stars`}>
            {renderStars(Math.round(reviews.averageRating))}
          </div>
          <span className={styles['rating-label']}>
            Based on {reviews.totalCount} verified reviews
          </span>
        </div>

        <div className={styles.breakdown}>
          {reviews.performanceBreakdown.map((item) => (
            <div key={item.label}>
              <div className={styles['breakdown__label-row']}>
                <span className={styles['breakdown__label']}>{item.label}</span>
                <span className={styles['breakdown__percent']}>{item.percent}%</span>
              </div>
              <div className={styles['breakdown__bar']}>
                <div
                  className={styles['breakdown__fill']}
                  style={{ width: `${item.percent}%` }}
                  role="progressbar"
                  aria-valuenow={item.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label}: ${item.percent}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className={styles['reviews-list']}>
        {reviews.items.map((review) => (
          <article key={review.id} className={styles.card}>
            <div className={styles['card__header']}>
              <div>
                <div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
                  {renderStars(review.rating)}
                </div>
                <h3 className={styles['card__title']}>{review.title}</h3>
              </div>
              <span className={styles['card__date']}>{review.date}</span>
            </div>

            <p className={styles['card__body']}>{review.body}</p>

            <div className={styles['card__footer']}>
              <div className={styles['card__author']}>
                <div className={styles['card__avatar']} aria-hidden="true">
                  {review.initials}
                </div>
                <div className={styles['card__author-info']}>
                  <span className={styles['card__author-name']}>{review.author}</span>
                  {review.verified && (
                    <span className={styles['card__verified']}>
                      <span
                        className={`material-symbols-outlined ${styles['card__verified-icon']}`}
                        aria-hidden="true"
                      >
                        verified
                      </span>
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              <div className={styles['card__helpful']}>
                <span
                  className={`material-symbols-outlined ${styles['card__helpful-icon']}`}
                  aria-hidden="true"
                >
                  thumb_up
                </span>
                {review.helpfulCount}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
