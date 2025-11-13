/**
 * Evento de dominio base
 * Todos los eventos de dominio deben heredar de esta clase
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;
  public readonly eventName: string;

  protected constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    return `${this.eventName}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Convierte el evento a formato primitivo para serialización
   */
  abstract toPrimitive(): Record<string, unknown>;
}

/**
 * Evento: Post creado
 */
export class PostCreatedEvent extends DomainEvent {
  public readonly slug: string;
  public readonly title: string;
  public readonly author: string;
  public readonly tags: string[];

  constructor(slug: string, title: string, author: string, tags: string[]) {
    super('PostCreated');
    this.slug = slug;
    this.title = title;
    this.author = author;
    this.tags = tags;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      slug: this.slug,
      title: this.title,
      author: this.author,
      tags: this.tags,
    };
  }
}

/**
 * Evento: Post actualizado
 */
export class PostUpdatedEvent extends DomainEvent {
  public readonly slug: string;
  public readonly changes: Record<string, unknown>;

  constructor(slug: string, changes: Record<string, unknown>) {
    super('PostUpdated');
    this.slug = slug;
    this.changes = changes;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      slug: this.slug,
      changes: this.changes,
    };
  }
}

/**
 * Evento: Post eliminado
 */
export class PostDeletedEvent extends DomainEvent {
  public readonly slug: string;
  public readonly title: string;

  constructor(slug: string, title: string) {
    super('PostDeleted');
    this.slug = slug;
    this.title = title;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      slug: this.slug,
      title: this.title,
    };
  }
}

/**
 * Evento: Tag agregado a post
 */
export class TagAddedToPostEvent extends DomainEvent {
  public readonly slug: string;
  public readonly tag: string;

  constructor(slug: string, tag: string) {
    super('TagAddedToPost');
    this.slug = slug;
    this.tag = tag;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      slug: this.slug,
      tag: this.tag,
    };
  }
}

/**
 * Evento: Tag eliminado de post
 */
export class TagRemovedFromPostEvent extends DomainEvent {
  public readonly slug: string;
  public readonly tag: string;

  constructor(slug: string, tag: string) {
    super('TagRemovedFromPost');
    this.slug = slug;
    this.tag = tag;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      slug: this.slug,
      tag: this.tag,
    };
  }
}

/**
 * Evento: Post buscado
 */
export class PostSearchedEvent extends DomainEvent {
  public readonly searchTerm: string;
  public readonly resultsCount: number;

  constructor(searchTerm: string, resultsCount: number) {
    super('PostSearched');
    this.searchTerm = searchTerm;
    this.resultsCount = resultsCount;
  }

  toPrimitive(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      searchTerm: this.searchTerm,
      resultsCount: this.resultsCount,
    };
  }
}
