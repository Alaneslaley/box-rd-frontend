# Sprint 4 — Pagos, Caja y Recibos

## Objetivo

Implementar el flujo administrativo de pagos, recibos y caja básica consumiendo el contrato real de `docs/arquitectura/openapi_backend_fase1.json` y los DTO Java actuales. Angular presenta y valida datos para UX; Spring Boot conserva la autoridad financiera, transaccional y de autorización.

## Implementación

- Feature `payments` lazy-loaded con listado paginado, registro, detalle y recibo.
- Feature `cash` lazy-loaded con consulta de caja actual, apertura y cierre.
- `PaymentsApiService`, `PaymentsFacade`, `CashRegisterApiService` y `CashRegisterFacade`.
- `IdempotencyKeyService` con criptografía del navegador/plataforma.
- Formularios reactivos y tipados para pago, apertura y cierre.
- Acción “Registrar pago” desde el listado de membresías mediante `membershipId` como query param.
- Estados loading, empty y error; mensajes 400/403/404/409/500 y error de conexión sin exponer JSON.
- Badges para estados de pago, recibo, entrega y caja.
- Vista de recibo imprimible con `window.print()`; el contenido sigue proviniendo del backend.
- El placeholder de Pagos fue retirado al ser sustituido por `PaymentsListPageComponent`; `CashPageComponent` se convirtió en la pantalla funcional.

## Rutas y permisos

| Ruta | Función | Código backend |
| --- | --- | --- |
| `/payments` | Listado paginado | `PAGOS_CONSULTAR` |
| `/payments/new` | Registro | `PAGOS_REGISTRAR` |
| `/payments/:id` | Detalle | `PAGOS_CONSULTAR` |
| `/payments/:id/receipt` | Recibo | `PAGOS_CONSULTAR` |
| `/cash` | Caja actual | `CAJA_CONSULTAR` |
| `/cash/open` | Apertura | `CAJA_ABRIR` |
| `/cash/close` | Cierre | `CAJA_CERRAR` |

Los aliases conceptuales `payments.read/detail/receipt/register` y `cash.read/open/close` se centralizan en `core/auth/permissions.ts`. Menú, rutas y botones son controles visuales; `@PreAuthorize` del backend decide el acceso real.

Las rutas dinámicas de pago y recibo usan renderizado cliente para no intentar prerenderizar UUID desconocidos.

## Endpoints consumidos

- `GET /api/v1/payments?page={page}&size={size}`
- `POST /api/v1/payments` con header `Idempotency-Key`
- `GET /api/v1/payments/{id}`
- `GET /api/v1/payments/{id}/receipt`
- `GET /api/v1/cash-register/current`
- `POST /api/v1/cash-register/open`
- `POST /api/v1/cash-register/close`
- `GET /api/v1/memberships?page=0&size=100` para el selector de registro de pago.

Todos los endpoints parten de `environment.apiBaseUrl` y reutilizan bearer token, refresh coordinado, trace ID, loading e interceptor de errores.

## DTOs frontend

### Pagos

- `RegisterPaymentRequest`: `membershipId`, `method`, `effectiveOn`.
- `PaymentSnapshot`: `id`, `folio`, `branchId`, `studentId`, `membershipId`, `cashRegisterId`, `amount`, `currency`, `method`, `concept`, `status`, `registeredAt`.
- `ReceiptSnapshot`: `id`, `paymentId`, `receiptNumber`, `paymentFolio`, `studentId`, `amount`, `currency`, `paymentMethod`, `status`, `deliveryStatus`, `generatedAt`.
- Métodos: `CASH`, `TRANSFER`, `MANUAL_CARD`.

`cashRegisterId` se modela como nullable porque el backend actual devuelve `null` para transferencias y tarjeta manual; solo el pago en efectivo exige una caja.

### Caja

- `OpenCashRegisterRequest`: `branchId` opcional, `initialCash`, `currency`.
- `CloseCashRegisterRequest`: `countedCash`, `currency`, `notes` opcional.
- `CashRegisterSnapshot`: IDs, fechas de apertura/cierre, montos, moneda, estado y notas. Campos de cierre y diferencia son nullable mientras la caja permanece abierta.

## Formularios y validaciones UX

### Registro de pago

- Membresía, método y fecha efectiva requeridos.
- Fecha en formato `YYYY-MM-DD`.
- Selector basado en las primeras 100 membresías, máximo soportado por el endpoint actual.
- Cuando llega `?membershipId=<uuid>` y no aparece en esa página, se conserva el UUID como opción explícita; no se inventa `GET /memberships/{id}`.
- El submit se bloquea mientras la petición está activa.

### Apertura

- Sucursal UUID opcional. Se precarga y queda en solo lectura cuando existe en la sesión; un usuario global puede capturarla.
- Caja inicial requerida y mayor o igual a cero.
- Moneda requerida con tres letras mayúsculas.

