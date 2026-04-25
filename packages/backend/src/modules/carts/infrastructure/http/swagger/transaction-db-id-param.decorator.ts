import { ApiParam } from '@nestjs/swagger';

export const transactionDbIdPathParam = ApiParam({
  name: 'transactionDbId',
  description: 'Identificador interno da transação (`Transaction.id`)',
  example: 1,
});
