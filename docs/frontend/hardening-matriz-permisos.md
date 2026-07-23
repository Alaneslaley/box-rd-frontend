# Matriz de rutas, menú y permisos

La matriz documenta seguridad visual. La autorización definitiva siempre corresponde a la API. `authGuard` protege el shell; `permissionChildGuard` valida cada ruta hija y `permissionGuard` refuerza rutas de acción.

| Módulo | Ruta | Acción | Permiso real | Guard | Menú | Prueba/evidencia |
|---|---|---|---|---|---|---|
| Autenticación | `/login` | Entrada compatible | Ninguno | Redirect interno | No | `app.routes.spec.ts` |
| Autenticación | `/auth/login` | Iniciar sesión | Ninguno | `guestGuard` | No | login/auth specs |
| Dashboard | `/dashboard` | Consultar KPIs | `REPORTES_DIARIOS_CONSULTAR` | child | Visible con permiso | `menu.config.spec.ts`, guard specs |
| Alumnos | `/students` | Listar | `ALUMNOS_CONSULTAR` | child + route | Visible con permiso | guard y acciones visuales |
| Alumnos | `/students/new` | Crear | `ALUMNOS_CREAR` | child + route | Acción contextual | formulario y API specs |
| Alumnos | `/students/:id` | Consultar detalle | `ALUMNOS_CONSULTAR` | child + route | Desde listado | route/guard + API spec |
| Alumnos | `/students/:id/edit` | Editar | `ALUMNOS_MODIFICAR` | child + route | Botón condicional | permisos visuales + formulario |
| Alumnos | Sin ruta | Cambiar estado | `ALUMNOS_DESACTIVAR` | No implementado | No visible | Pendiente OpenAPI |
| Alumnos | Sin ruta | Cargar foto | `ALUMNOS_MODIFICAR` (permiso existente aplicable) | No implementado | No visible | Pendiente OpenAPI |
| Planes | `/plans` | Listar | `PLANES_CONSULTAR` | child + route | Visible con permiso | `sprint-3-action-permissions.spec.ts` |
| Planes | `/plans/new` | Crear | `PLANES_GESTIONAR` | child + route | Botón condicional | formulario/API specs |
| Planes | `/plans/:id/edit` | Editar | `PLANES_GESTIONAR` | child + route | Acción condicional | formulario/API specs |
| Membresías | `/memberships` | Listar | `MEMBRESIAS_CONSULTAR` | child + route | Visible con permiso | `sprint-3-action-permissions.spec.ts` |
| Membresías | `/memberships/new` | Crear | `MEMBRESIAS_CREAR` | child + route | Botón condicional | formulario/API specs |
| Membresías | `/memberships/:id/renew` | Renovar | `MEMBRESIAS_MODIFICAR` | child + route | Acción condicional | permisos visuales/API spec |
| Pagos | `/payments` | Listar | `PAGOS_CONSULTAR` | child + route | Visible con permiso | `sprint-4-action-permissions.spec.ts` |
| Pagos | `/payments/new` | Registrar | `PAGOS_REGISTRAR` | child + route | Botón condicional | idempotencia y API specs |
| Pagos | `/payments/:id` | Consultar detalle | `PAGOS_CONSULTAR` | child + route | Acción condicional | route/guard + API spec |
| Pagos | `/payments/:id/receipt` | Consultar recibo | `PAGOS_CONSULTAR` | child + route | Acción condicional | route/guard + API spec |
| Caja | `/cash` | Consultar actual | `CAJA_CONSULTAR` | child + route | Visible con permiso | `sprint-4-action-permissions.spec.ts` |
| Caja | `/cash/open` | Abrir | `CAJA_ABRIR` | child + route | Acción condicional | formulario/API specs |
| Caja | `/cash/close` | Cerrar | `CAJA_CERRAR` | child + route | Acción condicional | formulario/API specs |
| Asistencia | `/attendance/today` | Consultar hoy | `ASISTENCIAS_CONSULTAR` | child | Visible con permiso | facade/API specs |
| Asistencia | `/attendance/check-in` | Registrar | `ASISTENCIAS_REGISTRAR` | child | Entrada propia condicional | formulario/API specs |
| Asistencia | `/attendance/student/:studentId` | Historial | `ASISTENCIAS_CONSULTAR` | child | Desde alumno | page/API specs |
| Instructor | `/instructor/today` | Consultar presentes | `ASISTENCIAS_CONSULTAR` | child | Visible con permiso | API/facade specs |
| Reportes | `/reports` | Ver catálogo | `REPORTES_DIARIOS_CONSULTAR` | child | Visible con permiso | menú/guard specs |
| Reportes | `/reports/admin-dashboard` | Ver reporte diario | `REPORTES_DIARIOS_CONSULTAR` | child | Desde reportes | facade/API specs |
| Seguridad | `/security` | Ver módulo | `USUARIOS_CONSULTAR` | child + route | Visible con permiso | menú/guard specs |
| Seguridad | `/security/users` | Listar usuarios | `USUARIOS_CONSULTAR` | child + route | Desde seguridad | API/permisos visuales |
| Seguridad | `/security/users/new` | Crear usuario | `USUARIOS_CREAR` | child + route | Botón condicional | formulario/API specs |
| Seguridad | `/security/users/:id` | Ver usuario | `USUARIOS_CONSULTAR` | child + route | Desde listado | guard + page spec |
| Seguridad | `/security/users/:id/roles` | Cambiar roles | `USUARIOS_MODIFICAR` | child + route | Acción condicional | `user-roles-page.component.spec.ts` |
| Seguridad | `/security/users/:id/status` | Cambiar estado | `USUARIOS_DESACTIVAR` | child + route | Acción condicional | `user-status-page.component.spec.ts` |
| Seguridad | `/security/roles` | Listar roles | `USUARIOS_CONSULTAR` | child + route | Desde seguridad | roles API spec |
| Sistema | `/forbidden` | Informar acceso denegado | Sesión autenticada | shell | No | permission guard spec |
| Sistema | `/**` | Informar ruta inexistente | Ninguno | wildcard | No | configuración de rutas/build |

## Perfiles representativos

- Administrador: requiere el conjunto completo de permisos anteriores.
- Administrativo limitado: ve únicamente módulos y acciones cuyos códigos están presentes en `/auth/me`.
- Caja: combinaciones de `PAGOS_*` y `CAJA_*`; no recibe acceso implícito a alumnos o usuarios.
- Instructor: `ASISTENCIAS_CONSULTAR` y/o `ASISTENCIAS_REGISTRAR`; instructor hoy usa el permiso real de consulta de asistencias.
- Sin permiso: no ve opción en menú; URL directa deriva a `/forbidden`; un 403 de la API también navega a forbidden sin cerrar una sesión válida.

`DEPORTIVO_CONSULTAR` permanece reservado, no está en el OpenAPI ni se inventó en este sprint. La ruta existente sigue protegida y no tiene endpoints de negocio.
