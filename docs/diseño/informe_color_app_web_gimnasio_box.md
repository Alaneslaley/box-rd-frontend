---
title: "Informe de color para la app y web del gimnasio de box"
source_pdf: "Informe de color para la app y web del gimnasio de box.pdf"
converted_at: "2026-07-16"
format: "Markdown"
conversion_note: "Conversión textual y estructurada desde PDF. Las tablas, bloques de código y mockups se conservaron en formato Markdown de forma aproximada."
---

# Informe de color para la app y web del gimnasio de box

## Resumen ejecutivo

Sin identidad previa, conviene usar una **familia visual común** y variar el color dominante por contexto:

- **Instructor = control + urgencia**.
- **Alumno = progreso + cercanía**.
- **Web admin/deportivo = confianza + lectura analítica**.

La base debe ser neutral oscura o casi blanca, con **azul** para acciones confiables, **verde** para progreso/éxito, **ámbar** para warning y **rojo** reservado sólo para fraude, vencimientos, fallos o riesgo.

Esto encaja con la operación del gimnasio:

- Pagos, caja y asistencia requieren lectura rápida y estados inequívocos.
- El módulo deportivo exige visibilidad de RPE, dolor y progreso.
- El alumno necesita señales de personalización y avance del ciclo de 12 semanas.

---

## Criterios de diseño

WCAG 2.2 pide:

- **4.5:1** para texto normal.
- **3:1** para texto grande.
- **3:1** para componentes o estados no textuales.

Además:

- El color no puede ser el único medio para comunicar estado.
- Los targets deben medir al menos **24 x 24 px**.
- El sistema debe combinar **color + texto + icono + borde/focus**.

### Mapa de significado por color

| Color | Significado | Uso principal |
| --- | --- | --- |
| Azul | Acción confiable | CTA, links, tabs |
| Verde | Progreso / éxito | Pagos OK, metas, badges |
| Ámbar | Atención preventiva | Vencimientos, carga alta |
| Rojo | Solo riesgo | Fraude, error, bloqueo |
| Neutros | Base visual | Fondos, cards, texto |

---

# Paletas recomendadas

## Instructor móvil

| Rol | HEX | RGB | Uso |
| --- | --- | --- | --- |
| Primaria | `#1D4ED8` | `29,78,216` | Header, tab activa, CTA principal, links |
| Secundaria | `#0F172A` | `15,23,42` | Fondos, cards, texto principal, iconos |
| Acento | `#C2410C` | `194,65,12` | "Iniciar clase", timer, efectivo pendiente |
| Dark alt | `#93C5FD` / `#E5E7EB` / `#FDBA74` | - | Modo oscuro |

**Ratios sugeridos:**

| Combinación | Ratio |
| --- | --- |
| Azul / blanco | **6.7:1** |
| Texto oscuro / claro | **17.8:1** |
| Acento / blanco | **5.18:1** |

Úsala para una UI operativa y rápida: menos emocional, más legible.

---

## Alumno móvil

| Rol | HEX | RGB | Uso |
| --- | --- | --- | --- |
| Primaria | `#4338CA` | `67,56,202` | Hero, progreso, CTA principal |
| Secundaria | `#0F766E` | `15,118,110` | Barras, bienestar, metas |
| Acento | `#E11D48` | `225,29,72` | Logros, feedback destacado, CTA emocional |
| Dark alt | `#A5B4FC` / `#5EEAD4` / `#FDA4AF` | - | Modo oscuro |

**Ratios sugeridos:**

| Combinación | Ratio |
| --- | --- |
| Índigo / blanco | **7.9:1** |
| Teal / blanco | **5.47:1** |
| Rose / blanco | **4.7:1** |

La mezcla comunica guía, salud y cercanía sin perder energía deportiva.

---

## Web administrativo y deportivo

| Rol | HEX | RGB | Uso |
| --- | --- | --- | --- |
| Primaria | `#111827` | `17,24,39` | Texto, sidebar, tablas, cards |
| Secundaria | `#1E40AF` | `30,64,175` | Filtros, botones primarios, links |
| Acento | `#047857` | `4,120,87` | KPIs positivos, progreso, métricas deportivas |
| Extra warning | `#A16207` | `161,98,7` | Vencimientos, anomalías, auditoría |
| Dark alt | `#CBD5E1` / `#93C5FD` / `#A7F3D0` | - | Modo oscuro |

**Ratios sugeridos:**

| Combinación | Ratio |
| --- | --- |
| Slate / claro | **16.98:1** |
| Azul / blanco | **8.72:1** |
| Verde / blanco | **5.48:1** |
| Ámbar / blanco | **4.92:1** |

