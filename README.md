# Laboratorio 10 — API REST con JWT (Django) + Frontend React/Vite en la nube

> **Curso:** Desarrollo de Aplicaciones Web (DAW) — Semestre III · EPIS-UNSA
> **Tema:** Backend Django REST protegido con **JWT** + panel web **React + Vite**, desplegado en la nube (Render + Vercel + Supabase).

Sistema completo de matrícula de laboratorio (**SISMAT**): un backend Django que expone una API REST con autenticación JWT, y un panel web React que consume esa API y muestra todos los modelos del sistema más la constancia de matrícula.

---

## 🌐 Enlaces en vivo

| Qué | URL |
|---|---|
| **Web (frontend)** | https://laboratorio10-daw-angel6174.vercel.app |
| **API (backend)** | https://laboratorio10-daw.onrender.com/api/docs/ |
| **Repositorio** | https://github.com/Angel6173/Laboratorio10_daw |

**Credenciales de acceso (demo):** usuario `admin` · contraseña `Sismat2026`

---

## 🧩 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Django + Django REST Framework |
| Autenticación | djangorestframework-simplejwt (JWT) |
| CORS | django-cors-headers |
| Base de datos | PostgreSQL (Supabase) |
| Frontend | React + Vite + TypeScript |
| Datos remotos | TanStack Query |
| Rutas | React Router |
| Despliegue backend | Render (gunicorn + whitenoise) |
| Despliegue frontend | Vercel |

---

## 📁 Estructura del proyecto

```
Laboratorio10_daw/
├── requirements.txt          → dependencias del backend
├── render.yaml               → configuración de despliegue (Render)
├── enrollments/              → BACKEND (Django)
│   ├── manage.py
│   ├── .env.example          → plantilla de credenciales
│   ├── enrollments/          → settings.py (JWT, CORS), urls.py, wsgi.py
│   └── sismat/               → models/, serializers/, views.py, urls.py
└── frontend/                 → FRONTEND (React + Vite)
    ├── package.json
    ├── vercel.json
    ├── .env.example          → VITE_API_BASE_URL
    └── src/                  → api/, context/, hooks/, components/, pages/
```

---

## ✅ Requisitos previos

| Herramienta | Versión |
|---|---|
| Python | 3.12+ |
| Node.js | 20+ (LTS) |
| Git | cualquiera |
| Cuenta Supabase | para la base de datos |
| Cuenta Render + Vercel | para el despliegue |

---

# PARTE 1 — Ejecutar en local (paso a paso)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Angel6173/Laboratorio10_daw.git
cd Laboratorio10_daw
```

### 2. Backend — entorno virtual e instalación
```bash
python -m venv venv
venv\Scripts\Activate.ps1        # Windows
# source venv/bin/activate       # Linux / macOS

pip install -r requirements.txt
```

### 3. Backend — variables de entorno
```bash
cp enrollments/.env.example enrollments/.env
```
Edita `enrollments/.env` con los datos de tu Supabase:
```env
SECRET_KEY=una-clave-larga-y-secreta
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
```

### 4. Backend — migraciones, superusuario y arranque
```bash
cd enrollments
python manage.py migrate
python manage.py createsuperuser     # con este usuario harás login
python manage.py runserver           # http://127.0.0.1:8000
```

### 5. Frontend — instalación y arranque
En **otra terminal**:
```bash
cd frontend
npm install

cp .env.example .env                 # ya apunta a http://127.0.0.1:8000
npm run dev                          # http://localhost:5173
```

### 6. Probar
Abre `http://localhost:5173`, inicia sesión con tu superusuario y navega el panel. ✅

---

# PARTE 2 — Desplegar en la nube (paso a paso)

El objetivo: **backend en Render + frontend en Vercel + base de datos en Supabase**, para que funcione sin depender de tu máquina.

## A) Base de datos — Supabase (Session Pooler)

Render solo se conecta por IPv4, así que se usa el **Session Pooler** de Supabase (no el host directo, que es IPv6).

### Cómo encontrar los datos del Session Pooler (paso a paso)

