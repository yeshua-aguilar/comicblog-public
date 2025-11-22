# Arquitectura Hexagonal - Comic Blog

Este proyecto ha sido refactorizado siguiendo los principios de **Arquitectura Hexagonal** (también conocida como Ports and Adapters).

## 📁 Estructura del Proyecto

```
src/
├── domain/                          # Capa de Dominio
│   ├── entities/                    # Entidades del negocio
│   │   ├── BlogPost.ts             # Entidad de post (interface simple)
│   │   ├── BlogPostEntity.ts       # Entidad con validaciones
│   │   ├── Genre.ts                # Entidad de género (interface)
│   │   ├── GenreEntity.ts          # Entidad de género con validaciones
│   │   └── index.ts
│   ├── value-objects/              # Objetos de valor
│   │   ├── ValueObjects.ts         # Slug, Title, Author, Tag, etc.
│   │   └── index.ts
│   ├── errors/                     # Errores de dominio
│   │   ├── DomainErrors.ts         # ValidationError, NotFoundError, etc.
│   │   └── index.ts
│   └── events/                     # Eventos de dominio
│       ├── DomainEvents.ts         # PostCreated, PostUpdated, etc.
│       ├── DomainEventBus.ts       # Event Bus (patrón Observer)
│       └── index.ts
│
├── application/                     # Capa de Aplicación
│   ├── ports/                       # Interfaces (Puertos)
│   │   ├── IBlogRepository.ts      # Puerto para repositorio de blogs
│   │   ├── IComicsManifestRepository.ts
│   │   ├── ICacheRepository.ts     # Puerto para caché
│   │   └── index.ts
│   │
│   ├── use-cases/                   # Casos de Uso
│   │   ├── GetComicsListUseCase.ts
│   │   ├── GetPostBySlugUseCase.ts
│   │   ├── SearchComicsUseCase.ts
│   │   ├── GetGenresWithCountsUseCase.ts
│   │   ├── CreatePostUseCase.ts
│   │   ├── UpdatePostUseCase.ts
│   │   ├── DeletePostUseCase.ts
│   │   ├── CreatePostWithSlugUseCase.ts
│   │   └── index.ts
│   │
│   └── event-handlers/             # Manejadores de eventos
│       ├── EventHandlers.ts        # EventLogger, NotificationHandler
│       └── index.ts
│
├── infrastructure/                  # Capa de Infraestructura
│   ├── adapters/                    # Adaptadores
│   │   ├── firebase/               # Adaptador Firebase
│   │   │   ├── firebaseConfig.ts
│   │   │   ├── FirebaseBlogRepository.ts
│   │   │   ├── FirebaseComicsManifestRepository.ts
│   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── cache/                  # Adaptadores de caché
│   │       ├── IndexedDBCacheAdapter.ts # Caché persistente (IndexedDB)
│   │       ├── CachedBlogRepository.ts  # Decorator con caché
│   │       └── index.ts
│   │
│   └── services/                    # Servicios Facade
│       └── blogService.ts          # Servicio que expone casos de uso
│
└── presentation/                    # Capa de Presentación
    ├── components/                  # Componentes React
    │   ├── BlogList.tsx
    │   ├── BlogPost.tsx
    │   ├── ComicPost.tsx
    │   ├── Header.tsx
    │   └── SearchBar.tsx
    │
    ├── contexts/                    # Contextos y Hooks de React
    │   ├── authContext.ts          # Contexto de autenticación
    │   ├── loginContexto.tsx       # Provider de autenticación
    │   ├── useAuth.ts              # Hook personalizado de auth
    │   └── index.ts
    │
    ├── views/                       # Vistas/Páginas
    │   ├── home.tsx
    │   ├── genero.tsx
    │   ├── contenido.tsx
    │   └── admin/
    │       ├── dashboard.tsx
    │       └── login.tsx
    │
    └── assets/                      # Recursos estáticos
        └── css/
```

