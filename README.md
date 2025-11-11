<div align="center">

# 🛒 Frontend E‑commerce (Vanilla JS)

Tienda web con autenticación JWT, perfil de usuario, checkout con Mercado Pago, panel admin, calificaciones, búsqueda y chatbot. 100% HTML/CSS/JS sin frameworks.

</div>

## 📚 Tabla de Contenidos

- Introducción
- Características
- Arquitectura y Stack
- Estructura del Proyecto
- Configuración de API (BASE_URL)
- Autenticación y Sesión
- Páginas Públicas vs Privadas
- Flujos Clave
- Manejo de Errores y Redirecciones
- Desarrollo Local (Guía Rápida)
- Navegación en la App
- Buenas Prácticas Internas
- Punteros Rápidos a Archivos
- Checklist de Verificación
- Contribuir

## 🎯 Introducción

Este proyecto implementa el frontend de una tienda con flujos completos de usuario: catálogo público, autenticación, perfil, checkout y administración. Todo el consumo de API se centraliza y normaliza a través de un cliente HTTP con control robusto de errores.

## ✅ Características

- Catálogo público con búsqueda y detalle de productos.
- Autenticación JWT: login, registro, recuperación y reseteo de contraseña.
- Perfil: historial, favoritos, domicilios, métricas de uso.
- Checkout: resumen, selección de domicilio, pago (Mercado Pago vía backend).
- Panel Admin: productos, usuarios, ventas, subida/eliminación de imágenes.
- Calificaciones y promedio de estrellas.
- Chatbot flotante con backend.
- Cliente API único con manejo silencioso de errores y redirecciones controladas.

## 🧱 Arquitectura y Stack

- HTML5, CSS3.
- JavaScript (ES6+), Fetch API.
- JWT en `localStorage`.

## 🗂️ Estructura del Proyecto

- `index.html` — Home, header, carrito.
- `html/` — Vistas: `admin.html`, `perfil.html`, `productos.html`, `checkout-pago.html`, páginas de MP y reset.
- `css/`, `imgs/`, `fonts/` — Estilos y assets.
- `scriptsFolder/` — Lógica JS modular:
  - `api/` — Módulos de API y cliente HTTP:
    - `apiClient.js` — cliente y `BASE_URL` central.
    - `api_auth.js`, `api_usuarios.js`, `api_productos.js`, `api_ventas.js`, `api_favoritos.js`, `api_imagenes.js`, `api_estrellas.js`, `api_mercadopago.js`, `api_busqueda.js`.
  - `auth.js` — Login/registro, UI de sesión, redirección post-login.
  - `perfil.js` — Lógica del perfil.
  - `admin.js` — Panel admin (tabs y acciones).
  - `productos.js` — Vista productos + ratings inline.
  - `detallesProducto.js` — Modal de detalle + favoritos/carrito.
  - `checkout-pago.js` — Flujo de checkout guiado.
  - `checkout-mp.js` — Flujo MP alternativo.
  - `busqueda.js`, `estrellas.js`, `chatbot.js`, `funciones.js`, `Inicio.js`, `modalHandler.js`.

## 🔧 Configuración de API (BASE_URL)

Definición única en `scriptsFolder/api/apiClient.js`:

```
export const BASE_URL = 'https://backend-22cs.onrender.com/api';
```

- Todas las rutas en el código deben ir SIN `/api` (ej.: `/productos`, `/usuarios/me`, `/payments/create-order`).
- Para desarrollo local podés cambiar temporalmente a `http://localhost:8080/api`.

## 🔐 Autenticación y Sesión

- Token: `localStorage.getItem('jwt_token')`.
- Roles: `localStorage.getItem('user_roles')` (JSON array).
- Uso del cliente: `llamarApi(endpoint, method, data, requiresAuth = true, queryParams, customHeaders)`.
  - Endpoints públicos: pasar `requiresAuth=false` (login, registro, catálogo público, etc.).
  - Si `requiresAuth=true` y no hay token → lanza `NO_AUTH_TOKEN` (sin alertas ni redirecciones).
  - En `401`:
    - Página privada (perfil/admin/checkout): limpia sesión y redirige en silencio a `/index.html`.
    - Página pública: sólo log suave en consola.

## 🌐 Páginas Públicas vs Privadas

- Públicas: `index.html`, `productos.html`, reset de contraseña, páginas de retorno de MP.
  - Nunca alertan ni redirigen si no hay token.
