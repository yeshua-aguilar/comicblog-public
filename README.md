# ComicFlix: Tu Plataforma de Cómics Favorita

ComicFlix es una plataforma de blogs de cómics dinámica y moderna, construida con React, TypeScript y Vite, que ofrece una experiencia de usuario inspirada en Netflix. Utiliza Firebase para los servicios de backend, incluyendo Firestore como base de datos en tiempo real.

## Características Principales

- **Interfaz Inspirada en Netflix**: Un diseño atractivo y familiar que facilita la navegación.
- **Exploración de Cómics**: Visualiza y lee publicaciones de cómics con contenido enriquecido.
- **Filtrado por Género**: Filtra los cómics por tus géneros favoritos.
- **Búsqueda Inteligente**: Encuentra cómics rápidamente con la función de búsqueda.
- **Panel de Administración**: Un dashboard completo para que los administradores gestionen las publicaciones.

## Estructura del Proyecto

- **`src/`**: Código fuente de la aplicación.
  - **`components/`**: Componentes de React reutilizables.
  - **`views/`**: Vistas o páginas de la aplicación.
  - **`services/`**: Lógica para interactuar con servicios externos como Firebase.
  - **`assets/`**: Imágenes y hojas de estilo.
- **`public/`**: Archivos públicos que no se procesan a través de Vite.

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

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto, por favor, abre un *pull request* con tus cambios.
