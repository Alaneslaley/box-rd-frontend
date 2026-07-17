# Sprint 2 — Alumnos / Students

## Objetivo

Implementar el primer módulo administrativo real de GymBox: listado paginado, filtros básicos, alta, edición y detalle de alumnos, consumiendo el backend Spring Boot como fuente de verdad.

## Implementado

- Modelos TypeScript alineados directamente con `CreateStudentRequest`, `UpdateStudentRequest`, `StudentResponse`, `StudentSummaryResponse`, `GuardianRequest` y `EmergencyContactRequest` del backend local.
- `StudentsApiService` y `StudentsFacade` con estado mediante signals para loading, error, página, filtros y contenido.
- Listado responsivo con paginación de servidor, estados loading/empty/error, filtros locales y acciones por permisos.
- Formulario reactivo reutilizable para alta y edición.
- Pantallas de alta, edición y detalle con navegación y errores controlados.
- Placeholders explícitos para membresía, asistencia y seguimiento deportivo.
- Pruebas de servicio HTTP, formulario y facade.

## Rutas y permisos

| Ruta | Función | Permiso backend |
| --- | --- | --- |
| `/students` | Listado | `ALUMNOS_CONSULTAR` |
| `/students/new` | Alta | `ALUMNOS_CREAR` |
| `/students/:id` | Detalle | `ALUMNOS_CONSULTAR` |
| `/students/:id/edit` | Edición | `ALUMNOS_MODIFICAR` |

Los permisos solo controlan rutas, menú y acciones visuales. Spring Boot vuelve a validarlos mediante `@PreAuthorize`.

## Endpoints consumidos

- `GET /api/v1/students?page={page}&size={size}`
- `GET /api/v1/students/{id}`
- `POST /api/v1/students`
- `PUT /api/v1/students/{id}`

Las peticiones pasan por los interceptores globales de Authorization, trace ID, loading, refresh único y errores 401/403.

## DTOs y campos

El backend usa `birthDate`, no `dateOfBirth`. Alta incluye `branchId` opcional, nombre, apellidos, teléfono, correo, fecha de nacimiento, objetivo personal, nivel, tutor y contacto de emergencia. Edición contiene los mismos campos salvo sucursal.

Niveles: `UNASSIGNED`, `BEGINNER`, `INTERMEDIATE`, `ADVANCED`.

Estados de respuesta: `ACTIVO`, `INACTIVO`, `PRUEBA`, `CONGELADO`, `BAJA`, `RESTRINGIDO`.

## Validaciones frontend

- Nombre, apellidos, fecha de nacimiento y nivel requeridos.
- Longitudes máximas idénticas a los DTO Java.
- Correo opcional con formato válido.
- Teléfonos opcionales con formato y longitud razonables.
- Fecha de nacimiento no futura.
- Si se inicia la captura de tutor, se solicitan nombre, teléfono y relación.
- Si se inicia la captura de emergencia, se solicitan nombre, teléfono y relación.

La política definitiva de menores/tutor, unicidad de correo, sucursal, estado, auditoría y autorización permanece en backend.

## Búsqueda y paginación

El `StudentController` actual acepta únicamente `page` y `size`; `StudentSearchQuery` no tiene `search`, `level` ni `sort`. Para no enviar parámetros inventados, texto y nivel filtran solo el contenido de la página cargada. La UI lo indica expresamente.

TODO backend: ampliar `StudentSearchQuery` y `GET /students` para búsqueda, nivel y ordenamiento server-side. Cuando exista el contrato, `StudentsApiService` podrá enviar esos parámetros sin cambiar las pantallas.

## Cómo probar manualmente

1. Iniciar sesión con un usuario que tenga `ALUMNOS_CONSULTAR`, `ALUMNOS_CREAR` y `ALUMNOS_MODIFICAR`.
2. Abrir `/students` y navegar entre páginas.
3. Crear un alumno desde “Nuevo alumno”.
4. Verificar la redirección al detalle.
5. Editar el expediente y confirmar que vuelve al detalle actualizado.
6. Probar filtros de nombre/teléfono y nivel sobre la página actual.
7. Probar un correo duplicado o datos inválidos y verificar el mensaje controlado del backend.

## Riesgos y pendientes para Sprint 3

- Búsqueda/filtro global requieren soporte backend.
- Foto, cambio de estado y eliminación lógica no forman parte de este sprint.
- No se implementaron membresías, pagos, caja, asistencia ni datos deportivos reales.
- Las rutas dinámicas de Students usan renderizado cliente en la configuración SSR existente, porque no pueden prerenderizar UUID desconocidos.
- Sprint 3 debe integrar Plans/Memberships mediante sus DTOs definitivos, sin calcular vigencias en Angular.

## Validación

- `npm run build`
- `npm test`

El proyecto no tiene script ni configuración de lint.
