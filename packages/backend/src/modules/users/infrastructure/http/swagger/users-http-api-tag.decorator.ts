import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function UsersHttpApiTag() {
  return applyDecorators(ApiTags('users'));
}
