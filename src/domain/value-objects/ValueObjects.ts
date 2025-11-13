import { ValidationError } from '../errors';

/**
 * Value Object: Slug
 * Representa un identificador único normalizado para URLs
 */
export class Slug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Crea un Slug validado
   */
  static create(value: string): Slug {
    const normalized = this.normalize(value);
    this.validate(normalized);
    return new Slug(normalized);
  }

  /**
   * Normaliza un string a formato slug
   */
  private static normalize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Valida que el slug sea correcto
   */
  private static validate(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationError('El slug no puede estar vacío');
    }

    if (value.length < 3) {
      throw new ValidationError('El slug debe tener al menos 3 caracteres');
    }

    if (value.length > 200) {
      throw new ValidationError('El slug no puede exceder 200 caracteres');
    }

    if (!/^[a-z0-9-]+$/.test(value)) {
      throw new ValidationError('El slug solo puede contener letras minúsculas, números y guiones');
    }
  }

  /**
   * Obtiene el valor del slug
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara dos slugs
   */
  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/**
 * Value Object: Title
 * Representa el título de un post
 */
export class Title {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Title {
    this.validate(value);
    return new Title(value.trim());
  }

  private static validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('El título no puede estar vacío');
    }

    if (value.trim().length < 3) {
      throw new ValidationError('El título debe tener al menos 3 caracteres');
    }

    if (value.length > 200) {
      throw new ValidationError('El título no puede exceder 200 caracteres');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Title): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/**
 * Value Object: Author
 * Representa el autor de un post
 */
export class Author {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Author {
    this.validate(value);
    return new Author(value.trim());
  }

  private static validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('El autor no puede estar vacío');
    }

    if (value.trim().length < 2) {
      throw new ValidationError('El autor debe tener al menos 2 caracteres');
    }

    if (value.length > 100) {
      throw new ValidationError('El autor no puede exceder 100 caracteres');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Author): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/**
 * Value Object: Tag
 * Representa una etiqueta/género
 */
export class Tag {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Tag {
    this.validate(value);
    return new Tag(value.trim());
  }

  private static validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('La etiqueta no puede estar vacía');
    }

    if (value.length > 50) {
      throw new ValidationError('La etiqueta no puede exceder 50 caracteres');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Tag): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}

/**
 * Value Object: PostDate
 * Representa la fecha de un post
 */
export class PostDate {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  static create(value: string | Date): PostDate {
    const date = typeof value === 'string' ? new Date(value) : value;
    this.validate(date);
    return new PostDate(date);
  }

  static now(): PostDate {
    return new PostDate(new Date());
  }

  private static validate(value: Date): void {
    if (isNaN(value.getTime())) {
      throw new ValidationError('La fecha no es válida');
    }

    // No permitir fechas futuras
    if (value > new Date()) {
      throw new ValidationError('La fecha no puede ser futura');
    }

    // No permitir fechas muy antiguas (antes del año 2000)
    if (value < new Date('2000-01-01')) {
      throw new ValidationError('La fecha no puede ser anterior al año 2000');
    }
  }

  getValue(): Date {
    return this.value;
  }

  toISOString(): string {
    return this.value.toISOString().slice(0, 10);
  }

  equals(other: PostDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  toString(): string {
    return this.toISOString();
  }
}

/**
 * Value Object: Excerpt
 * Representa el extracto/descripción de un post
 */
export class Excerpt {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Excerpt {
    this.validate(value);
    return new Excerpt(value.trim());
  }

  private static validate(value: string): void {
    if (value.length > 500) {
      throw new ValidationError('El extracto no puede exceder 500 caracteres');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Excerpt): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
