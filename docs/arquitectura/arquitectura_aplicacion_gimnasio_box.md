---
title: "Arquitectura aplicacion gimnasio box"
source_pdf: "arquitectura_aplicacion_gimnasio_box.pdf"
converted_at_utc: "2026-07-15T06:35:48Z"
pdf_title: "Arquitectura de Aplicacion - Gimnasio de Box"
conversion_note: "Conversión textual desde PDF para uso en repositorio y Codex; tablas y bloques de código se conservaron en Markdown de forma aproximada."
---

# Arquitectura de Aplicacion

### Plataforma para gimnasio de box: app movil de alumno e instructor, web administrativa

y deportiva, backend Spring Boot monolitico y PostgreSQL.
```text
Documento | Arquitectura tecnica, deployment, CI/CD y operacion
Stack | React Native + Angular + Spring Boot 4.1.0 + PostgreSQL 17
Arquitectura | Monolito modular
Version | 1.0
Fecha | 2 de julio de 2026
```

Uso previsto: documento base para alinear producto, desarrollo, operacion, instructores y direccion del
gimnasio de box.
Fuente deportiva interna: el modulo deportivo usa como referencia el ciclo de 12 semanas, evaluaciones periodicas, RPE, niveles y
seguimiento planteados en el programa de entrenamiento de boxeo proporcionado por el usuario.
## Indice de contenidos

## 1. Proposito, alcance y objetivos de arquitectura

## 2. Principios de diseno y decisiones base

## 3. Vista general del sistema

## 4. Frontend movil React Native

## 5. Frontend web Angular

## 6. Backend Spring Boot como monolito modular

## 7. Arquitectura de datos en PostgreSQL

## 8. API REST, contratos e integraciones

## 9. Seguridad, roles, permisos y auditoria

## 10. Flujos criticos de negocio

## 11. Notificaciones, archivos y modo offline

## 12. Deployment inicial y ambientes

## 13. CI/CD y estrategia de releases

## 14. Observabilidad, soporte y continuidad operativa

## 15. Pruebas, calidad y criterios de aceptacion

## 16. Escalabilidad futura y ruta hacia microservicios si aplica

## 17. Anexos tecnicos

## 1. Proposito, alcance y objetivos de arquitectura

Este documento define la arquitectura objetivo para la plataforma digital del gimnasio de box. La solucion contempla
una app movil desarrollada en React Native para alumnos e instructores, una aplicacion web en Angular para
administracion y direccion deportiva, un backend monolitico modular con Spring Boot y una base de datos PostgreSQL
como fuente unica de verdad.
El sistema debe resolver simultaneamente control administrativo, control financiero, seguimiento deportivo,
personalizacion del entrenamiento y trazabilidad antifraude. La arquitectura se disena para iniciar simple, operar con
bajo costo y dejar separaciones internas claras para poder escalar sin reescribir todo el producto.
Principio rector: todo pago, asistencia, evaluacion, observacion tecnica y cambio sensible debe quedar
conectado al perfil del alumno y auditado en el backend.
```text
Objetivo | Implicacion tecnica
Controlar alumnos y membresias | Ficha unica de alumno con foto, fecha de nacimiento, estado de membresia, historial y
vencimiento calculado.
Evitar omisiones o robo de efectivo | Pagos transaccionales, folio unico, caja abierta obligatoria, corte de caja, auditoria y
comprobante automatico.
Dar seguimiento deportivo | Modulo de ciclos, niveles, grupos, evaluaciones, RPE, dolor, observaciones y progreso.
Personalizar experiencia del alumno | App de alumno con objetivos, feedback, progreso, logros y recordatorios.
Mantener arquitectura simple al inicio | Backend monolitico modular, una base PostgreSQL y despliegue inicial con Docker Compose.
Preparar crecimiento | Separacion por dominios internos, contratos REST, eventos internos y outbox para
notificaciones.
```

## 2. Principios de diseno y decisiones base

```text
Decision | Descripcion | Razon
Monolito modular | Una sola aplicacion Spring Boot con modulos internos | Reduce complejidad inicial y mantiene fronteras para
separados por dominio. | crecer.
PostgreSQL como fuente unica | Toda informacion operativa, financiera y deportiva vive | Evita duplicidad y facilita reportes cruzados.
de verdad | en una base central.
REST JSON versionado | Todas las APIs publicas bajo /api/v1. | Facilita consumo desde mobile y web.
Auditoria append-only | Las acciones sensibles no se sobrescriben ni eliminan. | Necesario para confianza, caja, membresias y
permisos.
Pagos no eliminables | Un pago se cancela con reversa y motivo, nunca se | Control antifraude y conciliacion.
borra.
Edad calculada | Guardar fecha de nacimiento; calcular edad y categoria | Permite reglas deportivas y estadistica confiable.
automaticamente.
Offline limitado | Observaciones y asistencia pueden tener cache; pagos | Reduce riesgo financiero.
y caja requieren conexion.
Seguridad en backend | El frontend oculta opciones, pero el backend decide | Evita manipulaciones desde cliente.
permisos.
```