1. Entra al dashboard de tu proyecto en Supabase.
2. Arriba, junto al nombre del proyecto, haz clic en el botón **Connect** (ícono de enchufe 🔌).
3. Se abre la ventana **"Connect to your project"**.
4. Busca la sección **"Connection String"**. Por defecto muestra un **desplegable** que dice **"Direct connection"**.
5. **Haz clic en ese desplegable** y cámbialo a **"Session pooler"**. *(Este es el truco: por defecto sale "Direct connection"; hay que cambiarlo para ver el pooler.)*
6. Copia los datos que aparecen. Reconoces que es el pooler porque:
   - **Host:** contiene `pooler.supabase.com` → `aws-1-<region>.pooler.supabase.com`
   - **User:** lleva el ID del proyecto → `postgres.<project-ref>`
   - **Port:** `5432`

La cadena completa se ve así (de ahí sacas cada valor):
```
postgresql://postgres.<project-ref>:[PASSWORD]@aws-1-<region>.pooler.supabase.com:5432/postgres
```

## B) Backend — Render

1. Sube el proyecto a GitHub (ver PARTE 3).
2. En [render.com](https://render.com) → **New + → Web Service** → conecta tu repo.
3. Configura:
   - **Root Directory:** *(vacío)*
   - **Instance Type:** Free
   - **Build Command:**
     ```
     pip install -r requirements.txt && python enrollments/manage.py collectstatic --noinput && python enrollments/manage.py migrate
     ```
   - **Start Command:**
     ```
     gunicorn --chdir enrollments enrollments.wsgi:application --bind 0.0.0.0:$PORT
     ```
4. **Environment Variables:**
   ```
   PYTHON_VERSION        = 3.12.5
   DEBUG                 = False
   SECRET_KEY            = (una clave larga)
   ALLOWED_HOSTS         = .onrender.com
   CSRF_TRUSTED_ORIGINS  = https://*.onrender.com
   DB_NAME               = postgres
   DB_USER               = postgres.<project-ref>          (del pooler)
   DB_PASSWORD           = tu_password_de_supabase
   DB_HOST               = aws-1-<region>.pooler.supabase.com
   DB_PORT               = 5432
   ```
5. **Deploy.** Cuando diga "Live", prueba `https://tu-backend.onrender.com/api/docs/` (Swagger).

## C) Frontend — Vercel

1. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el mismo repo.
2. Configura:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Environment Variable:** `VITE_API_BASE_URL = https://tu-backend.onrender.com`
3. **Deploy.** Tu web quedará en `https://tu-proyecto.vercel.app`.

> El backend ya permite cualquier origen `*.vercel.app` en su CORS, así que la web conecta sin ajustes extra.

## D) Probar en línea
Abre tu URL de Vercel + `/login`, entra con `admin` / `Sismat2026`.
> ⏱️ La primera carga tarda ~40 seg (el backend gratis de Render "despierta").

---

# PARTE 3 — Subir el proyecto a GitHub

```bash
git add .
git commit -m "Subiendo proyecto laboratorio 10"
git push
```
Al hacer `push`, **Render y Vercel redespliegan automáticamente** los cambios.

---

## 🔌 Endpoints de la API

| Método | URL | Descripción |
|---|---|---|
| POST | `/api/token/` | Obtener access + refresh (login) |
| POST | `/api/token/refresh/` | Renovar el access token |
| GET | `/api/users/` | Usuarios |
| GET | `/api/teachers/` | Docentes |
| GET | `/api/students/` | Estudiantes |
| GET | `/api/courses/` | Cursos |
| GET | `/api/courses-students/` | Matrículas |
| GET | `/api/enrollment-certificate/?student_id=<uuid>` | Constancia de matrícula |
| GET | `/api/docs/` | Swagger (documentación interactiva) |

> Todos los endpoints (menos los de token) requieren la cabecera `Authorization: Bearer <access>`.

---

## 👥 Integrantes

- Santiago Cristopher Gutierrez Ramos
- Angel Gabriel Hancco Flores
- Matias Hernan Chamana Gonzales

---

Proyecto académico — Escuela Profesional de Ingeniería de Sistemas, UNSA · 2026-A.
