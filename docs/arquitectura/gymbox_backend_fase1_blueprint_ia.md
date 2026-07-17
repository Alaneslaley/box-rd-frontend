---
title: "GymBox Backend Fase 1 Blueprint IA"
source_pdf: "GymBox_Backend_Fase1_Blueprint_IA.pdf"
converted_at_utc: "2026-07-15T06:35:48Z"
pdf_title: "GymBox - Blueprint del backend Fase 1"
conversion_note: "Conversión textual desde PDF para uso en repositorio y Codex; tablas y bloques de código se conservaron en Markdown de forma aproximada."
---

## GYMBOX

# Blueprint del backend

# Fase 1 - MVP operativo administrativo

Estructura modular, paquetes, clases, contratos, APIs, flujos y pruebas
Identificador
```text
Versión | 1.1
Paquete raíz canónico | mx.com.gymbox.gymbox_backend
Clase principal | mx.com.gymbox.gymbox_backend.GymboxBackendApplication
Arquitectura | Monolito modular Spring Boot 4.1.0 + PostgreSQL 17
Java | 21
API pública | /api/v1
```

Basado en arquitectura_aplicacion_gimnasio_box.pdf y roadmap_aplicacion_gimnasio_box.pdf, versión 1.0 del 2 de julio de 2026.
Documento textual y buscable, optimizado para lectura humana y procesamiento por asistentes de IA.
13 de julio de 2026
## Contenido

La numeración de secciones es explícita para que el documento pueda citarse de forma estable desde tickets, prompts, pull
requests y revisiones de arquitectura.
## 1. Propósito, fuentes y decisiones obligatorias

## 2. Paquete canónico y clase principal

## 3. Modelo de arquitectura y convenciones

## 4. Módulos incluidos en la Fase 1

## 5. Árbol completo de paquetes y clases

## 6. Catálogo detallado por módulo

## 7. API REST de la Fase 1

## 8. Contratos y dependencias entre módulos

## 9. Flujos críticos de negocio

## 10. Seguridad y autorización

## 11. Persistencia, auditoría, outbox y archivos

## 12. Recursos y migraciones

## 13. Estrategia de pruebas

## 14. Spring Modulith como verificación opcional

## 15. Orden de implementación y Definition of Done

## 16. Manifiesto legible por IA

## 17. Trazabilidad con los documentos fuente

#### Regla canónica

Todos los nombres de paquete de este documento parten de mx.com.gymbox.gymbox_backend. El paquete com.gymbox
usado en el documento de arquitectura se considera conceptual y se sustituye por el paquete real del proyecto.
## 1. Propósito, fuentes y decisiones obligatorias

Este documento convierte la arquitectura objetivo y la Fase 1 del roadmap en una especificación implementable del backend.
Define paquetes, clases, responsabilidades, dependencias, endpoints, límites transaccionales y pruebas. No es código
generado: es el contrato de estructura que debe guiar la implementación.
### 1.1 Fuentes

```text
Fuente | Secciones utilizadas | Aporte al blueprint
arquitectura_aplicacion_gimnasio_box.pdf | Principios; backend monolítico modular; | Define capas internas, límites por dominio,
datos; API; seguridad; flujos críticos | REST bajo /api/v1, PostgreSQL como
fuente de verdad, auditoría append-only,
pagos transaccionales y almacenamiento de
archivos.
roadmap_aplicacion_gimnasio_box.pdf | Fase 0 y Fase 1; criterios de aceptación; | Define el MVP: autenticación, roles,
fuera de alcance | alumnos, foto, edad, tutor, planes,
membresías, pagos, comprobante,
asistencia, panel de instructor y dashboard
simple.
V1__crear_schemas_seguridad_y_configuracion_base.sql | Migración inicial ya generada | Crea los schemas lógicos y condiciona las
 | primeras entidades: sucursales, usuarios, roles, permisos y
sesiones de refresh.
```

### 1.2 Decisiones no negociables

- Una sola aplicación Spring Boot desplegable durante la primera etapa.
- Módulos internos separados por dominio, no paquetes globales controller/service/repository/entity.
- Cada módulo contiene, cuando aplica, api, application, domain e infrastructure.
- PostgreSQL es la fuente única de verdad para la operación administrativa.
- Todas las APIs públicas se publican bajo /api/v1.
- Las reglas de negocio viven en domain o application; nunca en controllers ni repositorios JPA.
- La autorización se decide en el backend. Ocultar botones en Angular no concede ni revoca permisos.
- Los pagos no se borran físicamente. La cancelación controlada pertenece a la Fase 2.
- La edad se calcula desde la fecha de nacimiento; no se almacena como dato mutable del alumno.
- Los cambios sensibles generan eventos de auditoría append-only.
- Los binarios de fotos y comprobantes se guardan en almacenamiento de archivos; PostgreSQL conserva metadatos y
referencias.
### 1.3 Alcance funcional de la Fase 1

- Login, JWT, refresh token rotativo, usuario actual y cierre de sesión.
- Roles y permisos básicos.
- Alta y edición de alumnos con foto, teléfono, correo, fecha de nacimiento, tutor y contacto de emergencia.
- Cálculo de edad y categoría; validación de tutor cuando el alumno es menor.
- Planes semanales, mensuales, clase suelta y paquetes de clases.
- Membresías con vigencia, estado y renovación.
- Pagos en efectivo, transferencia y tarjeta manual, con folio único.
- Comprobante digital básico y envío manual o simulado mediante outbox.
- Check-in con búsqueda, foto, edad, nivel, estado de membresía y alerta de vencimiento.
- Vista básica del instructor para operación diaria.
- Dashboard administrativo con alumnos activos, vencidos, pagos e ingresos del día y asistencias.
### 1.4 Fuera de alcance de la Fase 1

- Cierre de caja robusto con evidencia fotográfica, entrega y conciliación completa.
- Cancelaciones de pago, descuentos autorizados y reversas financieras.
- Auditoría completa consultable con todas las variantes antifraude.
- Módulo deportivo completo: ciclos, evaluaciones, RPE, bienestar, lesiones y progreso.
- Aplicación final del alumno.
- Integración real con WhatsApp, terminal bancaria o pasarela de pago.
- Microservicios, Kafka, Redis, gateway y service discovery.
#### Caja mínima en Fase 1

Aunque el cierre robusto corresponde a la Fase 2, se mantiene un módulo cash básico porque un pago en efectivo debe
validar una caja abierta y registrar un movimiento en la misma transacción. Evidencia, conciliación y entrega al dueño se
aplazan.
## 2. Paquete canónico y clase principal

Paquete raíz: mx.com.gymbox.gymbox_backend
Ruta física: src/main/java/mx/com/gymbox/gymbox_backend/
Clase principal: mx.com.gymbox.gymbox_backend.GymboxBackendApplication
### 2.1 Archivo principal

```text
package mx.com.gymbox.gymbox_backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class GymboxBackendApplication {
public static void main(String[] args) {
SpringApplication.run(GymboxBackendApplication.class, args);
}
}
```

La clase principal debe permanecer en el paquete raíz. De esta forma, el component scan de Spring incluye todos los
subpaquetes de los módulos.
### 2.2 Reglas de paquetes

- No crear paquetes bajo com.gymbox; el prefijo válido es mx.com.gymbox.gymbox_backend.
- Cada módulo es un subpaquete directo del paquete raíz: identity, students, memberships, payments, attendance, etc.
- Los nombres de clases permanecen en inglés para mantener consistencia con los dominios y endpoints definidos en
arquitectura.
- Los textos de negocio, mensajes de error y descripciones para usuarios pueden mantenerse en español.
- No usar un paquete global entity, controller, service o repository para toda la aplicación.
### 2.3 Alineación de roles con la migración V1

