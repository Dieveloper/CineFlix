# CineFlix

CineFlix es una plataforma web de streaming desarrollada como Proyecto de Fin de Grado. La aplicación permite a los usuarios registrarse, iniciar sesión y explorar un catálogo de películas y series de nicho a través de una interfaz moderna e intuitiva.

El sistema incluye un panel de administración para la gestión de usuarios, perfiles, películas, series, capítulos y contenidos multimedia (imágenes y vídeos).

---

## Tecnologías principales

### Frontend
- Vue.js 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS / CSS3
- Lucide Icons

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core 10
- SQLite
- Swagger

---

## Funcionalidades destacadas

- Autenticación de usuarios y gestión de sesión
- Sistema multiperfil para compartir cuentas
- Catálogo de películas y series
- Gestión de capítulos por serie
- Panel de administración para:
  - Usuarios
  - Perfiles
  - Películas
  - Series
  - Capítulos
  - Imágenes y vídeos
- Subida de portadas de serie y capítulos
- Subida de vídeos de capítulos
- Filtrado y clasificación por géneros
- API REST con documentación Swagger

---

## Estructura del proyecto

- `frontend/` - Aplicación cliente en Vue 3
  - `src/` - Código fuente de la app
  - `src/views/` - Vistas principales, incluido el panel de administración
  - `src/router/` - Rutas de Vue Router
  - `src/stores/` - Estado global con Pinia

- `backend/` - API en ASP.NET Core
  - `Controllers/` - Controladores REST
  - `Models/` - Modelos de datos
  - `Data/` - Contexto de EF Core
  - `Migrations/` - Migraciones de SQLite

---

## Requisitos previos

Instala estas herramientas antes de ejecutar el proyecto:

- .NET 10 SDK
- Node.js 18+ (o versión compatible)
- npm
- Git

---

## Instalación y ejecución local

1. Clonar el repositorio

```bash
git clone https://github.com/Dieveloper/CineFlix.git
cd CineFlix
```

2. Ejecutar el backend

```bash
cd backend
dotnet build
dotnet run
```

El backend usará SQLite y levantará la API con Swagger disponible en el entorno de desarrollo.

3. Ejecutar el frontend

```bash
cd ../frontend
npm install
npm run dev
```

La aplicación frontend se ejecutará con Vite. Normalmente podrás acceder a ella en `http://localhost:5173` o la URL que indique el terminal.

---

## Notas importantes

- El backend expone APIs REST para películas, series, capítulos, usuarios y perfiles.
- El archivo de base de datos SQLite se crea como `cineflix.db` en el directorio del backend.
- El servidor permite carga de archivos grandes hasta 500 MB para vídeo.
- El frontend consume la API y también sirve archivos estáticos desde el backend.

---

## Desarrollo

- Para construir la app de producción en el frontend:

```bash
npm run build
```

- Para publicar o desplegar el backend, compila normalmente con `dotnet publish`.

---

## Autoría

- Ramón Nicolás Dubit
- Raymond Gavril Szigyarto Brege
- Diego Gomez Jordán
- Gabriela Perez Alexandru

---

## Contacto

Para dudas o incidencias, utiliza el repositorio en GitHub: `https://github.com/Dieveloper/CineFlix`