### Cierre

- Efectivo contado requerido y mayor o igual a cero.
- Moneda requerida con tres letras mayúsculas.
- Notas opcionales, máximo 500 caracteres.
- La UI muestra caja inicial y esperada, pero nunca calcula la diferencia.

## Idempotency-Key

`IdempotencyKeyService` usa `crypto.randomUUID()` y, si no está disponible, construye un UUID v4 con `crypto.getRandomValues()`. Si no existe criptografía segura, el registro se detiene. Las claves no se imprimen, persisten ni envían a otros endpoints.

Decisión de reintento:

1. El primer submit genera una clave.
2. Mientras la solicitud está activa no se acepta doble submit.
3. Si la llamada falla, el mismo formulario y los mismos valores reutilizan la clave para un reintento seguro, incluido un error de red.
4. Si cambia membresía, método o fecha, se considera otro intento y se genera una clave nueva.
5. Después del éxito se descarta la clave y se navega al detalle devuelto por el backend.

## Flujos

### Pago y recibo

1. El usuario selecciona membresía, método y fecha.
2. Angular genera `Idempotency-Key` y envía únicamente `RegisterPaymentRequest`.
3. Backend valida membresía, usuario y caja cuando el método es efectivo; determina importe/concepto, genera folio y recibo, aplica su transacción y responde `PaymentSnapshot`.
4. La UI navega al detalle y puede consultar el recibo con el ID del pago.

### Caja

1. `/cash` consulta la caja abierta del usuario.
2. El backend actual responde 404 con `OPEN_CASH_REGISTER_NOT_FOUND` cuando no existe; la facade lo transforma exclusivamente en el estado vacío “No hay caja abierta actualmente”. Otros errores permanecen visibles.
3. Apertura envía caja inicial, moneda y sucursal cuando aplica.
4. Cierre carga primero la caja actual y envía conteo, moneda y notas.
5. Después del cierre se muestra `difference` de `CashRegisterSnapshot`; Angular no la calcula.

## Limitaciones y fuente de verdad

- `PaymentSnapshot` no incluye `studentName`; se muestra `studentId` y un enlace al expediente.
- No incluye detalle de membresía; se muestra `membershipId`.
- El importe, concepto, estado, `cashRegisterId`, folio y recibo los determina el backend.
- El backend decide si una caja está realmente abierta, si pertenece al usuario/sucursal y si puede cerrarse.
- Angular no calcula diferencia, caja esperada, renovaciones, folios ni importes.
- No existe cancelación de pagos en este contrato.
- No se genera ni almacena un recibo en frontend; solo se presenta la respuesta real.

## Cómo probar manualmente

1. Iniciar backend y ejecutar `npm start`.
2. Iniciar sesión con permisos `PAGOS_CONSULTAR`, `PAGOS_REGISTRAR`, `CAJA_CONSULTAR`, `CAJA_ABRIR` y `CAJA_CERRAR`.
3. Abrir `/cash`; validar el estado vacío y abrir con monto inicial.
4. Desde `/memberships`, usar “Registrar pago” y comprobar la membresía preseleccionada.
5. Registrar transferencia y validar que importe/folio provengan de la respuesta.
6. Registrar efectivo con caja abierta; luego probar sin caja y verificar el conflicto controlado.
7. Consultar detalle y recibo; probar impresión.
8. Cerrar caja, verificar que la diferencia mostrada sea la respuesta backend y que `/cash` vuelva al estado vacío.
9. Probar respuestas 400, 403, 404, 409, 500 y backend apagado.

## Pruebas automatizadas

- Contrato de los cuatro métodos de `PaymentsApiService`, incluido el header idempotente.
- Unicidad y longitud de claves idempotentes.
- Requeridos del formulario de pago.
- Contrato de `current/open/close` en `CashRegisterApiService`.
- Validación de montos negativos y moneda en formularios de caja.
- Tratamiento exclusivo de `OPEN_CASH_REGISTER_NOT_FOUND` como estado vacío.
- Permisos de rutas, menú, acciones de Pagos, Caja y Membresías.

Comandos:

```bash
npm run build
npm test -- --watch=false
```

No existe script ni configuración de lint en `package.json`.

## TODO y riesgos para Sprint 5

- Añadir búsqueda remota de membresías cuando el backend exponga filtros o consulta por ID; el selector actual se limita a 100.
- Enriquecer pagos con nombre de alumno/plan solo cuando el backend exponga una proyección adecuada.
- Añadir confirmación accesible definitiva para registro y cierre cuando se adopte un UI kit o diálogo compartido completo.
- Mantener el manejo de pagos duplicados según los códigos finales de idempotencia del backend.
- Sprint 5 implementará Asistencia/Check-in reutilizando sesión, membresía y manejo de errores, sin duplicar las reglas de acceso del backend.