No se recomienda iniciar con microservicios. El valor inicial esta en lanzar un sistema confiable y auditable, no
en agregar complejidad operacional.
## 3. Vista general del sistema

La plataforma se divide en canales de uso, un API central y componentes de soporte. La app movil cubre la operacion
diaria de alumnos e instructores. La web cubre administracion, direccion deportiva, reportes y configuracion. El
backend contiene toda la logica de negocio y PostgreSQL consolida los datos.
```text
[Alumno] [Instructor]
| |
+---- React Native App ----+
|
[Admin / Dueno] [Director deportivo]
| |
+-------- Angular Web ------+
|
[Spring Boot API]
|
+-------------------+-------------------+
| | |
[PostgreSQL] [File Storage] [Notificaciones]
| | |
```

```text
Datos y audit Fotos, videos WhatsApp, email,
financiero recibos, caja push notifications
```

```text
Componente | Tecnologia | Responsabilidad
App movil | React Native | Portal de alumno e instructor, check-in, clase del dia, progreso y
feedback.
Web | Angular | Administracion, caja, alumnos, membresias, pagos, reportes y modulo
deportivo.
API | Spring Boot | Reglas de negocio, seguridad, transacciones, auditoria e
integraciones.
Base de datos | PostgreSQL | Persistencia central para auth, alumnos, pagos, entrenamiento,
tracking y audit.
Archivos | S3, MinIO o disco controlado | Fotos de alumnos, comprobantes, recibos, videos tecnicos y
evidencias de caja.
Notificaciones | WhatsApp, email, push | Comprobantes, vencimientos, alertas de caja, feedback y progreso.
```

## 4. Frontend movil React Native

Se recomienda una sola app movil React Native con navegacion y permisos por rol. Un alumno no debe ver funciones
de instructor; un instructor no debe ver configuracion administrativa completa. La app debe estar optimizada para
rapidez en clase, uso con una mano y lectura visual mediante fotos, estados y alertas.
### 4.1 Modulo de alumno

```text
Pantalla | Funcion principal | Valor para el negocio
Inicio | Membresia, vencimiento, objetivo semanal, proxima clase y | El alumno percibe seguimiento y claridad.
ultimo feedback.
Mi perfil | Foto, datos, edad, nivel, objetivo personal y contacto de | Centraliza identidad y personalizacion.
emergencia.
Mi membresia | Plan, fecha de vencimiento, historial de pagos y comprobantes. | Reduce preguntas y conflictos de pago.
Mi progreso | Asistencias, evaluaciones, nivel, logros y cambios de tecnica. | Aumenta retencion por progreso visible.
Bienestar | Registro de RPE, dolor, sueno y molestias. | Informa al instructor y reduce riesgo de lesion.
Feedback | Observaciones del instructor y tareas de la proxima clase. | Crea trato personalizado en entrenamiento grupal.
Notificaciones | Vencimientos, comprobantes, evaluaciones y mensajes de | Mejora cobranza y adherencia.
seguimiento.
```

### 4.2 Modulo de instructor

El panel de instructor debe minimizar captura manual. La mayoria de las acciones deben ser de uno o dos toques:
registrar asistencia, ver estado de pago, registrar RPE, marcar molestia, agregar observacion y cerrar caja.
```text
Pantalla | Funcion principal | Alertas visibles
Inicio de turno | Abrir turno, ver clase actual, alumnos esperados y | Caja no abierta, pagos pendientes, evaluaciones del
pendientes. | dia.
Clase del dia | Objetivo, RPE meta, plan de sesion y subgrupos. | Alumnos vencidos, menores, lesiones, restricciones.
Lista de alumnos | Foto, edad, nivel, membresia, asistencia y objetivo individual. | Vencido, lesion activa, menor sin permiso, baja
asistencia.
Check-in | Registrar asistencia por busqueda, QR o lista. | Bloqueo si vencido salvo autorizacion.
Ficha rapida | Resumen deportivo y administrativo del alumno. | Restricciones, feedback anterior, proxima evaluacion.
Registro de pago | Cobro autorizado, folio y renovacion automatica. | Caja cerrada, permiso insuficiente, descuento no
autorizado.
Cierre de caja | Efectivo esperado, contado, diferencia y foto de evidencia. | Faltante, sobrante, cierre tardio.
Incidentes | Registrar lesion, golpe, molestia o restriccion temporal. | Dolor alto, posible conmocion, detener actividad.
Vista rapida sugerida para instructor
```

```text
- 
Clase: Martes 7:00 pm
Objetivo: Defensa, cabeceo y resistencia especifica
RPE meta: 6-7
Presentes: 18
Alertas:
- Diego: membresia vencida
- Mario: cuidar rodilla
- Luis: menor de edad, sin sparring intenso
- Ana: evaluar defensa hoy
```

## 5. Frontend web Angular

La web Angular debe organizarse por modulos funcionales y permisos. El uso principal sera de dueno, administracion y
direccion deportiva. Angular permite formularios complejos, dashboards, tablas, filtros y reportes con mayor comodidad
que el movil.
### 5.1 Modulo administrativo

