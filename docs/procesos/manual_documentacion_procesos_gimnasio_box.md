---
title: "Documentación operativa y procesos para gimnasio de box"
version: "1.0"
fecha: "1 de julio de 2026"
fuente: "manual_documentacion_procesos_gimnasio_box.pdf"
---

# Documentación operativa y procesos para gimnasio de box

> Documento convertido desde PDF a Markdown para consulta técnica en el repositorio.

Documentación operativa y procesos para gimnasio de box Sistema de alumnos, membresías, caja, panel de instructor, seguimiento deportivo y experiencia personalizada del alumno. Versión 1.0 - Documento de trabajo Fecha: 1 de julio de 2026


## Control del documento

| Campo | Detalle |
| --- | --- |
| Nombre del documento | Documentación operativa y procesos para gimnasio de box |
| Versión | 1.0 |
| Uso | Documento base para operar el gimnasio y construir la app |
| Dueño del proceso | Dirección / dueño del gimnasio |
| Usuarios principales | Dueño, administración, recepción, instructores y alumnos |
| Base técnica | Programa de entrenamiento de boxeo para escuela de box proporcionado por el usuario |
| Nota | Este documento no sustituye asesoría legal, fiscal, médica ni de protección civil. Debe adaptarse a la<br>normativa local y revisarse con especialistas cuando aplique. |

El propósito de este manual es dejar definido cómo debe operar el gimnasio, qué debe hacer la app, qué permisos debe tener cada rol, qué registros son obligatorios y cómo usar los datos deportivos para dar seguimiento personalizado a cada alumno.

Principio rector: todo alumno debe tener identidad, estatus de pago, asistencia, nivel, edad, objetivo y

seguimiento. Todo cobro, ajuste, descuento, incidencia y cambio de vencimiento debe dejar rastro auditable.


# 1. Resumen ejecutivo

La solución recomendada combina procesos operativos estrictos con una app ligera pero auditable. La app debe controlar alumnos, fotos, membresías, pagos, caja, asistencias, edades, niveles, evaluaciones, planes de entrenamiento, alertas y reportes. El objetivo administrativo es evitar omisiones, cobros no registrados, manipulación de vencimientos y pérdidas de efectivo. El objetivo deportivo es que el instructor sepa qué trabajar con cada alumno y que el alumno perciba un servicio personalizado, medible y profesional. El programa deportivo se organiza sobre una lógica de 12 semanas, con tres bloques de cuatro semanas, evaluaciones en semana 0, 4, 8 y 12, y registro de asistencia, RPE, bienestar, molestias, pruebas físicas y rúbrica técnica. Este enfoque permite operar clases grupales sin perder seguimiento individual.

| Frente | Qué se implementa | Resultado esperado |
| --- | --- | --- |
| Administración | Alta de alumno con foto, fecha de nacimiento, membresía,<br>pagos, vencimientos y comprobantes | Menos errores, mejor control de entrada y<br>claridad con el alumno |
| Caja | Corte por turno, folios, recibos automáticos, foto del efectivo,<br>entrega al dueño y auditoría | Reduce riesgo de robo u omisión de registros |
| Entrenamiento | Perfil deportivo, nivel, edad, objetivos, restricciones, RPE,<br>evaluaciones y progreso | Programas mejor planificados y seguimiento real |
| Instructor | Panel de clase con alumnos presentes, vencidos, lesiones,<br>objetivos y tareas por nivel | El instructor deja de improvisar y puede<br>personalizar |
| Alumno | Portal o mensajes con vencimiento, progreso, objetivos,<br>feedback y logros | Mayor retención y percepción de valor |
| Dueño | Dashboard de ingresos, asistencia, caja, vencidos, retención,<br>grupos y estadísticas por edad | Mejores decisiones operativas y comerciales |

La app no debe permitir que un instructor borre pagos, cambie vencimientos libremente o aplique descuentos sin autorización. Los errores se corrigen con movimientos inversos y motivo, nunca borrando historial.

# 2. Alcance, objetivos y principios de diseño

## 2.1 Alcance del sistema

El sistema cubre la operación completa de una escuela o gimnasio de box con clases grupales, alumnos recurrentes, nuevos ingresos, pagos en efectivo, transferencias o tarjeta, asistencia por horario y seguimiento deportivo.

| Incluido | Descripción |
| --- | --- |
| Alumnos | Registro con foto, datos de contacto, fecha de nacimiento, tutor si es menor, emergencia, nivel y objetivo |
| Membresías | Planes, vencimientos, estado, renovaciones, congelamientos y clases disponibles |
| Pagos | Folio, monto, método, concepto, usuario que cobró, comprobante y estado |
| Caja | Apertura, cobros, cierre, diferencias, entrega y confirmación por dueño |
| Asistencia | Check-in por alumno, foto, estado de membresía, horario, instructor y restricciones |
| Entrenamiento | Ciclo, semana, grupo, plan de sesión, nivel, edad, RPE, evaluaciones y observaciones |
| Reportes | Ingresos, efectivo, vencidos, asistencia, retención, edades, progreso, lesiones y carga |

## 2.2 Objetivos de negocio

- Evitar que se cobre efectivo sin registro o sin comprobante.
- Impedir que se active a un alumno sin pago, autorización o justificación.
- Reducir dependencia del dueño para operar horarios completos.
- Estandarizar clases y progresión técnica.
- Usar edad, nivel, asistencia y evaluaciones para planificar mejor.

- Incrementar retención mediante trato personalizado y progreso visible.
## 2.3 Principios de control

| Principio | Aplicación práctica |
| --- | --- |
| Un pago, un folio | Todo cobro genera folio y comprobante para el alumno. |
| Nada se borra | Pagos, asistencias, cierres y cambios se corrigen con movimientos auditables. |
| El vencimiento se calcula | La fecha de vencimiento se actualiza por reglas del plan, no por edición libre del instructor. |
| Caja por turno | Cada instructor abre y cierra turno; el efectivo esperado se compara contra efectivo contado. |
| El alumno valida | El alumno recibe comprobantes y mensajes; si no recibió comprobante, se investiga. |
| Separación de funciones | Quien cobra no debe poder autorizar descuentos, borrar pagos ni recibir su propio cierre sin revisión. |
| Personalización medible | Cada alumno tiene edad, nivel, objetivo, observaciones y próximas metas. |

# 3. Roles, responsabilidades y permisos

La seguridad operativa depende de que cada usuario tenga credenciales propias y permisos limitados. No se debe compartir usuario entre instructores.

## 3.1 Roles

| Rol | Responsabilidad principal | Debe poder | No debe poder |
| --- | --- | --- | --- |
| Dueño / dirección | Control total del negocio | Ver reportes, confirmar efectivo, autorizar<br>ajustes, gestionar usuarios, editar<br>configuración | Compartir su usuario o delegar<br>autorizaciones sin registro |
| Administrador /<br>recepción | Operación administrativa | Alta de alumnos, pagos, asistencia, reportes<br>limitados, cortes de caja | Borrar pagos o manipular auditoría |
| Instructor | Ejecutar clases y registrar<br>seguimiento | Check-in, ver panel de clase, registrar<br>observaciones, RPE, molestias y pagos si está<br>autorizado | Borrar pagos, editar vencimientos,<br>autorizar descuentos, eliminar alumnos |
| Alumno | Consultar información propia | Ver vencimiento, comprobantes, asistencia,<br>progreso, objetivos y mensajes | Ver datos de otros alumnos o editar<br>registros deportivos críticos |

## 3.2 Matriz de permisos

| Función | Dueño | Admin | Instructor | Alumno |
| --- | --- | --- | --- | --- |
| Alta de alumno | Sí | Sí | No / limitado | No |
| Tomar o actualizar foto | Sí | Sí | Sí con permiso | No |
| Registrar asistencia | Sí | Sí | Sí | No |
| Ver vencimiento | Sí | Sí | Sí | Propio |
| Registrar pago | Sí | Sí | Opcional por permiso | No |
| Cancelar pago | Sí | Solicita<br>autorización | No | No |
| Aplicar descuento | Sí | Con permiso | No | No |
| Cambiar vencimiento manual | Sí con motivo | No / solicita | No | No |
| Abrir/cerrar caja | Sí | Sí | Sí si cobra | No |
| Confirmar efectivo recibido | Sí | No | No | No |
| Registrar RPE/dolor | Sí | Sí | Sí | Propio si se habilita |
| Editar evaluación técnica | Sí | Sí | Sí | No |
| Ver reportes financieros | Sí | Limitado | No | No |
| Gestionar usuarios | Sí | No | No | No |

