/**
 * Entidad de dominio: Genre
 * Representa un género/categoría con su conteo
 */
export interface Genre {
  genre: string;
  count: number;
}

/**
 * Tipo de datos para Genre
 */
export type GenreData = Genre;