```text
Submodulo | Funciones
Dashboard administrativo | Ingresos del dia, alumnos activos, vencidos, asistencia, pagos por metodo, caja pendiente y alertas.
Alumnos | Alta, edicion, foto, fecha de nacimiento, tutor, contacto, objetivo, restricciones y estado.
Membresias | Planes, vigencias, renovaciones, congelamientos, paquetes de clases y vencimientos.
Pagos | Registro, busqueda, comprobantes, cancelaciones controladas y descuentos autorizados.
Caja | Apertura, cierre, diferencia, foto de efectivo, entrega al dueno y conciliacion.
Usuarios y permisos | Roles, permisos granulares, instructores, administradores y dispositivos.
Reportes financieros | Ingresos, efectivo, transferencias, faltantes, cancelaciones, vencimientos y retencion.
Auditoria | Consulta de acciones sensibles y trazabilidad por usuario, fecha y entidad.
```

### 5.2 Modulo deportivo

```text
Submodulo | Funciones
Programas | Crear programas base, por ejemplo ciclo escolar de box de 12 semanas.
Ciclos y mesociclos | Base y adaptacion, desarrollo especifico, integracion y realizacion.
Sesiones | Plantillas por dia, nivel, RPE meta, bloques, ejercicios y progresiones.
Grupos | Agrupar por edad, nivel, objetivo, horario, peso y restricciones.
Evaluaciones | Semana 0, 4, 8 y 12; tecnica, resistencia, fuerza, potencia, bienestar y decision.
RPE y bienestar | Carga de sesion, dolor, sueno, fatiga y alertas de recuperacion.
Observaciones | Feedback tecnico, correccion para siguiente clase y bitacora individual.
Dashboard deportivo | Edad, nivel, asistencia, progreso, lesiones, RPE, evaluaciones pendientes y riesgo de abandono.
```

### 5.3 Estructura Angular sugerida

```text
/src/app
core/ servicios globales, auth, interceptors, guards
shared/ componentes UI, pipes, validators, tables
features/
admin/ alumnos, membresias, pagos, caja, reportes
sports/ ciclos, grupos, evaluaciones, seguimiento
security/ usuarios, roles, permisos, sesiones
dashboard/ KPIs por rol
layout/ menus, topbar, shell por rol
data-access/ clientes REST y modelos DTO
```

El estado puede iniciar con servicios RxJS y signals. NgRx solo se recomienda si los flujos y estados compartidos se
vuelven complejos. Las reglas criticas deben vivir en backend, no en guards o componentes.
## 6. Backend Spring Boot como monolito modular

El backend se despliega como una sola aplicacion, pero se organiza por dominios. Cada modulo debe tener capas
internas: api, application, domain e infrastructure. Esta organizacion evita acoplamiento, facilita pruebas y permite
extraer un modulo en el futuro si fuera necesario.
```text
com.gymbox
identity/
api/ application/ domain/ infrastructure/
students/
api/ application/ domain/ infrastructure/
memberships/
api/ application/ domain/ infrastructure/
payments/
api/ application/ domain/ infrastructure/
attendance/
api/ application/ domain/ infrastructure/
training/
api/ application/ domain/ infrastructure/
evaluations/
```

```text
api/ application/ domain/ infrastructure/
reports/
api/ application/ infrastructure/
notifications/
application/ domain/ infrastructure/
audit/
application/ domain/ infrastructure/
media/
application/ domain/ infrastructure/
shared/
config/ security/ exceptions/ events/ utils/
```

### 6.1 Modulos de backend

```text
Modulo | Responsabilidad principal | Reglas criticas
Identity | Usuarios, login, refresh token, roles y permisos. | Permisos siempre validados en backend.
Students | Ficha de alumno, foto, edad, tutor, objetivo, nivel y restricciones. | Edad desde fecha de nacimiento; menor requiere
tutor.
Memberships | Planes, vigencias, paquetes, renovaciones y vencimientos. | Vencimiento se modifica por pago, congelamiento o
ajuste autorizado.
Payments | Pagos, folios, cancelaciones, recibos y relacion con membresia. | Pago no se borra; se cancela con motivo y reversa.
Cash | Turnos de caja, efectivo esperado, contado, diferencias y entrega. | Efectivo requiere caja abierta y cierre obligatorio.
Attendance | Check-in, validacion de membresia, edad, nivel y restricciones. | Vencidos bloqueados salvo pago o autorizacion
auditada.
Training | Programas, ciclos, semanas, sesiones, ejercicios y grupos. | Personalizacion por edad, nivel, objetivo y
restricciones.
Evaluations | Evaluaciones fisicas, tecnicas, RPE, bienestar y progreso. | Subir nivel por criterios, no por antiguedad.
Reports | Dashboards financieros y deportivos. | Consultas optimizadas y control de permiso por
reporte.
Notifications | WhatsApp, email, push y plantillas. | Outbox para no romper transacciones de negocio.
Audit | Bitacora append-only de acciones sensibles. | No se actualiza ni elimina; solo inserciones.
Media | Fotos, videos, recibos, comprobantes y evidencias. | Archivos protegidos por permisos y referencias en
BD.
```

### 6.2 Capas internas

