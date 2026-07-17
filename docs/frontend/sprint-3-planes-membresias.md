# Sprint 3 — Planes y Membresías

## Objetivo

Implementar el catálogo de planes y el flujo administrativo básico de membresías sobre los endpoints reales de `docs/arquitectura/openapi_backend_fase1.json`, sin trasladar reglas críticas del backend a Angular.

## Implementación

- Feature `plans` independiente, lazy-loaded, con listado paginado, filtro de inactivos, alta y edición.
- Feature `memberships` lazy-loaded, con listado paginado, alta y renovación.
- Integración del historial real de membresías en el detalle de alumno.
- Alta de membresía desde el detalle de alumno mediante `?studentId=<uuid>`.
- Signals para estado sencillo de página y RxJS para llamadas HTTP.
- Estados de carga, vacío y error con `traceId` cuando el backend lo informa.
- Badges visuales para estados de planes y membresías.
- Acciones, rutas y menú condicionados por permisos de UX. El backend sigue siendo la autoridad final.
- El placeholder anterior de Membresías fue retirado al ser reemplazado por `MembershipsListPageComponent`.

## Rutas

| Ruta | Función | Permiso backend |
| --- | --- | --- |
| `/plans` | Listado de planes | `PLANES_CONSULTAR` |
| `/plans/new` | Alta de plan | `PLANES_GESTIONAR` |
| `/plans/:id/edit` | Edición de plan | `PLANES_GESTIONAR` |
| `/memberships` | Listado de membresías | `MEMBRESIAS_CONSULTAR` |
| `/memberships/new` | Alta de membresía | `MEMBRESIAS_CREAR` |
| `/memberships/:id/renew` | Renovación | `MEMBRESIAS_MODIFICAR` |
| `/students/:id` | Historial de membresías del alumno | `ALUMNOS_CONSULTAR`; el bloque adicional usa `MEMBRESIAS_CONSULTAR` |

Los nombres conceptuales `plans.read`, `plans.create`, `plans.update`, `memberships.read`, `memberships.create` y `memberships.renew` se mapean a los códigos canónicos anteriores, que son los que devuelve `/auth/me`.

## Endpoints consumidos

Todos se construyen a partir de `environment.apiBaseUrl` (actualmente `/api/v1`):

- `GET /plans?page={page}&size={size}&includeInactive={boolean}`
- `POST /plans`
- `PUT /plans/{id}`
- `GET /memberships?page={page}&size={size}`
- `POST /memberships`
- `POST /memberships/{id}/renew`
- `GET /memberships/student/{studentId}`
- `GET /students?page=0&size=100` y, cuando el flujo parte de un alumno, `GET /students/{id}` para poblar el selector.

Las llamadas protegidas reutilizan los interceptores de Sprint 1 para bearer token, refresh coordinado, trazabilidad, carga y normalización de errores.

## DTOs usados

### Planes

- `PlanSnapshot`: `id`, `branchId`, `name`, `description`, `type`, `price`, `currency`, `validityDays`, `includedClasses`, `status`.
- `CreatePlanRequest`: `branchId` opcional, `name`, `description`, `type`, `price`, `currency`, `validityDays`, `includedClasses`.
- `UpdatePlanRequest`: `name`, `description`, `price`, `currency`, `validityDays`, `includedClasses`, `status`. El tipo no se envía porque el contrato no lo permite.
- Tipos: `WEEKLY`, `MONTHLY`, `SINGLE_CLASS`, `CLASS_PACKAGE`.
- Estados: `ACTIVO`, `INACTIVO`.

### Membresías

- `MembershipSnapshot`: `id`, `branchId`, `studentId`, `planId`, `planName`, `planType`, `startDate`, `endDate`, `status`, `includedClasses`, `remainingClasses`.
- `CreateMembershipRequest`: `studentId`, `planId`, `startDate`.
- `RenewMembershipRequest`: `effectiveOn`.
- Estados: `PENDING`, `ACTIVE`, `EXPIRED`, `FROZEN`, `CANCELLED`.

Las listas usan `PageResponse<T>` con `content`, `page`, `size`, `totalElements`, `totalPages`, `first` y `last`.

## Validaciones frontend

Son ayudas de UX, no reglas de negocio:

- Plan: nombre requerido y máximo 120; descripción máximo 300; precio requerido y no negativo; moneda con tres letras mayúsculas; vigencia mayor que cero si se captura. “Clases incluidas” solo se captura y envía para `SINGLE_CLASS` y `CLASS_PACKAGE`; no se muestra ni se envía para planes semanales o mensuales.
- Membresía: alumno, plan y fecha de inicio requeridos; fecha con formato `YYYY-MM-DD`.
- Renovación: fecha efectiva requerida con formato `YYYY-MM-DD`.
- Botones deshabilitados durante guardado y mensajes asociados a campos inválidos.

## Fuente de verdad del backend

Angular no calcula ni persiste la fecha final de membresía, el estado definitivo, las clases restantes, acumulaciones, congelamientos, cancelaciones, elegibilidad, auditoría ni autorización. Tampoco supone que crear o renovar una membresía implique un pago. Todos esos resultados provienen del backend.

## Cómo probar manualmente

1. Iniciar la API y ejecutar `npm start`.
2. Iniciar sesión con un usuario cuyos permisos incluyan los códigos necesarios.
3. Abrir `/plans`, alternar “Incluir planes inactivos” y validar paginación.
4. Crear un plan y editarlo desde el listado; comprobar que el tipo no sea editable.
5. Abrir `/memberships/new`, seleccionar alumno, plan activo y fecha de inicio.
6. Abrir `/memberships` y renovar una fila usando una fecha efectiva.
7. Abrir `/students/:id`, revisar su historial y probar “Nueva membresía” con alumno preseleccionado.
8. Probar respuestas 400/403/404/500 y verificar que no se muestre JSON crudo ni información sensible.

## Pruebas automatizadas

- `PlansApiService`: paginación/filtro, alta y edición.
- `PlanFormComponent`: nombre, precio, moneda y exclusión de `type` al editar.
- `MembershipsApiService`: listado, alta, renovación e historial por alumno.
- `MembershipCreateFormComponent`: alumno, plan y formato de fecha.
- Configuración de permisos en rutas y menú.

Comandos disponibles:

```bash
npm run build
npm test -- --watch=false
```

No existe script `lint` en `package.json`, por lo que no se ejecuta lint en este sprint.

## TODO y riesgos conocidos

- OpenAPI no publica `GET /plans/{id}`. La edición usa el estado de navegación y, como fallback temporal, busca el ID en `GET /plans?page=0&size=100&includeInactive=true`. Un catálogo de más de 100 planes puede dejar una URL directa sin datos. Añadir el endpoint o un resolver cuando el backend lo exponga.
- OpenAPI no publica `GET /memberships/{id}`. La renovación debe iniciarse desde el listado; una URL directa muestra un error controlado. Sustituir este mecanismo cuando exista consulta por ID.
- Los selectores de alta cargan hasta 100 alumnos y 100 planes, respetando el máximo actual. Para catálogos mayores se necesita búsqueda remota/autocompletado soportado por backend.
- `MembershipSnapshot` no incluye nombre del alumno; el listado enlaza al expediente y muestra su UUID. Evitar inventar un nombre hasta que el contrato lo incluya o exista una consulta agregada adecuada.
- Sprint 4 puede consumir estos recursos desde Pagos, manteniendo el pago y cualquier efecto sobre membresías como una transacción del backend.
