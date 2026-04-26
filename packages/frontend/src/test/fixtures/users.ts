import type { UserDto } from "../../api/@types/user.types";

export function mockUser(overrides: Partial<UserDto> = {}): UserDto {
  return {
    id: 1,
    externalId: 100,
    firstName: "Ana",
    lastName: "Silva",
    email: "ana@example.com",
    phone: "+5511999990001",
    username: "ana",
    image: "https://example.com/a.png",
    role: "user",
    ...overrides,
  };
}
