/** Errores de dominio. Las capas externas los traducen a HTTP/socket. */

export type DomainErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT";

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode = "VALIDATION",
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Datos invalidos") {
    super(message, "VALIDATION");
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "No autenticado") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Sin permiso") {
    super(message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "No encontrado") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class InvalidDiceNotationError extends ValidationError {
  constructor(notation: string, detail?: string) {
    super(detail ?? `Notacion de dados invalida: "${notation}"`);
    this.name = "InvalidDiceNotationError";
  }
}
