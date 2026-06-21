import { DomainError } from "@roldninja/domain";

const STATUS_BY_CODE: Record<string, number> = {
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

export function httpStatusForError(err: unknown): number {
  if (err instanceof DomainError) return STATUS_BY_CODE[err.code] ?? 400;
  return 500;
}

export function errorMessage(err: unknown): string {
  if (err instanceof DomainError) return err.message;
  return "Error interno del servidor";
}
