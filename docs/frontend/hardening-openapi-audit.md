# Auditoría OpenAPI del frontend

Fuente de verdad: `docs/arquitectura/openapi_backend_fase1.json`, OpenAPI 3.1.0, revisado el 2026-07-23. Se compararon método, path, parámetros, body, respuesta, fechas, UUID, paginación y headers con los servicios Angular.

Estados:

- **Correcto**: consumidor alineado con el contrato.
- **Corregido**: se aplicó hardening o alineación de tipos sin cambiar el contrato.
- **Pendiente**: operación publicada que no tiene flujo Angular; no se agregó por la prohibición de incorporar funcionalidad de negocio nueva.

| Endpoint | Servicio Angular | Estado | Diferencia detectada | Acción aplicada |
|---|---|---:|---|---|
| `POST /api/v1/auth/login` | `AuthApiService.login` | Correcto | Ninguna | Body `LoginRequest`; sin bearer. |
| `POST /api/v1/auth/refresh` | `AuthApiService.refresh` | Corregido | Faltaba evidencia de concurrencia | Se mantiene un solo refresh compartido y se probaron rotación atómica y recuperación después de fallo. |
| `POST /api/v1/auth/logout` | `AuthApiService.logout` | Correcto | Ninguna | Body `RefreshRequest`; la sesión local se limpia aunque falle la red. |
| `GET /api/v1/auth/me` | `AuthApiService.me` | Corregido | `branchName` no estaba representado en `AuthUser` | Se agregó como campo opcional de lectura. |
| `GET /api/v1/students` | `StudentsApiService.search` | Corregido | Riesgo de page/size fuera de rango y `content` ausente | Solo envía `page` y `size`; normaliza `page >= 0`, `1..100` y array vacío defensivo. |
| `POST /api/v1/students` | `StudentsApiService.create` | Correcto | Ninguna | Body alineado; reglas de tutor sin cambios. |
| `GET /api/v1/students/{id}` | `StudentsApiService.getById` | Correcto | Ninguna | Path UUID codificado. |
| `PUT /api/v1/students/{id}` | `StudentsApiService.update` | Correcto | Ninguna | Body alineado; reglas de tutor sin cambios. |
| `POST /api/v1/students/{id}/photo` | Sin consumidor | Pendiente | No existe operación ni formulario de carga Angular | Registrado como brecha; no se agregó funcionalidad en hardening. La lectura de media protegida sí existe. |
| `PATCH /api/v1/students/{id}/status` | Sin consumidor | Pendiente | No existe operación de cambio de estado de alumno Angular | Registrado como brecha; no se inventó flujo. |
| `GET /api/v1/plans` | `PlansApiService.list` | Corregido | Riesgo de page/size fuera de rango | Envía `page`, `size`, `includeInactive`; normalización defensiva. |
| `POST /api/v1/plans` | `PlansApiService.create` | Correcto | Ninguna | Body `CreatePlanRequest`. |
| `PUT /api/v1/plans/{id}` | `PlansApiService.update` | Correcto | Ninguna | No se inventó `GET /plans/{id}`. |
| `GET /api/v1/memberships` | `MembershipsApiService.list` | Corregido | Riesgo de paginación inválida | Normalización defensiva. |
| `POST /api/v1/memberships` | `MembershipsApiService.create` | Correcto | Ninguna | Body `CreateMembershipRequest`. |
| `POST /api/v1/memberships/{id}/renew` | `MembershipsApiService.renew` | Correcto | Ninguna | Body `RenewMembershipRequest`; path codificado. |
| `GET /api/v1/memberships/student/{studentId}` | `MembershipsApiService.listByStudent` | Corregido | Posible array nulo en respuesta degradada | Se normaliza a array vacío. |
| `GET /api/v1/payments` | `PaymentsApiService.list` | Corregido | Riesgo de paginación inválida | Normalización defensiva. |
| `POST /api/v1/payments` | `PaymentsApiService.register` | Correcto | Ninguna | `Idempotency-Key` requerido; una clave por intención y bloqueo de doble submit. |
| `GET /api/v1/payments/{id}` | `PaymentsApiService.getById` | Correcto | Ninguna | Path codificado. |
| `GET /api/v1/payments/{id}/receipt` | `PaymentsApiService.getReceipt` | Correcto | Ninguna | Respuesta `ReceiptSnapshot`; usa número y folio enriquecidos. |
| `GET /api/v1/cash-register/current` | `CashRegisterApiService.current` | Correcto | Ninguna | 404 de caja abierta se presenta como estado vacío cuando corresponde al código de negocio. |
| `POST /api/v1/cash-register/open` | `CashRegisterApiService.open` | Correcto | Ninguna | Body `OpenRequest`; doble submit bloqueado. |
| `POST /api/v1/cash-register/close` | `CashRegisterApiService.close` | Correcto | Ninguna | Body `CloseRequest`; totales del servidor son fuente de verdad. |
| `POST /api/v1/attendance/check-in` | `AttendanceApiService.checkIn` | Correcto | Ninguna | Body `CheckInRequest`; doble submit bloqueado y conflicto controlado. |
| `GET /api/v1/attendance/today` | `AttendanceApiService.today` | Corregido | Riesgo de paginación inválida | Normalización defensiva. |
| `GET /api/v1/attendance/student/{studentId}` | `AttendanceApiService.byStudent` | Corregido | Riesgo de página negativa | Path codificado y normalización defensiva. |
| `GET /api/v1/instructor/today` | `InstructorApiService.today` | Corregido | Riesgo de paginación inválida | Normalización defensiva. |
| `GET /api/v1/reports/admin/dashboard` | `ReportsApiService.getAdminDashboard` | Correcto | Ninguna | Usa campos enriquecidos y monedas recibidas. |
| `GET /api/v1/media/{fileId}` | `MediaApiService.getBlob` | Correcto | Ninguna | `HttpClient`, bearer, blob, object URL y revocación probada; sin token en URL. |
| `GET /api/v1/users` | `UsersApiService.list` | Corregido | Riesgo de paginación inválida | Normalización defensiva. |
| `POST /api/v1/users` | `UsersApiService.create` | Correcto | Ninguna | Body exacto; contraseña no se persiste y se limpia del formulario emitido. |
| `PUT /api/v1/users/{id}/roles` | `UsersApiService.updateRoles` | Correcto | Ninguna | Body `RolesRequest`; doble submit bloqueado. |
| `PATCH /api/v1/users/{id}/status` | `UsersApiService.updateStatus` | Correcto | Ninguna | Body `StatusRequest`; doble submit bloqueado. |
| `GET /api/v1/roles` | `RolesApiService.list` | Correcto | Ninguna | Respuesta `RoleSnapshot[]`. |

## Hallazgos transversales

- `apiBaseUrl` contiene `/api/v1` una sola vez y los endpoints son relativos a ese prefijo.
- La configuración productiva usa `https://api.escuelaboxrd.com.mx/api/v1`; no contiene secretos.
- Todos los path params se codifican con `encodeURIComponent`.
- El máximo OpenAPI de `size=100` se aplica en el borde HTTP.
- `LocalDate` se conserva como `YYYY-MM-DD`; no se convierte a UTC para presentación.
- Los campos enriquecidos de nombre se usan como presentación y los UUID se reservan para rutas y operaciones.
- No existe `GuardianDataStatus`; `GuardianRequest`, `GuardianResponse` y las reglas actuales de tutor no se modificaron.