Los documentos describen roles conceptuales Owner, Admin, Instructor, Cashier y Student. La migración V1 actual utiliza
ADMINISTRADOR, RECEPCION, INSTRUCTOR y ALUMNO. Para no bloquear el MVP, se adopta el siguiente mapeo
temporal:
```text
Rol conceptual | Código V1 actual | Uso en Fase 1
Owner / Admin | ADMINISTRADOR | Acceso administrativo total. Puede
separarse en OWNER y ADMIN en una
migración posterior.
Cashier / recepción | RECEPCION | Alta de alumnos, cobros, membresías, caja
básica y asistencia según permisos.
Instructor | INSTRUCTOR | Consulta operativa y check-in.
Student | ALUMNO | Reservado para la futura app del alumno.
```

## 3. Modelo de arquitectura y convenciones

### 3.1 Capas internas por módulo

```text
Capa | Responsabilidad | No debe hacer
api | Controllers REST, DTO de entrada y salida, | No contiene reglas de negocio ni acceso
validación Jakarta Validation, traducción | directo a JPA.
HTTP.
```

```text
Capa | Responsabilidad | No debe hacer
application | Casos de uso, coordinación entre puertos y | No expone entidades JPA ni detalles de
módulos, autorización de método y límites | frameworks al dominio.
transaccionales.
domain | Entidades, agregados, value objects, | No depende de Spring MVC, JPA,
políticas, eventos y puertos de repositorio. | almacenamiento o clientes externos.
infrastructure | Adaptadores JPA, Spring Security, | No decide reglas de negocio; implementa
almacenamiento local/S3, correo, WhatsApp | contratos definidos por el núcleo.
simulado, consultas SQL.
```

### 3.2 Convenciones de nombres

```text
Tipo | Convención | Ejemplo
Controller | <Dominio>Controller | StudentController
Request/Response | <Acción><Entidad>Request / | CreateStudentRequest, StudentResponse
<Entidad>Response
Caso de uso | <Acción><Entidad>Service o | RegisterPaymentService
<Entidad>CommandService
Comando/consulta | <Acción><Entidad>Command / | RenewMembershipCommand
<Entidad>SearchQuery
Entidad de dominio | Nombre sin sufijo técnico | Student, Payment
Value object | Nombre semántico | BirthDate, PaymentFolio
Puerto de repositorio | <Entidad>Repository | StudentRepository
Entidad JPA | <Entidad>JpaEntity | StudentJpaEntity
Spring Data | SpringData<Entidad>Repository | SpringDataStudentRepository
Adaptador | <Entidad>RepositoryAdapter | StudentRepositoryAdapter
Mapper | <Dominio>PersistenceMapper o | StudentPersistenceMapper
<Dominio>ApiMapper
```

### 3.3 Reglas de límites

- Un módulo nunca importa una clase de infrastructure de otro módulo.
- La comunicación entre módulos usa interfaces públicas pequeñas y snapshots inmutables.
- Los repositorios de dominio son interfaces; los adaptadores JPA los implementan.
- Una transacción de negocio puede coordinar varios módulos desde application, pero cada módulo conserva sus
invariantes.
- Los eventos de negocio no sustituyen una transacción cuando la operación requiere consistencia inmediata.
- Las consultas de dashboard pueden usar SQL optimizado y proyecciones de lectura sin hidratar agregados completos.
## 4. Módulos incluidos en la Fase 1

```text
Módulo | Responsabilidad principal
shared | Infraestructura técnica transversal mínima: errores, paginación,
auditoría JPA, usuario actual, reloj y trazas.
organization | Sucursal principal y contexto de sucursal.
identity | Login, JWT, refresh, usuarios, roles y permisos.
media | Metadatos y almacenamiento de fotos/comprobantes.
students | Ficha del alumno, tutor, emergencia, edad, nivel inicial y foto.
memberships | Planes, vigencias, membresías, estados y renovación.
cash | Apertura, consulta y cierre básico; movimientos de efectivo ligados
a pagos.
```

```text
Módulo | Responsabilidad principal
payments | Pago transaccional, folio, recibo, idempotencia e integración con
membresía/caja.
attendance | Check-in, reglas de acceso, historial y vista del instructor.
reports | Dashboard administrativo de solo lectura.
notifications | Outbox y simulación de email/WhatsApp para comprobantes.
audit | Eventos append-only de acciones sensibles.
```

### 4.1 Módulos reservados para fases posteriores

```text
training/
evaluations/
progress/
wellness/
injuries/
advanced_reporting/
cash_handover/
cash_reconciliation/
payment_cancellations/
discounts/
real_whatsapp_integration/
real_card_terminal_integration/
```

## 5. Árbol completo de paquetes y clases

El siguiente árbol es la referencia canónica para crear carpetas y clases. Se utiliza ASCII para que pueda copiarse sin
pérdida a prompts, tickets y herramientas de análisis.
```text
src/main/java/mx/com/gymbox/gymbox_backend/
|-- GymboxBackendApplication.java
|
|-- shared/
| |-- api/
| | |-- ApiError.java
| | |-- FieldViolation.java
| | |-- PageResponse.java
| | `-- GlobalExceptionHandler.java
| |-- config/
| | |-- ClockConfig.java
| | |-- JacksonConfig.java
| | |-- OpenApiConfig.java
| | |-- JpaAuditingConfig.java
| | `-- CorsProperties.java
| |-- domain/
| | |-- DomainEvent.java
| | |-- DomainException.java
| | |-- NotFoundException.java
| | |-- ConflictException.java
| | `-- Money.java
| |-- persistence/
| | |-- AuditableJpaEntity.java
| | `-- SpringSecurityAuditorAware.java
| |-- security/
| | |-- CurrentUser.java
| | |-- CurrentUserProvider.java
| | `-- PermissionCodes.java
| `-- observability/
| `-- TraceIdFilter.java
|
|-- organization/
| |-- BranchDirectory.java
| |-- BranchSnapshot.java
| |-- application/
| | `-- BranchQueryService.java
| |-- domain/
| | |-- Branch.java
| | |-- BranchId.java
| | |-- BranchStatus.java
| | `-- BranchRepository.java
| `-- infrastructure/persistence/
| |-- BranchJpaEntity.java
| |-- SpringDataBranchRepository.java
| |-- BranchRepositoryAdapter.java
| `-- BranchPersistenceMapper.java
|
|-- identity/
| |-- UserDirectory.java
| |-- UserSnapshot.java
| |-- api/
| | |-- AuthController.java
| | |-- UserController.java
| | |-- RoleController.java
| | |-- LoginRequest.java
| | |-- RefreshTokenRequest.java
| | |-- AuthResponse.java
| | |-- CurrentUserResponse.java
| | |-- CreateUserRequest.java
| | |-- AssignRolesRequest.java
| | `-- UserResponse.java
```