## 🏗️ Capas de la Arquitectura

### 1. Domain (Dominio)
**Propósito**: Contiene la lógica de negocio pura y las entidades del dominio.

- **Independiente**: No depende de ninguna otra capa
- **Entidades**: Representan los conceptos del negocio (BlogPost, Genre)
- **Value Objects**: Encapsulan validaciones y reglas (Slug, Title, Author, Tag, etc.)
- **Errores de Dominio**: Excepciones específicas del negocio (ValidationError, NotFoundError)
- **Eventos de Dominio**: Notificaciones sobre cambios importantes (PostCreated, PostUpdated, etc.)
- **Sin dependencias externas**: No conoce Firebase, React, ni ninguna tecnología específica

**Archivos principales**:
- `BlogPost.ts` / `BlogPostEntity.ts`: Estructura de un post con validaciones
- `Genre.ts` / `GenreEntity.ts`: Estructura de género/categoría con lógica de negocio
- `ValueObjects.ts`: Objetos de valor inmutables con validaciones
- `DomainErrors.ts`: Excepciones personalizadas del dominio
- `DomainEvents.ts`: Eventos que representan acciones del sistema
- `DomainEventBus.ts`: Bus de eventos (patrón Observer)

### 2. Application (Aplicación)
**Propósito**: Contiene la lógica de aplicación y coordina el flujo de datos.

#### Ports (Puertos)
Interfaces que definen contratos para servicios externos:
- `IBlogRepository`: Operaciones CRUD para blogs
- `IComicsManifestRepository`: Operaciones sobre el manifiesto de cómics
- `ICacheRepository`: Operaciones de caché genérico

#### Use Cases (Casos de Uso)
Cada caso de uso representa una operación del sistema:
- **GetComicsListUseCase**: Obtiene lista de cómics
- **GetPostBySlugUseCase**: Obtiene un post específico
- **CreatePostUseCase**: Crea un nuevo post (con validaciones y eventos)
- **UpdatePostUseCase**: Actualiza un post existente (con validaciones y eventos)
- **DeletePostUseCase**: Elimina un post (con validaciones y eventos)
- **SearchComicsUseCase**: Busca cómics (emite eventos de búsqueda)
- **GetGenresWithCountsUseCase**: Obtiene géneros con conteos

**Características**:
- Contienen validaciones de negocio usando entidades y value objects
- Orquestan operaciones entre repositorios
- Emiten eventos de dominio para notificar cambios
- Son independientes de la implementación

#### Event Handlers (Manejadores de Eventos)
- **EventLogger**: Registra todos los eventos para auditoría
- **CacheInvalidationHandler**: Invalida caché en respuesta a eventos
- **NotificationHandler**: Envía notificaciones (extensible)

### 3. Infrastructure (Infraestructura)
**Propósito**: Implementa los puertos definidos en la capa de aplicación.

#### Adapters (Adaptadores)
Implementaciones concretas de los puertos:

**Firebase Adapters**:
- `FirebaseBlogRepository`: Implementa `IBlogRepository` usando Firestore
- `FirebaseComicsManifestRepository`: Implementa `IComicsManifestRepository`
- Maneja conversión de datos entre Firestore y entidades de dominio
- Gestiona caché para optimizar consultas

**Cache Adapters**:
- `IndexedDBCacheAdapter`: Implementa `ICacheRepository` usando **IndexedDB**
  - Persistencia de datos (sobrevive a recargas)
  - Configuración de TTL (Time To Live)
  - Limpieza automática de entradas expiradas
  - Sin límites estrictos de tamaño (depende del disco)
  - Soporte para patrones de búsqueda de claves
- `CachedBlogRepository`: Decorator que añade caché a cualquier `IBlogRepository`
  - Patrón Decorator para añadir funcionalidad sin modificar el original
  - Invalidación inteligente de caché en operaciones de escritura
  - TTLs configurables por tipo de operación

