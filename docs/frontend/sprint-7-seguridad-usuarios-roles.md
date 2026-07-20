# Sprint 7 · Seguridad administrativa: usuarios y roles

## Objetivo

Completar el módulo web de Seguridad para consultar usuarios y roles, crear usuarios, actualizar su estado y asignar roles usando únicamente los endpoints reales del backend.

## Implementación

- Modelos para `UserSnapshot`, `CreateUserRequest`, `StatusRequest`, `RolesRequest` y `RoleSnapshot`.
- `UsersApiService`, `RolesApiService` y `SecurityFacade` con signals de carga, error, paginación de usuarios y catálogo de roles.
- Listado paginado de usuarios, alta, detalle visual, cambio de estado y asignación de roles.
- Catálogo de roles y permisos publicado por backend en modo solo lectura.
- Formularios reactivos, badges de estado, chips de roles/permisos y mensajes de error seguros.
- Rutas lazy y acciones visuales condicionadas por permisos.

## Rutas y permisos

| Ruta | Función | Código backend actual |
| --- | --- | --- |
| `/security` | Inicio de seguridad | `USUARIOS_CONSULTAR` |
| `/security/users` | Listado de usuarios | `USUARIOS_CONSULTAR` |
| `/security/users/new` | Alta | `USUARIOS_CREAR` |
| `/security/users/:id` | Detalle visual | `USUARIOS_CONSULTAR` |
| `/security/users/:id/roles` | Asignar roles | `USUARIOS_MODIFICAR` |
| `/security/users/:id/status` | Cambiar estado | `USUARIOS_DESACTIVAR` |
| `/security/roles` | Consulta de roles | `USUARIOS_CONSULTAR` |

Los aliases `security.read`, `users.read`, `users.create`, `users.status`, `users.roles` y `roles.read` están centralizados en `core/auth/permissions.ts`. El backend decide la autorización final.

## Endpoints consumidos

- `GET /api/v1/users?page&size`
- `POST /api/v1/users`
- `PATCH /api/v1/users/{id}/status`
- `PUT /api/v1/users/{id}/roles`
- `GET /api/v1/roles`

## Formularios y flujos

### Crear usuario

Se captura sucursal UUID, nombre, apellidos, correo, teléfono opcional, contraseña temporal y al menos un rol. La sucursal de la sesión se precarga cuando existe. Después de enviar el POST, la contraseña se limpia del formulario y nunca se muestra ni registra en mensajes.

### Cambiar estado

Se selecciona `ACTIVO`, `INACTIVO` o `BLOQUEADO` y se envía exclusivamente `{ status }`. La interfaz advierte cuando se cambia una cuenta propia, pero no impone una regla final: backend valida la operación.

### Asignar roles

La UI consulta roles disponibles, precarga los roles actuales y envía exclusivamente `{ roles: string[] }`. Los permisos se muestran como información proveniente de los roles; Angular no calcula permisos efectivos ni permite permisos individuales.

## Validaciones UX

- Sucursal requerida con formato UUID.
- Nombre requerido, máximo 100; apellidos requeridos, máximo 120.
- Correo requerido, formato email y máximo 254.
- Teléfono máximo 25.
- Contraseña entre 12 y 128 caracteres.
- Mínimo un rol en alta y reasignación.
- Botones deshabilitados durante guardado.

Estas validaciones son solo UX. Contraseñas, estado, roles, permisos, auditoría, sesiones y autorización definitiva se validan en Spring Boot.

## Limitaciones del contrato actual

- No existe `GET /users/{id}`. Las rutas de detalle reciben `UserSnapshot` mediante navigation state; sin state se consulta la página actual de `/users` y se muestra un error controlado si no se encuentra el ID.
- No existe `PUT /users/{id}` para editar datos generales.
- No existe `DELETE /users/{id}`.
- No existe reset o cambio administrativo de contraseña.
- No existe endpoint de sucursales para un selector amigable; `branchId` se captura como UUID o se precarga de sesión.
- No existen endpoints para crear o editar roles.

## Cómo probar manualmente

1. Iniciar backend y ejecutar `npm start`.
2. Entrar con permisos `USUARIOS_CONSULTAR`, `USUARIOS_CREAR`, `USUARIOS_MODIFICAR` y `USUARIOS_DESACTIVAR` según las acciones a probar.
3. Abrir `/security/users`, validar paginación y acciones visibles.
4. Crear un usuario con UUID de sucursal válido, contraseña de 12+ caracteres y un rol real de `/roles`.
5. Desde una fila del listado, abrir detalle, modificar roles y cambiar estado.
6. Abrir `/security/roles` y confirmar que los permisos se presentan sin acciones de edición.
7. Probar entradas directas por URL a detalle/roles/estado: si el usuario no está en state ni en la página actual, debe aparecer el error controlado, sin una llamada ficticia a `GET /users/{id}`.

## TODO para Sprint 8 y riesgos

- Exponer `GET /users/{id}` para URLs directas robustas.
- Exponer catálogo de sucursales para reemplazar el UUID manual.
- Añadir contratos explícitos de edición general, reset de contraseña y administración de roles solo cuando backend los publique.
- Los códigos de permisos de roles se muestran como devuelve backend; nuevos códigos no requieren cambios para ser visibles.
- Sprint 8 puede enfocarse en hardening, pruebas E2E y operación, sin duplicar reglas de seguridad en frontend.
