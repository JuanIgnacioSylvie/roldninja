import { UnauthorizedError, toAuthenticatedUser, type UserRepository } from "@roldninja/domain";
import type { LoginResponseDTO } from "@roldninja/contracts";
import type { PasswordHasher } from "../../ports/PasswordHasher.js";
import type { TokenService } from "../../ports/TokenService.js";

export interface LoginInput {
  username: string;
  password: string;
}

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute({ username, password }: LoginInput): Promise<LoginResponseDTO> {
    const user = await this.users.findByUsername(username);
    if (!user) throw new UnauthorizedError("Usuario o contraseña incorrectos");

    const ok = await this.hasher.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError("Usuario o contraseña incorrectos");

    const authUser = toAuthenticatedUser(user);
    return { token: this.tokens.sign(authUser), user: authUser };
  }
}
