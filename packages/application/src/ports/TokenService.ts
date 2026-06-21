import type { AuthenticatedUser } from "@roldninja/domain";

export interface TokenService {
  sign(user: AuthenticatedUser): string;
  verify(token: string): AuthenticatedUser | null;
}
