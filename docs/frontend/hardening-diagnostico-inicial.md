# Diagnóstico inicial de hardening web

Fecha de inspección: 2026-07-23.

Este diagnóstico se levantó antes de realizar cambios funcionales. La fuente de verdad HTTP revisada es `docs/arquitectura/openapi_backend_fase1.json` (OpenAPI 3.1.0, 35 operaciones). Se preservarán sin cambios las reglas actuales de alumnos menores y tutores.

## Módulos detectados

- Núcleo: configuración, autenticación, almacenamiento de sesión, refresh, interceptores, guards, permisos, layout y resolución de nombres.
- Compartido: estados loading/empty/error, encabezados, tablas, confirmación, badges, KPI, formato y media protegida.
- Funcionales: autenticación, dashboard, alumnos, planes, membresías, pagos/recibos, caja, asistencia/check-in, instructor hoy, reportes, usuarios/roles.
- Fuera del contrato actual: `sports` existe como placeholder preparado para una fase posterior; no se ampliará durante este sprint.

## Rutas detectadas

- Públicas: `/auth/login`.
- Protegidas generales: `/dashboard`, `/students`, `/plans`, `/memberships`, `/payments`, `/cash`, `/attendance`, `/instructor`, `/reports`, `/security`.
- Acciones protegidas: creación y edición de alumnos y planes; creación/renovación de membresías; registro y detalle/recibo de pagos; apertura/cierre de caja; check-in e historial por alumno; creación, detalle, estado y roles de usuarios; catálogo de roles.
- Sistema: `/forbidden` y ruta comodín de no encontrado.
- Preparada, no operativa en OpenAPI actual: `/sports`.
- Las rutas de features se cargan de forma diferida. Cloudflare configura `not_found_handling: "single-page-application"`.

## Permisos detectados

Los permisos canónicos declarados son los devueltos por `/auth/me`:

- `REPORTES_DIARIOS_CONSULTAR`.
- `ALUMNOS_CONSULTAR`, `ALUMNOS_CREAR`, `ALUMNOS_MODIFICAR`, `ALUMNOS_DESACTIVAR`.
- `PLANES_CONSULTAR`, `PLANES_GESTIONAR`.
- `MEMBRESIAS_CONSULTAR`, `MEMBRESIAS_CREAR`, `MEMBRESIAS_MODIFICAR`.
- `PAGOS_CONSULTAR`, `PAGOS_REGISTRAR`.
- `CAJA_CONSULTAR`, `CAJA_ABRIR`, `CAJA_CERRAR`.
- `ASISTENCIAS_CONSULTAR`, `ASISTENCIAS_REGISTRAR`.
- `USUARIOS_CONSULTAR`, `USUARIOS_CREAR`, `USUARIOS_MODIFICAR`, `USUARIOS_DESACTIVAR`.

Existen alias conceptuales para dashboard, reportes, instructor, seguridad y roles, todos mapeados a permisos reales. `DEPORTIVO_CONSULTAR` está reservado y no figura en el contrato actual.

## Servicios HTTP detectados

Se detectaron 12 servicios API:

- `AuthApiService`: login, refresh, logout y sesión actual.
- `StudentsApiService`: lista, detalle, alta, actualización, estado y foto.
- `PlansApiService`: lista, alta y actualización.
- `MembershipsApiService`: lista, alta, renovación y consulta por alumno.
- `PaymentsApiService`: lista, alta idempotente, detalle y recibo.
- `CashRegisterApiService`: caja actual, apertura y cierre.
- `AttendanceApiService`: check-in, asistencia del día e historial por alumno.
- `InstructorApiService`: instructor hoy.
- `ReportsApiService`: dashboard administrativo.
- `UsersApiService`: lista, alta, estado y roles.
- `RolesApiService`: catálogo de roles.
- `MediaApiService`: descarga autorizada como blob.

Los paths observados coinciden en método y ruta con las 35 operaciones publicadas; los DTO y parámetros se auditarán campo por campo en el reporte OpenAPI.

## Pruebas existentes

- 35 archivos `*.spec.ts`.
- 95 casos unitarios detectados.
- Cobertura actual en auth store, guards, menú, idempotencia, formularios y servicios principales, facades, badges, KPI, dashboard, asistencia y seguridad.
- El `package.json` solo expone `test`; no existen scripts `lint`, `test:coverage` ni `e2e`.
- No se detectó configuración ni directorio de una herramienta E2E.

