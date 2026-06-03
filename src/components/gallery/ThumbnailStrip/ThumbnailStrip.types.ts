export interface ThumbnailStripProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}