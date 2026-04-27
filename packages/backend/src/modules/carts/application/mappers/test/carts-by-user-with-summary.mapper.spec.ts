import type { GetCartsResponseDto } from '@/lib/external-api';
import { CartsByUserWithSummaryMapper } from '../carts-by-user-with-summary.mapper';

describe('CartsByUserWithSummaryMapper', () => {
  it('adds summary with transaction count and total sum', () => {
    const data: GetCartsResponseDto = {
      carts: [
        {
          id: 1,
          products: [],
          total: 10,
          discountedTotal: 9,
          userId: 5,
          totalProducts: 1,
          totalQuantity: 1,
        },
        {
          id: 2,
          products: [],
          total: 25.5,
          discountedTotal: 20,
          userId: 5,
          totalProducts: 2,
          totalQuantity: 3,
        },
      ],
      total: 2,
      skip: 0,
      limit: 10,
    };

    const out = CartsByUserWithSummaryMapper.toWithSummary(data);

    expect(out.summary.transactionCount).toBe(2);
    expect(out.summary.totalSum).toBe(35.5);
    expect(out.carts).toEqual(data.carts);
    expect(out.total).toBe(2);
  });

  it('handles empty carts', () => {
    const data: GetCartsResponseDto = {
      carts: [],
      total: 0,
      skip: 0,
      limit: 10,
    };
    const out = CartsByUserWithSummaryMapper.toWithSummary(data);
    expect(out.summary.transactionCount).toBe(0);
    expect(out.summary.totalSum).toBe(0);
  });
});
