# Checklist de release web

Estado al 2026-07-23. Marcar los pendientes únicamente con evidencia.

## Build y calidad

- [x] `npm ci` finaliza correctamente.
- [x] `npm run build -- --configuration production` finaliza sin errores ni warnings de budget.
- [x] TypeScript y templates compilan sin errores.
- [x] `npm test -- --watch=false`: 45 archivos, 122 pruebas aprobadas.
- [ ] Lint ejecutado. No existe script ni configuración de lint.
- [ ] Reporte de cobertura ejecutado. No existe script/configuración de cobertura.
- [ ] Suite E2E ejecutada. No existe script, herramienta ni entorno de fixtures E2E.

## API y producción

- [x] OpenAPI actual auditado: 35 operaciones.
- [x] URL productiva HTTPS: `https://api.escuelaboxrd.com.mx/api/v1`.
- [x] `/api/v1` aparece una sola vez en la configuración.
- [x] Bundle productivo sin referencias a localhost ni secretos detectados.
- [ ] CORS verificado contra frontend productivo.
- [ ] Certificados SSL de frontend y API verificados en producción.
- [ ] Estado/health real de API verificado.

## Cloudflare y rutas

- [x] Modalidad existente de Cloudflare Workers con assets preservada.
- [x] `not_found_handling: "single-page-application"`.
- [x] Build corregido a SPA cliente; ya no genera redirects prerenderizados por falta de sesión.
- [x] Wrangler local responde 200 para `/`, `/login`, `/dashboard`, `/students`, `/payments`, `/attendance`, `/security/users` y ruta inexistente.
- [x] `/login` redirige dentro del router a la ruta existente `/auth/login`.
- [ ] F5 verificado en el dominio productivo.

## Sesión, permisos y errores

- [x] Refresh concurrente único probado.
- [x] Retry máximo de una vez probado.
- [x] Fallo de refresh/segundo 401 limpia sesión.
- [x] Error no-401 después de refresh no cierra sesión.
- [x] Redirect de login restringido a ruta interna.
- [x] Logout limpia sesión aunque falle la API.
- [x] Matriz de ruta/menú/acción documentada.
- [x] 403 navega a forbidden sin sustituir seguridad del servidor.
- [x] Mensajes por 0/400/401/403/404/409/422/429/500/502/503/504 controlados.
- [x] `traceId` se presenta únicamente como referencia de soporte.

## Operaciones sensibles

- [x] Doble submit bloqueado en formularios existentes.
- [x] Pagos conservan una clave idempotente por intención.
- [x] Check-in bloquea doble submit.
- [ ] Flujo productivo controlado de pago/caja/check-in verificado.
- [ ] Cambio de estado y carga de foto de alumno implementados; el OpenAPI los publica, pero no existe flujo Angular.

## Responsive y accesibilidad

- [x] Tablas anchas permanecen dentro de contenedores con scroll.
- [x] Layout y formularios contienen reglas responsivas para móvil/tablet.
- [x] Idioma de documento `es-MX`.
- [x] Enlace para saltar al contenido y foco visible.
- [x] Tablas revisadas con caption/headers en pantallas principales.
- [x] Imágenes con alt/fallback; object URL revocado.
- [ ] Validación visual manual en 360, 390, 768, 1024, 1366 y 1920 px.
- [ ] Auditoría de teclado/lector de pantalla y foco de diálogo ejecutada.

## Smoke test y rollback

- [ ] Checklist productivo de `production-smoke-test-web.md` completado.
- [ ] Datos controlados y responsables del smoke test confirmados.
- [ ] Versión anterior de Cloudflare identificada para rollback.
- [ ] Rollback ensayado o confirmado por el responsable de despliegue.

## Decisión

- [ ] GO.
- [ ] GO con observaciones.
- [x] NO-GO mientras no exista E2E crítico y smoke productivo controlado.
