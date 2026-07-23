# Cierre de hardening web GymBox

Fecha: 2026-07-23.

## Objetivo y alcance

Se auditó y endureció incrementalmente la aplicación Angular administrativa, sin modificar backend, migraciones, endpoints, permisos de servidor ni reglas de negocio. Las reglas actuales de alumnos menores y tutores se conservaron exactamente: no se creó `GuardianDataStatus`, tutor pendiente ni posibilidad nueva de guardar menores sin tutor.

## Diagnóstico inicial

Se detectaron los módulos principales, 35 operaciones OpenAPI, 12 servicios HTTP y una base de 35 archivos/95 pruebas. Los riesgos prioritarios fueron:

- cierre de sesión incorrecto si una petición reintentada fallaba con un error distinto de 401;
- redirects no restringidos al volver del login;
- mensajes crudos provenientes del servidor;
- page/size sin defensa común;
- doble submit desigual;
- prerender de rutas protegidas que generaba redirects a login al hacer F5;
- ausencia de E2E, lint y cobertura;
- dos operaciones de alumnos publicadas sin flujo Angular.

El detalle original está en `hardening-diagnostico-inicial.md`.

## Correcciones aplicadas

### Sesión y seguridad

- Refresh concurrente compartido; ambos tokens se reemplazan en una sola actualización del store.
- Retry máximo una vez mediante `AUTH_REQUEST_RETRIED`.
- Refresh fallido, token ausente o segundo 401 limpian sesión y redirigen.
- 403/404/500 después de un refresh exitoso no destruyen una sesión válida.
- Login acepta únicamente `returnUrl` interno; rechaza esquema, protocol-relative, backslash y saltos de línea.
- Detección de URL API con límite de segmento para evitar coincidencias de prefijo.
- Logout repetido bloqueado y limpieza local conservada.

### Errores

- Mapper común para 0, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503 y 504.
- La UI ya no usa `message` o `details` crudos.
- `traceId` se conserva únicamente como referencia discreta.
- Un error de red/timeout no se confunde con 401.

### Operaciones y datos

- Doble submit bloqueado en login, alumnos, planes, membresías, pagos, caja, check-in, usuarios, roles y estado.
- Pago conserva una `Idempotency-Key` por intención, incluso al reintentar una respuesta incierta; una intención distinta genera otra clave.
- Paginación normalizada a page basado en cero y size `1..100`; respuestas degradadas sin `content` se vuelven array vacío.
- LocalDate se formatea sin conversión UTC y la moneda recibida controla el formato.
- Media protegida sigue usando blob; la revocación de object URLs se prueba al reemplazar y destruir.
- Campos de nombre enriquecido siguen siendo la presentación principal; UUID se reserva para operación/ruta.

### Producción, Cloudflare y SPA

- Se confirmó `https://api.escuelaboxrd.com.mx/api/v1`, HTTPS y prefijo único.
- Se preservó Cloudflare Workers con assets y `single-page-application`.
- Se retiró SSR/prerender del build productivo servido como assets. El build anterior generaba HTML de redirect a login para rutas protegidas porque no disponía de `sessionStorage`.
- Se retiró hidratación cliente, innecesaria en el build SPA.
- Se agregó `/login` como alias interno de la ruta existente `/auth/login`.
- Wrangler local devuelve HTTP 200 en `/`, `/login`, `/dashboard`, `/students`, `/payments`, `/attendance`, `/security/users` y una ruta inexistente.

### Accesibilidad y consistencia

- Documento `lang="es-MX"` y título de producto.
- Skip link al contenido principal, destino enfocable y foco visible.
- `select`/`textarea` heredan tipografía.
- Textos visibles de sprint/fase sustituidos.
- Botones sensibles muestran progreso y quedan deshabilitados.

## Archivos creados

- Diagnóstico, auditoría OpenAPI, matriz de permisos, cierre, release checklist, smoke productivo y known issues en `docs/frontend/`.
- `api-error.mapper.ts` y pruebas.
- `page-response.util.ts` y pruebas.
- `safe-return-url.ts` y pruebas.
- Specs de refresh, interceptor, URL API, formatos, idempotencia de pago y media protegida.

## Archivos modificados

- Configuración: `angular.json`, `src/app/app.config.ts`, `src/index.html`, `src/styles.css`.
- Core: URL API, interceptor de errores, shell/topbar y modelo de sesión.
- Data access paginado: alumnos, planes, membresías, pagos, asistencia, instructor y usuarios.
- Mensajes de error de alumnos, planes, membresías, pagos, caja, asistencia, reportes y seguridad.
- Formularios/páginas de escritura para doble submit.
- Encabezados y placeholders para textos de producto.