## Riesgos encontrados

1. El interceptor de errores reintenta una petición tras refresh, pero actualmente limpia la sesión ante cualquier error de la petición reintentada, incluso 403, 404 o 500; esto puede cerrar una sesión válida.
2. No existen pruebas específicas de concurrencia de refresh ni del interceptor completo.
3. El mapper global conserva por defecto el mensaje recibido del servidor; falta garantizar mensajes de producto seguros y uniformes por código HTTP.
4. El almacenamiento de access y refresh token es `sessionStorage`. Reduce persistencia frente a `localStorage`, pero sigue expuesto ante XSS; no se cambiará de arquitectura en este sprint.
5. Algunos comentarios y encabezados de página conservan términos de sprint/fase, y existen identificadores técnicos visibles como contenido secundario.
6. La interfaz `PageResponse` asume `content` siempre presente; se requiere tolerancia defensiva en el borde HTTP o facades.
7. Hay filtros locales documentados en alumnos. Debe comprobarse que el cambio de filtro reinicie la página y que no se presente como paginación global del servidor.
8. No hay suite E2E ni entorno de fixtures controlados, por lo que la regresión integral solicitada no puede declararse cubierta todavía.
9. No hay script de lint ni reporte de cobertura configurado.
10. No se detectó configuración explícita de headers web (CSP, Referrer-Policy, Permissions-Policy, `frame-ancestors`) en el repositorio.
11. La configuración Angular usa SSR/prerender, mientras Cloudflare sirve el directorio `browser` como SPA. Debe validarse que build, assets y rutas directas produzcan artefactos compatibles.
12. La ruta y menú deportivos dependen de un permiso fuera del OpenAPI; permanecerán inaccesibles salvo que el backend ya lo entregue, sin añadir endpoints ni funcionalidad.
13. El OpenAPI declara un servidor localhost como metadato de desarrollo. La configuración Angular de producción sí usa `https://api.escuelaboxrd.com.mx/api/v1`; debe verificarse en el bundle final.
14. Falta evidencia automatizada de responsive, foco de menú/diálogo y navegación por teclado.
15. Deben revisarse doble submit, estado de progreso y conservación de la clave idempotente en todos los formularios de escritura.

## Diferencias iniciales contra OpenAPI

- Los 35 métodos y paths tienen consumidor Angular o corresponden a operaciones implementadas dentro de los servicios detectados.
- Los campos enriquecidos `branchName`, `studentName`, `openedByName`, `closedByName`, `planName`, `paymentFolio` y `receiptNumber` están presentes en los modelos relacionados, generalmente como opcionales para tolerancia.
- `cashRegisterId` se modela anulable en pagos, acorde con pagos que no requieren caja aunque el esquema no marca explícitamente la nulabilidad.
- `PageResponse.content` se tipa obligatorio, igual que el uso normal esperado, pero los esquemas no declaran campos `required`; se añadirá normalización defensiva sin cambiar el contrato enviado.
- `StudentSearchParams` conserva `search`, `level` y `sort` solo para filtrado local; no deben enviarse porque OpenAPI no los expone.
- No se detectó `GuardianDataStatus`, tutor pendiente ni cambios al contrato de tutor. Se mantendrá así.

El detalle por endpoint y cualquier corrección quedarán en `hardening-openapi-audit.md`.

## Tareas de hardening que se aplicarán

- Auditar DTO, método, ruta, parámetros, headers y respuesta de cada operación OpenAPI.
- Corregir sesión/refresh concurrente, retry único y limpieza exclusiva ante fallos de autenticación.
- Consolidar mapeo seguro de errores y pruebas por estatus.
- Revisar permisos de ruta, menú y acción; documentar la matriz real.
- Endurecer doble submit e idempotencia en escrituras.
- Normalizar paginación, fechas, moneda, nombres de presentación y media.
- Eliminar textos técnicos visibles y UUID usados como información de presentación.
- Corregir defectos puntuales de responsive y accesibilidad.
- Revisar producción, Cloudflare SPA, seguridad, headers y bundles.
- Ampliar pruebas unitarias de reglas de mayor riesgo.
- Ejecutar los scripts existentes y documentar con precisión los scripts ausentes.
- Crear checklist de smoke productivo, release, issues conocidos y reporte final.
