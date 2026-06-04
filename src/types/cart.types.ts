export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  colourId: string;
  sizeId: string;
  quantity: number;
  maxQuantity: number;
}