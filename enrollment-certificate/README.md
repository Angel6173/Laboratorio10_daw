# Constancia de Matrícula de Laboratorio — EPIS

Aplicación React + Vite que consume la API REST de matrículas y muestra la constancia de laboratorio por C.U.I.

## API

```
GET https://sisacad-enrollments-backend.vercel.app/restful/enrollment-certificate/?cui=20250100
```

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:5173/constancia/20250100`

## Build

```bash
npm run build
npm run preview
```

## Despliegue (Netlify)

1. Conectar repositorio en Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

El archivo `netlify.toml` ya incluye la redirección SPA.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query (fetch nativo)

## Estructura

```
src/
  api/           # Llamadas a la API
  components/    # UI reutilizable
  hooks/         # useEnrollmentCertificate
  pages/         # Home y Certificate
  types/         # Interfaces TypeScript
```
