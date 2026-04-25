import { ApiParam } from '@nestjs/swagger';

/** Partilhado pelas rotas com `:userId` no path. */
export const userIdPathParam = ApiParam({
  name: 'userId',
  description: 'Identificador interno do utilizador (`User.id`)',
  example: 1,
});
