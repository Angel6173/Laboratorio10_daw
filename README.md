# Laboratorio 09 — JWT con Django REST Framework + React Frontend

> **Curso:** Desarrollo de Aplicaciones Web (DAW) — Semestre III
> **Escuela:** Ingeniería de Sistemas — UNSA
> **Tema:** Autenticación JWT en una API REST Django consumida por un cliente React + Vite.

El proyecto integra dos capas: un **backend Django REST Framework** protegido con JWT y un **frontend React + Vite** que implementa el flujo completo de autenticación (login → token → peticiones protegidas → logout) para generar constancias de matrícula.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Backend — Instalación y configuración JWT](#backend--instalación-y-configuración-jwt)
- [Frontend — Instalación](#frontend--instalación)
- [Ejecución](#ejecución)
- [Flujo de autenticación JWT](#flujo-de-autenticación-jwt)
- [Endpoints disponibles](#endpoints-disponibles)
- [Ejemplos con curl](#ejemplos-con-curl)
- [Integrantes](#integrantes)

---

## Requisitos previos

Antes de clonar el proyecto asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Python | 3.10+ | `python --version` |
| pip | 23+ | `pip --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | cualquier | `git --version` |

La base de datos es **Supabase (PostgreSQL)** — no necesitas instalar PostgreSQL localmente, solo necesitas las credenciales del proyecto (ver paso de configuración más abajo).

---

## Arquitectura

```
[React + Vite]  ──POST /api/token/──►  [Django + JWT]
     (5173)     ◄── access + refresh ──     (8000)
                ──GET /api/enrollment-certificate/
                   Authorization: Bearer <token> ──►
                ◄── JSON constancia ──
```

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Django + DRF | 6.0.6 / 3.17.1 |
| Auth | djangorestframework-simplejwt | 5.4.0 |
| CORS | django-cors-headers | 4.7.0 |
| Base de datos | PostgreSQL (Supabase) | 16 |
| Frontend | React + Vite + TypeScript | 19 / 6 |
| HTTP async | TanStack Query v5 | 5.x |
| Rutas | React Router DOM | 6.x |

---

## Estructura del proyecto

```
Laboratorio9_daw/
├── requirements.txt
├── README.md
├── enrollments/                  ← Backend Django
│   ├── manage.py
│   ├── enrollments/
│   │   ├── settings.py           (JWT + CORS + IsAuthenticated)
│   │   └── urls.py               (/api/token/ + /api/token/refresh/)
│   └── sismat/
│       ├── views.py              (ViewSets + EnrollmentCertificateView)
│       ├── urls.py               (/api/enrollment-certificate/)
│       ├── models/
│       └── serializers/
└── enrollment-certificate/       ← Frontend React
    ├── .env                      (VITE_API_BASE_URL)
    ├── src/
    │   ├── api/
    │   │   ├── authApi.ts        (login, tokens, localStorage)
    │   │   └── enrollmentApi.ts  (fetch con Bearer token)
    │   ├── context/
    │   │   └── AuthContext.tsx   (estado global de autenticación)
    │   ├── components/
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── CertificateView.tsx
    │   │   ├── CoursesTable.tsx
    │   │   ├── SectionHeader.tsx
    │   │   └── StudentInfo.tsx
    │   ├── hooks/
    │   │   └── useEnrollmentCertificate.ts
    │   └── pages/
    │       ├── LoginPage.tsx
    │       ├── HomePage.tsx
    │       └── CertificatePage.tsx
    └── netlify.toml
```

---

## Backend — Instalación y configuración JWT

### 1. Clonar el repositorio

```bash
git clone https://github.com/Angel6173/Laboratorio9_daw.git
cd Laboratorio9_daw
```

### 2. Crear y activar el entorno virtual

```bash
# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1

# Linux / macOS
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y rellena con tus credenciales:

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

> El archivo `.env` está en `.gitignore` — nunca se sube al repositorio.

### 5. Aplicar migraciones y crear superusuario

```bash
cd enrollments
python manage.py migrate
python manage.py createsuperuser
```

El superusuario es el que usarás para hacer login en el frontend React (`/login`).

### Configuración JWT en settings.py

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

---

## Frontend — Instalación

```bash
cd enrollment-certificate
npm install
```

El archivo `.env` ya está configurado:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## Ejecución

Abrir dos terminales:

**Terminal 1 — Backend:**
```bash
cd enrollments
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd enrollment-certificate
npm run dev
```

| URL | Descripción |
|---|---|
| `http://127.0.0.1:8000/api/token/` | Obtener JWT |
| `http://127.0.0.1:8000/api/token/refresh/` | Renovar JWT |
| `http://127.0.0.1:8000/api/enrollment-certificate/` | Constancia (protegida) |
| `http://127.0.0.1:8000/api/docs/` | Swagger UI |
| `http://localhost:5173/login` | Login frontend |
| `http://localhost:5173/` | Búsqueda de estudiante |
| `http://localhost:5173/constancia/:studentId` | Constancia de matrícula |

---

## Flujo de autenticación JWT

```
1. Usuario visita la app → ProtectedRoute detecta que no hay token → redirige a /login

2. LoginPage envía:
   POST http://127.0.0.1:8000/api/token/
   { "username": "admin", "password": "..." }

3. Django responde:
   { "access": "eyJ...", "refresh": "eyJ..." }
   → Tokens guardados en localStorage

4. Usuario ingresa UUID del estudiante → navega a /constancia/:studentId

5. CertificatePage llama useEnrollmentCertificate(studentId)
   → fetchEnrollmentCertificate envía:
   GET /api/enrollment-certificate/?student_id=<uuid>
   Authorization: Bearer eyJ...

6. Django valida el token y responde con los datos del estudiante y sus cursos

7. Si el token expiró → responde 401 → frontend limpia localStorage y redirige a /login

8. Cerrar sesión → botón "Cerrar sesión" limpia tokens → redirige a /login
```

---

## Endpoints disponibles

### Autenticación (sin JWT)

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/token/` | Obtener access + refresh token |
| POST | `/api/token/refresh/` | Renovar access token |

### Recursos (requieren `Authorization: Bearer <token>`)

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/enrollment-certificate/?student_id=<uuid>` | Constancia de matrícula |
| GET / POST | `/api/users/` | Usuarios |
| GET / POST | `/api/teachers/` | Docentes |
| GET / POST | `/api/students/` | Estudiantes |
| GET / POST | `/api/courses/` | Cursos |
| GET / POST | `/api/courses-students/` | Matrículas |
| GET | `/api/docs/` | Swagger UI |

---

## Ejemplos con curl

### Obtener token

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "tu_password"}'
```

### Obtener constancia con token

```bash
curl "http://127.0.0.1:8000/api/enrollment-certificate/?student_id=<uuid>" \
  -H "Authorization: Bearer <access_token>"
```

### Sin token — HTTP 401

```bash
curl "http://127.0.0.1:8000/api/enrollment-certificate/?student_id=<uuid>"
# {"detail": "Authentication credentials were not provided."}
```

---

## Integrantes

| Nombre |
|---|
| Santiago Cristopher Gutierrez Ramos |
| Angel Gabriel Hancco Flores |
| Matias Hernan Chamana Gonzales |

---

Proyecto académico — Escuela Profesional de Ingeniería de Sistemas, UNSA, semestre 2026-A.
