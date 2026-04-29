// Pre-fill bodies for the admin composer. Plain markdown — same renderer as
// the email pipeline so the preview matches exactly.

export type Template = {
  id: string;
  name: string;
  description: string;
  title: string;
  body: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "En blanco",
    description: "Empieza desde cero.",
    title: "",
    body: "",
  },
  {
    id: "letter",
    name: "Carta personal",
    description: "Tono cercano, primera persona.",
    title: "Una nota desde Punta Cana",
    body: `Hola,

Hace unas semanas que no escribía y me apetecía contarte por dónde anda el proyecto.

## El terreno

Acabamos de cerrar la siguiente fase de Larimar City. El equipo ha avanzado en silencio, pero los hitos importan: licencias, urbanización, las primeras unidades.

> Construir territorio no es construir edificios. Es decidir qué tipo de comunidad quieres dejar.

## Lo que viene

- Cierre de la fase de obra del primer hotel.
- Apertura del podcast *Próximamente* con tres invitados de lujo.
- Una pieza larga en prensa nacional que me ilusiona especialmente.

Te lo cuento en cuanto haya algo concreto. Mientras tanto, gracias por leer.

— Juan Andrés
`,
  },
  {
    id: "update",
    name: "Update de proyecto",
    description: "Avances y cifras.",
    title: "Avances · Trimestre Q1",
    body: `## Resumen

Tres titulares de los últimos 90 días. Cifras, no promesas.

## Hitos

- **CLERHP** firma su mayor contrato en LATAM.
- **Larimar City** cierra la fase I de comercialización.
- **Próximamente Podcast** lanza con 4 capítulos grabados.

## Cifras

| Métrica | Q4 2025 | Q1 2026 |
|---|---|---|
| Unidades reservadas | 124 | 318 |
| Empleos generados | 412 | 487 |
| Inversión movilizada (M€) | 28 | 41 |

## Lo que sigue

Reunión con autoridades locales en mayo y apertura de oficinas en Santo Domingo en junio. Te tendré al día.
`,
  },
  {
    id: "roundup",
    name: "Selección de lecturas",
    description: "Curaduría de enlaces y artículos.",
    title: "Lo que estoy leyendo",
    body: `Una selección breve de lo que me ha hecho parar y pensar este mes.

## Arquitectura

- *La forma del agua* — sobre cómo el Caribe está cambiando la idea de ciudad costera.
- *Construir comunidad antes que vivienda* — El País, columna de opinión.

## Empresa

- *Equipos pequeños, ciclos largos* — un essay corto que recoge bien lo que pienso del management.

## Una cita para cerrar

> El legado no se promete; se construye con lo que haces el lunes por la mañana.

Si has leído algo que te haya marcado, escríbeme. Las mejores conversaciones empiezan así.
`,
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
