import type { GetCartsResponseDto } from '@/lib/external-api';
import type { CartsByUserWithSummaryResponse } from '../dtos/carts-by-user-with-summary.dto';

export class CartsByUserWithSummaryMapper {
  static toWithSummary(
    data: GetCartsResponseDto,
  ): CartsByUserWithSummaryResponse {
    const totalSum = data.carts.reduce((acc, cart) => acc + cart.total, 0);
    return {
      ...data,
      summary: {
        transactionCount: data.carts.length,
        totalSum,
      },
    };
  }
}