```text
| |-- application/
| | |-- AuthenticationService.java
| | |-- RefreshSessionService.java
| | |-- UserCommandService.java
| | |-- UserQueryService.java
| | |-- RoleQueryService.java
| | |-- AdminBootstrapRunner.java
| | `-- port/
| | |-- PasswordHasher.java
| | `-- AccessTokenService.java
| |-- domain/
| | |-- User.java
| | |-- Role.java
| | |-- Permission.java
| | |-- RefreshSession.java
| | |-- UserId.java
| | |-- UserStatus.java
| | |-- RoleCode.java
| | |-- PermissionCode.java
| | |-- UserRepository.java
| | |-- RoleRepository.java
| | `-- RefreshSessionRepository.java
| `-- infrastructure/
| |-- security/
| | |-- SecurityConfiguration.java
| | |-- JwtAccessTokenService.java
| | |-- JwtAccountStateFilter.java
| | |-- Argon2PasswordHasher.java
| | |-- SecurityCurrentUserProvider.java
| | `-- JwtProperties.java
| `-- persistence/
| |-- UserJpaEntity.java
| |-- RoleJpaEntity.java
| |-- PermissionJpaEntity.java
| |-- SpringDataUserRepository.java
| |-- SpringDataRoleRepository.java
| |-- UserRepositoryAdapter.java
| |-- RoleRepositoryAdapter.java
| |-- RefreshSessionRepositoryAdapter.java
| `-- IdentityPersistenceMapper.java
|
|-- media/
| |-- MediaStorage.java
| |-- StoredFileSnapshot.java
| |-- application/
| | |-- StoreFileService.java
| | |-- LoadFileService.java
| | `-- MediaValidationPolicy.java
| |-- domain/
| | |-- StoredFile.java
| | |-- FileId.java
| | |-- FilePurpose.java
| | |-- FileStatus.java
| | `-- StoredFileRepository.java
| `-- infrastructure/
| |-- storage/
| | |-- BinaryStorage.java
| | |-- LocalFileStorageAdapter.java
| | `-- StorageProperties.java
| `-- persistence/
| |-- StoredFileJpaEntity.java
| |-- SpringDataStoredFileRepository.java
| |-- StoredFileRepositoryAdapter.java
| `-- StoredFilePersistenceMapper.java
|
|-- students/
| |-- StudentDirectory.java
| |-- StudentSnapshot.java
| |-- api/
| | |-- StudentController.java
| | |-- StudentPhotoController.java
| | |-- CreateStudentRequest.java
| | |-- UpdateStudentRequest.java
| | |-- GuardianRequest.java
| | |-- EmergencyContactRequest.java
| | |-- StudentResponse.java
| | |-- StudentSummaryResponse.java
| | `-- StudentApiMapper.java
| |-- application/
| | |-- StudentCommandService.java
| | |-- StudentQueryService.java
| | |-- StudentPhotoService.java
| | |-- CreateStudentCommand.java
| | |-- UpdateStudentCommand.java
| | `-- StudentSearchQuery.java
| |-- domain/
| | |-- Student.java
| | |-- Guardian.java
| | |-- EmergencyContact.java
| | |-- StudentId.java
| | |-- BirthDate.java
| | |-- AgeCategory.java
| | |-- StudentLevel.java
| | |-- StudentStatus.java
| | |-- AgeCalculator.java
| | |-- MinorGuardianPolicy.java
| | |-- StudentRepository.java
| | |-- StudentCreated.java
| | `-- StudentPhotoChanged.java
| `-- infrastructure/persistence/
| |-- StudentJpaEntity.java
| |-- StudentGuardianJpaEntity.java
| |-- StudentContactJpaEntity.java
| |-- SpringDataStudentRepository.java
| |-- StudentRepositoryAdapter.java
| `-- StudentPersistenceMapper.java
|
|-- memberships/
| |-- MembershipDirectory.java
| |-- MembershipSnapshot.java
| |-- MembershipRenewal.java
| |-- api/
```

