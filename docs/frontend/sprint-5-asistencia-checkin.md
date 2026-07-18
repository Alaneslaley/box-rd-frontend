# Sprint 5 · Asistencia, Check-in e Instructor Hoy

## Objetivo

Implementar los flujos frontend reales de asistencia diaria, registro de check-in, historial por alumno y vista rápida del instructor, usando el contrato actual de `openapi_backend_fase1.json`.

## Implementación

- Modelos tolerantes para `AttendanceResponse`, `CheckInRequest`, `CheckInResponse` e `InstructorTodayResponse`. Los estados y decisiones permanecen como `string` porque el OpenAPI no publica enums.
- Servicios HTTP y facades simples con signals para carga, error, paginación y último resultado de check-in.
- Listado paginado de asistencia del día e historial paginado por alumno.
- Check-in por selección de alumno, precarga mediante `?studentId=<uuid>`, bloqueo de doble envío y presentación de la decisión exacta del backend.
- Vista “Instructor hoy” con foto protegida, nombre, hora, edad/categoría, nivel y snapshot de membresía.
- Descarga autenticada de fotos como `Blob` mediante `HttpClient`. El interceptor agrega el bearer token; nunca se inserta un token en una URL de imagen. Cada object URL se revoca al cambiar la foto o destruir el componente.
- Integración desde el detalle del alumno hacia su historial y el formulario de check-in.
- Menú, rutas lazy y acciones condicionadas por permisos visuales.

## Rutas

| Ruta | Uso | Permiso visual |
| --- | --- | --- |
| `/attendance` | Redirige a asistencia de hoy | `ASISTENCIAS_CONSULTAR` |
| `/attendance/today` | Asistencia del día | `ASISTENCIAS_CONSULTAR` |
| `/attendance/check-in` | Registrar entrada | `ASISTENCIAS_REGISTRAR` |
| `/attendance/student/:studentId` | Historial del alumno | `ASISTENCIAS_CONSULTAR` |
| `/instructor/today` | Alumnos presentes hoy | `ASISTENCIAS_CONSULTAR` |

`attendance.read`, `attendance.student`, `attendance.checkin` e `instructor.today` son nombres conceptuales del frontend. Se mapean al catálogo real anterior. El contrato actual no declara un permiso exclusivo para instructor; cuando el backend lo incorpore deberá actualizarse el mapeo central.

## Endpoints consumidos

- `POST /api/v1/attendance/check-in` con `{ studentId }`.
- `GET /api/v1/attendance/today?page&size`.
- `GET /api/v1/attendance/student/{studentId}?page&size`.
- `GET /api/v1/instructor/today?page&size`.
- `GET /api/v1/media/{fileId}` como respuesta binaria autenticada.
- `GET /api/v1/students?page=0&size=100` para el selector actual de check-in.

La paginación usa `content`, `page`, `size`, `totalElements`, `totalPages`, `first` y `last`.

## Fuente de verdad

Angular solo valida que exista un alumno seleccionado y evita envíos simultáneos. Spring Boot decide y persiste la asistencia, la fecha operativa, duplicados, sucursal, estado, edad/categoría al evento, nivel, membresía y autorización. La web no recalcula vigencia ni sustituye la decisión devuelta en `CheckInResponse`.

## Manejo de errores

- `400`: mensaje de validación disponible.
- `404`: recurso no encontrado.
- `409`: conflicto de check-in o estado actual, conservando el mensaje seguro del backend.
- `401`: lo maneja el flujo central de refresh/sesión.
- `403`: lo maneja el interceptor/forbidden central.
- error de red y `5xx`: mensajes genéricos sin mostrar JSON ni datos sensibles.

## Cómo probar manualmente

1. Iniciar backend y web con `npm start`.
2. Entrar con un usuario que tenga `ASISTENCIAS_CONSULTAR` y `ASISTENCIAS_REGISTRAR`.
3. Abrir `/attendance/check-in`, seleccionar un alumno y registrar una sola vez.
4. Confirmar que la tarjeta muestra la decisión y snapshot entregados por el backend.
5. Revisar `/attendance/today`, el historial enlazado y `/instructor/today`.
6. Desde `/students/:id`, probar “Ver historial” y “Registrar check-in”.
7. Si el alumno tiene `photoFileId`, verificar que la petición a media incluye Authorization mediante el interceptor y que la URL visible es local tipo `blob:`.

## TODOs y riesgos

- El selector carga hasta 100 alumnos porque el backend no expone búsqueda remota en el contrato actual. Agregar búsqueda paginada cuando exista.
- Confirmar con backend si se añadirá un permiso específico para `instructor.today`.
- Los nombres no vienen en `AttendanceResponse`; los listados administrativos muestran `studentId`. Solo `CheckInResponse` e `InstructorTodayResponse` incluyen nombre.
- `photoFileId` y fechas de membresía pueden ser nulos aunque el esquema OpenAPI no marque explícitamente `nullable`; el frontend los trata como opcionales de forma defensiva.
- Sprint siguiente: asistencia/check-in no debe mezclarse con reglas deportivas, pagos ni edición de membresías.
