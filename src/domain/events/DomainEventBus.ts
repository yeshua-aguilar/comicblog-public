import type { DomainEvent } from './DomainEvents';

/**
 * Tipo para manejadores de eventos
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

/**
 * Bus de eventos de dominio (Event Bus)
 * Implementa el patrón Observer para eventos de dominio
 */
export class DomainEventBus {
  private static instance: DomainEventBus;
  private handlers: Map<string, EventHandler[]>;

  private constructor() {
    this.handlers = new Map();
  }

  /**
   * Obtiene la instancia singleton del Event Bus
   */
  static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  /**
   * Suscribe un manejador a un tipo de evento
   */
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler as EventHandler);
  }

  /**
   * Desuscribe un manejador de un tipo de evento
   */
  unsubscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const eventHandlers = this.handlers.get(eventName);
    if (!eventHandlers) {
      return;
    }

    const index = eventHandlers.indexOf(handler as EventHandler);
    if (index !== -1) {
      eventHandlers.splice(index, 1);
    }
  }

  /**
   * Publica un evento de dominio
   * Ejecuta todos los manejadores suscritos a ese tipo de evento
   */
  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName);
    if (!eventHandlers || eventHandlers.length === 0) {
      return;
    }

    // Ejecutar todos los manejadores
    const promises = eventHandlers.map(handler => {
      try {
        return Promise.resolve(handler(event));
      } catch (error) {
        console.error(`Error ejecutando handler para evento ${event.eventName}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Limpia todos los manejadores (útil para testing)
   */
  clearAll(): void {
    this.handlers.clear();
  }

  /**
   * Limpia manejadores de un evento específico
   */
  clearEvent(eventName: string): void {
    this.handlers.delete(eventName);
  }

  /**
   * Obtiene el número de manejadores suscritos a un evento
   */
  getHandlerCount(eventName: string): number {
    return this.handlers.get(eventName)?.length || 0;
  }
}

/**
 * Helper para crear una instancia global del Event Bus
 */
export const eventBus = DomainEventBus.getInstance();
