# Eliminación del correo del alumno

## Objetivo

Actualizar Students para usar el teléfono celular como dato principal y obligatorio de contacto, sin alterar los correos de autenticación, usuarios administrativos o tutor.

## Ajustes realizados

- Se eliminó `email` de `StudentResponse`, `StudentUpdateRequest` y solicitudes de alta.
- El formulario de alumno ya no crea ni envía un control de correo.
- `phone` es obligatorio, se mantiene como texto y admite hasta 25 caracteres.
- El detalle muestra teléfono celular con enlace `tel:` cuando está disponible.
- El tutor conserva su correo opcional, identificado como “Correo del tutor”.

## OpenAPI utilizado

`docs/arquitectura/openapi_backend_fase1.json`: solicitudes de alta/edición y respuesta de alumno sin correo directo; teléfono requerido. `GuardianRequest` y `GuardianResponse` conservan correo.

## Checklist manual

1. Abrir alta de alumno y confirmar que no existe un campo de correo.
2. Intentar guardar sin teléfono y verificar el mensaje de campo obligatorio.
3. Crear y editar con teléfono válido.
4. Revisar que el detalle muestre teléfono, sin fila de correo del alumno.
5. Confirmar que el correo del tutor se puede capturar y mostrar.
