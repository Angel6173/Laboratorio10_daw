# Laboratorio 09 — JWT (Django REST) + Frontend React/Vite desplegado en Vercel

> **Curso:** Desarrollo de Aplicaciones Web (DAW) — Semestre III
> **Escuela:** Ingeniería de Sistemas — UNSA
> **Tema:** API REST Django protegida con JWT, consumida por un panel web React + Vite (SPA) desplegable en Vercel.

El proyecto integra dos capas, ambas desarrolladas por el equipo:

1. **Backend `enrollments/`** — API REST con Django REST Framework, autenticación **JWT** y CORS.
2. **Frontend `frontend/`** — panel web **React + Vite + TypeScript** que consume la API, muestra **todos los modelos del sistema** en templates y genera la **constancia de matrícula**. Usa **TanStack Query** y **React Router**, y se despliega en **Vercel**.

> 📌 La carpeta `enrollment-certificate/` es el **proyecto guía del profesor** y **no forma parte de la entrega** (está excluida en `.gitignore`). Todo nuestro frontend vive en `frontend/`.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [1. Backend — Django + JWT](#1-backend--django--jwt)
- [2. Frontend — React + Vite](#2-frontend--react--vite)
- [Ejecución local (ambos a la vez)](#ejecución-local-ambos-a-la-vez)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Flujo de autenticación JWT](#flujo-de-autenticación-jwt)
- [Vistas del frontend](#vistas-del-frontend)
- [Endpoints de la API](#endpoints-de-la-api)
- [Cumplimiento de la rúbrica 12.2](#cumplimiento-de-la-rúbrica-122)
- [Integrantes](#integrantes)

---

## Requisitos previos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Python | 3.10+ | `python --version` |
| pip | 23+ | `pip --version` |
| Node.js | 20+ (LTS) | `node --version` |
| npm | 9+ | `npm --version` |
| Git | cualquier | `git --version` |
| Cuenta Vercel | — | para el despliegue del frontend |

La base de datos es **Supabase (PostgreSQL)**: no necesitas instalar PostgreSQL localmente, solo las credenciales (ver configuración del `.env`).

---

## Arquitectura

```
        [ Frontend React + Vite ]                 [ Backend Django + JWT ]
            panel SISMAT                                API REST
         localhost:5173 / Vercel                     localhost:8000
                 │                                          │
                 │  POST /api/token/  (usuario + password)  │
                 │ ───────────────────────────────────────► │
                 │ ◄──────────  { access, refresh }  ─────── │
                 │                                          │
                 │  GET /api/students/  (y demás modelos)   │
                 │  Authorization: Bearer <access>          │
                 │ ───────────────────────────────────────► │
                 │ ◄────────────  JSON (datos)  ──────────── │
                 │                                          │
                 │  GET /api/enrollment-certificate/?student_id=<uuid>
                 │ ───────────────────────────────────────► │
                 │ ◄──────────  JSON constancia  ─────────── │
```

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Django + DRF | 6.0.6 / 3.17.1 |
| Auth | djangorestframework-simplejwt | 5.4.0 |
| CORS | django-cors-headers | 4.7.0 |
| Config | python-dotenv | 1.0.1 |
| Base de datos | PostgreSQL (Supabase) | 16 |
| Frontend | React + Vite + TypeScript | 19 / 6 |
| Datos remotos | TanStack Query | 5.x |
| Rutas | React Router DOM | 6.x |
| Despliegue | Vercel | — |

---

## Estructura del proyecto

```
Laboratorio9_daw/
├── requirements.txt
├── README.md
├── .gitignore                    (excluye informe/, enrollment-certificate/, .env, node_modules)
│
├── enrollments/                  ← BACKEND (mi proyecto Django)
│   ├── manage.py
│   ├── .env.example              (plantilla de credenciales)
│   ├── enrollments/
│   │   ├── settings.py           (JWT + CORS + IsAuthenticated, lee de .env)
│   │   └── urls.py               (/api/token/ + /api/token/refresh/)
│   └── sismat/
│       ├── models/               (Users, Teachers, Students, Courses, CoursesStudents)
│       ├── serializers/
│       ├── views.py              (ViewSets + EnrollmentCertificateView)
│       └── urls.py
│
├── frontend/                     ← FRONTEND (mi panel React + Vite)
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json               (rewrites SPA para Vercel)
│   ├── .env.example              (VITE_API_BASE_URL)
│   └── src/
│       ├── api/        authApi.ts · client.ts · sismatApi.ts
│       ├── context/    AuthContext.tsx
│       ├── hooks/      useResources.ts · useEnrollmentCertificate.ts
│       ├── components/ Layout · ProtectedRoute · DataTable · ResourceView
│       │               SectionHeader · StatusBadge · CertificateView
│       │               CoursesTable · StudentInfo
│       └── pages/      LoginPage · DashboardPage · UsersPage · TeachersPage
│                       StudentsPage · CoursesPage · EnrollmentsPage
│                       CertificateSearchPage · CertificatePage
│
└── enrollment-certificate/       ← GUÍA del profesor (NO se entrega, gitignored)
```

---

## 1. Backend — Django + JWT

### Instalación

```bash
git clone https://github.com/Angel6173/Laboratorio9_daw.git
cd Laboratorio9_daw

# Entorno virtual
python -m venv venv
venv\Scripts\Activate.ps1        # Windows
# source venv/bin/activate       # Linux / macOS

pip install -r requirements.txt
```

### Variables de entorno

```bash
cp enrollments/.env.example enrollments/.env
```

Edita `enrollments/.env`:

```env
SECRET_KEY=coloca-aqui-tu-secret-key
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase
DB_HOST=db.xxxxxxxxxxxxxxxx.supabase.co
DB_PORT=5432
```

> `.env` está en `.gitignore` — nunca se sube al repositorio.

### Migraciones, superusuario y arranque

```bash
cd enrollments
python manage.py migrate
python manage.py createsuperuser     # con este usuario inicias sesión en el frontend
python manage.py runserver           # http://127.0.0.1:8000
```

---

## 2. Frontend — React + Vite

```bash
cd frontend
npm install

cp .env.example .env                 # ya apunta a http://127.0.0.1:8000
npm run dev                          # http://localhost:5173
```

Scripts disponibles:

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Compila TypeScript y genera `dist/` |
| `npm run preview` | Sirve el build de producción localmente |

---

## Ejecución local (ambos a la vez)

Abre **dos terminales**:

**Terminal 1 — Backend**
```bash
cd enrollments
python manage.py runserver
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Abre `http://localhost:5173`, inicia sesión con tu superusuario y navega el panel.

---

## Despliegue en Vercel

> ⚠️ **En Vercel se despliega SOLO el frontend** (`frontend/`). El backend Django **no** va a Vercel. Que el frontend esté en la nube es independiente de dónde corra el backend.

El frontend es una SPA Vite, lista para Vercel (incluye `vercel.json` con el rewrite a `index.html`).

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. Configura el proyecto:
   - **Root Directory:** `frontend`  ← imprescindible (si no, Vercel intentaría compilar el Django)
   - **Framework Preset:** Vite (autodetectado)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. En **Environment Variables** agrega `VITE_API_BASE_URL` (la URL de tu backend):

   ```
   VITE_API_BASE_URL = http://127.0.0.1:8000
   ```

5. **Deploy.** Vercel entrega una URL pública del tipo `https://laboratorio9-daw.vercel.app`.

### ¿Y el backend? — Este proyecto usa la Opción A (backend local)

El frontend en Vercel corre en el navegador de quien lo abre, y desde ahí llama a tu backend. Como el backend corre en **tu máquina** (`http://127.0.0.1:8000`):

- La web desplegada carga datos **solo en una computadora que tenga tu backend corriendo** (la tuya, con `python manage.py runserver` activo).
- Para la demo con datos reales lo más simple es usar `http://localhost:5173` (todo local). La URL de Vercel queda como el **entregable desplegado** (cumple el requisito de "URL pública activa").
- Si quieres que la URL de Vercel también cargue datos desde tu máquina, añade tu dominio de Vercel a `CORS_ALLOWED_ORIGINS` en `settings.py`.

> **Alternativa (Opción B, no usada aquí):** si quisieras que la web funcione para *cualquiera* sin tu máquina, tendrías que desplegar también el backend Django en un servicio como Render/Railway y poner esa URL pública en `VITE_API_BASE_URL`.

---

## Flujo de autenticación JWT

```
1. Visitas el panel → ProtectedRoute ve que no hay token → redirige a /login.
2. LoginPage envía POST /api/token/ con usuario y contraseña.
3. Django responde { access, refresh } → se guardan en localStorage (AuthContext).
4. Cada petición (apiFetch) añade el header Authorization: Bearer <access>.
5. Si el access expira (401), el cliente intenta /api/token/refresh/ una vez.
6. Si el refresh falla → limpia tokens y redirige a /login.
7. "Cerrar sesión" borra los tokens y vuelve a /login.
```

---

## Vistas del frontend

| Ruta | Vista | Descripción |
|---|---|---|
| `/login` | Login | Autenticación JWT |
| `/` | Dashboard | Tarjetas con el total de cada modelo |
| `/usuarios` | Usuarios | Tabla de cuentas (email, rol, estado) |
| `/docentes` | Docentes | Tabla de docentes (especialidad, teléfono…) |
| `/estudiantes` | Estudiantes | Tabla de estudiantes + enlace a su constancia |
| `/cursos` | Cursos | Tabla de cursos (créditos, descripción) |
| `/matriculas` | Matrículas | Tabla de la relación curso–estudiante |
| `/constancia` | Buscar constancia | Formulario por ID de estudiante |
| `/constancia/:studentId` | Constancia | Constancia de matrícula institucional |

---

## Endpoints de la API

### Autenticación (público)

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/token/` | Obtener access + refresh |
| POST | `/api/token/refresh/` | Renovar access |

### Recursos (requieren `Authorization: Bearer <token>`)

| Método | URL | Descripción |
|---|---|---|
| GET/POST | `/api/users/` | Usuarios |
| GET/POST | `/api/teachers/` | Docentes |
| GET/POST | `/api/students/` | Estudiantes |
| GET/POST | `/api/courses/` | Cursos |
| GET/POST | `/api/courses-students/` | Matrículas |
| GET | `/api/enrollment-certificate/?student_id=<uuid>` | Constancia de matrícula |
| GET | `/api/docs/` | Swagger UI |

Ejemplo:

```bash
# Token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "tu_password"}'

# Constancia con token
curl "http://127.0.0.1:8000/api/enrollment-certificate/?student_id=<uuid>" \
  -H "Authorization: Bearer <access_token>"
```

---

## Cumplimiento de la rúbrica 12.2

| # | Criterio | Cómo se cumple |
|---|---|---|
| 1 | Proyecto Vite | `frontend/` creado con React + Vite + TypeScript; `npm run dev`/`build` funcionan |
| 2 | Componentes | `Layout`, `DataTable`, `ResourceView`, `CertificateView`, `StudentInfo`, `CoursesTable`, `StatusBadge`, `SectionHeader` |
| 3 | TanStack Query | Hooks `useResources` y `useEnrollmentCertificate` con `useQuery`, `staleTime` y manejo de estados |
| 4 | Rutas | React Router con rutas protegidas y `/constancia/:studentId` |
| 5 | Diseño | Tarjeta institucional, barra azul de sección y tablas con bordes (estilo de la guía) |
| 6 | Despliegue | `vercel.json` + instrucciones de Vercel |
| 7 | Commits | Historial Git descriptivo |
| 8 | Informe | `informe/DAW_lab09_jwt.tex` con marco teórico, código y capturas |

---

## Integrantes

| Nombre |
|---|
| Santiago Cristopher Gutierrez Ramos |
| Angel Gabriel Hancco Flores |
| Matias Hernan Chamana Gonzales |

---

Proyecto académico — Escuela Profesional de Ingeniería de Sistemas, UNSA, semestre 2026-A.
