# ComicFlix: Tu Plataforma de Cómics Favorita

ComicFlix es una plataforma de blogs de cómics dinámica y moderna, construida con React, TypeScript y Vite, que ofrece una experiencia de usuario inspirada en Netflix. Utiliza Firebase para los servicios de backend, incluyendo Firestore como base de datos en tiempo real.

**🏗️ Este proyecto utiliza Arquitectura Hexagonal (Ports & Adapters)**. Ver [ARQUITECTURA.md](./ARQUITECTURA.md) para más detalles.

## Características Principales

- **Interfaz Inspirada en Netflix**: Un diseño atractivo y familiar que facilita la navegación.
- **Exploración de Cómics**: Visualiza y lee publicaciones de cómics con contenido enriquecido.
- **Filtrado por Género**: Filtra los cómics por tus géneros favoritos.
- **Búsqueda Inteligente**: Encuentra cómics rápidamente con la función de búsqueda.
- **Panel de Administración**: Un dashboard completo para que los administradores gestionen las publicaciones.
- **Arquitectura Hexagonal**: Código mantenible, testeable y escalable.

## Estructura del Proyecto

El proyecto sigue la **Arquitectura Hexagonal** con las siguientes capas:

```
src/
├── domain/              # Entidades del negocio (BlogPost, Genre)
├── application/         # Lógica de aplicación
│   ├── ports/          # Interfaces (contratos)
│   └── use-cases/      # Casos de uso del sistema
├── infrastructure/      # Implementaciones técnicas
│   ├── adapters/       # Adaptadores (Firebase, etc.)
│   └── services/       # Servicios facade
└── presentation/        # Interfaz de usuario (React)
    ├── components/     # Componentes reutilizables
    ├── views/          # Páginas de la aplicación
    └── assets/         # Recursos estáticos
```

**Ver documentación completa de arquitectura en [ARQUITECTURA.md](./ARQUITECTURA.md)**

## Cómo Empezar

### Prerrequisitos

- **Node.js**: Descárgalo desde [nodejs.org](https://nodejs.org/).
- **npm**: Se instala junto con Node.js.

### Instalación y Configuración

1. **Clona el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/comic-blog.git
   cd comic-blog
   ```

2. **Instala las Dependencias**:
   ```bash
   npm install
   ```

3. **Configura Firebase**:
   - Regístrate en [Firebase](https://firebase.google.com/) si no tienes cuenta.
   - Crea un nuevo proyecto en la consola de Firebase.
   - En "Authentication", habilita el método de autenticación por correo electrónico y contraseña.
   - En "Firestore Database", crea la base de datos en modo de prueba.
   - Ve a la configuración de tu proyecto y copia tus credenciales de Firebase.
   - Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales:
     ```
     VITE_FIREBASE_API_KEY=tu_api_key
     VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
     VITE_FIREBASE_PROJECT_ID=tu_project_id
     VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
     VITE_FIREBASE_APP_ID=tu_app_id
     ```

4. **Crea las colecciones necesarias en Firestore:**
   - Ingresa a la sección "Firestore Database" en la consola de Firebase.
   - Haz clic en "Iniciar colección" y crea una colección llamada `blogs` para almacenar las publicaciones de cómics. Cada documento representa un cómic y debe contener los campos: `title`, `author`, `date`, `tags`, `excerpt`, `image`, `content`, etc.
   - Crea otra colección llamada `contenido`. Dentro de esta colección, crea un documento (por ejemplo, con el ID `xxxxxxxxxx`) que contendrá un campo `comics` (array de objetos cómic) usado como manifiesto para mostrar la lista de cómics en la app.
   - Puedes añadir documentos de ejemplo para probar la funcionalidad y asegurarte de que los campos coincidan con los usados en el código.

### Scripts Disponibles

- **`npm run dev`**: Inicia el servidor de desarrollo.
- **`npm run build`**: Compila la aplicación para producción.
- **`npm run lint`**: Analiza el código en busca de errores.
- **`npm run preview`**: Previsualiza la compilación de producción.

## Arquitectura

Este proyecto implementa **Arquitectura Hexagonal** (Ports & Adapters) que proporciona:

- ✅ **Separación de responsabilidades**: Cada capa tiene un propósito claro
- ✅ **Testabilidad**: Fácil crear tests unitarios sin dependencias externas
- ✅ **Independencia de frameworks**: Fácil cambiar React, Firebase u otros frameworks
- ✅ **Escalabilidad**: Estructura clara para agregar nuevas funcionalidades
- ✅ **Mantenibilidad**: Cambios en una capa no afectan otras

### Flujo de Datos

```
UI (React) → Service Facade → Use Cases → Ports → Adapters → Firebase
```

Para una explicación completa de la arquitectura, ver [ARQUITECTURA.md](./ARQUITECTURA.md)

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto, por favor, abre un *pull request* con tus cambios.

Cuando agregues nuevas funcionalidades, sigue la estructura de arquitectura hexagonal:
1. Define entidades en `domain/`
2. Crea puertos en `application/ports/`
3. Implementa casos de uso en `application/use-cases/`
4. Crea adaptadores en `infrastructure/adapters/`
5. Expón servicios en `infrastructure/services/`
6. Usa en componentes de `presentation/`