## 3.3 Reglas de usuario

- Cada usuario debe tener PIN, contraseña o acceso individual.

- El sistema debe cerrar sesión automáticamente después de inactividad.
- Toda acción sensible registra usuario, fecha, hora, dispositivo y motivo.
- Los permisos de cobro deben revocarse inmediatamente cuando un instructor deja de trabajar.
- El dueño debe revisar semanalmente usuarios activos y permisos especiales.
# 4. Modelo de datos de la app

La app debe estructurarse con módulos conectados. La foto y los datos básicos sirven para identificar al alumno; la membresía y pagos controlan acceso; el perfil deportivo, edad y evaluaciones personalizan el entrenamiento.

## 4.1 Entidades principales

| Entidad | Campos mínimos | Para qué sirve |
| --- | --- | --- |
| Alumno | ID, foto, nombre, teléfono, fecha de nacimiento, edad calculada, contacto de<br>emergencia, tutor, estatus | Identificación, comunicación y seguridad |
| Membresía | Alumno, plan, inicio, vencimiento, estado, clases disponibles,<br>congelamientos | Controlar acceso y renovaciones |
| Pago | Folio, alumno, monto, concepto, método, usuario, turno, hora, estado,<br>comprobante | Registrar ingresos y generar evidencia |
| Asistencia | Alumno, fecha, hora, clase, instructor, estatus de membresía al ingresar | Medir uso, retención y cumplimiento |
| Perfil deportivo | Nivel, edad, peso, estatura, guardia, objetivo, lesiones, restricciones,<br>frecuencia esperada | Personalizar cargas y subgrupos |
| Plan de sesión | Fecha, horario, grupo, nivel, objetivo, RPE meta, estaciones, instructor | Guiar al instructor |
| Seguimiento diario | Asistencia, minutos, RPE, dolor, sueño, observación técnica, rounds | Medir carga y progreso |
| Evaluación | Semana, pruebas físicas, técnica 1-5, video, decisión de nivel | Tomar decisiones de progresión |
| Turno de caja | Instructor, apertura, fondo, efectivo esperado, contado, diferencia, foto,<br>estado | Control de efectivo |
| Auditoría | Usuario, acción, entidad, antes, después, fecha, motivo | Rastrear cambios y evitar manipulación |

## 4.2 Estados estandarizados

| Objeto | Estados permitidos | Regla clave |
| --- | --- | --- |
| Alumno | Activo, vencido, prueba, congelado, baja, restringido | El estado de entrenamiento no debe ocultar el estado de<br>pago. |
| Membresía | Vigente, vencida, congelada, cancelada, pendiente de<br>pago | La fecha de vencimiento se calcula por plan y pago. |
| Pago | Registrado, conciliado, cancelación solicitada,<br>cancelado autorizado, reversado | Cancelar requiere motivo y permiso. |
| Turno de caja | Abierto, cerrado por instructor, pendiente de entrega,<br>recibido, diferencia en revisión | Ningún turno con efectivo debe quedar sin cierre. |
| Evaluación | Pendiente, realizada, requiere revisión, aprobada, no<br>apto temporal | Progresión por criterios, no por antigüedad. |

## 4.3 Campos obligatorios por perfil

| Perfil administrativo | Perfil deportivo | Perfil de seguridad |
| --- | --- | --- |
| Nombre, foto, teléfono, fecha de nacimiento,<br>plan, vencimiento, historial de pagos,<br>comprobantes | Nivel, edad calculada, categoría de edad,<br>objetivo, guardia, peso/estatura opcional,<br>asistencia, pruebas, observaciones | Contacto de emergencia, lesiones,<br>restricciones, tutor si es menor,<br>consentimiento de foto, consentimiento de<br>entrenamiento |

# 5. Integración de edad, estadísticas y personalización

La edad debe integrarse como dato activo del entrenamiento, no solo como dato demográfico. La app debe guardar fecha de nacimiento y calcular edad automáticamente. Con eso se generan categorías, alertas, restricciones y estadísticas.


## 5.1 Datos de edad

| Campo | Regla |
| --- | --- |
| Fecha de nacimiento | Campo obligatorio en alta; no se captura solo edad porque cambia cada año. |
| Edad calculada | La app la calcula con la fecha actual. |
| Categoría de edad | Se asigna automáticamente y puede usarse para reportes y restricciones. |
| Tutor / responsable | Obligatorio para menores de edad. |
| Consentimientos | Foto, entrenamiento, contacto, emergencias y participación en actividades con contacto. |

## 5.2 Categorías sugeridas

| Categoría | Edad | Enfoque de entrenamiento | Reglas de seguridad |
| --- | --- | --- | --- |
| Infantil | 8 a 12 | Coordinación, movilidad, juego de pies, técnica básica,<br>disciplina y hábitos | Sin sparring intenso; bajo impacto; sesiones<br>más cortas; comunicación con tutor |
| Adolescente | 13 a 17 | Técnica, acondicionamiento, fuerza supervisada, seguridad y<br>progresión | Sparring solo técnico y autorizado; evitar<br>mezclas inseguras por peso/nivel |
| Adulto joven | 18 a 34 | Plan estándar completo por nivel y objetivo | Control por nivel, peso, experiencia y<br>recuperación |
| Adulto recreativo | 35 a 49 | Técnica, condición, movilidad, progresión gradual y prevención | Más calentamiento; controlar impacto,<br>lesiones y fatiga |
| Adulto mayor o<br>sedentario | 50+ | Salud, movilidad, coordinación, acondicionamiento y técnica sin<br>contacto fuerte | Carga inicial conservadora; revisión de<br>banderas de riesgo; evitar sparring duro por<br>defecto |

Regla de personalización: la edad no reemplaza al nivel. Dos alumnos de la misma edad pueden entrenar distinto por lesión, experiencia, peso, objetivo, recuperación y asistencia.

## 5.3 Estadísticas por edad

| Reporte | Decisión que permite tomar |
| --- | --- |
| Distribución de alumnos por edad | Definir horarios y campañas: infantil, juvenil, box fitness, competitivo, 35+. |
| Asistencia promedio por edad | Detectar grupos más constantes y ajustar horarios. |
| Retención / baja por edad | Diseñar acciones de recuperación o programas especiales. |
| Lesiones o molestias por edad | Ajustar cargas, calentamientos y ejercicios. |
| Progreso técnico por edad y nivel | Ver si el programa está funcionando para cada grupo. |
| Pagos y vencimientos por edad | Entender qué segmento aporta más ingresos y qué segmento requiere seguimiento. |

## 5.4 Perfil personalizado visible

Alumno: Juan Pérez Edad: 23 años | Categoría: adulto joven | Nivel: principiante Objetivo: bajar peso y mejorar técnica Plan actual: semana 3 del ciclo base Enfoque de la semana: mantener guardia al retroceder Corrección principal: no bajar mano derecha después del jab Restricciones: ninguna | Dolor reciente: 0/10 Membresía: activa hasta 15/julio

# 6. Módulos funcionales de la app

## 6.1 Módulo administrativo

| Función | Detalle | Control |
| --- | --- | --- |
| Alta de alumnos | Registro con foto, fecha de nacimiento, contacto y plan inicial | Campos obligatorios y consentimiento |
| Membresías | Planes, fechas, clases disponibles, congelamientos y vencidos | Vencimiento calculado por reglas |
| Pagos | Efectivo, transferencia, tarjeta, folios y comprobantes | No borrar; solo reversar con permiso |
| Caja | Apertura, cierre, diferencias, entrega y confirmación | Corte por turno y foto del efectivo |
| Reportes | Ingresos, vencidos, caja, asistencia y retención | Envío automático al dueño |


## 6.2 Módulo deportivo

| Función | Detalle | Resultado |
| --- | --- | --- |
| Perfil deportivo | Edad, nivel, objetivo, guardia, restricciones, frecuencia<br>esperada | Base para personalizar |
| Plan de entrenamiento | Ciclo 12 semanas, semana actual, objetivo del día, RPE meta | Clase estructurada |
| Evaluaciones | Semana 0, 4, 8, 12; técnica 1-5 y pruebas físicas | Progreso medible |
| Seguimiento diario | Asistencia, RPE, dolor, sueño, rounds y observación | Control de carga y retención |
| Progresión de nivel | Criterios técnicos, asistencia y recuperación | Subir nivel sin improvisar |

## 6.3 Módulo instructor

Pantalla del día

