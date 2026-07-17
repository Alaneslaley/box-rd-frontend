# GymBox web — resultado de Fase 0

## Implementado

- Angular 22 standalone con TypeScript estricto, organización `core`, `shared` y `features`.
- Shell autenticado con sidebar, topbar, menú por permisos visuales y cierre de sesión.
- Rutas lazy para auth, dashboard, alumnos, membresías, pagos, caja, asistencia, reportes, seguridad y deportivo.
- Login reactivo preparado para el API, store de sesión con signals, guards funcionales e interceptores de token, error, trazabilidad y carga.
- Entornos con `apiBaseUrl`, nombre, versión y configuración separada para desarrollo/producción.
- Tema CSS propio basado en slate, azul, verde, ámbar y rojo reservado para riesgo; no se instaló ni mezcló un kit UI.
- Componentes compartidos de cabecera, estados, badge, confirmación placeholder y tabla base.
- Pruebas unitarias iniciales para sesión, guard y badge.

## Estructura relevante

```text
src/app/core/{auth,config,guards,http,layout,models}
src/app/shared/components
src/app/features/{auth,dashboard,students,memberships,payments,cash,attendance,reports,security,sports}
src/environments
```

## Ejecución

```bash
npm start
npm run build
npm test
```

No existe script `lint` ni configuración de ESLint en el proyecto inicial. El pipeline futuro debe añadirlo antes de habilitar CI obligatorio.

## Ambientes

`src/environments/environment.ts` usa `apiBaseUrl: '/api/v1'`. Para desarrollo local con API separada puede cambiarse temporalmente a `http://localhost:8080/api/v1`; producción conserva la ruta relativa para proxy inverso. Sprint 1 elimina el mock de autenticación para mantener los contratos aislados del API real.

## API esperada

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Las features de Fase 1 consumen después los endpoints documentados de alumnos, planes/membresías, pagos, caja, asistencia, usuarios/roles y reportes. La API Spring Boot es la fuente de verdad para permisos, vigencias, folios, idempotencia y operaciones financieras.

## Pendiente para Fase 1

- Confirmar DTO exacto de login/refresh y estrategia final de refresh token (se recomienda cookie HttpOnly).
- Integrar `/auth/me`, expiración controlada y redirección por sesión expirada.
- Implementar verticales reales de Students y Auth, después memberships, pagos, asistencia y caja.
- Definir/instalar un único UI kit si se requiere; la arquitectura está preparada para Angular Material/CDK, pero no se añadió una dependencia innecesaria.
- Añadir ESLint, pipeline CI y pruebas de interceptores cuando se acuerde la configuración de lint.

## Riesgos y TODOs

- Los roles y permisos actuales solo controlan UX; ningún guard es una autorización de seguridad.
- No se persiste sesión en `localStorage`; los tokens no se registran ni imprimen. La sesión actual vive en memoria.
- La confirmación y tabla compartidas son bases visuales, no sustituyen un diálogo accesible completo ni paginación server-side de Fase 1.