```text
| | |-- PlanController.java
| | |-- MembershipController.java
| | |-- CreatePlanRequest.java
| | |-- UpdatePlanRequest.java
| | |-- CreateMembershipRequest.java
| | |-- RenewMembershipRequest.java
| | |-- PlanResponse.java
| | `-- MembershipResponse.java
| |-- application/
| | |-- PlanCommandService.java
| | |-- PlanQueryService.java
| | |-- MembershipCommandService.java
| | |-- MembershipQueryService.java
| | |-- CreateMembershipCommand.java
| | `-- RenewMembershipCommand.java
| |-- domain/
| | |-- Plan.java
| | |-- Membership.java
| | |-- MembershipMovement.java
| | |-- PlanId.java
| | |-- MembershipId.java
| | |-- PlanType.java
| | |-- PlanValidity.java
| | |-- MembershipStatus.java
| | |-- MembershipMovementType.java
| | |-- MembershipExpirationPolicy.java
| | |-- MembershipRenewalPolicy.java
| | |-- PlanRepository.java
| | |-- MembershipRepository.java
| | `-- MembershipRenewed.java
| `-- infrastructure/persistence/
| |-- PlanJpaEntity.java
| |-- MembershipJpaEntity.java
| |-- MembershipMovementJpaEntity.java
| |-- SpringDataPlanRepository.java
| |-- SpringDataMembershipRepository.java
| |-- PlanRepositoryAdapter.java
| |-- MembershipRepositoryAdapter.java
| `-- MembershipPersistenceMapper.java
|
|-- cash/
| |-- CashRegisterOperations.java
| |-- CashRegisterSnapshot.java
| |-- api/
| | |-- CashRegisterController.java
| | |-- OpenCashRegisterRequest.java
| | |-- CloseCashRegisterRequest.java
| | `-- CashRegisterResponse.java
| |-- application/
| | |-- CashRegisterService.java
| | |-- CashMovementService.java
| | `-- CurrentCashRegisterQueryService.java
| |-- domain/
| | |-- CashRegisterSession.java
| | |-- CashMovement.java
| | |-- CashRegisterId.java
| | |-- CashRegisterStatus.java
| | |-- CashMovementType.java
| | |-- CashRegisterRepository.java
| | `-- CashMovementRepository.java
| `-- infrastructure/persistence/
| |-- CashRegisterSessionJpaEntity.java
| |-- CashMovementJpaEntity.java
| |-- SpringDataCashRegisterRepository.java
| |-- SpringDataCashMovementRepository.java
| |-- CashRegisterRepositoryAdapter.java
| `-- CashPersistenceMapper.java
|
|-- payments/
| |-- api/
| | |-- PaymentController.java
| | |-- ReceiptController.java
| | |-- RegisterPaymentRequest.java
| | |-- PaymentResponse.java
| | |-- PaymentSearchResponse.java
| | `-- ReceiptResponse.java
| |-- application/
| | |-- RegisterPaymentService.java
| | |-- PaymentQueryService.java
| | |-- ReceiptService.java
| | |-- PaymentIdempotencyService.java
| | |-- RegisterPaymentCommand.java
| | `-- PaymentSearchQuery.java
| |-- domain/
| | |-- Payment.java
| | |-- PaymentItem.java
| | |-- Receipt.java
| | |-- PaymentId.java
| | |-- PaymentFolio.java
| | |-- PaymentMethod.java
| | |-- PaymentStatus.java
| | |-- PaymentConcept.java
| | |-- PaymentRepository.java
| | |-- ReceiptRepository.java
| | |-- PaymentFolioGenerator.java
| | `-- PaymentRegistered.java
| `-- infrastructure/
| |-- persistence/
| | |-- PaymentJpaEntity.java
| | |-- PaymentItemJpaEntity.java
| | |-- ReceiptJpaEntity.java
| | |-- IdempotencyKeyJpaEntity.java
| | |-- SpringDataPaymentRepository.java
| | |-- PaymentRepositoryAdapter.java
| | |-- ReceiptRepositoryAdapter.java
| | `-- PaymentPersistenceMapper.java
| `-- folio/
| `-- PostgresPaymentFolioGenerator.java
|
|-- attendance/
| |-- api/
| | |-- AttendanceController.java
| | |-- InstructorTodayController.java
| | |-- CheckInRequest.java
```

```text
| | |-- CheckInResponse.java
| | |-- AttendanceResponse.java
| | `-- InstructorTodayResponse.java
| |-- application/
| | |-- CheckInStudentService.java
| | |-- AttendanceQueryService.java
| | |-- InstructorTodayQueryService.java
| | `-- CheckInCommand.java
| |-- domain/
| | |-- AttendanceRecord.java
| | |-- ClassSession.java
| | |-- AttendanceId.java
| | |-- CheckInDecision.java
| | |-- AttendanceStatus.java
| | |-- CheckInPolicy.java
| | |-- AttendanceRepository.java
| | `-- ClassSessionRepository.java
| `-- infrastructure/persistence/
| |-- AttendanceRecordJpaEntity.java
| |-- ClassSessionJpaEntity.java
| |-- SpringDataAttendanceRepository.java
| |-- SpringDataClassSessionRepository.java
| |-- AttendanceRepositoryAdapter.java
| `-- AttendancePersistenceMapper.java
|
|-- reports/
| |-- api/
| | |-- AdminDashboardController.java
| | `-- AdminDashboardResponse.java
| |-- application/
| | `-- AdminDashboardQueryService.java
| `-- infrastructure/query/
| |-- AdminDashboardQueryRepository.java
| |-- AdminDashboardJdbcRepository.java
| `-- AdminDashboardProjection.java
|
|-- notifications/
| |-- NotificationPublisher.java
| |-- application/
| | |-- NotificationOutboxService.java
| | `-- NotificationOutboxWorker.java
| |-- domain/
| | |-- OutboxMessage.java
| | |-- NotificationChannel.java
| | |-- OutboxStatus.java
| | `-- OutboxRepository.java
| `-- infrastructure/
| |-- sender/
| | |-- NotificationSender.java
| | |-- LoggingEmailSender.java
| | `-- LoggingWhatsAppSender.java
| `-- persistence/
| |-- OutboxMessageJpaEntity.java
| |-- SpringDataOutboxRepository.java
| `-- OutboxRepositoryAdapter.java
|
`-- audit/
|-- AuditRecorder.java
|-- application/
| `-- AuditEventService.java
|-- domain/
| |-- AuditEvent.java
| |-- AuditAction.java
| |-- AuditEntityType.java
| `-- AuditEventRepository.java
`-- infrastructure/persistence/
|-- AuditEventJpaEntity.java
|-- SpringDataAuditEventRepository.java
`-- AuditEventRepositoryAdapter.java
```

## 6. Catálogo detallado por módulo

Las listas siguientes no obligan a implementar todas las clases el primer día. Definen la separación final esperada dentro de
la Fase 1 y permiten crear cada corte vertical sin romper límites.
### 6.1 shared

Contiene únicamente capacidades técnicas realmente transversales. No debe convertirse en un cajón de utilidades de
negocio.
#### Contratos públicos

```text
ApiError
FieldViolation
PageResponse<T>
CurrentUser
CurrentUserProvider
PermissionCodes
Money
```

#### Dominio

```text
DomainEvent
DomainException
NotFoundException
ConflictException
Money
```

#### Infraestructura

```text
GlobalExceptionHandler
ClockConfig
JacksonConfig
OpenApiConfig
JpaAuditingConfig
CorsProperties
AuditableJpaEntity
SpringSecurityAuditorAware
TraceIdFilter
```

#### Reglas críticas

- No incluir reglas específicas de alumno, membresía, caja o pagos.
- ApiError debe incluir code, message, details, timestamp y traceId.
- Money debe usar BigDecimal y moneda explícita; nunca double para importes.
- Clock se inyecta para hacer deterministas las pruebas de edad, vencimiento y fechas de negocio.
### 6.2 organization

Representa la sucursal o sede en la que ocurre la operación. En el MVP puede existir una sola sucursal principal, pero el
modelo evita hardcodear ese supuesto.
#### Contratos públicos

```text
BranchDirectory
BranchSnapshot
```

#### Aplicación

```text
BranchQueryService
```

#### Dominio

```text
Branch
BranchId
BranchStatus
BranchRepository
```

#### Infraestructura

```text
BranchJpaEntity
SpringDataBranchRepository
BranchRepositoryAdapter
BranchPersistenceMapper
```

#### Reglas críticas

- Toda caja, usuario operativo, pago y asistencia debe poder asociarse con una sucursal.
- No exponer BranchJpaEntity fuera del módulo.
### 6.3 identity

Autenticación, sesiones, usuarios, roles y permisos. La autorización siempre se valida en backend.
#### Contratos públicos

```text
UserDirectory
UserSnapshot
```

#### API

```text
AuthController
UserController
RoleController
LoginRequest
RefreshTokenRequest
AuthResponse
CurrentUserResponse
CreateUserRequest
AssignRolesRequest
UserResponse
```

#### Aplicación

```text
AuthenticationService
RefreshSessionService
UserCommandService
UserQueryService
RoleQueryService
AdminBootstrapRunner
PasswordHasher
TokenService
```

#### Dominio

```text
User
Role
Permission
RefreshSession
UserId
UserStatus
RoleCode
PermissionCode
UserRepository
RoleRepository
RefreshSessionRepository
```

#### Infraestructura

```text
SecurityConfiguration
JwtAccessTokenService
JwtAccountStateFilter
Argon2PasswordHasher
SecurityCurrentUserProvider
JwtProperties
UserJpaEntity
RoleJpaEntity
PermissionJpaEntity
UserRepositoryAdapter
RoleRepositoryAdapter
RefreshSessionRepositoryAdapter
```

#### Reglas críticas

- El access token usa JWT HS512 con secreto de al menos 64 bytes y dura 15 minutos.
- Claims estándar: iss, aud, sub, jti, iat, nbf y exp. Claims propios: typ, sid, branchId, roles,
  permissions y authzVersion.
- El refresh token opaco dura 30 días, rota en cada uso y conserva un identificador de familia.
- En base de datos se almacena únicamente el hash del refresh token.
- La reutilización de un refresh ya rotado revoca toda su familia.
- Los permisos del claim permissions se convierten a GrantedAuthority.
- AdminBootstrapRunner crea el primer administrador solo si no existe y toma secretos de variables de entorno.
- No guardar contraseñas en texto plano ni en migraciones compartidas.
#### Endpoints

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET /api/v1/auth/me
GET/POST /api/v1/users
PATCH /api/v1/users/{id}/status
PUT /api/v1/users/{id}/roles
GET /api/v1/roles
```

### 6.4 media

Almacena metadatos de archivos y delega los bytes a disco controlado, MinIO o S3. En Fase 1 soporta principalmente fotos
de alumnos y comprobantes.
#### Contratos públicos

```text
MediaStorage
StoredFileSnapshot
```

#### Aplicación

```text
StoreFileService
LoadFileService
MediaValidationPolicy
```

#### Dominio

```text
StoredFile
FileId
FilePurpose
FileStatus
StoredFileRepository
```

#### Infraestructura

```text
BinaryStorage
LocalFileStorageAdapter
StorageProperties
StoredFileJpaEntity
SpringDataStoredFileRepository
StoredFileRepositoryAdapter
StoredFilePersistenceMapper
```

#### Reglas críticas

- No guardar fotos en Base64 dentro de la tabla students.
- Validar MIME type, extensión permitida, tamaño máximo y checksum.
- Usar claves de almacenamiento no adivinables.
- Autorizar cada descarga; conocer un fileId no debe conceder acceso automático.
### 6.5 students

Gestiona la ficha única del alumno, datos de contacto, tutor, contacto de emergencia, fecha de nacimiento, nivel inicial,
estado y fotografía.
#### Contratos públicos

```text
StudentDirectory
StudentSnapshot
```

#### API

```text
StudentController
StudentPhotoController
CreateStudentRequest
UpdateStudentRequest
GuardianRequest
EmergencyContactRequest
StudentResponse
StudentSummaryResponse
StudentApiMapper
```

#### Aplicación

```text
StudentCommandService
StudentQueryService
StudentPhotoService
CreateStudentCommand
UpdateStudentCommand
StudentSearchQuery
```

#### Dominio

```text
Student
Guardian
EmergencyContact
StudentId
BirthDate
AgeCategory
StudentLevel
StudentStatus
AgeCalculator
MinorGuardianPolicy
StudentRepository
StudentCreated
StudentPhotoChanged
```

#### Infraestructura

```text
StudentJpaEntity
StudentGuardianJpaEntity
StudentContactJpaEntity
SpringDataStudentRepository
StudentRepositoryAdapter
```

```text
StudentPersistenceMapper
```

#### Reglas críticas