- Clase: martes 7:00 pm
- Objetivo general: defensa, cabeceo y resistencia específica
- RPE meta: 6-7
- Presentes: 18 | Vencidos: 3 | Restricciones: 2
- Subgrupos sugeridos: 6 principiantes, 8 intermedios, 4 avanzados Lista rápida Foto | Alumno | Edad | Nivel | Estado pago | Restricción | Enfoque de hoy
## 6.4 Módulo alumno

| Elemento visible | Valor para el alumno |
| --- | --- |
| Vencimiento y comprobantes | Claridad administrativa y menos conflictos de pago. |
| Asistencias del mes | Refuerza constancia. |
| Nivel y progreso | Percibe avance real. |
| Objetivo semanal | Siente que el entrenamiento no es genérico. |
| Feedback del instructor | Se siente observado y acompañado. |
| Logros | Motivación y retención. |

# 7. Política de pagos, caja y control de efectivo

El efectivo es el punto de mayor riesgo. Por eso se controla con folios, turnos, cortes, recibos automáticos, confirmación del dueño y auditoría.

## 7.1 Reglas no negociables

| Regla | Aplicación |
| --- | --- |
| Todo pago se registra al momento | No se permite cobrar y registrar después. |
| Todo pago genera folio | El folio aparece en el historial del alumno y en el corte de caja. |
| Todo pago genera comprobante | WhatsApp, correo o comprobante dentro del portal. |
| El instructor no borra pagos | Los errores se corrigen con cancelación autorizada y motivo. |
| El efectivo se concilia por turno | El efectivo físico debe cuadrar contra el efectivo registrado. |
| El dueño confirma recepción | El dinero pasa a estado recibido solo cuando el dueño lo confirma. |

## 7.2 Estados del dinero en efectivo

# 1. Cobrado por instructor

# 2. Registrado con folio

# 3. Incluido en turno de caja

# 4. Turno cerrado por instructor

# 5. Pendiente de entrega física

# 6. Recibido y confirmado por dueño

# 7. Conciliado o diferencia en revisión


## 7.3 Letrero recomendado para recepción

Importante: todo pago debe registrarse en sistema y generar comprobante digital. Si no recibes comprobante, tu pago no será reconocido. Para aclaraciones, comunícate directamente con administración.

## 7.4 Reglas especiales

| Situación | Regla |
| --- | --- |
| Transferencia | Debe asociarse a comprobante o referencia. Queda como pendiente hasta validación si no se confirma. |
| Tarjeta | Debe coincidir con terminal o proveedor de pago. |
| Descuento | Requiere permiso y motivo. Debe aparecer en reporte diario. |
| Cortesía | Requiere autorización y fecha de vencimiento. No debe ser indefinida. |
| Pago parcial | Permitido solo si el plan lo admite. Debe quedar saldo pendiente. |
| Error de captura | Se solicita cancelación; dueño o admin autorizado aprueba; queda historial. |

# 8. Procesos administrativos estándar

Los procesos siguientes deben configurarse en la app y entrenarse con todo el equipo. Cada proceso tiene evidencias mínimas, controles y métricas.

## P-01 Alta de alumno

| Elemento | Definición |
| --- | --- |
| Objetivo | Crear un expediente completo que permita identificar, cobrar, contactar y entrenar al alumno de forma segura. |
| Responsable principal | Recepción / administrador |
| Disparador / frecuencia | Cada nuevo ingreso o clase de prueba convertida en alumno |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Capturar datos básicos: nombre, teléfono, fecha de nacimiento, contacto de emergencia y correo<br>si aplica. | Ficha de alumno |
| 2 | Tomar foto clara de rostro para reconocimiento en entrada. | Foto en sistema |
| 3 | Capturar tutor y consentimiento cuando el alumno sea menor de edad. | Datos de tutor y consentimiento |
| 4 | Seleccionar plan inicial, fecha de inicio y método de pago. | Membresía creada |
| 5 | Registrar pago o marcar como clase de prueba autorizada. | Pago con folio o prueba registrada |
| 6 | Asignar categoría de edad, nivel inicial y objetivo preliminar. | Perfil deportivo inicial |
| 7 | Enviar mensaje de bienvenida con reglas de pago, equipo y horarios. | Notificación enviada |

| Control | Cómo se verifica |
| --- | --- |
| Campos obligatorios | El sistema no permite guardar sin foto, fecha de nacimiento y contacto. |
| Menores de edad | Bloquear alta final sin tutor y consentimiento. |
| Plan activo | Solo se activa si hay pago o cortesía autorizada. |

Excepciones: Si el alumno solo toma clase de prueba, se crea expediente mínimo con foto, teléfono y consentimiento. La prueba

debe tener fecha de expiración.

Métricas asociadas: Altas por semana, conversiones de prueba, perfiles incompletos.

## P-02 Evaluación inicial deportiva

| Elemento | Definición |
| --- | --- |
| Objetivo | Clasificar al alumno por edad, nivel, objetivo, condición y restricciones para asignarlo al programa adecuado. |
| Responsable principal | Instructor responsable |
| Disparador / frecuencia | Antes de la primera semana formal o durante la primera clase |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Revisar edad, objetivo, experiencia previa y lesiones declaradas. | Perfil deportivo |


| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 2 | Aplicar cuestionario breve de salud y banderas de riesgo. | Cuestionario registrado |
| 3 | Asignar nivel provisional: principiante, intermedio o avanzado. | Nivel en sistema |
| 4 | Registrar pruebas base: peso opcional, flexiones 30 s, abdominales 30 s, técnica 1-5 y<br>observación. | Evaluación semana 0 |
| 5 | Definir enfoque de las primeras 4 semanas. | Objetivo personal |
| 6 | Marcar restricciones: sin sparring, baja carga, cuidar rodilla, etc. | Alerta visible al instructor |

| Control | Cómo se verifica |
| --- | --- |
| Progresión conservadora | Un alumno nuevo inicia como principiante salvo evaluación autorizada. |
| Alertas de riesgo | Dolor, mareo, lesión o condición médica generan restricción visible. |
| Menores | El sistema sugiere limitar contacto intenso y exige consentimiento. |

Excepciones: Si hay bandera médica, el alumno queda restringido hasta revisión o autorización pertinente.

Métricas asociadas: Alumnos evaluados, perfiles sin evaluación, alumnos restringidos.

## P-03 Check-in y control de acceso

| Elemento | Definición |
| --- | --- |
| Objetivo | Registrar asistencia y validar que el alumno tenga derecho a entrenar antes de entrar a clase. |
| Responsable principal | Instructor o recepción |
| Disparador / frecuencia | Cada entrada de alumno |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Buscar alumno por nombre, foto, QR o teléfono. | Alumno identificado |
| 2 | Verificar foto y estado de membresía. | Pantalla de check-in |
| 3 | Si está vigente, registrar asistencia. | Asistencia con hora |
| 4 | Si está vencido, bloquear check-in normal y mostrar opción de pago o autorización especial. | Alerta de vencido |
| 5 | Mostrar restricciones deportivas al instructor: lesión, menor, sin sparring, baja carga. | Alerta visible |
| 6 | Enviar asistencia al historial y sumar a estadísticas. | Registro de asistencia |

| Control | Cómo se verifica |
| --- | --- |
| Vencidos | No se permite entrenar sin pago, autorización o registro de excepción. |
| Foto | Evita que alguien entrene con cuenta de otro. |
| Auditoría | Check-in de vencido queda en reporte del dueño. |

Excepciones: Clase de prueba, invitado o autorización especial deben tener motivo y usuario que autorizó.

Métricas asociadas: Asistencias, vencidos que intentaron entrar, excepciones de acceso.

## P-04 Cobro y renovación de membresía

| Elemento | Definición |
| --- | --- |
| Objetivo | Registrar pagos y actualizar vencimientos automáticamente. |
| Responsable principal | Recepción / instructor autorizado |
| Disparador / frecuencia | Cuando un alumno compra, renueva o paga clase suelta |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Seleccionar alumno y concepto de pago. | Pantalla de cobro |
| 2 | Confirmar plan, monto, método y fecha de inicio del periodo. | Detalle de pago |
| 3 | Registrar pago; el sistema genera folio. | Pago registrado |
| 4 | Actualizar vencimiento o clases disponibles por regla del plan. | Membresía actualizada |
| 5 | Enviar comprobante al alumno. | Notificación con folio |


| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 6 | Si es efectivo, sumar al efectivo esperado del turno. | Turno de caja actualizado |

| Control | Cómo se verifica |
| --- | --- |
| Monto predefinido | El sistema sugiere precio del plan y marca descuentos. |
| Vencimiento automático | El instructor no edita fecha manualmente. |
| Comprobante | Si no se envía, queda alerta de pago sin comprobante. |