- Privadas: `perfil.html`, `admin.html`, `checkout-pago.html`.
  - Sin token: no llaman endpoints autenticados.
  - `401`: redirección única y silenciosa al login/home.

## 🔁 Flujos Clave

- Autenticación: `scriptsFolder/auth.js` + `scriptsFolder/api/api_auth.js`.
  - Post-login: si `ROLE_ADMIN` → `/html/admin.html`; caso contrario → `/index.html`.
- Perfil: `scriptsFolder/perfil.js` + `scriptsFolder/api/api_usuarios.js` (`/usuarios/me`).
- Favoritos: `scriptsFolder/api/api_favoritos.js`.
- Productos:
  - Público: `obtenerProductos`, `obtenerProductoPorId` (`requiresAuth=false`).
  - Búsqueda por nombre: `/productos/buscar-id` es público.
  - Admin CRUD + imágenes: `admin.js` + `api_productos.js` (JWT + `BASE_URL`).
- Checkout: `html/checkout-pago.html` + `scriptsFolder/checkout-pago.js`.
  - Orden/pago: `scriptsFolder/api/api_mercadopago.js#crearPreferencia` → `/payments/create-order`.
- Ratings: `scriptsFolder/estrellas.js` (promedio público, envío autenticado).
- Búsqueda: `scriptsFolder/busqueda.js` + `scriptsFolder/api/api_busqueda.js`.
- Chatbot: `scriptsFolder/chatbot.js` → `POST ${BASE_URL}/chat`.

## 🧯 Manejo de Errores y Redirecciones

Centralizado en `scriptsFolder/api/apiClient.js`:

- Sin token en llamada autenticada → `NO_AUTH_TOKEN` (silencioso).
- `401 Unauthorized`:
  - Privadas: redirige a `/index.html` (sin alertas).
  - Públicas: sólo `console.warn`.
- Otros errores: `console.error` (públicas evitan alertas intrusivas).

## 🧪 Desarrollo Local (Guía Rápida)

1) Backend disponible en `http://localhost:8080/api`.
2) Cambiar temporalmente `BASE_URL` en `apiClient.js`.
3) Servir el sitio de forma estática:

```
npx serve .
# o
python3 -m http.server 8081
# o VS Code Live Server
```

## 🧭 Navegación en la App

- Home: `index.html`.
- Login/Registro: modal en el header.
- Perfil: `/html/perfil.html` (requiere token).
- Admin: `/html/admin.html` (requiere `ROLE_ADMIN`).
- Checkout: `/html/checkout-pago.html` (requiere token y carrito).

## 🧰 Buenas Prácticas Internas

- Usar `llamarApi()` y `BASE_URL` en todas las llamadas (sin hardcodear hosts).
- Token único: `jwt_token`; roles: `user_roles`.
- Mantener páginas públicas libres de efectos de auth (sin alertas/redirecciones).

## 📎 Punteros Rápidos a Archivos

- Cliente y config: `scriptsFolder/api/apiClient.js`
- Auth UI/flow: `scriptsFolder/auth.js`, `scriptsFolder/api/api_auth.js`
- Perfil: `scriptsFolder/perfil.js`, `scriptsFolder/api/api_usuarios.js`
- Admin: `scriptsFolder/admin.js`, `scriptsFolder/api/api_productos.js`, `scriptsFolder/api/api_usuarios.js`, `scriptsFolder/api/api_ventas.js`
- Checkout: `scriptsFolder/checkout-pago.js`, `scriptsFolder/api/api_mercadopago.js`
- Productos/Detalles: `scriptsFolder/api/api_productos.js`, `scriptsFolder/detallesProducto.js`
- Ratings: `scriptsFolder/estrellas.js`, `scriptsFolder/api/api_estrellas.js`
- Búsqueda: `scriptsFolder/busqueda.js`, `scriptsFolder/api/api_busqueda.js`
- Chatbot: `scriptsFolder/chatbot.js`

## ✅ Checklist de Verificación

- [ ] Sin login, la app no alerta ni redirige en páginas públicas.
- [ ] En páginas privadas, sin token no se llama al backend.
- [ ] Con token vencido, se redirige una sola vez y en silencio.
- [ ] Admin sólo se redirige al panel después del login.
- [ ] `/productos/buscar-id` funciona sin autenticación.
- [ ] Todo el frontend usa `jwt_token` y la misma `BASE_URL`.

## 🤝 Contribuir

- Agregar módulos bajo `scriptsFolder/` y enlazarlos desde la vista correspondiente.
- Respetar la política de auth/redirects y el uso de `BASE_URL`.