- La edad se calcula usando BirthDate y Clock; no se persiste como campo actualizable.
- Si la regla de menor está activa y el alumno es menor, Guardian es obligatorio.
- StudentLevel en Fase 1 es informativo: UNASSIGNED, BEGINNER, INTERMEDIATE o ADVANCED.
- La baja es lógica mediante estado; no se elimina el historial.
- La fotografía se relaciona mediante fileId del módulo media.
#### Endpoints

```text
GET/POST /api/v1/students
GET/PUT /api/v1/students/{id}
PATCH /api/v1/students/{id}/status
POST /api/v1/students/{id}/photo
```

### 6.6 memberships

Administra planes, vigencias, membresías, estados y renovaciones.
#### Contratos públicos

```text
MembershipDirectory
MembershipSnapshot
MembershipRenewal
```

#### API

```text
PlanController
MembershipController
CreatePlanRequest
UpdatePlanRequest
CreateMembershipRequest
RenewMembershipRequest
PlanResponse
MembershipResponse
```

#### Aplicación

```text
PlanCommandService
PlanQueryService
MembershipCommandService
MembershipQueryService
CreateMembershipCommand
RenewMembershipCommand
```

#### Dominio

```text
Plan
Membership
MembershipMovement
PlanId
MembershipId
PlanType
PlanValidity
MembershipStatus
MembershipMovementType
MembershipExpirationPolicy
MembershipRenewalPolicy
PlanRepository
MembershipRepository
MembershipRenewed
```

#### Infraestructura

```text
PlanJpaEntity
MembershipJpaEntity
MembershipMovementJpaEntity
SpringDataPlanRepository
SpringDataMembershipRepository
PlanRepositoryAdapter
MembershipRepositoryAdapter
MembershipPersistenceMapper
```

#### Reglas críticas

- PlanType inicial: WEEKLY, MONTHLY, SINGLE_CLASS y CLASS_PACKAGE.
- El vencimiento se calcula a partir del plan y fecha efectiva; no lo decide el frontend.
- Cada renovación crea MembershipMovement para conservar historial.
- MembershipStatus inicial: PENDING, ACTIVE, EXPIRED, FROZEN y CANCELLED; congelamiento operativo puede
aplazarse.
- payments usa MembershipRenewal como contrato, no la entidad JPA.
#### Endpoints

```text
GET/POST /api/v1/plans
PUT /api/v1/plans/{id}
GET/POST /api/v1/memberships
GET /api/v1/memberships/student/{studentId}
POST /api/v1/memberships/{id}/renew
```

### 6.7 cash

Proporciona la caja mínima para pagos en efectivo: apertura, caja actual, cierre básico y movimientos de ingreso.
#### Contratos públicos

```text
CashRegisterOperations
CashRegisterSnapshot
```

#### API

```text
CashRegisterController
OpenCashRegisterRequest
CloseCashRegisterRequest
CashRegisterResponse
```

#### Aplicación

```text
CashRegisterService
CashMovementService
CurrentCashRegisterQueryService
```

#### Dominio

```text
CashRegisterSession
CashMovement
CashRegisterId
CashRegisterStatus
CashMovementType
CashRegisterRepository
CashMovementRepository
```

#### Infraestructura

```text
CashRegisterSessionJpaEntity
CashMovementJpaEntity
SpringDataCashRegisterRepository
SpringDataCashMovementRepository
CashRegisterRepositoryAdapter
CashPersistenceMapper
```

#### Reglas críticas

- Un pago CASH exige una caja abierta para la sucursal o usuario según la política elegida.
- CashMovementService.registerPaymentIncome se invoca dentro de la transacción del pago.
- Evidencia, handover, conciliación y alertas de diferencias quedan para Fase 2.
#### Endpoints

```text
POST /api/v1/cash-register/open
GET /api/v1/cash-register/current
POST /api/v1/cash-register/close
```

### 6.8 payments

Registra pagos de forma atómica, genera folio y recibo, renueva membresía, registra caja, auditoría y outbox.
#### API

```text
PaymentController
ReceiptController
RegisterPaymentRequest
PaymentResponse
PaymentSearchResponse
ReceiptResponse
```

#### Aplicación

```text
RegisterPaymentService
PaymentQueryService
ReceiptService
PaymentIdempotencyService
RegisterPaymentCommand
PaymentSearchQuery
```

#### Dominio

```text
Payment
PaymentItem
Receipt
PaymentId
PaymentFolio
PaymentMethod
PaymentStatus
PaymentConcept
PaymentRepository
ReceiptRepository
PaymentFolioGenerator
PaymentRegistered
```

#### Infraestructura

```text
PaymentJpaEntity
PaymentItemJpaEntity
ReceiptJpaEntity
IdempotencyKeyJpaEntity
SpringDataPaymentRepository
PaymentRepositoryAdapter
ReceiptRepositoryAdapter
PaymentPersistenceMapper
PostgresPaymentFolioGenerator
```

#### Reglas críticas

- PaymentMethod: CASH, TRANSFER y MANUAL_CARD.
- El folio se genera en servidor mediante mecanismo seguro de PostgreSQL.
- POST /payments acepta Idempotency-Key para evitar cobros duplicados por reintentos.
- No existe DELETE /payments/{id}.
- La cancelación controlada se agrega en Fase 2 y conserva el pago original.
#### Endpoints

```text
POST /api/v1/payments
GET /api/v1/payments
GET /api/v1/payments/{id}
GET /api/v1/payments/{id}/receipt
```

### 6.9 attendance

Registra check-in y devuelve una decisión explícita basada en alumno, duplicidad y membresía.
#### API

```text
AttendanceController
InstructorTodayController
CheckInRequest
CheckInResponse
AttendanceResponse
InstructorTodayResponse
```

#### Aplicación

```text
CheckInStudentService
AttendanceQueryService
InstructorTodayQueryService
CheckInCommand
```

#### Dominio

```text
AttendanceRecord
ClassSession
AttendanceId
CheckInDecision
AttendanceStatus
CheckInPolicy
AttendanceRepository
ClassSessionRepository
```

#### Infraestructura

```text
AttendanceRecordJpaEntity
ClassSessionJpaEntity
SpringDataAttendanceRepository
SpringDataClassSessionRepository
AttendanceRepositoryAdapter
AttendancePersistenceMapper
```

#### Reglas críticas

- CheckInDecision: ALLOWED, ALREADY_REGISTERED, BLOCKED_EXPIRED_MEMBERSHIP o
BLOCKED_INACTIVE_STUDENT.
- La respuesta muestra foto, nombre, edad, nivel y estado de membresía.
- Guardar snapshots age_at_event, age_category_at_event, level_at_event, membership_status_at_event y
membership_end_date_at_event.
- En Fase 1 el vencido se bloquea. El override auditado se agrega en Fase 2.
#### Endpoints

```text
POST /api/v1/attendance/check-in
GET /api/v1/attendance/today
GET /api/v1/attendance/student/{studentId}
GET /api/v1/instructor/today
```

### 6.10 reports

Módulo de lectura para dashboard. Puede usar JdbcClient o SQL explícito con proyecciones optimizadas.
#### API

```text
AdminDashboardController
AdminDashboardResponse
```

#### Aplicación

```text
AdminDashboardQueryService
```

#### Infraestructura

```text
AdminDashboardQueryRepository
AdminDashboardJdbcRepository
AdminDashboardProjection
```

#### Reglas críticas

- No contiene lógica de escritura.
- No carga agregados JPA completos para sumar indicadores.
- Indicadores mínimos: alumnos activos, vencidos, pagos e ingresos del día, asistencia del día e ingresos por método.
#### Endpoints

```text
GET /api/v1/reports/admin/dashboard
```

### 6.11 notifications

Desacopla la transacción financiera del envío de comprobantes mediante outbox.
#### Contratos públicos

```text
NotificationPublisher
```

#### Aplicación