#### Services (Servicios)
- `blogService.ts`: Servicio Facade que expone una API simplificada
- Mantiene compatibilidad con código existente
- Inicializa y coordina repositorios y casos de uso

### 4. Presentation (Presentación)
**Propósito**: Interfaz de usuario con React.

**Components**: Componentes reutilizables de UI
**Contexts**: Contextos de React para estado global (autenticación, etc.)
**Views**: Páginas completas de la aplicación
**Assets**: Recursos estáticos (CSS, imágenes)

**Características**:
- Consume el servicio de infraestructura
- No conoce detalles de Firebase o la lógica de negocio
- Sólo maneja estado de UI y renderizado

## 🔄 Flujo de Datos

```
Usuario interactúa con UI (Presentation)
    ↓
Componente llama al blogService (Infrastructure/Services)
    ↓
blogService ejecuta caso de uso (Application/Use-Cases)
    ↓
Caso de uso usa puerto (Application/Ports)
    ↓
Adaptador implementa puerto (Infrastructure/Adapters)
    ↓
Adaptador accede a Firebase
    ↓
Datos se convierten a entidades (Domain/Entities)
    ↓
Flujo inverso hasta la UI
```

## ✅ Ventajas de esta Arquitectura

### 1. Separación de Responsabilidades
- Cada capa tiene un propósito claro
- Fácil de entender y mantener
- Validaciones centralizadas en el dominio

### 2. Testabilidad
- Casos de uso son fáciles de testear sin Firebase
- Se pueden crear mocks de repositorios
- Lógica de negocio aislada
- Validaciones testeables de forma unitaria
- Eventos permiten testing de efectos secundarios

### 3. Independencia de Frameworks
- El dominio no conoce React ni Firebase
- Fácil migrar a otra base de datos
- Puedes cambiar de UI framework sin tocar la lógica
- Caché intercambiable (IndexedDB, Redis, memoria, etc.)

### 4. Escalabilidad
- Agregar nuevas features es estructurado
- Fácil añadir nuevos adaptadores (REST API, GraphQL, etc.)
- Código organizado facilita trabajo en equipo
- Sistema de eventos permite agregar funcionalidades sin modificar código existente

### 5. Mantenibilidad
- Cambios en una capa no afectan otras
- Código más limpio y legible
- Menos acoplamiento entre módulos
- Value Objects eliminan duplicación de validaciones
- Errores de dominio proporcionan contexto claro

### 6. Observabilidad
- Eventos de dominio permiten auditoría
- Fácil agregar logging y monitoreo
- Trazabilidad de operaciones del sistema

## 🔌 Cómo Agregar Nuevas Funcionalidades

### Agregar un nuevo caso de uso:

1. **Definir entidad** (si es necesaria) en `domain/entities/`
2. **Crear puerto** (si es necesario) en `application/ports/`
3. **Implementar caso de uso** en `application/use-cases/`
4. **Implementar en adaptador** en `infrastructure/adapters/`
5. **Exponer en servicio** en `infrastructure/services/blogService.ts`
6. **Usar en componentes** de `presentation/`

### Ejemplo: Agregar comentarios a posts

1. Crear `Comment.ts` en `domain/entities/`
2. Crear `ICommentsRepository.ts` en `application/ports/`
3. Crear `AddCommentUseCase.ts` en `application/use-cases/`
4. Implementar `FirebaseCommentsRepository.ts` en `infrastructure/adapters/firebase/`
5. Agregar métodos en `blogService.ts`
6. Usar en componentes de React

## 🧪 Testing

La arquitectura hexagonal facilita el testing. Utilizamos **Vitest** como runner:

