# Sprint 1 — autenticación y seguridad visual

## Objetivo

Preparar la autenticación real de la web GymBox contra el API Spring Boot, con sesión centralizada, persistencia acotada, permisos visuales y navegación protegida. Angular mejora la experiencia; la autorización definitiva y las reglas de negocio pertenecen al backend.

## Implementación

- `AuthApiService` concentra `login`, `refresh`, `logout` y `me` con los DTOs definitivos del backend.
- `AuthFacade` orquesta el flujo y `AuthSessionStore` mantiene signals de sesión, usuario, roles y permisos.
- `AuthSessionStorageService` persiste la sesión actual solo durante la pestaña/navegador (`sessionStorage`, clave `gymbox.auth.session`). No se usa `localStorage`, no se registran tokens y se limpia el storage al salir o recibir un 401.
- El initializer restaura la sesión y consulta `/auth/me` cuando existe un token. Si el access token venció, el interceptor rota los tokens una única vez y reintenta la solicitud.
- `authTokenInterceptor` y `traceRequestInterceptor` solo modifican solicitudes internas al `apiBaseUrl`; login y refresh permanecen públicos.
- `httpErrorInterceptor` normaliza errores. Ante 401 de un endpoint protegido coordina un único refresh en curso, reintenta la solicitud una vez y, si falla, limpia sesión y redirige a login con `returnUrl`; un 403 redirige a `/forbidden`.
- `AuthFacade.logout()` envía el refresh token a `POST /auth/logout` y limpia localmente aun si el servidor no responde.
- Permisos visuales centralizados en `core/auth/permissions.ts`; menú y rutas los consumen desde `menu.config.ts` y `app.routes.ts`.

## Flujo de login y restauración

1. Login envía `email`, contraseña y `device` opcional a `POST /api/v1/auth/login`.
2. La respuesta `AuthTokens` guarda access token, refresh token y expiración en el store/sessionStorage.
3. Se consulta `GET /api/v1/auth/me` para actualizar usuario, roles y permisos antes de navegar al `returnUrl` o dashboard.
4. Al iniciar la aplicación se restaura la sesión y se valida de nuevo con `/auth/me`.

## Rutas y permisos

Las rutas internas están bajo `authGuard` y `permissionChildGuard`. Para una nueva ruta, usar el catálogo:

```ts
data: { permissionsAny: [PERMISSIONS.STUDENTS_VIEW] }
```

Para un menú, agregar un `MenuItem` en `core/layout/menu.config.ts` con el mismo permiso. El sidebar solo oculta o muestra opciones: nunca concede acceso real.

## Endpoints esperados

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Los paths están en `core/config/api-endpoints.ts`. El contrato definitivo está documentado en `docs/arquitectura/dtos_y_refresh_token_backend.md`: login y refresh devuelven `AuthTokens`; `/auth/me` devuelve `UserSnapshot` directamente; logout recibe `{ refreshToken }` y responde `204`.

## Ambiente y decisiones

`environment.apiBaseUrl` es `/api/v1` para funcionar detrás de proxy; en desarrollo local puede configurarse como `http://localhost:8080/api/v1`. No hay mocks de autenticación ni tokens hardcodeados. La coordinación de refresh evita usos concurrentes y nunca reutiliza el refresh token anterior.

## Validación

- `npm run build`
- `npm test`

No existe una configuración o script de lint en el proyecto inicial.

## Pendiente para Sprint 2

- Añadir pruebas de integración de interceptor/refresh con `HttpTestingController`.
- Evaluar migrar el refresh token a cookie HttpOnly/Secure si el backend modifica el contrato actual basado en JSON.
- Comenzar Students sin incorporar reglas de edad, tutor, vigencia o permisos definitivos al frontend.