```text
Capa | Contenido | No debe hacer
api | Controllers REST, DTOs de entrada/salida, validaciones | No contener reglas de negocio complejas.
superficiales.
application | Casos de uso, transacciones, orquestacion entre | No depender de detalles de HTTP.
repositorios y servicios.
domain | Entidades, value objects, reglas, enums y eventos de | No depender de frameworks ni persistencia.
dominio.
infrastructure | Repositorios JPA, clientes externos, storage, email, | No tomar decisiones de negocio.
WhatsApp y adaptadores.
```

### 6.3 Limites transaccionales

Las operaciones financieras y de caja deben ejecutarse en transacciones atomicas. Por ejemplo, registrar pago en
efectivo debe crear pago, renovar membresia, crear movimiento de caja, crear recibo pendiente y registrar auditoria en
una sola transaccion. El envio de WhatsApp o email debe salir por outbox despues del commit.
```text
Caso de uso: registrar pago en efectivo
```

## 1. Validar usuario y permiso payment.create

## 2. Validar caja abierta para el usuario o sucursal

## 3. Crear payment con folio unico

## 4. Crear payment_item y aplicar plan

## 5. Renovar membresia o sumar clases

## 6. Sumar efectivo esperado al cash_register_session

## 7. Crear audit_event payment.created

## 8. Crear notification_outbox receipt.pending

## 9. Commit

## 10. Worker envia comprobante y marca outbox como sent

## 7. Arquitectura de datos en PostgreSQL

PostgreSQL se organiza en esquemas logicos para separar dominios sin crear multiples bases. Esta separacion facilita
permisos, migraciones y lectura del modelo. No se recomienda guardar binarios grandes directamente en PostgreSQL;
la base almacena metadata y referencias a storage.
```text
Schema | Contenido
auth | Usuarios, roles, permisos, refresh tokens y dispositivos.
people | Alumnos, tutores, contactos, restricciones y notas medicas/deportivas.
billing | Planes, membresias, pagos, recibos, caja y conciliacion.
training | Programas, ciclos, mesociclos, semanas, sesiones, ejercicios y grupos.
tracking | Asistencia, evaluaciones, RPE, bienestar, lesiones, observaciones y progreso.
notification | Plantillas, mensajes, outbox y bitacora de envios.
audit | Eventos de auditoria append-only.
media | Metadata de fotos, videos, comprobantes, documentos y evidencias.
```

### 7.1 Entidades principales

```text
Dominio | Tablas principales
Auth | users, roles, permissions, user_roles, role_permissions, refresh_tokens, user_devices
Alumnos | students, student_guardians, student_contacts, student_restrictions, student_goals, student_level_history
Membresias | plans, memberships, membership_movements, discounts, promotions
Pagos y caja | payments, payment_items, payment_cancellations, receipts, cash_register_sessions, cash_movements,
cash_reconciliations, cash_handovers
Asistencia | class_sessions, attendance_records, attendance_overrides
Entrenamiento | training_programs, training_cycles, mesocycles, training_weeks, session_templates, session_blocks, exercises,
training_groups, group_students
Evaluaciones | evaluations, evaluation_metrics, technical_scores, rpe_logs, wellness_logs, injury_reports, instructor_observations,
progress_reports
Auditoria | audit_events
Media | files, file_links
```

### 7.2 Edad, categoria y estadistica historica

La edad no debe capturarse manualmente como campo fijo. La ficha del alumno guarda birth_date y el sistema calcula
edad actual. Para reportes historicos, los eventos importantes guardan age_at_event y age_category_at_event. Asi una
asistencia de cuando el alumno tenia 16 anos no cambia cuando el alumno cumple 17.
```text
Campo | Donde vive | Uso
birth_date | people.students | Calcular edad actual y validar menor de edad.
current_age_category | people.students | Filtro operativo rapido; recalculable.
age_at_event | attendance, evaluations, incidents | Analisis historico por edad al momento del evento.
age_category_at_event | attendance, evaluations, incidents | Reportes por categoria historica.
guardian_id | student_guardians | Requisito para menores de edad.
```

### 7.3 Modelo minimo de payments y cash

```text
billing.payments
id, folio, student_id, cash_register_session_id, amount,
payment_method, concept, status, created_by, created_at,
cancelled_by, cancelled_at, cancellation_reason
billing.cash_register_sessions
id, opened_by, opened_at, closed_by, closed_at,
initial_cash, expected_cash, counted_cash, difference,
status, notes, photo_file_id
audit.audit_events
id, actor_user_id, action, entity_type, entity_id,
old_value_json, new_value_json, reason,
ip_address, device_id, created_at
```

## 8. API REST, contratos e integraciones

La API debe ser REST JSON versionada, con convenciones uniformes de paginacion, errores, filtros y seguridad.
Todos los endpoints deben exigir autenticacion salvo login, refresh y recursos publicos estrictamente necesarios.
### 8.1 Convenciones

```text
Aspecto | Convencion
Base path | /api/v1
Formato | JSON UTF-8
Fechas | ISO 8601, zona horaria definida por sucursal
Paginacion | page, size, sort; respuesta con totalElements y totalPages
Errores | Objeto estandar: code, message, details, timestamp, traceId
Autenticacion | Authorization: Bearer
Idempotencia | Header Idempotency-Key en pagos y operaciones criticas.
Archivos | Carga multipart; descarga mediante endpoint autorizado o URL firmada.
```

