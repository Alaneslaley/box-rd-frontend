# Riesgos e issues conocidos de la web

## KI-01 — No existe suite E2E

- **Descripción:** `package.json` no contiene `e2e` y no hay herramienta, specs ni entorno de fixtures controlados.
- **Impacto:** no hay evidencia automatizada integral de login, sesión, alumnos, pagos, caja, asistencia, permisos ni responsive.
- **Severidad:** Alta; bloquea release según la Definition of Done.
- **Workaround:** ejecutar el checklist manual en un entorno de prueba con datos controlados.
- **Responsable futuro:** Frontend/QA.
- **Recomendación:** incorporar una suite E2E con backend de prueba o fixtures de red controlados, sin datos productivos.

## KI-02 — Smoke test productivo pendiente

- **Descripción:** no se realizaron login ni escrituras reales contra producción.
- **Impacto:** CORS, SSL, API dormida, permisos y flujos reales no están confirmados desde el dominio final.
- **Severidad:** Alta; bloquea release.
- **Workaround:** smoke test acompañado con cuentas y datos desechables/controlados.
- **Responsable futuro:** Release manager/Operaciones.
- **Recomendación:** completar `production-smoke-test-web.md` antes de habilitar usuarios reales.

## KI-03 — Foto y estado de alumno sin flujo Angular

- **Descripción:** OpenAPI publica `POST /students/{id}/photo` y `PATCH /students/{id}/status`, pero `StudentsApiService` y la UI no los consumen.
- **Impacto:** dos flujos incluidos en la regresión solicitada no pueden verificarse.
- **Severidad:** Alta para el alcance funcional declarado.
- **Workaround:** operar temporalmente desde un cliente administrativo autorizado, si existe, sin exponer credenciales.
- **Responsable futuro:** Frontend/Product owner.
- **Recomendación:** planear un corte funcional separado, con permisos, validación de tipo/tamaño y E2E; no mezclarlo con hardening.

## KI-04 — Headers de seguridad no versionados en el repositorio

- **Descripción:** no hay CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ni política explícita de framing en `wrangler.jsonc`.
- **Impacto:** depende de configuración manual de Cloudflare y no existe evidencia reproducible.
- **Severidad:** Media.
- **Workaround:** revisar los headers efectivos en Cloudflare antes del release.
- **Responsable futuro:** DevOps/Seguridad.
- **Recomendación:** probar primero en preview y luego versionar una política compatible. Propuesta:
  - `Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' blob: data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.escuelaboxrd.com.mx; upgrade-insecure-requests`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - HSTS solo después de confirmar todos los subdominios HTTPS.

## KI-05 — Tokens en sessionStorage

- **Descripción:** access y refresh token se almacenan en `sessionStorage`.
- **Impacto:** una vulnerabilidad XSS podría leerlos durante la pestaña activa.
- **Severidad:** Media.
- **Workaround:** CSP, sanitización Angular, revisión de dependencias y ausencia de `innerHTML`/bypass.
- **Responsable futuro:** Arquitectura/Backend/Seguridad.
- **Recomendación:** evaluar cookies HttpOnly/SameSite en un cambio coordinado de contrato; no migrar unilateralmente el frontend.

## KI-06 — Validación visual y accesibilidad manual incompleta

- **Descripción:** se revisó CSS/markup y se agregaron controles básicos, pero no se ejecutó matriz real de navegadores, viewports, lector de pantalla o foco de diálogo.
- **Impacto:** pueden persistir defectos puntuales de touch, foco o composición.
- **Severidad:** Media.
- **Workaround:** validación manual antes de entrega a usuarios.
- **Responsable futuro:** Frontend/QA/Diseño.
- **Recomendación:** probar 360, 390, 768, 1024, 1366 y 1920 px y navegación solo con teclado.

## KI-07 — Sin lint ni reporte de cobertura

- **Descripción:** no existen scripts `lint` ni `test:coverage`.
- **Impacto:** se pierden señales automatizadas de estilo, patrones riesgosos y huecos de prueba.
- **Severidad:** Media.
- **Workaround:** TypeScript estricto, build y 122 pruebas actuales.
- **Responsable futuro:** Frontend.
- **Recomendación:** agregar configuración mantenida por el equipo en un sprint de tooling; no instalar dependencias únicamente para silenciar el cierre.

## KI-08 — Catálogo de sucursales no publicado

- **Descripción:** `CreateUserRequest` requiere `branchId`, pero OpenAPI no ofrece endpoint de catálogo de sucursales.
- **Impacto:** si la sesión no tiene sucursal, la UI debe aceptar un código interno; la experiencia no puede ofrecer selección por nombre.
- **Severidad:** Baja/Media.
- **Workaround:** crear usuarios dentro de la sucursal de la sesión.
- **Responsable futuro:** API/Product owner.
- **Recomendación:** definir el contrato de catálogo antes de cambiar la UI; no inventar endpoint.

## KI-09 — Ruta deportiva reservada

- **Descripción:** existe `/sports` detrás de `DEPORTIVO_CONSULTAR`, permiso no publicado por el OpenAPI actual.
- **Impacto:** normalmente permanece oculta; si el backend entregara ese código, mostraría solo “no disponible”.
- **Severidad:** Baja.
- **Workaround:** no asignar un permiso fuera del catálogo actual.
- **Responsable futuro:** Product owner.
- **Recomendación:** conservar fuera del menú operativo hasta definir contrato y alcance.
