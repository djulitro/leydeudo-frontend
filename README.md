# LeyDeudo Frontend

Aplicación frontend para el sistema LeyDeudo construida con React, TypeScript y Vite.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 20
- Yarn 1.22.22 (recomendado) o npm

### Instalación

1. Clonar el repositorio y navegar a la carpeta del frontend
2. Instalar dependencias:

```bash
yarn install
# o
npm install
```

3. Copiar el archivo de variables de entorno:

```bash
cp .env.example .env
```

4. Configurar las variables de entorno en `.env` según tu entorno

### Iniciar Desarrollo

```bash
yarn dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado en VITE_PORT)

## 🔧 Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para la configuración. Copia `.env.example` a `.env` y ajusta los valores:

#### API Configuration
- `VITE_API_BASE_URL`: URL base del backend API (default: `http://localhost:8000/api`)
- `VITE_API_TIMEOUT`: Timeout en milisegundos para peticiones API (default: `30000`)

#### App Configuration
- `VITE_APP_NAME`: Nombre de la aplicación (default: `LeyDeudo`)
- `VITE_APP_VERSION`: Versión de la aplicación (default: `1.0.0`)

#### Development Server
- `VITE_PORT`: Puerto del servidor de desarrollo (default: `3000`)
- `VITE_HOST`: Habilitar acceso desde red local (default: `true`)

#### Storage Configuration
- `VITE_STORAGE_PREFIX`: Prefijo para claves de localStorage (default: `leydeudo_`)

#### Environment
- `VITE_ENV`: Entorno de ejecución (default: `development`)

**Nota**: Todas las variables de entorno para Vite deben tener el prefijo `VITE_` para ser expuestas al cliente.

## 📜 Scripts Disponibles

- `yarn dev` - Inicia el servidor de desarrollo
- `yarn build` - Construye la aplicación para producción
- `yarn start` - Previsualiza la build de producción
- `yarn lint` - Ejecuta el linter
- `yarn lint:fix` - Ejecuta el linter y corrige errores automáticamente
- `yarn fm:check` - Verifica el formato con Prettier
- `yarn fm:fix` - Formatea el código con Prettier
- `yarn fix:all` - Ejecuta lint:fix y fm:fix
- `yarn tsc:watch` - Ejecuta TypeScript en modo watch

## 🏗️ Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── contexts/        # Contextos de React (Auth, etc.)
├── hooks/          # Hooks personalizados
├── layouts/        # Layouts de la aplicación
├── pages/          # Páginas de la aplicación
├── routes/         # Configuración de rutas
├── sections/       # Secciones específicas de páginas
├── theme/          # Configuración del tema
├── types/          # Tipos TypeScript
└── utils/          # Utilidades y helpers
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens se almacenan en localStorage con el prefijo configurado en `VITE_STORAGE_PREFIX`.

### Uso del API Client

```typescript
import { apiClient } from 'src/utils/api-client';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE request
await apiClient.delete('/users/1');
```

El cliente API automáticamente:
- Añade el token JWT a las peticiones
- Maneja timeouts
- Formatea errores
- Usa la URL base configurada en `.env`

## 📦 Build para Producción

```bash
yarn build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI v6** - Componentes UI
- **React Router v7** - Enrutamiento
- **Recharts** - Gráficos
- **date-fns** - Manejo de fechas

## 📝 Licencia

MIT