### 8.2 Endpoints por dominio

```text
Dominio | Endpoints principales
Auth | POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me
Students | GET/POST /students, GET/PUT /students/{id}, POST /students/{id}/photo, GET /students/{id}/profile
Memberships | GET /memberships, POST /memberships, GET /memberships/student/{id}, POST /memberships/{id}/renew, POST
/memberships/{id}/freeze
Payments | POST /payments, GET /payments/{id}, GET /payments, POST /payments/{id}/cancel, GET /payments/{id}/receipt
Cash | POST /cash-register/open, GET /cash-register/current, POST /cash-register/close, POST /cash-register/{id}/handover
Attendance | POST /attendance/check-in, GET /attendance/today, GET /attendance/student/{id}, POST /attendance/{id}/override
Instructor | GET /instructor/today, GET /instructor/classes/current, POST /instructor/classes/{id}/observations
Training | GET/POST /training/programs, GET/POST /training/cycles, GET/POST /training/groups, GET/POST
/training/session-templates
Evaluations | POST /evaluations, GET /evaluations/student/{id}, PUT /evaluations/{id}, POST /evaluations/{id}/metrics
Reports | GET /reports/admin/dashboard, GET /reports/admin/cash, GET /reports/sports/dashboard, GET
/reports/sports/age-distribution
```

### 8.3 Integraciones externas

```text
Integracion | Momento de uso | Notas
WhatsApp API | Comprobantes, vencimientos, seguimiento y | Debe operar asincronamente por outbox.
alertas.
Email | Comprobantes, reportes diarios y recuperacion de | Canal alterno a WhatsApp.
contrasena.
Push notifications | App movil para alumnos e instructores. | Necesita registro de device token.
Terminal de pago futura | Pagos con tarjeta. | Inicialmente se puede registrar pago manual
con referencia.
Storage | Fotos, videos, recibos y evidencias. | Usar permisos por archivo.
```

## 9. Seguridad, roles, permisos y auditoria

El sistema maneja informacion financiera, imagenes de alumnos, datos de menores, historial de lesiones y
evaluaciones fisicas. Por eso la seguridad debe ser parte de la arquitectura desde el primer sprint, no un agregado al
final.
### 9.1 Autenticacion

- Access token JWT de corta duracion y refresh token persistente por dispositivo.
- Rotacion de refresh token y cierre de sesion por dispositivo.
- JWT HS512 con secreto de al menos 64 bytes mientras el despliegue sea un unico monolito.
- Claims: iss, aud, sub, jti, iat, nbf, exp, typ, sid, branchId, roles, permissions y authzVersion.
- Refresh token opaco de 30 dias, almacenado como hash, con rotacion y revocacion de familia ante reutilizacion.
- Contrasenas con Argon2id: 19 MiB, 2 iteraciones y paralelismo 1.
- Bloqueo progresivo: 5 fallos en 24 horas bloquean 15 minutos; 10 fallos bloquean 60 minutos.
- Recuperacion de contrasena por correo o WhatsApp verificado.
- HTTPS obligatorio en produccion.
### 9.2 Roles y permisos

```text
Rol | Uso
OWNER | Dueno: acceso total, reportes financieros, auditoria y confirmacion de entrega de efectivo.
ADMIN | Administracion: alumnos, membresias, pagos, caja y reportes operativos.
SPORTS_MANAGER | Direccion deportiva: programas, ciclos, evaluaciones, grupos y reportes deportivos.
INSTRUCTOR | Clase diaria: asistencia, observaciones, RPE, alertas y pagos solo si se autoriza.
CASHIER | Cobros y caja, sin acceso completo a configuracion deportiva.
STUDENT | Solo su perfil, membresia, comprobantes, progreso y feedback.
READ_ONLY | Consulta limitada sin acciones de escritura.
Accion | Owner | Admin | Sports Manager | Instructor | Alumno
Ver alumnos | Si | Si | Si | Limitado | Solo propio
Crear alumnos | Si | Si | No | No | No
Registrar pago | Si | Si | No | Con permiso | No
Cancelar pago | Si | Limitado | No | No | No
Cerrar caja | Si | Si | No | Si | No
Confirmar entrega efectivo | Si | No | No | No | No
Crear programa deportivo | Si | No | Si | No | No
Registrar evaluacion | Si | No | Si | Si | No
Ver reportes financieros | Si | Si | No | No | No
Ver auditoria | Si | Limitado | No | No | No
```

### 9.3 Auditoria obligatoria

```text
Evento | Datos minimos auditados
payment.created | Usuario, alumno, folio, monto, metodo, caja, fecha, dispositivo.
payment.cancelled | Usuario, pago, motivo, valor anterior, valor nuevo y aprobador.
membership.manual_adjusted | Usuario, alumno, vigencia anterior, vigencia nueva y motivo.
cash_register.closed | Usuario, efectivo esperado, contado, diferencia, foto y hora.
attendance.override | Alumno, instructor, razon de entrada sin pago o excepcion.
discount.applied | Pago, descuento, autorizador y motivo.
role.changed | Usuario afectado, rol anterior, rol nuevo y actor.
student.restriction.updated | Restriccion deportiva, razon, vigencia y usuario.
```

