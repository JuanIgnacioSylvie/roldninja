import jwt from "jsonwebtoken";
import type { AuthenticatedUser } from "@roldninja/domain";
import type { TokenService } from "@roldninja/application";

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = "7d",
  ) {}

  sign(user: AuthenticatedUser): string {
    return jwt.sign(user, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): AuthenticatedUser | null {
    try {
      const decoded = jwt.verify(token, this.secret) as AuthenticatedUser & { iat: number; exp: number };
      return {
        id: decoded.id,
        username: decoded.username,
        displayName: decoded.displayName,
      };
    } catch {
      return null;
    }
  }
}
