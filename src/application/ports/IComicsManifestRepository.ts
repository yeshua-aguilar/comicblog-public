import type { BlogPost } from '../../domain/entities';
import type { Genre } from '../../domain/entities';

/**
 * Puerto (Interface) para el repositorio del manifiesto de cómics
 * Maneja operaciones relacionadas con el documento de manifiesto
 */
export interface IComicsManifestRepository {
  /**
   * Obtiene la lista de cómics desde el manifiesto
   */
  getComicsList(): Promise<BlogPost[]>;

  /**
   * Obtiene géneros con conteos desde el manifiesto
   */
  getGenresWithCounts(): Promise<Genre[]>;

  /**
   * Actualiza el manifiesto de cómics
   */
  updateManifest(): Promise<void>;

  /**
   * Invalida el cache de la lista de cómics
   */
  invalidateComicsListCache(): void;

  /**
   * Invalida el cache de géneros
   */
  invalidateGenresCache(): void;
}