## 10. Flujos criticos de negocio

### 10.1 Alta de alumno

```text
Admin web -> POST /students
Backend -> guarda alumno, fecha nacimiento, categoria, tutor si aplica
Admin web -> POST /students/{id}/photo
Backend -> guarda archivo en storage y referencia en media.files
Backend -> audit_event student.created
Resultado -> alumno listo para membresia y asignacion deportiva
```

### 10.2 Check-in de alumno

```text
Instructor app -> busca alumno o escanea QR
Backend -> valida membresia, restricciones, edad, lesion y estado
Si activo -> crea attendance_record con age_at_event y level_at_event
Si vencido -> bloquea y ofrece pago o autorizacion auditada
Si restriccion -> muestra alerta antes de permitir ejercicios de riesgo
```

### 10.3 Pago en efectivo

```text
Instructor app -> POST /payments
Backend -> valida permiso y caja abierta
Backend -> crea pago + folio + renueva membresia + suma efectivo esperado
Backend -> audit_event payment.created + outbox receipt.pending
Worker -> envia comprobante al alumno
Owner/Admin -> ve efectivo pendiente de entrega
```

### 10.4 Cierre de caja

```text
Instructor -> abre cierre
Backend -> calcula efectivo esperado desde pagos en efectivo no cancelados
Instructor -> captura efectivo contado, notas y foto
Backend -> calcula diferencia, cierra caja y audita
Si diferencia != 0 -> alerta a dueno
Dueno -> confirma entrega fisica de efectivo
```

### 10.5 Evaluacion mensual

```text
Instructor -> abre evaluacion de alumno
Registra: peso opcional, pruebas, tecnica 1-5, RPE, molestias y video
Backend -> compara con evaluaciones previas y criterios de nivel
Resultado -> mantener nivel, progresar o reducir carga
Alumno -> recibe resumen de progreso y objetivo siguiente
```

## 11. Notificaciones, archivos y modo offline

### 11.1 Patron outbox

Las notificaciones no deben bloquear operaciones de negocio. Un pago no debe fallar porque WhatsApp no respondio.
Para ello, la transaccion principal guarda un evento pendiente en notification_outbox y un proceso interno lo envia
despues del commit.
```text
Tabla notification.outbox
id, event_type, payload_json, status, attempts,
next_retry_at, created_at, sent_at, error_message
Estados:
PENDING -> SENDING -> SENT
PENDING -> SENDING -> FAILED -> RETRY
FAILED_FINAL cuando supera intentos configurados
```

### 11.2 Archivos

```text
Tipo de archivo | Storage | Referencia BD | Regla de acceso
Foto de alumno | S3/MinIO/local | media.files + student.photo_file_id | Solo usuarios con permiso sobre alumno.
Foto de cierre de caja | S3/MinIO/local | cash_register_sessions.photo_file_id | Owner/Admin y auditoria.
Comprobante de transferencia | S3/MinIO/local | payment attachments | Admin, cajero autorizado y alumno propio.
Recibo PDF | Generado y almacenado | receipts.file_id | Alumno propio y administracion.
Video tecnico | S3/MinIO/local | evaluation video file | Instructor, deportivo y alumno propio si se
habilita.
Responsiva | S3/MinIO/local | student documents | Admin y dueno.
```

### 11.3 Modo offline

```text
Operacion | Offline | Politica
Ver clase previamente cargada | Si | Cache con fecha de ultima sincronizacion visible.
Registrar observacion tecnica | Si | Cola local y sincronizacion posterior.
Registrar RPE/dolor | Si | Cola local; mostrar pendiente hasta sincronizar.
Registrar asistencia | Limitado | Solo si el alumno estaba cacheado; validar al sincronizar.
Registrar pago en efectivo | No recomendado | Debe requerir conexion para folio, caja y vencimiento.
Cerrar caja | No | Necesita conciliacion contra pagos del servidor.
Cambiar membresia | No | Operacion sensible y auditada.
```

## 12. Deployment inicial y ambientes

El despliegue inicial puede operar con Docker Compose en un VPS o servidor cloud. Para un gimnasio pequeno o
mediano, esto reduce costo y complejidad. Lo importante es incluir HTTPS, backups, logs, variables seguras y
separacion entre staging y produccion.
```text
Internet
|
[Nginx / Reverse Proxy / HTTPS]
|---------------------> [Angular static web]
|
+---------------------> [Spring Boot API]
|
+--> [PostgreSQL]
```

```text
+--> [File Storage]
+--> [Notification providers]
+--> [Logs / Metrics]
```

### 12.1 Contenedores iniciales

