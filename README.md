# ComicFlix: Tu Plataforma de Cómics Favorita

ComicFlix es una plataforma de blogs de cómics dinámica y moderna, construida con React, TypeScript y Vite, que ofrece una experiencia de usuario inspirada en Netflix. Utiliza Firebase para los servicios de backend, incluyendo Firestore como base de datos en tiempo real.

## Características Principales

- **Interfaz Inspirada en Netflix**: Un diseño atractivo y familiar que facilita la navegación.
- **Exploración de Cómics**: Visualiza y lee publicaciones de cómics con contenido enriquecido.
- **Filtrado por Género**: Filtra los cómics por tus géneros favoritos.
- **Búsqueda Inteligente**: Encuentra cómics rápidamente con la función de búsqueda.
- **Panel de Administración**: Un dashboard completo para que los administradores gestionen las publicaciones.

## Cómo Empezar

Para poner en marcha el proyecto en tu entorno local, sigue estos sencillos pasos.

### Prerrequisitos

- **Node.js**: Asegúrate de tener Node.js instalado. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- **npm**: Generalmente se instala junto con Node.js.

### Instalación

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
   - Crea un proyecto en [Firebase](https://firebase.google.com/).
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

### Scripts Disponibles

- **`npm run dev`**: Inicia el servidor de desarrollo.
- **`npm run build`**: Compila la aplicación para producción.
- **`npm run lint`**: Analiza el código en busca de errores.
- **`npm run preview`**: Previsualiza la compilación de producción.

## Estructura del Proyecto

- **`src/`**: Contiene el código fuente de la aplicación.
  - **`components/`**: Componentes de React reutilizables.
  - **`views/`**: Las diferentes vistas o páginas de la aplicación.
  - **`services/`**: Lógica para interactuar con servicios externos como Firebase.
  - **`assets/`**: Archivos estáticos como imágenes y hojas de estilo.
- **`public/`**: Archivos públicos que no se procesan a través de Vite.

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto, por favor, abre un *pull request* con tus cambios.