Excepciones: Pago parcial o saldo pendiente solo si el plan lo permite. Debe quedar visible para el alumno y dueño.

Métricas asociadas: Ingresos por método, renovaciones, pagos con descuento, pagos sin comprobante.

## P-05 Cobro en efectivo cuando no está el dueño

| Elemento | Definición |
| --- | --- |
| Objetivo | Controlar el efectivo cobrado por instructores y evitar omisiones o apropiación. |
| Responsable principal | Instructor autorizado y dueño |
| Disparador / frecuencia | Cada cobro en efectivo durante un turno sin dueño |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Instructor inicia sesión con su usuario. | Usuario identificado |
| 2 | Verifica que su turno de caja esté abierto. | Turno abierto |
| 3 | Recibe efectivo frente al alumno y lo cuenta. | Monto capturado |
| 4 | Registra pago en la app inmediatamente. | Folio creado |
| 5 | Entrega o envía comprobante al alumno. | Comprobante enviado |
| 6 | Guarda efectivo en caja definida. | Efectivo bajo custodia |
| 7 | Al cierre, el sistema muestra efectivo esperado para ese instructor. | Corte de turno |

| Control | Cómo se verifica |
| --- | --- |
| Alumno como control | Sin comprobante, el alumno debe reportarlo. |
| Corte por usuario | El dinero se atribuye al instructor que cobró. |
| Reporte al dueño | Cada pago en efectivo puede notificar al dueño en tiempo real o en resumen diario. |

Excepciones: Si no hay internet, usar folio manual preimpreso y capturar en cuanto vuelva el servicio. El folio manual se concilia

contra sistema.

Métricas asociadas: Efectivo por instructor, diferencias, pagos capturados fuera de hora, pagos sin turno abierto.

## P-06 Apertura y cierre de turno de caja

| Elemento | Definición |
| --- | --- |
| Objetivo | Comparar efectivo registrado contra efectivo contado y dejar evidencia del cierre. |
| Responsable principal | Instructor / recepción |
| Disparador / frecuencia | Inicio y fin de cada turno |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Abrir turno con usuario, hora y fondo inicial si existe. | Apertura de turno |
| 2 | Durante el turno, todos los pagos en efectivo se acumulan automáticamente. | Efectivo esperado |
| 3 | Al cierre, contar efectivo físico. | Monto contado |
| 4 | Capturar monto contado y subir foto del efectivo. | Foto de cierre |
| 5 | Registrar explicación si existe diferencia. | Diferencia documentada |
| 6 | Cerrar turno y bloquear nuevos cobros en ese turno. | Turno cerrado |
| 7 | Enviar corte al dueño. | Reporte enviado |


| Control | Cómo se verifica |
| --- | --- |
| Bloqueo de turnos | No se pueden registrar cobros en turno cerrado. |
| Diferencias obligatorias | Faltante o sobrante requiere motivo. |
| Revisión del dueño | El turno no queda conciliado hasta confirmación. |

Excepciones: Si el instructor olvida cerrar, el sistema alerta al dueño y bloquea al usuario para nuevo turno hasta regularizar.

Métricas asociadas: Diferencias de caja, turnos sin cierre, efectivo pendiente de recibir.

## P-07 Entrega de efectivo al dueño

| Elemento | Definición |
| --- | --- |
| Objetivo | Confirmar la transferencia física de dinero del instructor al dueño. |
| Responsable principal | Dueño |
| Disparador / frecuencia | Cada turno con efectivo cerrado |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Dueño recibe efectivo físico del instructor. | Entrega física |
| 2 | Abre turno pendiente en la app. | Turno pendiente |
| 3 | Cuenta dinero y compara contra corte. | Validación |
| 4 | Confirma recepción o marca diferencia en revisión. | Estado actualizado |
| 5 | El sistema bloquea edición del corte recibido. | Corte final |

| Control | Cómo se verifica |
| --- | --- |
| Doble conteo | Instructor cuenta al cierre; dueño cuenta al recibir. |
| Estado pendiente | Mientras no confirme dueño, el efectivo sigue asignado al instructor. |
| Historial | Se conserva fecha y hora de recepción. |

Excepciones: Si entrega por depósito bancario, adjuntar comprobante y referencia.

Métricas asociadas: Tiempo promedio pendiente de entrega, diferencias después de recepción.

## P-08 Descuentos, cortesías y cancelaciones

| Elemento | Definición |
| --- | --- |
| Objetivo | Controlar excepciones que afectan ingresos o vencimientos. |
| Responsable principal | Dueño / administrador autorizado |
| Disparador / frecuencia | Cada vez que se aplique descuento, cortesía o cancelación |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Usuario solicita excepción desde el pago o perfil del alumno. | Solicitud |
| 2 | Selecciona tipo: descuento, cortesía, cancelación, congelamiento o ajuste. | Tipo de excepción |
| 3 | Captura motivo obligatorio. | Motivo |
| 4 | Dueño o admin autorizado aprueba. | Aprobación |
| 5 | La app aplica efecto y deja historial. | Movimiento auditable |
| 6 | Aparece en reporte diario. | Reporte |

| Control | Cómo se verifica |
| --- | --- |
| Permisos | Instructor no aprueba excepciones financieras. |
| Reporte diario | Todas las excepciones se listan para revisión. |
| Límites | La cortesía debe tener fecha fin o número de clases. |

Excepciones: Promociones masivas pueden configurarse como cupón aprobado por el dueño.

Métricas asociadas: Descuentos por mes, cortesías activas, cancelaciones por usuario.


## P-09 Gestión de vencidos y cobranza

| Elemento | Definición |
| --- | --- |
| Objetivo | Evitar entrenamientos sin pago y mejorar renovaciones. |
| Responsable principal | Sistema / recepción |
| Disparador / frecuencia | Diario y antes de cada clase |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Generar lista de alumnos que vencen en 3 días, hoy y vencidos. | Reporte de vencimientos |
| 2 | Enviar recordatorio automático antes del vencimiento. | Mensaje enviado |
| 3 | Al llegar vencido, bloquear check-in normal. | Alerta |
| 4 | Si paga, registrar renovación y permitir asistencia. | Pago y asistencia |
| 5 | Si no paga pero se autoriza entrada, registrar excepción. | Motivo y usuario |
| 6 | Reportar vencidos que asistieron sin pago. | Reporte del dueño |

| Control | Cómo se verifica |
| --- | --- |
| Bloqueo de acceso | Un vencido no entra como si estuviera activo. |
| Excepciones visibles | Todas las entradas sin pago se reportan. |
| Recibos | El alumno recibe comprobante al renovar. |

Excepciones: Alumnos con promesa de pago deben quedar como saldo pendiente y con fecha límite.

Métricas asociadas: Renovaciones, vencidos recuperados, vencidos que asistieron sin pago.

## P-10 Alta, baja y control de instructores

| Elemento | Definición |
| --- | --- |
| Objetivo | Controlar quién tiene acceso a la app y qué puede hacer. |
| Responsable principal | Dueño |
| Disparador / frecuencia | Cada incorporación, cambio de rol o salida de personal |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Crear usuario individual con rol específico. | Usuario creado |
| 2 | Asignar permisos mínimos necesarios. | Rol |
| 3 | Capacitar en cobros, caja, asistencia y seguimiento. | Registro de capacitación |
| 4 | Revisar actividad durante la primera semana. | Auditoría |
| 5 | Cuando sale del gimnasio, desactivar usuario de inmediato. | Usuario desactivado |

| Control | Cómo se verifica |
| --- | --- |
| Usuario individual | No se comparten accesos. |
| Revisión semanal | Dueño revisa permisos especiales. |
| Baja inmediata | Ex empleados no conservan acceso. |

Excepciones: Instructor invitado puede tener acceso temporal con expiración automática.

Métricas asociadas: Usuarios activos, permisos especiales, accesos fallidos.

# 9. Procesos deportivos y planificación de entrenamiento

La operación deportiva se basa en un ciclo de 12 semanas, con progresión técnica, carga controlada y evaluaciones periódicas. El instructor no necesita improvisar: el sistema le muestra objetivo del día, subgrupos, restricciones y tareas individuales.


## 9.1 Estructura del ciclo de 12 semanas

