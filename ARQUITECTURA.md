# Arquitectura Hexagonal - Comic Blog

Este proyecto ha sido refactorizado siguiendo los principios de **Arquitectura Hexagonal** (también conocida como Ports and Adapters).

## 📁 Estructura del Proyecto

```
src/
├── domain/                          # Capa de Dominio
│   └── entities/                    # Entidades del negocio
│       ├── BlogPost.ts             # Entidad de post de blog/cómic
│       ├── Genre.ts                # Entidad de género
│       └── index.ts
│
├── application/                     # Capa de Aplicación
│   ├── ports/                       # Interfaces (Puertos)
│   │   ├── IBlogRepository.ts      # Puerto para repositorio de blogs
│   │   ├── IComicsManifestRepository.ts
│   │   └── index.ts
│   │
│   └── use-cases/                   # Casos de Uso
│       ├── GetComicsListUseCase.ts
│       ├── GetPostBySlugUseCase.ts
│       ├── SearchComicsUseCase.ts
│       ├── GetGenresWithCountsUseCase.ts
│       ├── CreatePostUseCase.ts
│       ├── UpdatePostUseCase.ts
│       ├── DeletePostUseCase.ts
│       ├── CreatePostWithSlugUseCase.ts
│       └── index.ts
│
├── infrastructure/                  # Capa de Infraestructura
│   ├── adapters/                    # Adaptadores
│   │   ├── firebase/               # Adaptador Firebase
│   │   │   ├── firebaseConfig.ts
│   │   │   ├── FirebaseBlogRepository.ts
│   │   │   ├── FirebaseComicsManifestRepository.ts
│   │   │   └── index.ts
│   │   └── cache/                  # (Futuro: adaptadores de caché)
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
- **Sin dependencias externas**: No conoce Firebase, React, ni ninguna tecnología específica

**Archivos principales**:
- `BlogPost.ts`: Define la estructura de un post de blog/cómic
- `Genre.ts`: Define la estructura de un género/categoría

### 2. Application (Aplicación)
**Propósito**: Contiene la lógica de aplicación y coordina el flujo de datos.

#### Ports (Puertos)
Interfaces que definen contratos para servicios externos:
- `IBlogRepository`: Operaciones CRUD para blogs
- `IComicsManifestRepository`: Operaciones sobre el manifiesto de cómics

#### Use Cases (Casos de Uso)
Cada caso de uso representa una operación del sistema:
- **GetComicsListUseCase**: Obtiene lista de cómics
- **GetPostBySlugUseCase**: Obtiene un post específico
- **CreatePostUseCase**: Crea un nuevo post
- **UpdatePostUseCase**: Actualiza un post existente
- **DeletePostUseCase**: Elimina un post
- **SearchComicsUseCase**: Busca cómics
- **GetGenresWithCountsUseCase**: Obtiene géneros con conteos

**Características**:
- Contienen validaciones de negocio
- Orquestan operaciones entre repositorios
- Son independientes de la implementación

### 3. Infrastructure (Infraestructura)
**Propósito**: Implementa los puertos definidos en la capa de aplicación.

#### Adapters (Adaptadores)
Implementaciones concretas de los puertos:

**Firebase Adapters**:
- `FirebaseBlogRepository`: Implementa `IBlogRepository` usando Firestore
- `FirebaseComicsManifestRepository`: Implementa `IComicsManifestRepository`
- Maneja conversión de datos entre Firestore y entidades de dominio
- Gestiona caché para optimizar consultas

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

### 2. Testabilidad
- Casos de uso son fáciles de testear sin Firebase
- Se pueden crear mocks de repositorios
- Lógica de negocio aislada

### 3. Independencia de Frameworks
- El dominio no conoce React ni Firebase
- Fácil migrar a otra base de datos
- Puedes cambiar de UI framework sin tocar la lógica

### 4. Escalabilidad
- Agregar nuevas features es estructurado
- Fácil añadir nuevos adaptadores (REST API, GraphQL, etc.)
- Código organizado facilita trabajo en equipo

### 5. Mantenibilidad
- Cambios en una capa no afectan otras
- Código más limpio y legible
- Menos acoplamiento entre módulos

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

La arquitectura hexagonal facilita el testing:

```typescript
// Ejemplo de test de caso de uso
describe('CreatePostUseCase', () => {
  it('should create a post with valid data', async () => {
    // Mock del repositorio
    const mockBlogRepo = {
      createPost: jest.fn().mockResolvedValue('post-123')
    };
    const mockManifestRepo = {
      invalidateComicsListCache: jest.fn(),
      invalidateGenresCache: jest.fn(),
      updateManifest: jest.fn()
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
});
```

## 📚 Referencias

- [Arquitectura Hexagonal - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports and Adapters Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)

## 🚀 Próximos Pasos

1. Agregar tests unitarios para casos de uso
2. Implementar adaptador de caché en memoria
3. Agregar más validaciones de negocio en el dominio
4. Considerar agregar eventos de dominio
5. Documentar cada caso de uso con ejemplos
