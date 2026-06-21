export interface User {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
}

/** Identidad autenticada (sin secretos), usada en toda la app. */
export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
}

export function toAuthenticatedUser(user: User): AuthenticatedUser {
  return { id: user.id, username: user.username, displayName: user.displayName };
}