| Bloque | Semanas | Objetivo técnico | Objetivo físico | Evaluació<br>n |
| --- | --- | --- | --- | --- |
| Base y adaptación | 1 a 4 | Postura, guardia, desplazamientos, jab-cross,<br>defensa básica | Base aeróbica, coordinación, fuerza<br>general, movilidad | Semana 0 y<br>4 |
| Desarrollo específico | 5 a 8 | Combinaciones, hooks, uppercut técnico,<br>pivotes, fintas, defensa | Resistencia específica, fuerza-potencia<br>introductoria, core | Semana 8 |
| Integración y realización | 9 a 12 | Táctica por distancia, salidas angulares,<br>contraataque y ritmo | Potencia específica, tolerancia a rounds y<br>recuperación | Semana 12 |

## 9.2 Objetivos por semana

| Semana | Meta |
| --- | --- |
| 1 | Evaluación inicial, normas de seguridad, vendaje, postura, guardia, desplazamientos lineales y jab. |
| 2 | Cross, bloqueos, parries, cuerda, coordinación y circuito general. |
| 3 | Hook delantero, slips, saco de ritmo y control postural bajo fatiga ligera. |
| 4 | Descarga, pruebas, correcciones y reclasificación de nivel. |
| 5 | Combinaciones 1-2-3 y 1-1-2, pivotes y defensa de tronco. |
| 6 | Manoplas, saco por rounds, potencia con balón o bandas y sparring técnico muy guiado. |
| 7 | Fintas básicas, ataque-salida e intervalos de resistencia específica. |
| 8 | Descarga, video y pruebas mensuales. |
| 9 | Táctica por larga y media distancia, contraataque simple. |
| 10 | Rounds más específicos, tempo, presión y potencia específica. |
| 11 | Integración táctica individual y ajuste fino de carga. |
| 12 | Taper escolar, pruebas finales, informe de progreso y nueva entrada al siguiente ciclo. |

## 9.3 Semana tipo

| Día | Objetivo de clase | RPE meta | Nota operativa |
| --- | --- | --- | --- |
| Lunes | Técnica base, juego de pies y fuerza general | 5-6 | Ideal para revisar fundamentos y subgrupos<br>nuevos. |
| Martes | Defensa, cabeceo y resistencia específica | 6-7 | Registrar molestias y control técnico bajo fatiga. |
| Miércoles | Combinaciones y fuerza-potencia | 6-7 | Agregar movilidad si se opera solo L-V. |
| Jueves | Táctica y sparring técnico condicionado | 7-8 | Sparring solo por perfiles aptos y con tareas<br>claras. |
| Viernes | Intervalos específicos, manoplas/saco y core | 7-8 | Cerrar con recuperación guiada y feedback. |
| Sábado opcional | Movilidad, aeróbico suave, video, técnica fina y pruebas<br>cortas | 3-5 | Funciona como descarga, regularización o<br>evaluación. |

La app debe mostrar el objetivo de la sesión y el RPE meta. Después de clase se registra RPE real, minutos, carga de sesión = minutos x RPE, observaciones y molestias.

## P-11 Planeación semanal de clases

| Elemento | Definición |
| --- | --- |
| Objetivo | Transformar el ciclo de 12 semanas en sesiones concretas por horario y nivel. |
| Responsable principal | Coordinador deportivo / dueño / instructor principal |
| Disparador / frecuencia | Cada semana, antes del lunes |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Revisar semana actual del ciclo y objetivos por nivel. | Plan semanal |
| 2 | Revisar estadísticas de asistencia, RPE, dolor y evaluaciones. | Dashboard deportivo |
| 3 | Definir objetivo por día y RPE meta. | Plan de sesión |
| 4 | Preparar variantes por nivel y edad. | Subgrupos |


| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 5 | Marcar alumnos con evaluación pendiente o restricciones. | Lista de seguimiento |

| Control | Cómo se verifica |
| --- | --- |
| Plan visible | Instructor ve el plan antes de la clase. |
| Carga progresiva | Semanas 4, 8 y 12 deben descargar y evaluar. |
| Restricciones | Alumnos con dolor o lesión no reciben misma carga. |

Excepciones: Si hay evento, torneo o baja asistencia, el coordinador puede ajustar la sesión y dejar motivo.

Métricas asociadas: Sesiones planificadas, sesiones modificadas, cumplimiento de plan.

## P-12 Ejecución de clase con panel de instructor

| Elemento | Definición |
| --- | --- |
| Objetivo | Guiar la clase y registrar asistencia, restricciones y observaciones sin interrumpir la operación. |
| Responsable principal | Instructor |
| Disparador / frecuencia | Cada clase |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Abrir pantalla de clase del día. | Panel abierto |
| 2 | Registrar check-in y revisar alertas: vencidos, edad, lesión, restricciones. | Lista de presentes |
| 3 | Dividir subgrupos por nivel, edad, peso y objetivo. | Subgrupos sugeridos |
| 4 | Ejecutar calentamiento, técnica, bloque principal y vuelta a la calma. | Plan ejecutado |
| 5 | Registrar incidentes o molestias al momento. | Incidente o dolor |
| 6 | Marcar alumnos para feedback post clase. | Lista de feedback |

| Control | Cómo se verifica |
| --- | --- |
| No vencidos sin control | El panel bloquea o alerta antes de entrenar. |
| Seguridad | Menores, lesiones y restricciones aparecen en rojo/ámbar. |
| Trazabilidad | Instructor queda asociado a la clase. |

Excepciones: Clase muy llena: usar estaciones y priorizar observaciones de alumnos con alerta.

Métricas asociadas: Asistencia por clase, alertas atendidas, incidentes.

## P-13 Seguimiento post clase

| Elemento | Definición |
| --- | --- |
| Objetivo | Capturar información mínima para personalizar sin cargar demasiado al instructor. |
| Responsable principal | Instructor |
| Disparador / frecuencia | Al terminar cada clase o antes de cerrar turno |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Registrar RPE general de la sesión y duración. | Carga de grupo |
| 2 | Registrar alumnos con observación técnica relevante. | Observaciones |
| 3 | Registrar dolor o molestia reportada. | Dolor 0-10 |
| 4 | Seleccionar corrección principal para la próxima clase. | Tarea individual |
| 5 | Enviar feedback automático o semiautomático al alumno. | Mensaje de progreso |

| Control | Cómo se verifica |
| --- | --- |
| Mínimo viable | No se exige escribir notas largas para todos; se priorizan alertas y objetivos. |
| Feedback reusable | Plantillas para no perder tiempo. |
| Carga | RPE y minutos alimentan reportes. |

Excepciones: Si el instructor no pudo capturar al momento, debe completar antes de iniciar el siguiente turno.


Métricas asociadas: Notas por clase, feedback enviado, alumnos con seguimiento pendiente.

## P-14 Evaluación mensual

| Elemento | Definición |
| --- | --- |
| Objetivo | Medir progreso técnico y físico en semanas 4, 8 y 12. |
| Responsable principal | Instructor / coordinador deportivo |
| Disparador / frecuencia | Semana 4, 8 y 12 del ciclo |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Generar lista de alumnos con evaluación pendiente. | Lista de evaluación |
| 2 | Aplicar batería corta o completa según semana. | Resultados |
| 3 | Registrar técnica 1-5: postura, guardia, pies, defensa, cabeceo, combinaciones y distancia. | Rúbrica |
| 4 | Subir video corto si es posible. | Video |
| 5 | Decidir: mantener nivel, progresar o reducir carga/revisar. | Decisión |
| 6 | Enviar informe breve de progreso al alumno. | Reporte al alumno |

| Control | Cómo se verifica |
| --- | --- |
| Criterios | Nadie sube de nivel solo por antigüedad o pago. |
| Seguridad | Dolor alto o lesión bloquea progresión. |
| Comparativo | Se compara contra evaluación previa. |

Excepciones: Si el alumno falta en semana de prueba, el sistema reprograma evaluación.

Métricas asociadas: Evaluaciones realizadas, mejoras por nivel, progresiones, revisiones por lesión.

## P-15 Progresión de nivel

| Elemento | Definición |
| --- | --- |
| Objetivo | Mover alumnos de principiante a intermedio o avanzado con criterios claros. |
| Responsable principal | Coordinador deportivo / instructor principal |
| Disparador / frecuencia | Después de evaluación mensual o revisión técnica |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Revisar asistencia mínima y cumplimiento de plan. | Asistencia |
| 2 | Revisar técnica 1-5 y video. | Rúbrica |
| 3 | Revisar RPE, recuperación y molestias. | Carga y bienestar |
| 4 | Validar seguridad: guardia, postura, defensa y control emocional. | Checklist |
| 5 | Registrar decisión y objetivo del nuevo nivel. | Cambio de nivel |
| 6 | Comunicar al alumno su avance y nuevas metas. | Mensaje |