```text
Servicio | Responsabilidad | Notas
nginx | HTTPS, reverse proxy y servir Angular. | Tambien puede manejar compresion y headers de
seguridad.
api | Spring Boot backend. | Variables por ambiente; health checks.
postgres | Base de datos PostgreSQL. | Volumen persistente y backups automaticos.
storage | MinIO opcional o ruta local controlada. | En produccion preferible S3/compatible.
worker | Opcional; mismo codigo backend ejecutando outbox. | Puede iniciar como scheduler dentro del monolito.
backup | Tarea programada de respaldo. | Dump cifrado y almacenamiento externo.
```

### 12.2 Ambientes

```text
Ambiente | Uso | Datos
Local | Desarrollo individual. | Datos fake, seed de pruebas.
Dev | Integracion continua del equipo. | Datos anonimos o generados.
Staging | Validacion previa a produccion. | Configuracion similar a produccion, datos de prueba
realistas.
Produccion | Operacion real del gimnasio. | Backups, monitoreo, HTTPS, roles reales y auditoria
activa.
```

### 12.3 Variables y secretos

- No guardar contrasenas ni tokens en repositorio.
- Usar variables de entorno o secret manager del proveedor cloud.
- Separar credenciales de BD por ambiente.
- Rotar credenciales de WhatsApp/email si hay sospecha de exposicion.
- Configurar CORS solo para dominios conocidos.
- Forzar HTTPS en produccion.
### 12.4 Backups

```text
Elemento | Frecuencia sugerida | Retencion
PostgreSQL dump completo | Diario | 30 dias
WAL/backup incremental | Segun criticidad | 7 a 14 dias
Archivos media | Diario incremental | 30 a 90 dias
Configuracion y secretos | Al cambio | Version control seguro o secret manager
Prueba de restauracion | Mensual | Documento de resultado
```

## 13. CI/CD y estrategia de releases

La estrategia de CI/CD debe automatizar pruebas, builds y despliegues para reducir errores humanos. El flujo puede
implementarse con GitHub Actions, GitLab CI o Bitbucket Pipelines. Lo importante es que todo cambio pase por
pruebas y que produccion sea promovida desde un build validado.
### 13.1 Branching recomendado

```text
main -> produccion estable
develop -> integracion continua
feature/* -> nuevas funcionalidades
bugfix/* -> correcciones
release/* -> estabilizacion de version
hotfix/* -> correccion urgente desde main
```

### 13.2 Pipeline backend Spring Boot

```text
Paso | Actividad | Criterio de exito
Checkout | Descargar codigo y configurar JDK. | Repositorio disponible.
Lint/format | Validar estilo o formato. | Sin errores bloqueantes.
Unit tests | Pruebas de dominio y application services. | 100% pasan.
Integration tests | Spring Boot + PostgreSQL test container. | Migraciones y repositorios correctos.
Security scan | Dependencias vulnerables y secretos accidentales. | Sin vulnerabilidades criticas.
Build | Generar jar e imagen Docker. | Artefacto versionado.
Migrations | Flyway/Liquibase validate. | No hay migraciones rotas.
Deploy staging | Actualizar API staging. | Health check OK.
Promote production | Manual approval o tag de release. | Deploy y smoke test OK.
```

### 13.3 Pipeline Angular

```text
Paso | Actividad
Install | Instalar dependencias con lockfile.
Lint | Validar reglas de codigo.
Unit tests | Componentes, servicios y guards.
Build staging/prod | Compilar con environment correspondiente.
Bundle check | Revisar tamano de bundle si aplica.
Deploy | Publicar dist en Nginx, CDN o storage estatico.
```

### 13.4 Pipeline React Native

```text
Paso | Actividad
Install | Instalar dependencias con lockfile.
Lint y typecheck | Validar TypeScript y reglas.
Unit tests | Componentes y hooks.
Build Android/iOS | Generar APK/AAB o build iOS segun fase.
Distribucion interna | Firebase App Distribution, TestFlight o equivalente.
Release stores | Publicacion controlada cuando la app alumno este lista.
```

### 13.5 Versionado y migraciones

- Usar versionado semantico: MAJOR.MINOR.PATCH.
- Toda migracion de BD debe ser incremental y reversible cuando sea posible.
- No editar migraciones ya aplicadas a produccion; crear nueva migracion correctiva.
- Los cambios de contrato API deben mantener compatibilidad o versionarse.
- Probar migraciones en staging con backup reciente antes de produccion.
## 14. Observabilidad, soporte y continuidad operativa

La operacion diaria requiere saber si el sistema esta sano, quien hizo cada accion sensible, por que fallo una
notificacion y como restaurar servicio si algo se rompe. La observabilidad tecnica y la auditoria de negocio deben
complementarse.
```text
Area | Implementacion recomendada
Logs de aplicacion | Formato JSON con traceId, userId cuando aplique, endpoint y resultado.
Metricas | Health checks, latencia API, errores 5xx, DB pool, jobs outbox y cola de notificaciones.
Alertas | API caida, DB sin espacio, backups fallidos, outbox acumulado, faltantes de caja.
Auditoria de negocio | Tabla audit_events consultable por dueno/admin.
Soporte | Registro de incidencias con categoria: pago, caja, membresia, alumno, app, deporte.
Continuidad | Backups probados, procedimiento de restauracion y credenciales de emergencia.
```

