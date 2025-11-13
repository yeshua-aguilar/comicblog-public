/**
 * Puerto (Interface) para el repositorio de caché
 * Define las operaciones de caché sin depender de la implementación
 */
export interface ICacheRepository<T> {
  /**
   * Obtiene un valor del caché
   * @param key Clave del valor a obtener
   * @returns El valor almacenado o null si no existe o expiró
   */
  get(key: string): Promise<T | null>;

  /**
   * Almacena un valor en el caché
   * @param key Clave para almacenar el valor
   * @param value Valor a almacenar
   * @param ttl Tiempo de vida en milisegundos (opcional)
   */
  set(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Elimina un valor del caché
   * @param key Clave del valor a eliminar
   */
  delete(key: string): Promise<void>;

  /**
   * Elimina múltiples valores del caché usando un patrón
   * @param pattern Patrón para buscar claves (ej: 'posts:*')
   */
  deletePattern(pattern: string): Promise<void>;

  /**
   * Limpia todo el caché
   */
  clear(): Promise<void>;

  /**
   * Verifica si existe una clave en el caché
   * @param key Clave a verificar
   */
  has(key: string): Promise<boolean>;
}
