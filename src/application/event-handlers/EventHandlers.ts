import { eventBus } from '../../domain/events';
import type { DomainEvent } from '../../domain/events';

/**
 * Manejadores de eventos de ejemplo
 * Estos se pueden mover a la capa de infraestructura o presentación según necesidad
 */

/**
 * Logger de eventos para debugging y auditoría
 */
export class EventLogger {
  static subscribe(): void {
    // Suscribirse a todos los eventos comunes
    eventBus.subscribe('PostCreated', (event: DomainEvent) => {
      console.log('[EVENTO] Post Creado:', event.toPrimitive());
    });

    eventBus.subscribe('PostUpdated', (event: DomainEvent) => {
      console.log('[EVENTO] Post Actualizado:', event.toPrimitive());
    });

    eventBus.subscribe('PostDeleted', (event: DomainEvent) => {
      console.log('[EVENTO] Post Eliminado:', event.toPrimitive());
    });

    eventBus.subscribe('PostSearched', (event: DomainEvent) => {
      console.log('[EVENTO] Búsqueda realizada:', event.toPrimitive());
    });

    eventBus.subscribe('TagAddedToPost', (event: DomainEvent) => {
      console.log('[EVENTO] Tag agregado:', event.toPrimitive());
    });

    eventBus.subscribe('TagRemovedFromPost', (event: DomainEvent) => {
      console.log('[EVENTO] Tag eliminado:', event.toPrimitive());
    });
  }

  static unsubscribe(): void {
    eventBus.clearAll();
  }
}

/**
 * Handler para invalidar caché cuando se modifican posts
 * Este es un ejemplo de cómo usar eventos para coordinar acciones
 */
export class CacheInvalidationHandler {
  private cacheService: { invalidate: (pattern: string) => Promise<void> };

  constructor(cacheService: { invalidate: (pattern: string) => Promise<void> }) {
    this.cacheService = cacheService;
  }

  subscribe(): void {
    eventBus.subscribe('PostCreated', async () => {
      await this.cacheService.invalidate('posts:*');
    });

    eventBus.subscribe('PostUpdated', async () => {
      await this.cacheService.invalidate('posts:*');
    });

    eventBus.subscribe('PostDeleted', async () => {
      await this.cacheService.invalidate('posts:*');
    });
  }
}

/**
 * Handler para notificaciones (ejemplo de extensibilidad)
 */
export class NotificationHandler {
  subscribe(): void {
    eventBus.subscribe('PostCreated', async (event: DomainEvent) => {
      const data = event.toPrimitive();
      console.log(`📢 Nuevo post creado: "${data.title}"`);
      // Aquí podrías enviar notificaciones push, emails, etc.
    });

    eventBus.subscribe('PostDeleted', async (event: DomainEvent) => {
      const data = event.toPrimitive();
      console.log(`🗑️ Post eliminado: "${data.title}"`);
    });
  }
}

/**
 * Inicializa todos los handlers de eventos
 */
export function initializeEventHandlers(): void {
  EventLogger.subscribe();
  // Aquí puedes agregar más handlers según sea necesario
  // new NotificationHandler().subscribe();
}