Es la mejor para finanzas, caja, reportes y lectura de dashboards.

---

# Benchmarks y mockups

Strava usa un eje **oscuro + naranja** muy efectivo para acción inmediata; Nike Training Club privilegia contraste alto y foco en contenido; ClassPass favorece azul limpio y descubrimiento; Mindbody modela bien el back-office de pagos, staff, scheduling y reporting.

## Mockup textual: Instructor

```text
Instructor
[Azul header] Clase del día
[Chip naranja] RPE 6-7
[Card oscura] 18 alumnos | 3 vencidos | 2 alertas
[Botón azul] Registrar asistencia
[Badge rojo] Vencido
```

## Mockup textual: Alumno

```text
Alumno
[Hero índigo] Semana 3 de 12
[Barra teal] Asistencia 8/12
[Card blanca] Feedback del coach
[Chip rose] Logro desbloqueado
```

## Mockup textual: Admin web

```text
Admin web
[Sidebar slate]
[KPI verde] Ingresos hoy
[KPI ámbar] Vencimientos 7 días
[Tabla clara] Caja / pagos / incidencias
[Botón azul] Exportar reporte
```

---

# Reglas, tokens e implementación

No uses rojo como color principal; resérvalo para **error/fraude**.

Mantén una proporción cercana a:

```text
70 / 20 / 10
neutros / color principal / acento
```

## Estados interactivos

| Estado | Regla visual |
| --- | --- |
| Hover | Oscurecer 8-10% |
| Active | Oscurecer 12-16% |
| Disabled | Opacidad + texto secundario |
| Focus | Outline sólido de 2 px con contraste >= 3:1 |

## Tokens CSS base

```css
:root {
  --bg: #F8FAFC;
  --text: #111827;
  --primary: #1D4ED8;
  --success: #15803D;
  --warning: #A16207;
  --danger: #B91C1C;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.input:focus {
  outline: 2px solid #1D4ED8;
  outline-offset: 2px;
}
```

## Tokens JavaScript / TypeScript

```ts
const tokens = {
  bg: '#F8FAFC',
  text: '#111827',
  primary: '#4338CA',
  accent: '#0F766E'
};
```

---

# Accesibilidad y pruebas

Checklist recomendado:

- Contraste AA / AAA.
- No depender sólo del color.
- Iconos + etiquetas en badges.
- Focus visible.
- Targets >= 24 px.
- Pruebas en sol / exteriores.
- Simulación de daltonismo.
- Dark mode.
- Tablas con soporte 3:1 en bordes y sparklines.
- Alertas financieras con texto explícito, por ejemplo:
  - "Pago cancelado".
  - "Caja con diferencia".
- En apps deportivas, probar lectura con fatiga y movimiento.

---

# Fuentes y recursos

## Base normativa

- WCAG 2.2.
- WebAIM Contrast.
- Understanding Success Criterion 1.4.3: Contrast (Minimum) | WAI | W3C.
- Understanding Success Criterion 1.4.1: Use of Color | WAI | W3C.
- Understanding Success Criterion 2.5.8: Target Size (Minimum) | WAI | W3C.

## Benchmarks

- Strava Mobile.
- ClassPass Reviews.
- Mindbody Business.
- Cobertura pública de Nike Training Club.

## Contexto funcional interno

El contexto funcional proviene del programa de entrenamiento del gimnasio de box, que prioriza:

- Objetivo del día.
- RPE.
- Dolor / molestia.
- Rounds.
- Seguimiento mensual.

---

# Resumen de decisión visual

| Canal | Color dominante recomendado | Motivo |
| --- | --- | --- |
| Instructor móvil | Azul operativo + acento naranja | Lectura rápida, control de clase y urgencia moderada |
| Alumno móvil | Índigo + teal + rose | Progreso, cercanía, bienestar y motivación |
| Web admin/deportivo | Slate + azul + verde | Confianza, lectura analítica, finanzas y dashboards |

---

# Reglas finales de uso de color

1. No usar rojo como color principal.
2. Reservar rojo para riesgo, error, fraude, bloqueo o vencimientos críticos.
3. Usar verde sólo para éxito, progreso o estados positivos reales.
4. Usar ámbar para advertencias preventivas, no para errores definitivos.
5. Acompañar siempre los estados con texto o icono.
6. Mantener alto contraste en pantallas usadas en recepción, caja o clase.
7. Validar colores en modo claro y modo oscuro.
8. Reutilizar tokens entre app móvil y web para conservar identidad visual.