| Control | Cómo se verifica |
| --- | --- |
| Aprobación | Cambio a avanzado o competitivo requiere instructor principal. |
| No forzar | Si hay lesión o dolor persistente, se mantiene o reduce carga. |
| Trazabilidad | El historial muestra cuándo y por qué subió. |

Excepciones: Alumno con experiencia previa puede iniciar en intermedio si pasa evaluación y no tiene banderas de riesgo.

Métricas asociadas: Progresiones por mes, alumnos estancados, bajas después de progresión.


## P-16 Incidentes, lesión y seguridad

| Elemento | Definición |
| --- | --- |
| Objetivo | Registrar y actuar ante molestias, golpes, mareos, caídas o signos de alarma. |
| Responsable principal | Instructor / dueño |
| Disparador / frecuencia | Cada incidente o molestia relevante |

| Paso | Actividad | Evidencia mínima |
| --- | --- | --- |
| 1 | Detener actividad si hay señal de alarma o dolor alto. | Clase detenida para el alumno |
| 2 | Registrar incidente: fecha, actividad, síntoma, acción tomada y testigos. | Registro de incidente |
| 3 | Marcar restricción temporal en perfil del alumno. | Alerta visible |
| 4 | Informar al dueño y tutor si es menor. | Notificación |
| 5 | No permitir sparring o carga alta hasta resolver restricción. | Bloqueo deportivo |
| 6 | Cerrar incidente con seguimiento. | Cierre |

| Control | Cómo se verifica |
| --- | --- |
| Banderas rojas | Mareo, desorientación, visión borrosa, náusea o respuesta lenta detienen participación. |
| Restricción visible | El instructor siguiente ve la alerta. |
| Menores | Tutor informado cuando aplique. |

Excepciones: Lesiones leves pueden registrarse como molestia 0-10 sin incidente formal, pero si se repite se crea alerta.

Métricas asociadas: Incidentes por mes, dolor promedio, reincidencias, ejercicios asociados.

# 10. Panel del instructor

El panel del instructor debe ser rápido, visual y accionable. La prioridad es que en menos de 30 segundos el instructor sepa quién está en clase, quién está vencido, quién tiene restricción y qué enfoque trabajar.

## 10.1 Vista de clase

| Bloque visual | Información mostrada | Acción del instructor |
| --- | --- | --- |
| Encabezado | Fecha, hora, instructor, objetivo del día, RPE meta, semana del ciclo | Confirmar plan y empezar clase |
| Resumen | Presentes, vencidos, pendientes de pago, restricciones, evaluaciones<br>pendientes | Atender alertas antes de iniciar |
| Subgrupos | Principiantes, intermedios, avanzados; sugerencia por edad/peso | Organizar estaciones |
| Lista de alumnos | Foto, nombre, edad, nivel, estado de pago, objetivo y alerta | Registrar asistencia o abrir ficha |
| Plan de sesión | Calentamiento, técnica, bloque principal, acondicionamiento, vuelta a la<br>calma | Seguir estructura |
| Post clase | RPE, observaciones, molestias, feedback y tareas | Cerrar seguimiento |

## 10.2 Ficha rápida de alumno

Foto y nombre Edad | categoría | nivel | guardia Membresía: activa/vencida hasta fecha Objetivo personal Última observación técnica Restricciones / lesiones Asistencias del mes RPE y dolor últimos 7 días Botones: asistencia, pago, observación, dolor, evaluación, historial


## 10.3 Alertas visuales recomendadas

| Color / prioridad | Alerta | Acción |
| --- | --- | --- |
| Rojo | Membresía vencida, dolor 7/10 o más, incidente abierto, menor sin<br>consentimiento | Bloquear o detener hasta resolver |
| Ámbar | Evaluación pendiente, baja asistencia, molestia leve, pago por vencer | Atender durante clase o seguimiento |
| Verde | Activo, sin restricciones, objetivo asignado | Entrenar normal |
| Azul | Logro, progreso o evaluación positiva | Reconocer y comunicar al alumno |

## 10.4 Acciones rápidas

- Registrar asistencia.
- Registrar pago si tiene permiso.
- Marcar alumno como observado hoy.
- Añadir nota técnica rápida desde plantillas.
- Registrar dolor o molestia 0-10.
- Programar evaluación.
- Enviar feedback al alumno.
# 11. Experiencia personalizada del alumno

El alumno debe sentir que no solo compró acceso al gimnasio, sino un proceso de mejora. La personalización no requiere planes individuales complejos para todos: basta con objetivos claros, feedback breve y progreso visible.

## 11.1 Qué ve el alumno

| Pantalla / mensaje | Contenido |
| --- | --- |
| Inicio | Nombre, foto, vencimiento, asistencias del mes y próximo objetivo. |
| Progreso | Nivel, evaluaciones, mejoras, logros y pendientes. |
| Pagos | Historial, comprobantes, folios, fecha de vencimiento. |
| Entrenamiento | Objetivo de la semana y tarea recomendada. |
| Feedback | Qué hizo bien, qué debe corregir y qué se trabajará la próxima clase. |

## 11.2 Mensajes automáticos

| Evento | Mensaje base |
| --- | --- |
| Bienvenida | Bienvenido/a, {nombre}. Tu plan inicia hoy y vence el {fecha}. Recuerda traer vendas, guantes y botella. |
| Pago registrado | Gracias, {nombre}. Recibimos tu pago de {monto} por {concepto}. Vence el {fecha}. Folio: {folio}. |
| Por vencer | Hola, {nombre}. Tu membresía vence el {fecha}. Puedes renovar antes de tu próxima clase. |
| Vencido | Hola, {nombre}. Tu membresía está vencida desde {fecha}. Para entrenar, registra tu renovación. |
| Feedback | Buen trabajo, {nombre}. Hoy mejoraste {logro}. Para la próxima clase trabajaremos {correccion}. |
| Baja asistencia | Te extrañamos, {nombre}. Llevas varios días sin entrenar. Esta semana podemos retomar con carga gradual. |
| Logro | Felicidades, {nombre}. Completaste {logro}. Tu siguiente objetivo es {meta}. |


## 11.3 Logros recomendados

| Logro | Condición |
| --- | --- |
| Constancia 10 | 10 asistencias en el mes. |
| Primer ciclo completo | Completa 12 semanas con evaluación final. |
| Guardia sólida | Calificación 4/5 en guardia y postura. |
| Resistencia 3 rounds | Completa saco 3 x 3 con técnica estable. |
| Técnica limpia | 4/5 en postura, pies y combinación básica. |
| Regreso fuerte | Vuelve después de 14 días de ausencia y completa 3 clases. |

# 12. Reportes, tableros e indicadores

El dueño debe recibir información diaria para controlar dinero y asistencia, e información semanal/mensual para dirigir el negocio y el programa deportivo.

## 12.1 Reporte diario del dueño

| Indicador | Detalle |
| --- | --- |
| Total efectivo | Suma de pagos en efectivo por turno e instructor. |
| Total transferencia / tarjeta | Separado por método y estado de validación. |
| Ingresos totales | Total del día por concepto. |
| Pagos registrados | Alumno, monto, método, folio y usuario que cobró. |
| Turnos de caja | Abiertos, cerrados, pendientes de entrega y diferencias. |
| Vencidos que asistieron | Alumno, instructor, motivo y autorización. |
| Cancelaciones/descuentos | Usuario, monto, motivo y autorizador. |
| Asistencia del día | Por horario, nivel y categoría de edad. |
| Incidentes o lesiones | Resumen y alumnos restringidos. |

## 12.2 Dashboard semanal

| Área | Indicadores |
| --- | --- |
| Ventas y caja | Ingresos por método, planes vendidos, efectivo pendiente, diferencias, descuentos, cortesías. |
| Membresías | Activos, vencidos, renovaciones, bajas, congelados y pruebas. |
| Asistencia | Asistencia por horario, alumno, edad, nivel y frecuencia esperada. |
| Retención | Alumnos en riesgo por baja asistencia, vencidos no renovados y pruebas no convertidas. |
| Entrenamiento | Carga semanal, RPE promedio, evaluaciones pendientes, progresión de nivel. |
| Seguridad | Dolor alto, incidentes, lesiones por edad/nivel/ejercicio. |

## 12.3 Indicadores clave