```text
NotificationOutboxService
NotificationOutboxWorker
```

#### Dominio

```text
OutboxMessage
NotificationChannel
OutboxStatus
OutboxRepository
```

#### Infraestructura

```text
NotificationSender
LoggingEmailSender
LoggingWhatsAppSender
OutboxMessageJpaEntity
SpringDataOutboxRepository
OutboxRepositoryAdapter
```

#### Reglas críticas

- El mensaje outbox se inserta dentro de la transacción de pago.
- El envío ocurre después del commit.
- En Fase 1 los senders pueden registrar el envío en logs o marcarlo como simulado.
- Estados sugeridos: PENDING, PROCESSING, SENT, FAILED y FAILED_FINAL.
### 6.12 audit

Registra eventos de negocio sensibles de forma append-only.
#### Contratos públicos

```text
AuditRecorder
```

#### Aplicación

```text
AuditEventService
```

#### Dominio

```text
AuditEvent
AuditAction
AuditEntityType
AuditEventRepository
```

#### Infraestructura

```text
AuditEventJpaEntity
SpringDataAuditEventRepository
AuditEventRepositoryAdapter
```

#### Reglas críticas

- El puerto público expone append, no update ni delete.
- Guardar actorUserId, acción, entidad, entityId, fecha, sucursal, motivo y payload seguro cuando aplique.
- No guardar contraseñas, tokens o datos sensibles completos en payload.
- Eventos mínimos: USER_CREATED, USER_ROLE_CHANGED, STUDENT_CREATED, STUDENT_UPDATED,
STUDENT_PHOTO_CHANGED, MEMBERSHIP_CREATED, MEMBERSHIP_RENEWED, PAYMENT_REGISTERED,
CASH_REGISTER_OPENED, CASH_REGISTER_CLOSED, ATTENDANCE_REGISTERED y
ATTENDANCE_BLOCKED.
## 7. API REST de la Fase 1

Todos los endpoints usan JSON salvo carga/descarga de archivos. Las rutas se agrupan por dominio y se versionan desde el
inicio.
```text
# Auth

POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET /api/v1/auth/me
# Usuarios y roles

GET /api/v1/users
POST /api/v1/users
PATCH /api/v1/users/{id}/status
PUT /api/v1/users/{id}/roles
GET /api/v1/roles
# Alumnos

GET /api/v1/students
POST /api/v1/students
GET /api/v1/students/{id}
PUT /api/v1/students/{id}
PATCH /api/v1/students/{id}/status
POST /api/v1/students/{id}/photo
# Planes y membresías

GET /api/v1/plans
POST /api/v1/plans
PUT /api/v1/plans/{id}
GET /api/v1/memberships
POST /api/v1/memberships
GET /api/v1/memberships/student/{studentId}
POST /api/v1/memberships/{id}/renew
# Caja

POST /api/v1/cash-register/open
GET /api/v1/cash-register/current
POST /api/v1/cash-register/close
# Pagos y recibos

POST /api/v1/payments
GET /api/v1/payments
GET /api/v1/payments/{id}
GET /api/v1/payments/{id}/receipt
# Asistencia e instructor

POST /api/v1/attendance/check-in
GET /api/v1/attendance/today
GET /api/v1/attendance/student/{studentId}
GET /api/v1/instructor/today
# Reportes y archivos

GET /api/v1/reports/admin/dashboard
GET /api/v1/media/{fileId}
```

### 7.1 Convención de errores

```text
{
"code": "MEMBERSHIP_EXPIRED",
"message": "La membresía del alumno está vencida.",
"details": {
"studentId": "uuid",
"expiredOn": "2026-07-10"
},
"timestamp": "2026-07-13T12:30:00Z",
"traceId": "trace-id"
}
```

```text
Situación | HTTP | Código de dominio sugerido
Validación de DTO | 400 | VALIDATION_ERROR
JWT ausente o inválido | 401 | UNAUTHENTICATED
Permiso insuficiente | 403 | FORBIDDEN
Entidad inexistente | 404 | STUDENT_NOT_FOUND,
PAYMENT_NOT_FOUND, etc.
Conflicto de estado o duplicidad | 409 | ALREADY_CHECKED_IN,
CASH_REGISTER_ALREADY_OPEN
Regla de negocio no cumplida | 422 | MINOR_REQUIRES_GUARDIAN,
MEMBERSHIP_EXPIRED
```

## 8. Contratos y dependencias entre módulos

### 8.1 Contratos públicos permitidos

```text
organization.BranchDirectory
organization.BranchSnapshot
identity.UserDirectory
identity.UserSnapshot
students.StudentDirectory
students.StudentSnapshot
memberships.MembershipDirectory
memberships.MembershipSnapshot
memberships.MembershipRenewal
cash.CashRegisterOperations
cash.CashRegisterSnapshot
media.MediaStorage
media.StoredFileSnapshot
notifications.NotificationPublisher
audit.AuditRecorder
```

### 8.2 Dependencias permitidas

```text
organization -> shared
identity -> shared, organization, audit
media -> shared
students -> shared, media, audit
memberships -> shared, students, audit
cash -> shared, organization, audit
payments -> shared, students, memberships, cash, notifications, audit
attendance -> shared, students, memberships, audit
reports -> shared; consultas SQL de solo lectura
notifications -> shared
audit -> shared
```

### 8.3 Importaciones prohibidas

```text
// PROHIBIDO fuera del módulo students
import mx.com.gymbox.gymbox_backend.students.infrastructure.persistence.StudentJpaEntity;
// PROHIBIDO desde payments
import mx.com.gymbox.gymbox_backend.memberships.infrastructure.persistence.MembershipJpaEntity;
// CORRECTO
import mx.com.gymbox.gymbox_backend.students.StudentDirectory;
import mx.com.gymbox.gymbox_backend.memberships.MembershipRenewal;
```

- students no depende de memberships.
- memberships no depende de payments.
- cash no depende de payments.
- audit no depende de identity; recibe actorUserId como UUID o value object.
- notifications no conoce entidades de pagos; recibe mensajes serializables.
## 9. Flujos críticos de negocio

### 9.1 Login, refresh y logout

## 1. AuthController valida el formato de LoginRequest.

## 2. AuthenticationService busca el usuario y verifica estado y password.

## 3. TokenService emite access token y refresh token.

## 4. RefreshSessionService guarda únicamente el hash del refresh token con expiración y metadatos.

## 5. La respuesta entrega access token, refresh token y datos mínimos del usuario.

## 6. En refresh se revoca/rota la sesión anterior y se crea una nueva.

## 7. En logout se revoca la sesión de refresh correspondiente.

### 9.2 Alta de alumno

## 1. Validar permiso ALUMNOS_CREAR.

## 2. Validar DTO, normalizar correo/teléfono y fecha de nacimiento.

## 3. AgeCalculator calcula edad usando Clock.

## 4. MinorGuardianPolicy exige tutor cuando corresponde.

## 5. Student crea el agregado y StudentRepository lo persiste.

## 6. Si llega una foto, StudentPhotoService usa MediaStorage y vincula fileId.

## 7. AuditRecorder agrega STUDENT_CREATED y, si aplica, STUDENT_PHOTO_CHANGED.

## 8. Responder StudentResponse sin exponer entidades JPA.

### 9.3 Registro transaccional de pago

RegisterPaymentService.register es el orquestador y debe ejecutarse con @Transactional.
## 1. Validar Idempotency-Key.

## 2. Validar permiso PAGOS_REGISTRAR.

## 3. Consultar alumno mediante StudentDirectory.

## 4. Consultar plan/membresía mediante contratos públicos.

## 5. Si PaymentMethod = CASH, exigir caja abierta.

## 6. Generar folio único en PostgreSQL.

## 7. Crear payment y payment_items.

## 8. Renovar la membresía dentro de la misma transacción.