No se modificaron `package.json`, `package-lock.json`, backend, base de datos, migraciones ni OpenAPI.

## Pruebas ejecutadas y resultados

| Validación | Resultado |
|---|---|
| `npm ci` | Correcto; 644 paquetes instalados |
| `npm test -- --watch=false` | Correcto; 45 archivos, 122 pruebas |
| `npm run build -- --configuration production` | Correcto; sin errores ni warnings |
| Wrangler local SPA | 200 en 8 rutas probadas |
| `npm run lint` | No ejecutable: script/configuración inexistente |
| `npm run test:coverage` | No ejecutable: script/configuración inexistente |
| `npm run e2e` | No ejecutable: script/herramienta/entorno inexistente |

Pruebas agregadas: concurrencia y recuperación de refresh; retry 401; conservación de sesión ante 500; mapper seguro; límites de API URL; redirect interno; page/size; LocalDate; moneda; idempotencia/doble submit de pago; lifecycle de object URL.

## Build y rendimiento

- Bundle inicial: **301.71 kB raw**, **80.25 kB estimados transferidos**.
- `main`: 283.53 kB raw / 76.61 kB transferidos.
- estilos: 18.18 kB raw / 3.64 kB transferidos.
- Budget inicial: warning 500 kB, error 1 MB; no excedido.
- Features continúan lazy-loaded; 75 chunks diferidos reportados.
- No se aumentaron budgets ni se agregaron dependencias.

## Permisos

La matriz completa está en `hardening-matriz-permisos.md`. Se verificó estáticamente y con unit tests:

- opción de menú condicionada;
- ruta directa con guard;
- acciones condicionadas;
- 403 navega a forbidden;
- frontend documentado como control UX, no seguridad definitiva.

## OpenAPI

La auditoría completa está en `hardening-openapi-audit.md`:

- 35 operaciones revisadas;
- 33 con consumidor Angular alineado;
- 2 pendientes: foto y estado de alumno;
- paginación y `AuthUser.branchName` corregidos;
- no se inventaron endpoints.

## Responsive

Se revisaron contenedores, tablas, grids, cards, formularios y botones en CSS. Existen cortes para móvil/tablet y tablas encapsuladas. No se ejecutó una validación visual real en los seis viewports solicitados; permanece en el checklist previo a release.

## Accesibilidad

Se verificaron labels principales, tablas con caption/headers, alt/fallback de imágenes, foco visible, estados con `role=status/alert` y skip link. No se ejecutó lector de pantalla ni auditoría completa de foco de diálogo; queda pendiente.

## Seguridad

- Sin `innerHTML` ni bypass de sanitización detectados.
- Sin tokens en query params o logs.
- Sin secretos en environments.
- Redirect interno seguro.
- Mensajes técnicos no se presentan.
- Storage actual documentado como riesgo.
- Headers propuestos, no activados sin prueba, en `known-issues-web.md`.

## Configuración productiva

- API: `https://api.escuelaboxrd.com.mx/api/v1`.
- Cloudflare assets: `./dist/admin-box-RD/browser`.
- SPA fallback: activo.
- Workers/Pages: no se cambió la modalidad existente.
- Dominio personalizado: no se modificó.
- `workers.dev`: no se reactivó.

## Riesgos aceptados y pendientes

No se aceptan como cerrados los blockers:

1. suite E2E crítica inexistente;
2. smoke productivo pendiente;
3. foto y estado de alumno sin flujo Angular;
4. responsive/accesibilidad manual incompletos.

Otros riesgos: headers no versionados, sessionStorage, falta de lint/cobertura, ausencia de catálogo de sucursales y ruta deportiva reservada. Ver `known-issues-web.md`.

## Rollback

1. No desplegar este cambio hasta cerrar los blockers.
2. Si se despliega y falla, volver a la versión Cloudflare previamente identificada.
3. Restaurar conjuntamente `angular.json` y `app.config.ts` solo si se vuelve a una infraestructura SSR real; no restaurar prerender mientras Cloudflare sirva assets SPA.
4. Revertir las correcciones como una unidad desde el commit de release, no archivo por archivo.
5. Confirmar después del rollback login, F5 interno, API base y logout.

## Checklist de release

El estado marcable está en `release-checklist-web.md`; el smoke está en `production-smoke-test-web.md`.

## Recomendación

**NO-GO**.

El build, tests unitarios, budgets, sesión, errores, doble submit y fallback SPA tienen evidencia positiva. Sin embargo, la Definition of Done exige E2E crítico aprobado y la operación real controlada aún no tiene smoke productivo. Además, dos flujos de alumnos publicados por OpenAPI no existen en Angular. Liberar ahora obligaría a aceptar brechas que el propio alcance define como obligatorias.
