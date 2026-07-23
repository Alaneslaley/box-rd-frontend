# Smoke test productivo web

No ejecutar operaciones financieras irreversibles sin datos controlados. Registrar fecha, responsable, cuenta, sucursal, dato de prueba y evidencia.

## Infraestructura

- [ ] Abrir el dominio frontend oficial por HTTPS.
- [ ] Confirmar certificado válido y sin contenido mixto.
- [ ] Confirmar API `https://api.escuelaboxrd.com.mx/api/v1`.
- [ ] Confirmar certificado válido de la API.
- [ ] Confirmar CORS desde el dominio frontend.
- [ ] Confirmar que Network no contiene localhost, `http://` ni `/api/v1/api/v1`.
- [ ] Confirmar consola sin errores críticos ni tokens.

## Sesión

- [ ] Login válido.
- [ ] Login inválido con mensaje controlado.
- [ ] `GET /auth/me` correcto.
- [ ] Recargar una ruta protegida y conservar/restaurar sesión.
- [ ] Esperar o simular expiración controlada y confirmar refresh único.
- [ ] Logout y limpieza de sesión.
- [ ] URL protegida sin sesión redirige a login con retorno interno.
- [ ] Usuario sin permiso recibe forbidden y no ve menú/acción.

## Rutas y SPA

- [ ] F5 en `/dashboard`.
- [ ] F5 en `/students`.
- [ ] F5 en `/payments`.
- [ ] F5 en `/attendance`.
- [ ] F5 en `/security/users`.
- [ ] Ruta inexistente muestra página no encontrada.

## Funcionalidad controlada

- [ ] Dashboard: KPI, fecha y sucursal por nombre.
- [ ] Alumnos: listado, alta, detalle y edición con registro de prueba.
- [ ] Menor: confirmar las reglas actuales de tutor, sin modificarlas.
- [ ] Planes: listado y lectura de inactivos.
- [ ] Membresías: listado, alta/renovación solo con dato controlado.
- [ ] Pagos: operación controlada, folio, recibo e `Idempotency-Key`.
- [ ] Caja: consulta; apertura/cierre únicamente con autorización y montos controlados.
- [ ] Check-in: registro controlado y conflicto duplicado.
- [ ] Instructor hoy: nombre y foto/fallback.
- [ ] Usuarios/roles: consultar; cambios solo con cuenta de prueba autorizada.

## UX

- [ ] Backend lento muestra loading y permite reintentar.
- [ ] Un timeout no cierra sesión.
- [ ] Doble clic no duplica escrituras.
- [ ] Estados loading/empty/error no aparecen simultáneamente.
- [ ] Viewports 360, 390, 768, 1024, 1366 y 1920 px.
- [ ] Navegación con teclado, skip link y foco visible.
- [ ] Tablas/diálogos/formularios dentro del viewport.

## Cierre

- [ ] Eliminar o desactivar datos/cuentas de prueba según el proceso autorizado.
- [ ] Guardar evidencias y traceId de fallos.
- [ ] Confirmar versión anterior de Cloudflare para rollback.
- [ ] Emitir decisión GO/NO-GO con responsables.

