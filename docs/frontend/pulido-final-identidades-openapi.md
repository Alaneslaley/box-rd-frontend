# Pulido final de identidades del OpenAPI

## Objetivo

Actualizar la presentación de la aplicación para usar los nombres incluidos en las respuestas de lectura y mantener los identificadores únicamente para navegación y operaciones.

## Campos incorporados

- `UserSnapshot`: `branchName`.
- `PaymentSnapshot`: `branchName`, `studentName`.
- `MembershipSnapshot`: `branchName`, `studentName`.
- `CashRegisterSnapshot`: `branchName`, `openedByName`, `closedByName`.
- `AdminDashboardResponse`: `branchName`.
- `AttendanceResponse`: `studentName`.
- `ReceiptSnapshot`: `studentName`.

## Pantallas ajustadas

- Pagos: alumno y sucursal por nombre en listado y detalle.
- Recibos: alumno por nombre.
- Membresías: alumno y sucursal por nombre, incluido el resumen de renovación.
- Caja: sucursal y responsables de apertura/cierre por nombre.
- Asistencia: alumno por nombre.
- Dashboard: sucursal por nombre.
- Usuarios: sucursal por nombre en listado y detalle.

## Fallbacks

Cuando la respuesta no incluye el nombre se muestran etiquetas de producto: “Alumno no disponible”, “Sucursal actual”, “Sucursal asignada”, “Usuario registrado”, “Membresía asociada” y “Caja asociada”.

## Resoluciones eliminadas

El helper de presentación dejó de consultar alumnos o mantener caché. Ahora solo aplica fallbacks a los nombres ya incluidos en los DTOs, evitando solicitudes adicionales por fila.

## Identificadores conservados

Los UUIDs permanecen en los modelos para rutas, enlaces, acciones de pago, renovación, asistencia, caja y seguridad; no se muestran como información principal.

## Validación manual

1. Consultar pagos, membresías y asistencias con datos del backend actualizado.
2. Confirmar nombres de alumno y sucursal en cada listado y detalle.
3. Verificar responsables de apertura y cierre en Caja.
4. Revisar el dashboard y el listado de usuarios.
5. Confirmar que las rutas a detalle y las acciones continúan operando.

## Riesgos y limitaciones

Los nuevos campos son opcionales para conservar compatibilidad durante despliegues escalonados. Si una respuesta antigua no los envía, la interfaz usará el fallback humano correspondiente.
