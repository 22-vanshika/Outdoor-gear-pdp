export interface DescriptionFeature {
  id: string;
  label: string;
  text: string;
}

export interface SpecItem {
  id: string;
  category: string;
  name: string;
  value: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  helpfulCount: number;
  verified: boolean;
}

export interface ProductDetailsData {
  description: {
    headline: string;
    body: string;
    features: DescriptionFeature[];
    image: string;
    imageAlt: string;
  };
  specs: SpecItem[];
  reviews: {
    averageRating: number;
    totalCount: number;
    items: ReviewItem[];
    performanceBreakdown: { label: string; percent: number }[];
  };
}

export const PRODUCT_DETAILS: ProductDetailsData = {
  description: {
    headline: 'Built for the Elements.',
    body: "The Alpine Ascent Pack isn't just a bag — it's a tool. Designed with feedback from mountain guides in the Cascades, it features a unique top-loading system that allows for rapid access to safety gear while keeping the center of gravity low and tight to the body.",
    features: [
      {
        id: 'cordura',
        label: '1000D Cordura® Shell',
        text: 'Military-grade abrasion resistance that withstands granite scrapes and icy conditions.',
      },
      {
        id: 'ergo',
        label: 'ErgoHarness System',
        text: 'Contoured foam padding and adjustable load lifters ensure comfort on 12-hour summit bids.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=60&fm=webp',
    imageAlt: 'Hiker wearing the Alpine Ascent Pack in a misty forest',
  },
  specs: [
    { id: 'shell',    category: 'Construction', name: 'Shell Material',       value: '1000D Cordura® Nylon / DWR Finish' },
    { id: 'capacity', category: 'Storage',      name: 'Capacity Range',       value: '15L / 20L / 30L / 40L / 50L' },
    { id: 'hardware', category: 'Security',     name: 'Hardware',             value: 'YKK® AquaGuard® Water-Repellent Zippers' },
    { id: 'device',   category: 'Protection',   name: 'Device Compatibility', value: 'Padded 16" Laptop + 11" Tablet Sleeves' },
    { id: 'pockets',  category: 'Utility',      name: 'Pocket Geometry',      value: '2× Expandable Side, 1× Quick-Access Lid, 1× Hidden Passport' },
    { id: 'weight',   category: 'Metrics',      name: 'Unit Weight',          value: '1.2 kg / 2.6 lbs (Empty — 30L Size)' },
    { id: 'hydration',category: 'Utility',      name: 'Hydration',            value: 'Integrated 3L Bladder Sleeve, Dual-Exit Ports' },
    { id: 'rating',   category: 'Protection',   name: 'Weather Rating',       value: 'IPX6 Weatherproof' },
  ],
  reviews: {
    averageRating: 4.9,
    totalCount: 48,
    performanceBreakdown: [
      { label: 'Durability',   percent: 98 },
      { label: 'Versatility',  percent: 94 },
      { label: 'Comfort',      percent: 92 },
    ],
    items: [
      {
        id: 'review-1',
        author: 'Marcus V.',
        initials: 'MV',
        date: 'Oct 12, 2023',
        rating: 5,
        title: 'Indestructible Technical Tool',
        body: 'The 1000D Cordura shell has survived abrasive granite chimneys across three continents. It\'s essentially a soft-sided vault for your gear. The ErgoHarness system is where this truly shines — I can carry 40lbs all day without the usual shoulder fatigue.',
        helpfulCount: 24,
        verified: true,
      },
      {
        id: 'review-2',
        author: 'Sarah L.',
        initials: 'SL',
        date: 'Sep 28, 2023',
        rating: 5,
        title: 'Best-in-class hydration routing',
        body: 'Unbeatable harness system. The hydration routing is also best-in-class, very well thought out for mountain photographers. I\'ve put this through two seasons in the Pacific Northwest and it still looks brand new.',
        helpfulCount: 18,
        verified: true,
      },
      {
        id: 'review-3',
        author: 'James T.',
        initials: 'JT',
        date: 'Aug 14, 2023',
        rating: 5,
        title: 'Worth every penny',
        body: 'Bought this for a 3-week trek in Patagonia. Survived everything from torrential rain to dry desert wind. The modular organisation system is genius — I never have to unpack everything to find what I need.',
        helpfulCount: 31,
        verified: true,
      },
    ],
  },
};
