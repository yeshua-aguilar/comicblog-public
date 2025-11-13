import { ValidationError } from '../errors';

/**
 * Interfaz simple para mantener compatibilidad
 */
export interface Genre {
  genre: string;
  count: number;
}

/**
 * Clase de entidad Genre con validaciones de dominio
 */
export class GenreEntity {
  private readonly _genre: string;
  private _count: number;

  private constructor(genre: string, count: number) {
    this._genre = genre;
    this._count = count;
  }

  /**
   * Crea una nueva entidad Genre validada
   */
  static create(genre: string, count: number): GenreEntity {
    this.validate(genre, count);
    return new GenreEntity(genre.trim(), count);
  }

  /**
   * Crea una entidad desde datos simples (DTO)
   */
  static fromPrimitive(data: Genre): GenreEntity {
    return GenreEntity.create(data.genre, data.count);
  }

  /**
   * Validaciones de negocio
   */
  private static validate(genre: string, count: number): void {
    if (!genre || genre.trim().length === 0) {
      throw new ValidationError('El género no puede estar vacío');
    }

    if (genre.length > 50) {
      throw new ValidationError('El género no puede exceder 50 caracteres');
    }

    if (count < 0) {
      throw new ValidationError('El conteo no puede ser negativo');
    }

    if (!Number.isInteger(count)) {
      throw new ValidationError('El conteo debe ser un número entero');
    }
  }

  /**
   * Convierte la entidad a formato simple (DTO)
   */
  toPrimitive(): Genre {
    return {
      genre: this._genre,
      count: this._count,
    };
  }

  // Getters
  get genre(): string {
    return this._genre;
  }

  get count(): number {
    return this._count;
  }

  // Métodos de negocio

  /**
   * Incrementa el contador
   */
  increment(): void {
    this._count++;
  }

  /**
   * Decrementa el contador
   */
  decrement(): void {
    if (this._count > 0) {
      this._count--;
    }
  }

  /**
   * Establece un nuevo conteo
   */
  setCount(newCount: number): void {
    if (newCount < 0) {
      throw new ValidationError('El conteo no puede ser negativo');
    }
    if (!Number.isInteger(newCount)) {
      throw new ValidationError('El conteo debe ser un número entero');
    }
    this._count = newCount;
  }

  /**
   * Compara géneros (case-insensitive)
   */
  equals(other: GenreEntity): boolean {
    return this._genre.toLowerCase() === other._genre.toLowerCase();
  }
}

// Mantener tipo original para compatibilidad
export type GenreData = Genre;
