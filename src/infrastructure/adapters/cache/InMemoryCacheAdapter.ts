import type { ICacheRepository } from '../../../application/ports';

/**
 * Entrada del caché con tiempo de expiración
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * Configuración del adaptador de caché en memoria
 */
export interface InMemoryCacheConfig {
  defaultTTL?: number; // TTL por defecto en milisegundos
  maxSize?: number; // Tamaño máximo del caché (número de entradas)
  cleanupInterval?: number; // Intervalo de limpieza en milisegundos
}

/**
 * Adaptador de caché en memoria
 * Implementa ICacheRepository usando un Map en memoria
 */
export class InMemoryCacheAdapter<T> implements ICacheRepository<T> {
  private cache: Map<string, CacheEntry<T>>;
  private config: Required<InMemoryCacheConfig>;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: InMemoryCacheConfig = {}) {
    this.cache = new Map();
    this.config = {
      defaultTTL: config.defaultTTL ?? 5 * 60 * 1000, // 5 minutos por defecto
      maxSize: config.maxSize ?? 100, // 100 entradas por defecto
      cleanupInterval: config.cleanupInterval ?? 60 * 1000, // 1 minuto
    };

    // Iniciar limpieza automática de entradas expiradas
    this.startCleanupTimer();
  }

  /**
   * Inicia el temporizador de limpieza automática
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, this.config.cleanupInterval);

    // En Node.js, permitir que el proceso termine aunque el timer esté activo
    if (typeof this.cleanupTimer.unref === 'function') {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Detiene el temporizador de limpieza
   */
  public stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Limpia entradas expiradas del caché
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt < now) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Aplica la política de tamaño máximo (LRU básico)
   */
  private enforceMaxSize(): void {
    if (this.cache.size >= this.config.maxSize) {
      // Eliminar la entrada más antigua (primera insertada)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Verifica si una entrada está expirada
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    if (entry.expiresAt === null) {
      return false;
    }
    return entry.expiresAt < Date.now();
  }

  async get(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    this.enforceMaxSize();

    const actualTTL = ttl ?? this.config.defaultTTL;
    const expiresAt = actualTTL > 0 ? Date.now() + actualTTL : null;

    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    // Convertir patrón simple a regex
    // Ej: 'posts:*' -> /^posts:.*$/
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);

    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Obtiene estadísticas del caché
   */
  public getStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
    };
  }
}