## 9. Registrar cash_movement cuando el método es efectivo.

## 10. Crear receipt en estado pendiente/listo.

## 11. Insertar audit_event PAYMENT_REGISTERED.

## 12. Insertar notification_outbox.

## 13. Commit.

## 14. NotificationOutboxWorker envía o simula el comprobante después del commit.

### 9.4 Check-in

## 1. Validar permiso ASISTENCIAS_REGISTRAR.

## 2. Consultar StudentSnapshot y MembershipSnapshot.

## 3. Rechazar alumno inactivo.

## 4. Detectar duplicidad para la misma sesión o día según la regla.

## 5. Si la membresía está vencida, devolver BLOCKED_EXPIRED_MEMBERSHIP antes de insertar asistencia.

## 6. Si se permite, guardar AttendanceRecord y snapshots históricos.

## 7. Registrar ATTENDANCE_REGISTERED o ATTENDANCE_BLOCKED en audit.

## 8. Responder foto, nombre, edad, nivel, vigencia y decisión.

### 9.5 Dashboard administrativo

AdminDashboardQueryService ejecuta consultas de solo lectura y devuelve una proyección agregada. No modifica alumnos,
membresías, pagos ni asistencias.
```text
{
"activeStudents": 92,
"expiredStudents": 8,
"paymentsToday": 14,
"incomeToday": 7350.00,
"attendanceToday": 31,
"incomeByMethod": {
"CASH": 4200.00,
"TRANSFER": 2650.00,
"MANUAL_CARD": 500.00
}
}
```

## 10. Seguridad y autorización

- SecurityConfiguration declara SecurityFilterChain y @EnableMethodSecurity.
- Rutas públicas: login, refresh y health check. Logout requiere contexto o refresh token válido según diseño.
- El resto de /api/v1 exige JWT.
- SecurityConfiguration convierte permissions en authorities y roles en authorities con prefijo ROLE_.
- Los casos de uso sensibles usan @PreAuthorize; el controller no es la única barrera.
- La contraseña se codifica con Argon2id (19 MiB, 2 iteraciones, paralelismo 1); nunca se registra en logs.
- Tras 5 fallos en 24 horas la cuenta se bloquea 15 minutos; desde 10 fallos, 60 minutos.
- El refresh token se rota, se almacena como SHA-256 y la reutilización revoca toda la familia.
- El backend valida sucursal, estado del usuario y permiso para cada operación sensible.
- CORS se restringe por ambiente; no usar wildcard con credenciales en producción.
```text
package mx.com.gymbox.gymbox_backend.students.application;
import org.springframework.security.access.prepost.PreAuthorize;
public class StudentCommandService {
@PreAuthorize("hasAuthority('ALUMNOS_CREAR')")
public StudentResponse create(CreateStudentCommand command) {
// reglas y persistencia
return null;
}
}
```

### 10.1 Bootstrap del primer administrador

- Variables sugeridas: ADMIN_INITIAL_EMAIL y ADMIN_INITIAL_PASSWORD.
- AdminBootstrapRunner solo se habilita en local/dev o mediante propiedad explícita.
- Antes de crear, consulta si ya existe un usuario administrativo.
- Codifica la contraseña y asigna el rol ADMINISTRADOR.
- Marca debe_cambiar_password = true.
- Nunca imprime la contraseña ni la inserta en una migración versionada.
## 11. Persistencia, auditoría, outbox y archivos

### 11.1 Separación dominio/JPA

```text
Student -> modelo de dominio sin anotaciones JPA
StudentJpaEntity -> representación de tabla
StudentPersistenceMapper -> conversión entre ambos
StudentRepository -> puerto del dominio
StudentRepositoryAdapter -> implementación del puerto
SpringDataStudentRepository -> interfaz JpaRepository
```

El mismo patrón se aplica a usuarios, membresías, pagos, caja, asistencia, outbox y auditoría.
### 11.2 Reglas de datos

- Identificadores UUID generados en servidor o PostgreSQL.
- Fechas de evento y auditoría con TIMESTAMPTZ; fechas civiles como nacimiento o inicio de vigencia con DATE.
- Importes con NUMERIC/BigDecimal; nunca float o double.
- Correos con unicidad case-insensitive.
- Bajas lógicas para usuarios, alumnos, planes y roles; no borrar historial transaccional.
- Pagos y eventos de auditoría son inmutables a nivel de negocio.
- Los listados usan paginación, filtros y orden estable.
### 11.3 Auditoría técnica y de negocio

```text
Tipo | Campos/ejemplos | Objetivo
Auditoría JPA | createdAt, createdBy, updatedAt, | Trazabilidad técnica de registros mutables.
updatedBy
Auditoría append-only | PAYMENT_REGISTERED, | Evidencia de operaciones sensibles; no se
MEMBERSHIP_RENEWED, | sobrescribe ni elimina.
ROLE_CHANGED
```

### 11.4 Outbox

El recibo y su mensaje outbox se guardan dentro de la transacción del pago. Un worker independiente procesa mensajes
confirmados después del commit. Un fallo de correo o WhatsApp no revierte el pago.
### 11.5 Archivos