### 14.1 Indicadores de salud

```text
Indicador | Umbral de alerta
API health | Falla por mas de 2 minutos.
Errores 5xx | Mas de 2% de solicitudes por 10 minutos.
Outbox pendiente | Mas de 100 eventos pendientes o eventos mayores a 30 minutos.
Backup diario | No se ejecuto o no se pudo validar.
Espacio en disco | Menos de 20% libre.
DB connections | Pool saturado por mas de 5 minutos.
Caja no cerrada | Turno abierto despues de hora maxima configurada.
```

## 15. Pruebas, calidad y criterios de aceptacion

### 15.1 Estrategia de pruebas

```text
Tipo | Que prueba | Herramienta sugerida
Unitarias backend | Reglas de dominio: pagos, vencimientos, edad, restricciones, caja. | JUnit, Mockito, AssertJ
Integracion backend | Repositorios, transacciones, migraciones, API controllers. | Spring Boot Test, Testcontainers
Contrato API | DTOs, codigos de error, paginacion y seguridad. | OpenAPI, contract tests
Frontend web | Servicios, componentes, guards y formularios. | Jasmine/Karma o Jest,
Cypress/Playwright
Mobile | Hooks, navegacion por rol, formularios y cache. | Jest, Detox opcional
E2E critica | Alta alumno, pago, check-in, cierre de caja. | Playwright o Cypress
Seguridad | Permisos, JWT, endpoints sensibles y subida de archivos. | OWASP ZAP, pruebas manuales
```

### 15.2 Criterios de aceptacion globales

- No se puede registrar pago en efectivo sin caja abierta.
- Todo pago genera folio unico y recibo pendiente de envio.
- No existe endpoint funcional para borrar pagos.
- Los cambios de membresia manuales requieren permiso y motivo.
- Un alumno vencido queda bloqueado en check-in salvo pago o autorizacion auditada.
- La fecha de nacimiento calcula edad y categoria correctamente.
- El instructor ve foto, edad, nivel, restriccion y estado de membresia.
- La web separa permisos de administracion y direccion deportiva.
- Los reportes financieros no son visibles para instructores sin permiso.
- El sistema crea audit_event en acciones sensibles.
## 16. Escalabilidad futura y ruta hacia microservicios si aplica

El monolito modular debe soportar la primera etapa del negocio. La extraccion a microservicios solo tendria sentido
cuando existan problemas reales de escala, equipos separados por dominio, multiples sucursales con alto volumen,
integraciones complejas o necesidades de despliegue independiente.
```text
Senal de crecimiento | Posible accion futura
Muchas notificaciones y proveedores externos | Separar notification-service.
Reportes pesados afectan operacion | Crear replica de lectura o reporting-service.
Multiples sucursales con alto trafico de check-in | Optimizar attendance y cache; separar si es necesario.
Integracion avanzada de pagos externos | Separar billing/payments con eventos.
Equipo deportivo y equipo financiero desarrollan | Separar modulos con contratos y eventos.
independiente
```

Antes de microservicios: optimizar consultas, indices, caching, workers internos, colas y replicas de lectura.
## 17. Anexos tecnicos

### 17.1 Reglas de negocio principales

```text
Regla | Descripcion
Pago no borrable | Solo se cancela con permiso, motivo y auditoria.
Vencimiento protegido | No se modifica libremente; se actualiza por pago, congelamiento o ajuste autorizado.
Caja obligatoria | Pago en efectivo requiere cash_register_session abierta.
Comprobante al alumno | Todo pago genera comprobante o recibo digital.
Entrada de vencidos | Solo con pago o autorizacion auditada.
Menor de edad | Requiere tutor y restricciones automaticas segun edad.
Dolor alto | Dolor >= 7 genera alerta y recomendacion de reducir o detener carga.
Subida de nivel | Debe basarse en criterios tecnicos, asistencia, recuperacion y evaluacion.
```

### 17.2 Configuracion inicial sugerida

```text
Parametro | Valor inicial sugerido
Duracion access token | 15 minutos
Duracion refresh token | 30 dias con rotacion
Algoritmo JWT | HS512 con secreto aleatorio de al menos 64 bytes
Hash de contrasena | Argon2id, 19 MiB, 2 iteraciones, paralelismo 1
Zona horaria | America/Mexico_City o segun ubicacion del gimnasio
Categoria menor de edad | < 18 anos
Sparring intenso bloqueado | < 14 anos o restriccion activa
Alerta vencimiento | 3 dias antes, dia de vencimiento y 1 dia despues
Cierre de caja tardio | Despues de hora configurada por turno
Outbox max attempts | 5 intentos con backoff
Backup diario | 02:00 hora local
```

### 17.3 Referencia deportiva incorporada

El modulo deportivo considera un ciclo de 12 semanas, dividido en tres mesociclos de 4 semanas, con evaluaciones en
semanas 0, 4, 8 y 12, niveles principiante/intermedio/avanzado, uso de session-RPE, asistencia, bienestar, molestias,
pruebas fisicas y rubricas tecnicas. Estos elementos provienen del programa de entrenamiento de boxeo
proporcionado para la escuela.
