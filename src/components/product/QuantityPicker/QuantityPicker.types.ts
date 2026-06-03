export interface QuantityPickerProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  showMaxLabel?: boolean;
}