| KPI | Fórmula sugerida | Uso |
| --- | --- | --- |
| Retención mensual | Alumnos activos fin de mes / alumnos activos inicio de<br>mes | Medir fidelización. |
| Renovación puntual | Renovaciones antes o en fecha / vencimientos del<br>periodo | Medir cobranza. |
| Asistencia promedio | Asistencias totales / alumnos activos | Medir uso real del gimnasio. |
| Riesgo de abandono | Alumno con 7+ días sin asistir o membresía vencida | Activar seguimiento. |
| Diferencia de caja | Efectivo contado - efectivo esperado | Control financiero. |
| Evaluaciones cumplidas | Evaluaciones realizadas / evaluaciones programadas | Calidad del programa. |
| Progreso técnico | Promedio de mejora de rúbrica por ciclo | Medir resultado deportivo. |
| Dolor alto | Alumnos con dolor >= 7 / alumnos presentes | Prevención de lesiones. |


# 13. Reglas de negocio y automatizaciones

## 13.1 Reglas administrativas

| ID | Regla |
| --- | --- |
| RN-001 | No se puede registrar asistencia normal si la membresía está vencida. |
| RN-002 | Un pago en efectivo exige turno de caja abierto. |
| RN-003 | Un pago registrado no se elimina; se cancela o reversa con motivo y permiso. |
| RN-004 | Todo descuento mayor a un límite definido requiere autorización del dueño. |
| RN-005 | La fecha de vencimiento se actualiza por plan, no por edición libre. |
| RN-006 | El cierre de caja no puede omitirse si hubo pagos en efectivo. |
| RN-007 | Una cortesía debe tener fecha fin o número máximo de clases. |
| RN-008 | Un usuario desactivado no puede iniciar sesión ni aparecer como cobrador. |

## 13.2 Reglas deportivas

| ID | Regla |
| --- | --- |
| RD-001 | Menores deben tener tutor y consentimientos antes de entrenamiento formal. |
| RD-002 | Alumno con dolor 7/10 o más genera alerta roja y restricción temporal. |
| RD-003 | Sparring intenso solo para perfiles aptos, sin lesiones y con progresión técnica. |
| RD-004 | Un alumno nuevo inicia con evaluación o nivel provisional conservador. |
| RD-005 | El cambio de nivel exige criterios técnicos, asistencia y recuperación adecuados. |
| RD-006 | Semanas 4, 8 y 12 se usan para descarga, evaluación y ajuste. |
| RD-007 | La carga de sesión se calcula como minutos x RPE. |
| RD-008 | El instructor debe registrar incidente si hay mareo, desorientación, dolor intenso o golpe preocupante. |

## 13.3 Automatizaciones de alerta

| Disparador | Acción automática |
| --- | --- |
| Pago en efectivo registrado | Notificar al dueño o incluir en reporte inmediato. |
| Turno sin cierre | Enviar alerta y bloquear nuevo turno al usuario. |
| Diferencia de caja | Enviar alerta roja al dueño y requerir explicación. |
| Alumno vencido intenta entrar | Bloquear check-in normal y mostrar cobro. |
| Alumno faltó 7 días | Enviar mensaje de recuperación. |
| Alumno cumple 10 asistencias | Enviar felicitación. |
| Evaluación pendiente | Mostrar en panel del instructor. |
| Dolor alto | Crear restricción y alerta visible. |

# 14. Especificación funcional para desarrollo de la app

Esta sección sirve para entregar a un desarrollador o equipo técnico. Los requisitos están priorizados para construir primero un MVP funcional y luego ampliar personalización.


## 14.1 Requisitos funcionales MVP

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-001 | Crear, editar y consultar alumnos con foto, fecha de nacimiento, teléfono y contacto de emergencia. | Alta |
| RF-002 | Calcular edad y categoría de edad automáticamente. | Alta |
| RF-003 | Gestionar planes, membresías, fecha de inicio, vencimiento y estado. | Alta |
| RF-004 | Registrar pagos con folio, método, monto, usuario, turno y comprobante. | Alta |
| RF-005 | Actualizar vencimiento automáticamente al registrar pago. | Alta |
| RF-006 | Enviar comprobante digital al alumno. | Alta |
| RF-007 | Registrar asistencia con validación de foto y estado de membresía. | Alta |
| RF-008 | Bloquear o alertar check-in de alumnos vencidos. | Alta |
| RF-009 | Abrir y cerrar turno de caja por usuario. | Alta |
| RF-010 | Calcular efectivo esperado y registrar efectivo contado, foto y diferencia. | Alta |
| RF-011 | Confirmar efectivo recibido por dueño. | Alta |
| RF-012 | Manejar roles y permisos. | Alta |
| RF-013 | Registrar perfil deportivo: nivel, objetivo, restricciones y lesiones. | Alta |
| RF-014 | Mostrar panel de instructor con clase del día, alumnos, alertas y plan. | Alta |
| RF-015 | Registrar observación técnica, RPE y dolor por alumno o clase. | Media |
| RF-016 | Registrar evaluación mensual con rúbrica técnica 1-5. | Media |
| RF-017 | Generar reportes diarios de caja, pagos, vencidos y asistencia. | Alta |
| RF-018 | Generar estadísticas por edad, nivel, asistencia y retención. | Media |

## 14.2 Requisitos no funcionales

| Categoría | Requisito |
| --- | --- |
| Seguridad | Autenticación individual, roles, bitácora de auditoría y bloqueo de acciones sensibles. |
| Disponibilidad | La app debe funcionar en tablet/celular; si se cae internet, tener modo de contingencia controlado. |
| Privacidad | Proteger fotos, datos de menores, datos de salud y contactos. |
| Usabilidad | Check-in y cobro deben completarse en menos de 30 segundos. |
| Trazabilidad | Todo cambio de pago, vencimiento, nivel o restricción debe guardar usuario, hora y motivo. |
| Respaldos | Respaldos automáticos diarios y exportación mensual. |
| Escalabilidad | Soportar múltiples horarios, instructores, sucursales y planes. |

## 14.3 Roadmap sugerido

| Fase | Duración sugerida | Entregables |
| --- | --- | --- |
| Fase 1 - Control operativo | 2 a 4 semanas | Alumnos, foto, membresías, pagos, asistencia, caja, reportes diarios, roles. |
| Fase 2 - Panel de instructor | 2 a 4 semanas | Clase del día, alertas, perfil deportivo, observaciones, RPE, dolor. |
| Fase 3 - Evaluaciones y portal<br>alumno | 3 a 6 semanas | Evaluación mensual, progreso, mensajes, logros, historial. |
| Fase 4 - Analítica y<br>automatizaciones | Continuo | Estadísticas por edad, retención, recomendaciones, riesgo de abandono,<br>integraciones. |


# 15. Implementación operativa

## 15.1 Plan de arranque

| Semana | Actividad | Resultado |
| --- | --- | --- |
| Semana 1 | Cargar catálogo de planes, usuarios, roles y alumnos activos. | Base administrativa lista. |
| Semana 2 | Tomar fotos, completar fechas de nacimiento, vencimientos y teléfonos. | Identificación y vencimientos confiables. |
| Semana 3 | Activar pagos, folios, comprobantes y corte de caja. | Control de ingresos. |
| Semana 4 | Activar panel de instructor, asistencia y alertas de vencidos. | Operación diaria controlada. |
| Semana 5 | Agregar perfil deportivo, edad, nivel, restricciones y objetivos. | Seguimiento personalizado. |
| Semana 6 | Iniciar evaluaciones mensuales y reportes de progreso. | Progreso medible. |

## 15.2 Capacitación del equipo

| Tema | Quién debe saberlo | Práctica obligatoria |
| --- | --- | --- |
| Alta de alumno | Recepción/admin | Crear alumno completo con foto y plan. |
| Cobro y recibo | Recepción/instructor autorizado | Registrar pago efectivo y enviar comprobante. |
| Cierre de caja | Todo usuario que cobre | Abrir turno, cerrar turno y subir foto de efectivo. |
| Check-in | Instructores | Registrar asistencia y resolver vencido. |
| Panel de instructor | Instructores | Ver alertas, plan y observaciones. |
| Incidentes | Instructores | Registrar lesión y restricción. |
| Reportes | Dueño/admin | Revisar caja, vencidos y asistencia diaria. |

## 15.3 Política de adopción

- Durante las primeras dos semanas se permite corrección con supervisión, pero no se debe operar fuera del sistema.
- Después del arranque, pago sin folio se considera falta operativa.
- El dueño debe revisar diariamente el reporte de caja hasta que el equipo tenga disciplina.
- No se debe aceptar la frase "lo registro después" como práctica normal.
- Las métricas se revisan semanalmente para ajustar horarios, programas y promociones.
# 16. Checklists y formatos operativos

## 16.1 Checklist de apertura diaria

