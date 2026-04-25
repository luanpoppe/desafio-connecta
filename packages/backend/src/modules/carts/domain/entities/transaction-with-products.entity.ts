export interface TransactionProductLine {
  id: number;
  productExternalId: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface TransactionWithProducts {
  id: number;
  externalId: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  products: TransactionProductLine[];
  createdAt: Date;
  updatedAt: Date;
}
