# Pulido UX: textos e identidades

## Objetivo

Mejorar la claridad de la interfaz administrativa de GymBox sin modificar los flujos de autenticación, permisos, solicitudes ni modelos de datos existentes.

## Ajustes realizados

- Se retiraron del encabezado y del menú las referencias visibles a fases y sprints.
- Los mensajes de secciones aún no disponibles ahora usan lenguaje de producto, por ejemplo: “Disponible próximamente”.
- Se eliminaron explicaciones técnicas visibles de pantallas de pagos, caja, asistencia, membresías, planes, reportes y seguridad.
- Los listados de pagos, membresías y asistencia muestran el nombre del alumno en lugar de su identificador interno.
- Los detalles de pago y recibo muestran el nombre del alumno, el folio y etiquetas como “Membresía asociada” o “Caja asociada”.
- Caja, dashboard y detalle de usuario muestran “Sucursal actual” o “Sucursal asignada” en lugar de identificadores de sucursal.
- El listado de usuarios ya no expone identificadores internos junto al nombre.

## Resolución de identidades

Se añadió `DisplayNameResolverService` en `src/app/core/display`.

- Obtiene el nombre completo de alumnos mediante el servicio existente de alumnos.
- Guarda nombres consultados durante la sesión de la aplicación para evitar solicitudes repetidas.
- Si la información no está disponible, muestra un fallback humano como “Alumno registrado” o “Usuario registrado”.
- No agrega rutas ni modifica los contratos existentes.

## Criterios de presentación

- Alumno: nombre completo.
- Pago: folio.
- Membresía y caja: etiquetas contextuales cuando no existe un nombre de negocio disponible.
- Sucursal: “Sucursal actual” o “Sucursal asignada”.
- Roles: se conserva el nombre disponible y su código cuando es útil para administración.

## Alcance preservado

Los identificadores internos siguen utilizándose para navegación y solicitudes cuando corresponde. Los permisos continúan siendo controles visuales y los flujos de validación, seguridad y datos permanecen sin cambios.

## Pendientes

- Incorporar un catálogo de sucursales cuando esté disponible para mostrar su nombre real.
- Resolver nombres de usuarios distintos de la sesión actual cuando exista una consulta individual o un catálogo adecuado.
- Sustituir etiquetas de membresía y caja por nombres de negocio si esos datos llegan en las respuestas futuras.
