# Sprint 6 · Dashboard administrativo y reportes básicos

## Objetivo

Conectar el dashboard administrativo de GymBox al contrato real del backend y crear la entrada base del módulo de reportes, sin calcular indicadores financieros ni inventar endpoints en Angular.

## Implementación

- DTOs exactos `AdminDashboardResponse`, `IncomeTotalResponse` e `IncomeByMethodResponse`.
- `ReportsApiService` y `ReportsFacade` con signals para datos, carga, error y última actualización.
- Dashboard administrativo con fecha operativa, sucursal, cuatro KPI, ingresos por moneda, ingresos por método y accesos rápidos condicionados por permisos.
- Página base de reportes con el reporte administrativo disponible y placeholders explícitos para contratos futuros.
- Vista detallada `/reports/admin-dashboard` que reutiliza los mismos componentes y datos.
- `KpiCardComponent` reutilizable y accesible, con tonos semánticos y navegación opcional.
- `IncomeSummaryComponent` sin agregaciones propias: presenta los arrays recibidos y estados vacíos parciales.
- Cards, tabla y CSS responsivo; no se agregó una librería de gráficas porque el endpoint no ofrece series temporales.

## Rutas y permisos

| Ruta | Función | Código backend actual |
| --- | --- | --- |
| `/dashboard` | Dashboard administrativo | `REPORTES_DIARIOS_CONSULTAR` |
| `/reports` | Catálogo base de reportes | `REPORTES_DIARIOS_CONSULTAR` |
| `/reports/admin-dashboard` | Vista detallada diaria | `REPORTES_DIARIOS_CONSULTAR` |

Los nombres conceptuales `dashboard.view`, `reports.read` y `reports.admin.dashboard` se centralizan como aliases de `REPORTES_DIARIOS_CONSULTAR`, único permiso de reportes presente en el catálogo actual. Son controles visuales; el backend conserva la autorización final.

## Endpoint y DTOs

`GET /api/v1/reports/admin/dashboard` devuelve:

- `businessDate`, `branchId`.
- `activeStudents`, `expiredMemberships`, `paymentsToday`, `attendanceToday`.
- `incomeToday[]`: `currency`, `amount`.
- `incomeByMethod[]`: `method`, `currency`, `payments`, `amount`.

No se agregaron campos de nuevos alumnos, cancelaciones, gastos, utilidad ni caja porque no forman parte del contrato.

## KPI y formato visual

- Alumnos activos: verde positivo.
- Membresías vencidas: ámbar cuando el valor es mayor que cero y verde cuando es cero. Esto es únicamente tono visual; el valor procede del backend.
- Pagos y asistencias de hoy: azul informativo.
- Ingresos: verde y siempre acompañados de su moneda.
- `LocalDate` se formatea en español sin convertirla desde UTC, evitando cambios de día por zona horaria.
- Métodos conocidos se traducen visualmente: efectivo, transferencia y tarjeta manual; valores nuevos se muestran sin descartarlos.

## Fuente de verdad

Angular no suma ingresos, no calcula pagos o asistencias del día, no determina alumnos activos ni membresías vencidas y no crea métricas financieras. Solo presenta `AdminDashboardResponse`. Spring Boot determina fecha operativa, sucursal, agregaciones, autorización, consistencia y auditoría.

## Estados y errores

- Loading durante la primera consulta y botón deshabilitado durante actualización.
- Última actualización visible después de una respuesta exitosa.
- Arrays de ingresos vacíos se muestran como estados vacíos parciales, no como error.
- `400`, `403`, `404`, `5xx` y error de conexión tienen mensajes controlados; nunca se imprime JSON crudo.
- `401` y refresh permanecen en los interceptores centrales de Sprint 1.

## Cómo probar manualmente

1. Iniciar backend y ejecutar `npm start`.
2. Entrar con un usuario que tenga `REPORTES_DIARIOS_CONSULTAR`.
3. Abrir `/dashboard` y confirmar fecha operativa, sucursal y los cuatro KPI.
4. Verificar totales por cada moneda y filas por método exactamente como responde la API.
5. Usar “Refrescar” y comprobar la última actualización.
6. Probar los accesos rápidos; solo deben aparecer los módulos permitidos para la sesión.
7. Abrir `/reports` y `/reports/admin-dashboard`.
8. Probar arrays de ingresos vacíos, backend apagado y respuestas 403/404/500.

## Limitaciones y TODO para Sprint 7

- No existen filtros por rango de fechas.
- No hay reportes históricos ni series temporales para gráficas.
- No hay detalle por alumno o plan en este endpoint.
- El permiso de reportes es único; separar `dashboard.view`, `reports.read` y `reports.admin.dashboard` requiere cambios explícitos en el catálogo backend.
- Los reportes futuros permanecen como placeholders hasta que exista un endpoint real.
- Sprint 7 podrá implementar usuarios, roles y seguridad administrativa sin trasladar reglas de autorización al frontend.

## Riesgos conocidos

- Un valor monetario se muestra por registro recibido; Angular no combina entradas duplicadas de una misma moneda.
- Métodos de pago nuevos se mostrarán con el código del backend hasta definir su traducción visual.
- El endpoint es una fotografía diaria; no debe interpretarse como reporte histórico.
