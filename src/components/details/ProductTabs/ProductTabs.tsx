import { useState, type ReactElement } from 'react';
import type { TabId, ProductTabsProps } from './ProductTabs.types';
import { DescriptionPanel } from '../DescriptionPanel';
import { SpecificationsPanel } from '../SpecificationsPanel';
import { ReviewsPanel } from '../ReviewsPanel';
import { PRODUCT_DETAILS } from '@/data';
import styles from './ProductTabs.module.scss';

export function ProductTabs({ reviewCount }: ProductTabsProps): ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('description');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'description',    label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews',        label: `Reviews (${reviewCount})` },
  ];

  return (
    <div className={styles.tabs}>
      <div className={styles['tab-bar']} role="tablist" aria-label="Product details">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`${styles['tab-btn']} ${activeTab === tab.id ? styles['tab-btn--active'] : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={styles.panel}
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'description'    && <DescriptionPanel data={PRODUCT_DETAILS.description} />}
        {activeTab === 'specifications' && <SpecificationsPanel specs={PRODUCT_DETAILS.specs} />}
        {activeTab === 'reviews'        && <ReviewsPanel reviews={PRODUCT_DETAILS.reviews} />}
      </div>
    </div>
  );
}