```text
data/media/
`-- students/
`-- {studentId}/
`-- {fileId}.jpg
```

La ruta anterior es válida para local. En producción el adaptador puede cambiar a MinIO o S3 sin modificar students.
### 11.6 Estrategia adoptada de schemas PostgreSQL

El MVP usa schemas lógicos desde la migración inicial: `infra`, `organization`, `auth`, `people`, `billing`,
`tracking`, `media`, `audit` y `notification`. Flyway mantiene su historial en `infra`; las tablas y funciones de
aplicación se califican explícitamente con su schema correspondiente.

La migración inicial es `V1__crear_schemas_seguridad_y_configuracion_base.sql` y constituye la línea base del
proyecto. Ya puede existir en ambientes locales; una vez aplicada en cualquier ambiente, no debe editarse. Cualquier
corrección deberá hacerse en una nueva migración versionada.
## 12. Recursos y migraciones

```text
src/main/resources/
|-- application.properties
`-- db/migration/
|-- V1__crear_schemas_seguridad_y_configuracion_base.sql
|-- V2__fortalecer_seguridad_de_identidad.sql
|-- V3__crear_alumnos_tutores_y_contactos.sql
|-- V4__crear_planes_y_membresias.sql
|-- V5__crear_caja_basica_pagos_y_recibos.sql
|-- V6__crear_asistencias_y_clases_basicas.sql
`-- V7__crear_media_auditoria_y_outbox.sql
```

- Flyway es el único mecanismo para evolucionar el esquema de aplicación.
- Hibernate ddl-auto debe permanecer en validate fuera de pruebas aisladas.
- No crear tablas operativas desde docker-entrypoint-initdb.d.
- Cada migración se prueba desde una base vacía y sobre la versión anterior.
- Una migración aplicada en un ambiente compartido no se edita; se corrige con una nueva versión.
## 13. Estrategia de pruebas

```text
src/test/java/mx/com/gymbox/gymbox_backend/
|-- ArchitectureTest.java
|-- identity/
| |-- AuthenticationServiceTest.java
| `-- AuthFlowIntegrationTest.java
|-- students/
| |-- AgeCalculatorTest.java
| |-- MinorGuardianPolicyTest.java
| `-- StudentRepositoryIntegrationTest.java
|-- memberships/
| |-- MembershipExpirationPolicyTest.java
| `-- MembershipRenewalIntegrationTest.java
|-- cash/
| `-- CashRegisterIntegrationTest.java
|-- payments/
| |-- RegisterPaymentServiceTest.java
| `-- RegisterPaymentIntegrationTest.java
|-- attendance/
| |-- CheckInPolicyTest.java
| `-- CheckInIntegrationTest.java
`-- reports/
`-- AdminDashboardIntegrationTest.java
```

### 13.1 Niveles de prueba

```text
Nivel | Herramienta/alcance | Ejemplos
Unitarias | JUnit 5; sin Spring cuando sea posible | AgeCalculator, MinorGuardianPolicy,
MembershipExpirationPolicy, CheckInPolicy.
Aplicación | Mocks/fakes de puertos | AuthenticationService,
RegisterPaymentService y validación de
orquestación.
Integración | Spring Boot + Testcontainers PostgreSQL | Repositorios, Flyway, JWT, transacciones,
folios, índices y consultas.
API | MockMvc o WebTestClient sobre MVC | Códigos HTTP, validaciones, permisos y
contratos JSON.
E2E | Entorno local completo | Alumno -> membresía -> caja -> pago ->
check-in -> dashboard.
```

No utilizar H2 como sustituto principal de PostgreSQL para pruebas de integración, porque no reproduce exactamente UUID,
SQL, restricciones, secuencias e índices de PostgreSQL.
## 14. Spring Modulith como verificación opcional

Spring Modulith encaja con esta estructura porque cada subpaquete directo del paquete raíz puede tratarse como un módulo.
Es opcional para ejecutar el MVP, pero recomendable para detectar ciclos y accesos indebidos.
```text
package mx.com.gymbox.gymbox_backend;
import org.junit.jupiter.api.Test;
```

```text
import org.springframework.modulith.core.ApplicationModules;
class ArchitectureTest {
@Test
void modulesMustRespectBoundaries() {
ApplicationModules
.of(GymboxBackendApplication.class)
.verify();
}
}
```

- Usar una versión de Spring Modulith compatible con la versión concreta de Spring Boot del proyecto.
- Agregar @ApplicationModuleTest para probar módulos de forma aislada cuando aporte valor.
- La prueba de arquitectura debe ejecutarse en CI.
## 15. Orden de implementación y Definition of Done

### 15.1 Orden recomendado

## 1. shared, organization e identity; login, refresh, logout y permisos.

## 2. media y students; alta de alumno con foto y tutor.

## 3. memberships; planes, vigencia y renovación.

## 4. cash básico y payments; folio, recibo, idempotencia y transacción completa.

## 5. attendance; check-in y panel básico del instructor.

## 6. reports; dashboard simple.

## 7. notifications simuladas y audit mínimo integrados en los flujos.

## 8. Prueba E2E completa y endurecimiento de validaciones/seguridad.

### 15.2 Definition of Done por corte vertical

- Migración Flyway creada y probada desde base vacía.
- Dominio y políticas unit-tested.
- Puerto y adaptador de persistencia implementados.
- Caso de uso transaccional implementado.
- Endpoint protegido con permiso correcto.
- DTO validados y errores normalizados.
- Prueba de integración con PostgreSQL real mediante Testcontainers.
- OpenAPI actualizado.
- Evento de auditoría agregado cuando la operación es sensible.
- No hay imports de infrastructure entre módulos ni ciclos de dependencias.
### 15.3 Recorrido E2E mínimo

```text
Crear/obtener administrador
- > iniciar sesión
- > registrar alumno con foto
- > crear plan
- > crear membresía
- > abrir caja
- > registrar pago
- > renovar membresía
- > registrar asistencia
- > consultar dashboard
```

Próximo corte recomendado: crear un esqueleto compilable de shared + organization + identity; después continuar con
media + students.
## 16. Manifiesto legible por IA

Este bloque resume decisiones canónicas en un formato estable. No sustituye las reglas detalladas de las secciones
anteriores.
```text
document:
id: GYMBOX-BE-F1-BLUEPRINT
version: "1.1"
language: es-MX
architecture: modular-monolith
phase: "Fase 1 - MVP operativo administrativo"
java:
version: 21
packageRoot: mx.com.gymbox.gymbox_backend
mainClass: mx.com.gymbox.gymbox_backend.GymboxBackendApplication
```

```text
api:
basePath: /api/v1
style: REST-JSON
versioned: true
persistence:
database: PostgreSQL
migrations: Flyway
orm: Spring Data JPA
ddlAuto: validate
sourceOfTruth: PostgreSQL
modules:
- shared
- organization
- identity
- media
- students
- memberships
- cash
- payments
- attendance
- reports
- notifications
- audit
layering:
moduleLayers: [api, application, domain, infrastructure]
domainDependsOnFrameworks: false
crossModuleInfrastructureImportsAllowed: false
criticalRules:
- permissions-validated-in-backend
- age-derived-from-birth-date
- minor-requires-guardian-when-rule-active
- payment-has-unique-folio
- cash-payment-requires-open-cash-register
- payment-membership-cash-receipt-audit-outbox-are-atomic
- payment-never-physically-deleted
- audit-events-append-only
- file-binaries-outside-postgresql
- notifications-sent-after-commit
phase1OutOfScope:
- robust-cash-reconciliation
- payment-cancellations
- authorized-discounts
- full-sports-module
- final-student-app
- real-whatsapp-integration
- real-card-terminal-integration
- microservices
acceptanceFlow:
- authenticate-admin
- create-student-with-photo
- create-plan
- create-membership
- open-cash-register
- register-payment
- renew-membership
- check-in-student
- read-admin-dashboard
```

## 17. Trazabilidad con los documentos fuente

```text
Requisito | Fuente | Implementación en este documento
Monolito modular y capas por dominio | Arquitectura, sección 6, páginas 5-6 | Secciones 3, 4, 5, 6 y 8
PostgreSQL como fuente única de verdad | Arquitectura, secciones 1-3, páginas 3-4 | Secciones 1, 11 y 12
REST bajo /api/v1 | Arquitectura, principios de diseño, página 3 | Secciones 1 y 7
Auditoría append-only y pagos no eliminables | Arquitectura, principios de diseño, página 3 | Secciones 1, 6.8, 6.12 y 11
Pago transaccional con caja, membresía, | Arquitectura, límites transaccionales y flujo de | Sección 9.3
recibo, audit y outbox | pago
Alumno con foto, fecha de nacimiento, tutor y | Roadmap, Fase 1, página 4 | Secciones 4, 6.4 y 6.5
emergencia
Planes, membresías, pagos y folio | Roadmap, Fase 1, página 4 | Secciones 6.6, 6.8 y 9.3
Check-in con foto, edad, nivel y estado de | Roadmap, criterios de aceptación Fase 1, | Secciones 6.9 y 9.4
membresía | página 4
Caja robusta y auditoría completa fuera de | Roadmap, no incluido todavía y Fase 2, | Secciones 1.4, 6.7 y 15
Fase 1 | páginas 5-6
```

### 17.1 Referencias

- Arquitectura de Aplicación - Plataforma para gimnasio de box. Versión 1.0, 2 de julio de 2026.
- Roadmap de Producto y Entrega - Plan por fases para la plataforma del gimnasio de box. Versión 1.0, 2 de julio de 2026.
- V1__crear_schemas_seguridad_y_configuracion_base.sql - migración inicial de schemas, seguridad y configuración base.
### 17.2 Checklist antes de comenzar a programar

- Confirmar que el paquete raíz del repositorio es mx.com.gymbox.gymbox_backend.
- Mantener GymboxBackendApplication.java en el paquete raíz.
- Aceptar el mapeo temporal de roles de V1 o crear una migración nueva antes de implementar autorización.
- Mantener los schemas lógicos definidos en V1; no mezclar tablas operativas en `public`.
- Verificar que V1 se ejecuta desde una base vacía y que Hibernate opera con ddl-auto=validate.
- Definir variables de entorno para JWT, administrador inicial, PostgreSQL y almacenamiento local.
- Crear primero shared, organization e identity y mantener los demás módulos sin dependencias cíclicas.
- Activar pruebas de arquitectura y Testcontainers en el pipeline.
- Implementar el primer corte vertical completo: media + students.
- No añadir capacidades de Fase 2 o Fase 3 hasta cerrar los criterios de aceptación del MVP.
