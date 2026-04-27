import { ExternalUserToPrismaMapper } from '../user.mapper';
import { makeExternalUserDto } from './external-user.fixture';

describe('ExternalUserToPrismaMapper', () => {
  it('maps DTO fields to Prisma create/update shape', () => {
    const dto = makeExternalUserDto({ id: 500, firstName: 'Zé' });
    const fields = ExternalUserToPrismaMapper.map(dto);

    expect(fields.firstName).toBe('Zé');
    expect(fields.email).toBe('ana@test.dev');
    expect(fields.role).toBe('user');
  });
});