| No. | Actividad | Responsable |
| --- | --- | --- |
| 1 | Iniciar sesión con usuario propio. | Instructor/recepción |
| 2 | Abrir turno de caja si se cobrará efectivo. | Usuario que cobra |
| 3 | Verificar alumnos vencidos esperados para el horario. | Recepción/instructor |
| 4 | Revisar plan de clase del día y RPE meta. | Instructor |
| 5 | Revisar alertas de lesión, menores y evaluaciones pendientes. | Instructor |
| 6 | Verificar equipo mínimo, botiquín, timer y limpieza. | Instructor |


## 16.2 Checklist de cierre diario

| No. | Actividad | Responsable |
| --- | --- | --- |
| 1 | Registrar observaciones post clase y molestias relevantes. | Instructor |
| 2 | Cerrar turno de caja con efectivo contado y foto. | Usuario que cobró |
| 3 | Revisar diferencias de caja. | Dueño/admin |
| 4 | Confirmar efectivo recibido o dejar pendiente. | Dueño |
| 5 | Revisar vencidos que asistieron sin pago. | Dueño/admin |
| 6 | Revisar descuentos, cortesías y cancelaciones. | Dueño/admin |
| 7 | Enviar o revisar reporte diario. | Sistema/dueño |

## 16.3 Formato de ficha de alumno

| Sección | Campos |
| --- | --- |
| Identificación | ID, nombre, foto, teléfono, correo, fecha de nacimiento, edad calculada. |
| Emergencia | Contacto, teléfono, parentesco, tutor si es menor. |
| Membresía | Plan, fecha inicio, vencimiento, estado, historial de pagos. |
| Deportivo | Nivel, categoría de edad, objetivo, guardia, frecuencia esperada, restricciones. |
| Salud | Lesiones, molestias, alergias relevantes, notas de seguridad. |
| Seguimiento | Asistencia, RPE, evaluaciones, observaciones, logros. |

## 16.4 Formato de evaluación mensual

| Campo | Valor |
| --- | --- |
| Mesociclo / semana | Semana 0, 4, 8 o 12 |
| Peso / estatura | Opcional según objetivo y política del gimnasio |
| Prueba de saco | 3 x 3 min o variante por nivel |
| Flexiones 30 s | Número de repeticiones |
| Abdominales 30 s | Número de repeticiones |
| Salto / balón medicinal | Potencia, si aplica |
| Técnica 1-5 | Postura, guardia, pies, defensa, cabeceo, combinaciones, distancia |
| Decisión | Mantener nivel, progresar, reducir carga o revisar |
| Acciones correctivas | Objetivos del siguiente mes |

## 16.5 Formato de cierre de caja

| Campo | Detalle |
| --- | --- |
| Turno | Fecha, hora inicio, hora fin, usuario responsable. |
| Fondo inicial | Monto de caja chica si aplica. |
| Efectivo esperado | Suma automática de pagos en efectivo. |
| Efectivo contado | Monto físico al cierre. |
| Diferencia | Contado - esperado. |
| Foto de efectivo | Adjuntar imagen del efectivo contado. |
| Transferencias/tarjeta | Resumen por método y estado. |
| Observaciones | Motivo de diferencia o incidencia. |
| Firma/cierre digital | Usuario y hora. |
| Confirmación del dueño | Recibido, diferencia en revisión o pendiente. |


## 16.6 Formato de incidente

| Campo | Detalle |
| --- | --- |
| Alumno | Nombre, edad, nivel, tutor si aplica. |
| Fecha y clase | Horario, instructor y actividad que realizaba. |
| Tipo de incidente | Dolor, mareo, golpe, caída, corte, lesión previa, otro. |
| Síntomas observados | Dolor 0-10, mareo, visión borrosa, náusea, equilibrio, respuesta lenta, etc. |
| Acción tomada | Detener, hielo, descanso, aviso a tutor, derivación, restricción. |
| Testigos | Instructor, alumnos o personal presente. |
| Restricción creada | Sí/no, duración y condiciones de regreso. |
| Seguimiento | Fecha de revisión y responsable. |

# 17. Matriz de riesgos y controles

| Riesgo | Señal de alerta | Control preventivo | Control detectivo |
| --- | --- | --- | --- |
| Instructor cobra efectivo y no<br>registra | Alumno no recibe comprobante;<br>efectivo no aparece en corte | Comprobante obligatorio, letrero, turno<br>abierto | Reporte de vencidos que<br>asistieron y auditoría de pagos |
| Instructor cambia vencimiento sin<br>pago | Alumno activo sin pago reciente | Bloquear edición de vencimiento | Reporte de activos sin pago<br>asociado |
| Pago borrado o modificado | Historial inconsistente | No borrar; reversa con permiso | Auditoría de cambios y reporte<br>diario |
| Descuentos falsos | Muchos descuentos por usuario | Permisos y límites | Reporte de descuentos con<br>motivo |
| Caja con faltantes | Diferencia negativa | Corte por turno y foto de efectivo | Confirmación del dueño y análisis<br>por usuario |
| Alumno vencido entrena | Asistencia sin pago | Bloqueo en check-in | Reporte diario de vencidos que<br>asistieron |
| Lesión por mala mezcla de<br>niveles | Novato con avanzado o menor con<br>adulto fuerte | Subgrupos por edad, nivel y peso | Incidentes por clase y alertas de<br>seguridad |
| Pérdida de alumnos por falta de<br>seguimiento | Baja asistencia y vencimientos no<br>renovados | Objetivo semanal y feedback | Reporte de riesgo de abandono |

# 18. Gobierno, revisión y mejora continua

El sistema debe revisarse de forma periódica. La app da datos, pero el dueño debe tomar decisiones: ajustar horarios, reforzar cobranza, capacitar instructores y mejorar el programa.

## 18.1 Rutina de revisión del dueño

| Frecuencia | Qué revisar | Acción |
| --- | --- | --- |
| Diario | Caja, efectivo pendiente, vencidos que asistieron, descuentos, incidentes | Corregir diferencias y hablar con responsable. |
| Semanal | Asistencia por horario, riesgo de abandono, vencimientos próximos, RPE y<br>molestias | Ajustar horarios, cargas y mensajes. |
| Mensual | Ingresos, retención, progreso técnico, estadísticas por edad, bajas y<br>conversiones | Definir promociones, cambios de programa y<br>capacitación. |
| Trimestral | Ciclo completo de 12 semanas, resultados, lesiones, rentabilidad por horario | Rediseñar ciclo, paquetes y metas. |

## 18.2 Auditoría mínima mensual

- Seleccionar 10 pagos al azar y confirmar que tengan folio, método, usuario y comprobante.
- Comparar alumnos activos contra pagos recientes y autorizaciones.
- Revisar turnos con diferencias y usuarios asociados.
- Revisar vencidos que asistieron sin pago y motivos.
- Revisar cortesías, descuentos y congelamientos activos.

- Revisar alumnos menores con tutor y consentimientos.
- Revisar incidentes y restricciones abiertas.
## 18.3 Criterios de éxito del proyecto

| Indicador | Meta inicial sugerida |
| --- | --- |
| Pagos con comprobante | 100% |
| Turnos de caja cerrados | 100% |
| Diferencias de caja sin explicar | 0 |
| Alumnos con fecha de nacimiento registrada | 95% o más |
| Alumnos con foto | 95% o más |
| Alumnos con nivel asignado | 90% o más |
| Evaluaciones mensuales realizadas | 80% o más de alumnos activos |
| Vencidos que asistieron sin pago ni autorización | 0 |

# 19. Referencias internas y notas de diseño

Este manual incorpora la estructura técnica del programa de entrenamiento proporcionado para una escuela de box, especialmente los siguientes puntos: ciclo de 12 semanas, tres mesociclos de cuatro semanas, evaluaciones en semana 0, 4, 8 y 12, progresión por niveles, uso de RPE, registro de asistencia, molestias, bienestar, pruebas y rúbrica técnica.

| Fuente interna | Uso dentro del manual |
| --- | --- |
| Programa de entrenamiento de boxeo para una<br>escuela de box | Base para ciclo de 12 semanas, categorías de evaluación, seguimiento RPE, batería<br>mensual, seguridad y progresión técnica. |
| Proceso administrativo propuesto en conversación | Base para caja, cobros, comprobantes, roles, vencidos y auditoría. |
| Requerimiento del dueño | Integración de edad, estadísticas, panel de instructor y trato personalizado. |

Siguiente paso recomendado: convertir este manual en tareas de desarrollo y checklist de capacitación. Primero implementar alumnos, membresías, pagos, caja y asistencia; después panel deportivo, evaluaciones, progreso y portal del alumno.
