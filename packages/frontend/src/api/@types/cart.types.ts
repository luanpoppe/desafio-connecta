export interface CartDto {
  id: number;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartsByUserSummary {
  transactionCount: number;
  totalSum: number;
}

export interface CartsByUserWithSummaryResponse {
  carts: CartDto[];
  total: number;
  skip: number;
  limit: number;
  summary: CartsByUserSummary;
}
