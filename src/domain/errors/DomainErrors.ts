/**
 * Errores de dominio personalizados
 * Estos errores representan violaciones de reglas de negocio
 */

/**
 * Error base para errores de dominio
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

/**
 * Error de validación
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error cuando una entidad no se encuentra
 */
export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} con identificador "${identifier}" no encontrado`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error cuando ya existe una entidad con el mismo identificador
 */
export class AlreadyExistsError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} con identificador "${identifier}" ya existe`);
    this.name = 'AlreadyExistsError';
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}

/**
 * Error de operación no permitida
 */
export class ForbiddenOperationError extends DomainError {
  constructor(operation: string, reason: string) {
    super(`Operación "${operation}" no permitida: ${reason}`);
    this.name = 'ForbiddenOperationError';
    Object.setPrototypeOf(this, ForbiddenOperationError.prototype);
  }
}