```typescript
// Ejemplo de test de caso de uso
describe('CreatePostUseCase', () => {
  it('should create a post with valid data', async () => {
    // Mock del repositorio
    const mockBlogRepo = {
      createPost: vi.fn().mockResolvedValue('post-123')
    };
    const mockManifestRepo = {
      invalidateComicsListCache: vi.fn(),
      invalidateGenresCache: vi.fn(),
      updateManifest: vi.fn()
    };
    
    // Caso de uso con mocks
    const useCase = new CreatePostUseCase(mockBlogRepo, mockManifestRepo);
    
    // Ejecutar
    const postId = await useCase.execute({
      title: 'Test Post',
      author: 'Test Author',
      // ... más datos
    });
    
    // Verificar
    expect(postId).toBe('post-123');
    expect(mockBlogRepo.createPost).toHaveBeenCalled();
  });

  it('should throw ValidationError for invalid title', async () => {
    const mockBlogRepo = { createPost: vi.fn() };
    const mockManifestRepo = { /* ... */ };
    const useCase = new CreatePostUseCase(mockBlogRepo, mockManifestRepo);
    
    await expect(
      useCase.execute({ title: '', /* ... */ })
    ).rejects.toThrow(ValidationError);
  });
});
```

## 💾 Sistema de Caché

### Características del Adaptador de Caché

El sistema de caché implementado utiliza **IndexedDB** para persistencia robusta:

**IndexedDBCacheAdapter**:
- **Persistencia**: Los datos no se pierden al recargar la página
- **TTL Configurable**: Tiempo de vida por entrada
- **Limpieza Automática**: Elimina entradas expiradas periódicamente
- **Gran Capacidad**: Almacenamiento limitado solo por el disco del usuario
- **Asíncrono**: No bloquea el hilo principal

```typescript
// Ejemplo de uso
import { IndexedDBCacheAdapter } from './infrastructure/adapters/cache';

const cache = new IndexedDBCacheAdapter({
  dbName: 'comic-blog-cache',
  defaultTTL: 5 * 60 * 1000,  // 5 minutos
  cleanupInterval: 60 * 1000   // Limpiar cada minuto
});

// Usar el caché
await cache.set('key', value, 10000); // TTL específico
const cached = await cache.get('key');
await cache.deletePattern('posts:*'); // Invalidar patrón
```

**CachedBlogRepository (Decorator)**:
- Añade caché a cualquier implementación de `IBlogRepository`
- TTLs diferentes por tipo de operación
- Invalidación inteligente en operaciones de escritura

```typescript
// Ejemplo de uso
import { FirebaseBlogRepository } from './infrastructure/adapters/firebase';
import { IndexedDBCacheAdapter, CachedBlogRepository } from './infrastructure/adapters/cache';

const firebaseRepo = new FirebaseBlogRepository();
const cache = new IndexedDBCacheAdapter();
const cachedRepo = new CachedBlogRepository(firebaseRepo, cache, {
  postTTL: 10 * 60 * 1000,    // Posts: 10 min
  listTTL: 5 * 60 * 1000,     // Listas: 5 min
  searchTTL: 3 * 60 * 1000    // Búsquedas: 3 min
});

// Usar como cualquier repositorio
const posts = await cachedRepo.getAllPosts(); // Primera vez: consulta a DB
const posts2 = await cachedRepo.getAllPosts(); // Segunda vez: desde caché
```

## ⚡ Eventos de Dominio

### ¿Qué son los Eventos de Dominio?

Los eventos de dominio representan hechos significativos que ocurren en el sistema. Permiten:
- **Desacoplar** componentes del sistema
- **Auditoría** y logging automático
- **Extensibilidad** sin modificar código existente
- **Comunicación** entre bounded contexts

### Eventos Disponibles

1. **PostCreatedEvent**: Se emite al crear un post
2. **PostUpdatedEvent**: Se emite al actualizar un post
3. **PostDeletedEvent**: Se emite al eliminar un post
4. **TagAddedToPostEvent**: Se emite al agregar un tag
5. **TagRemovedFromPostEvent**: Se emite al quitar un tag
6. **PostSearchedEvent**: Se emite al realizar una búsqueda

