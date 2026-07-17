# DTOs definitivos y refresh token (Fase 1)

Documento corto de referencia para clientes e IA. La fuente de verdad es la API en ejecucion bajo `/api/v1`; no inventar campos ni rutas fuera de este documento.

## Convenciones comunes

- JSON usa `camelCase`. Los UUID se envian como texto; `LocalDate` como `YYYY-MM-DD`; los instantes como ISO-8601 UTC.
- Los importes son numeros decimales JSON. Las listas paginadas usan `PageResponse`: `content`, `page` (base 0), `size`, `totalElements`, `totalPages`, `first`, `last`.
- Toda respuesta de error usa: `ApiError { code, message, details, timestamp, traceId }`. `details` es un objeto con errores de campo cuando aplica; puede ser `{}`.
- Las rutas protegidas requieren `Authorization: Bearer <accessToken>`. Roles se representan como `ROLE_<CODIGO>` y permisos como codigos sin prefijo.

## DTOs de identidad y tokens

`POST /auth/login`

```json
{ "email": "admin@gymbox.mx", "password": "...", "device": "opcional, maximo 200 caracteres" }
```

`POST /auth/refresh` y `POST /auth/logout`

```json
{ "refreshToken": "token-opaco-entregado-por-el-backend" }
```

`POST /auth/login` y `POST /auth/refresh` responden `AuthTokens`:

```json
{
  "tokenType": "Bearer",
  "accessToken": "JWT",
  "expiresIn": 900,
  "refreshToken": "token-opaco"
}
```

`GET /auth/me` responde `UserSnapshot`:

```json
{
  "id": "uuid", "branchId": "uuid|null", "email": "...",
  "firstName": "...", "lastName": "...", "status": "ACTIVE",
  "mustChangePassword": false, "authzVersion": 1,
  "roles": ["ADMIN"], "permissions": ["students.read"]
}
```

## Estrategia de refresh token

1. El access token es un JWT HS512 de corta vida (15 minutos por defecto). Incluye `sub`, `sid`, `email`, `roles`, `permissions`, `authzVersion`, emisor, audiencia, fechas y `jti`.
2. El refresh token es opaco, aleatorio y de larga vida (30 dias por defecto). El backend solo persiste su hash SHA-256, nunca el valor original.
3. Cada inicio de sesion crea una familia de sesiones. Un refresh valido rota el token: crea el sucesor y revoca el anterior dentro de la misma familia.
4. Reutilizar un refresh revocado, vencido o ya rotado se trata como posible robo: el backend marca el evento y revoca toda la familia. El cliente debe eliminar su sesion e ir a login.
5. `POST /auth/logout` revoca toda la familia asociada al refresh recibido y responde `204`. Es una ruta protegida: enviar tambien el access token vigente en `Authorization`.

Reglas obligatorias del cliente:

- Mantener como maximo **un refresh en curso** por sesion. Si varias peticiones reciben `401`, una sola rota el token y las demas esperan su resultado.
- Al refrescar correctamente, sustituir **de forma atomica** access y refresh token antes de reintentar una peticion, y reintentarla una sola vez.
- No reintentar ni reutilizar el refresh token anterior. Ante fallo de refresh, borrar ambos tokens y redirigir a login.
- No registrar tokens en logs, analitica ni mensajes de error. En aplicaciones web, el contrato actual recibe el refresh en JSON; almacenarlo con el mecanismo mas seguro disponible. Usar cookie `HttpOnly` requeriria un cambio explicito del backend.

## Catalogo funcional de DTOs

| Modulo | Solicitud principal | Respuesta principal |
| --- | --- | --- |
| `users` | crear/editar usuario: correo, nombre, apellido, sucursal, roles/estado | `UserSnapshot`; roles: `RoleSnapshot { id, code, name, description, permissions }` |
| `students` | alta/edicion: datos personales, contacto, nivel, tutor y emergencia opcionales | `StudentResponse` (detalle) y `StudentSummaryResponse` (listado); niveles: `UNASSIGNED`, `BEGINNER`, `INTERMEDIATE`, `ADVANCED` |
| `memberships` | crear: `studentId`, `planId`, `startDate`; renovacion: fecha de inicio | `MembershipSnapshot { id, branchId, studentId, planId, planName, status, startDate, endDate, ... }`; estados: `PENDING`, `ACTIVE`, `EXPIRED`, `FROZEN`, `CANCELLED` |
| `plans` | nombre, descripcion, tipo, duracion, precio, estado | `PlanSnapshot`; tipos: `WEEKLY`, `MONTHLY`, `SINGLE_CLASS`, `CLASS_PACKAGE`; estados: `ACTIVO`, `INACTIVO` |
| `cash` | apertura/cierre con monto y nota opcional | `CashRegisterSnapshot` |
| `payments` | pago con estudiante, membresia cuando aplica, importe, metodo, concepto y referencia opcional | `PaymentSnapshot` y `ReceiptSnapshot`; enviar `Idempotency-Key` en altas de pago; metodos: `CASH`, `TRANSFER`, `MANUAL_CARD` |
| `attendance` | `CheckInRequest { studentId }` | `CheckInResponse` con decision y `AttendanceResponse`; consultar asistencia devuelve `PageResponse<AttendanceResponse>` |
| `reports` | sin DTO de escritura | `AdminDashboardResponse` y resumenes de ingresos para administracion |
| `media` | archivos `multipart/form-data` (foto de estudiante) | devuelve el DTO actualizado del recurso; la descarga es binaria |

Los campos que representan una relacion (por ejemplo estudiante, plan, sucursal o membresia) se envian como UUID, no como objetos anidados. Las mutaciones respetan las validaciones de negocio del backend; no duplicarlas como fuente de verdad en el cliente.