### Event Bus (Bus de Eventos)

Sistema centralizado para publicar y suscribirse a eventos:

```typescript
import { eventBus, PostCreatedEvent } from './domain/events';

// Suscribirse a un evento
eventBus.subscribe('PostCreated', (event: PostCreatedEvent) => {
  console.log('Nuevo post creado:', event.title);
  // Enviar notificación, actualizar analytics, etc.
});

// Publicar un evento (hecho automáticamente por los casos de uso)
await eventBus.publish(
  new PostCreatedEvent('mi-post', 'Mi Post', 'Autor', ['tag1', 'tag2'])
);
```

### Manejadores de Eventos

**EventLogger**: Registra todos los eventos para debugging
```typescript
import { EventLogger } from './application/event-handlers';
EventLogger.subscribe(); // Activa el logging
```

**CacheInvalidationHandler**: Invalida caché automáticamente
```typescript
import { CacheInvalidationHandler } from './application/event-handlers';
const handler = new CacheInvalidationHandler(cacheService);
handler.subscribe();
```

**NotificationHandler**: Envía notificaciones (ejemplo extensible)
```typescript
import { NotificationHandler } from './application/event-handlers';
const handler = new NotificationHandler();
handler.subscribe();
```

## 🔐 Validaciones de Dominio

### Value Objects

Los Value Objects encapsulan validaciones y reglas de negocio:

**Slug**: Identificador normalizado para URLs
```typescript
import { Slug } from './domain/value-objects';

const slug = Slug.create('Mi Título Ñoño'); // 'mi-titulo-nono'
// Valida: longitud mínima, caracteres permitidos, normalización
```

**Title**: Título del post
```typescript
import { Title } from './domain/value-objects';

const title = Title.create('Mi Post');
// Valida: no vacío, longitud entre 3-200 caracteres
```

**Author**: Autor del post
```typescript
import { Author } from './domain/value-objects';

const author = Author.create('John Doe');
// Valida: no vacío, longitud entre 2-100 caracteres
```

**Tag**: Etiqueta/Género
```typescript
import { Tag } from './domain/value-objects';

const tag = Tag.create('Acción');
// Valida: no vacío, máximo 50 caracteres
```

**PostDate**: Fecha del post
```typescript
import { PostDate } from './domain/value-objects';

const date = PostDate.create('2024-01-15');
// Valida: fecha válida, no futura, posterior a 2000
```

**Excerpt**: Extracto/Descripción
```typescript
import { Excerpt } from './domain/value-objects';

const excerpt = Excerpt.create('Descripción del post...');
// Valida: máximo 500 caracteres
```

### Entidades con Validaciones

**BlogPostEntity**: Entidad completa con métodos de negocio
```typescript
import { BlogPostEntity } from './domain/entities';

// Crear con validaciones
const post = BlogPostEntity.create({
  slug: 'mi-post',
  title: 'Mi Post',
  author: 'Autor',
  date: '2024-01-15',
  tags: ['Acción', 'Aventura'],
  excerpt: 'Descripción...',
  content: 'Contenido completo...',
  image: 'https://example.com/image.jpg'
});

// Métodos de negocio
post.updateTitle('Nuevo Título');
post.addTag('Comedia');
post.removeTag('Acción');
post.updateContent('Nuevo contenido...');

// Validaciones automáticas
post.addTag(''); // ❌ Lanza ValidationError
post.setTags([]); // ❌ Debe haber al menos un tag
```

### Errores de Dominio

Excepciones personalizadas que representan violaciones de reglas de negocio:

```typescript
import {
  ValidationError,
  NotFoundError,
  AlreadyExistsError,
  ForbiddenOperationError
} from './domain/errors';

try {
  const slug = Slug.create(''); // ❌ Slug vacío
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Error de validación:', error.message);
  }
}
```



## 📚 Referencias

- [Arquitectura Hexagonal - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports and Adapters Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
