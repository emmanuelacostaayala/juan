import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { ensureTrackingTables, PREVIEW_NAMES } from "@/lib/tracking";

export const dynamic = "force-dynamic";

/*
 * /admin/estadisticas — medición de la newsletter con los datos de nuestro servidor
 * (ver lib/tracking.ts). Periodo con ?d=7, ?d=30 o ?d=todo.
 */

type Props = { searchParams: Promise<{ d?: string }> };

const TZ = "Europe/Madrid";
const n = (v: unknown) => Number(v ?? 0);
const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %` : "—");

export default async function EstadisticasPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { d } = await searchParams;
  const days = d === "todo" ? null : d === "30" ? 30 : 7;
  const since = days ? new Date(Date.now() - days * 86_400_000) : new Date(0);
  const chartDays = days ?? 30;

  await ensureTrackingTables();

  const [subs] = await sql<{ activos: number; bajas: number; altas: number; sin_origen: number }[]>`
    SELECT
      count(*) FILTER (WHERE status = 'active')::int AS activos,
      count(*) FILTER (WHERE status = 'unsubscribed')::int AS bajas,
      count(*) FILTER (WHERE created_at >= ${since})::int AS altas,
      count(*) FILTER (WHERE created_at >= ${since} AND source IS NULL)::int AS sin_origen
    FROM subscribers
  `;

  const porDia = await sql<{ dia: string; altas: number }[]>`
    SELECT to_char(g.dia, 'DD/MM') AS dia, count(s.id)::int AS altas
    FROM generate_series(
      (now() AT TIME ZONE ${TZ})::date - ${chartDays - 1}::int,
      (now() AT TIME ZONE ${TZ})::date,
      interval '1 day'
    ) AS g(dia)
    LEFT JOIN subscribers s ON (s.created_at AT TIME ZONE ${TZ})::date = g.dia::date
    GROUP BY g.dia ORDER BY g.dia
  `;

  const porOrigen = await sql<{ origen: string; altas: number }[]>`
    SELECT COALESCE(source, 'sin dato (antes de medir)') AS origen, count(*)::int AS altas
    FROM subscribers WHERE created_at >= ${since}
    GROUP BY 1 ORDER BY 2 DESC
  `;

  const [visitas] = await sql<{ visitas: number; personas: number; altas_pagina: number }[]>`
    SELECT
      (SELECT count(*)::int FROM newsletter_visits WHERE bot IS NULL AND created_at >= ${since}) AS visitas,
      (SELECT count(DISTINCT visitor)::int FROM newsletter_visits WHERE bot IS NULL AND created_at >= ${since}) AS personas,
      (SELECT count(*)::int FROM subscribers WHERE landing = '/newsletter' AND created_at >= ${since}) AS altas_pagina
  `;

  const visitasOrigen = await sql<{ origen: string; personas: number }[]>`
    SELECT COALESCE(source, 'directo') AS origen, count(DISTINCT visitor)::int AS personas
    FROM newsletter_visits WHERE bot IS NULL AND created_at >= ${since}
    GROUP BY 1 ORDER BY 2 DESC
  `;

  const compartidos = await sql<{ red: string; veces: number }[]>`
    SELECT bot AS red, count(*)::int AS veces
    FROM newsletter_visits
    WHERE bot = ANY(${sql.array(PREVIEW_NAMES)}) AND created_at >= ${since}
    GROUP BY 1 ORDER BY 2 DESC
  `;

  const campanas = await sql<{ campana: string; enviados: number; personas: number; clics: number }[]>`
    WITH env AS (
      SELECT campaign, count(*)::int AS enviados FROM email_sends
      WHERE created_at >= ${since} GROUP BY 1
    ), cli AS (
      SELECT campaign,
        count(DISTINCT subscriber_id)::int AS personas,
        count(*)::int AS clics
      FROM email_clicks WHERE bot IS NULL AND created_at >= ${since} GROUP BY 1
    )
    SELECT COALESCE(env.campaign, cli.campaign) AS campana,
      COALESCE(env.enviados, 0) AS enviados,
      COALESCE(cli.personas, 0) AS personas,
      COALESCE(cli.clics, 0) AS clics
    FROM env FULL JOIN cli ON cli.campaign = env.campaign
    ORDER BY enviados DESC
  `;

  const enlaces = await sql<{ campana: string; url: string; clics: number; personas: number }[]>`
    SELECT campaign AS campana, url, count(*)::int AS clics, count(DISTINCT subscriber_id)::int AS personas
    FROM email_clicks WHERE bot IS NULL AND created_at >= ${since}
    GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20
  `;

  const ultimas = await sql<{ nombre: string | null; origen: string | null; landing: string | null; fecha: Date }[]>`
    SELECT trim(concat_ws(' ', name, last_name)) AS nombre, source AS origen, landing, created_at AS fecha
    FROM subscribers ORDER BY created_at DESC LIMIT 15
  `;

  const totalCompartidos = compartidos.reduce((a, r) => a + n(r.veces), 0);
  const maxDia = Math.max(1, ...porDia.map((r) => n(r.altas)));
  const periodo = days ? `últimos ${days} días` : "desde el principio";

  return (
    <div className="st">
      <header className="st__top">
        <div>
          <Link href="/admin" className="st__back">← Volver al panel</Link>
          <h1 className="st__title">Estadísticas</h1>
          <p className="st__muted">Datos de nuestro servidor · {periodo}</p>
        </div>
        <nav className="st__period">
          {[["7", "7 días"], ["30", "30 días"], ["todo", "Todo"]].map(([v, label]) => (
            <Link key={v} href={`/admin/estadisticas?d=${v}`} className={(d ?? "7") === v ? "is-on" : ""}>{label}</Link>
          ))}
        </nav>
      </header>

      <section className="st__kpis">
        <Kpi num={n(subs.activos)} label="Suscriptores activos" />
        <Kpi num={n(subs.altas)} label={`Altas (${periodo})`} />
        <Kpi num={n(visitas.personas)} label="Personas en /newsletter" />
        <Kpi num={pct(n(visitas.altas_pagina), n(visitas.personas))} label="Conversión de /newsletter" />
        <Kpi num={totalCompartidos} label="Veces compartido (mínimo)" />
      </section>

      <section className="st__card">
        <h2>Altas por día</h2>
        <div className="st__bars">
          {porDia.map((r) => (
            <div key={r.dia} className="st__bar" title={`${r.dia}: ${r.altas}`}>
              <span className="st__bar-num">{n(r.altas) || ""}</span>
              <span className="st__bar-fill" style={{ height: `${(n(r.altas) / maxDia) * 100}%` }} />
              <span className="st__bar-day">{r.dia}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="st__grid">
        <Table
          title="¿De dónde vienen las altas?"
          cols={["Origen", "Altas"]}
          rows={porOrigen.map((r) => [r.origen, n(r.altas)])}
          note={n(subs.sin_origen) ? "«Sin dato» son altas anteriores a que empezáramos a medir el origen." : undefined}
        />
        <Table
          title="Visitas a /newsletter por origen"
          cols={["Origen", "Personas"]}
          rows={visitasOrigen.map((r) => [r.origen, n(r.personas)])}
          note="«Directo» incluye WhatsApp, apps y enlaces copiados: no dicen de dónde vienen."
        />
        <Table
          title="Veces compartido, por red"
          cols={["Red", "Vistas previas"]}
          rows={compartidos.map((r) => [r.red, n(r.veces)])}
          note="Cada vez que alguien pega el enlace, la red pide la página para crear la tarjeta. Algunas la guardan en caché unos días: es un mínimo."
        />
        <Table
          title="Correos: envíos y clics"
          cols={["Correo", "Enviados", "Hicieron clic", "% clic"]}
          rows={campanas.map((r) => [r.campana, n(r.enviados), n(r.personas), pct(n(r.personas), n(r.enviados))])}
          note="Se excluyen los clics automáticos de antivirus y filtros de correo."
        />
      </div>

      <Table
        title="Enlaces más pulsados"
        cols={["Correo", "Enlace", "Clics", "Personas"]}
        rows={enlaces.map((r) => [r.campana, r.url, n(r.clics), n(r.personas)])}
      />

      <Table
        title="Últimas altas"
        cols={["Nombre", "Fecha", "Origen", "Página"]}
        rows={ultimas.map((r) => [
          r.nombre || "—",
          new Date(r.fecha).toLocaleString("es-ES", { timeZone: TZ, dateStyle: "short", timeStyle: "short" }),
          r.origen ?? "sin dato",
          r.landing ?? "—",
        ])}
      />

      <style>{`
        .st { max-width: 1240px; margin: 0 auto; padding: clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem); color: var(--color-ink); }
        .st__top { display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
        .st__back { font-size: var(--fs-13); color: var(--fg-muted); text-decoration:none; }
        .st__title { font-family: var(--font-display); font-size: clamp(var(--fs-36),5vw,var(--fs-52)); font-weight:500; letter-spacing:-0.03em; margin:0.25rem 0; }
        .st__muted { color: var(--fg-muted); font-size: var(--fs-13); margin:0; }
        .st__period { display:flex; gap:0.25rem; }
        .st__period a { padding:0.5rem 0.875rem; border:1px solid rgba(0,0,0,0.15); border-radius: var(--radius-sm); font-size: var(--fs-13); text-decoration:none; color: var(--color-ink); }
        .st__period a.is-on { background: var(--color-ink); color: var(--color-white); }
        .st__kpis { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:1rem; margin-bottom:1.5rem; }
        .st__kpi { padding:1.25rem 1.5rem; background: var(--color-cream); border-radius: var(--radius-md); display:flex; flex-direction:column; gap:0.25rem; }
        .st__kpi-num { font-family: var(--font-display); font-size: var(--fs-36); font-weight:500; line-height:1; }
        .st__kpi-label { font-size: var(--fs-13); color: var(--fg-muted); letter-spacing:0.04em; text-transform:uppercase; }
        .st__card { border:1px solid rgba(0,0,0,0.08); border-radius: var(--radius-md); padding:1.25rem 1.5rem; margin-bottom:1.5rem; background: var(--color-white); }
        .st__card h2 { font-family: var(--font-display); font-size: var(--fs-20, 20px); font-weight:500; margin:0 0 1rem; }
        .st__grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(340px,1fr)); gap:1.5rem; }
        .st__bars { display:flex; align-items:flex-end; gap:4px; height:180px; }
        .st__bar { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%; min-width:0; }
        .st__bar-fill { width:100%; max-width:28px; background: var(--color-ink); border-radius:3px 3px 0 0; min-height:1px; }
        .st__bar-num { font-size:11px; margin-bottom:2px; }
        .st__bar-day { font-size:10px; color: var(--fg-muted); margin-top:4px; white-space:nowrap; }
        .st table { width:100%; border-collapse:collapse; font-size: var(--fs-14, 14px); }
        .st th { text-align:left; font-weight:500; color: var(--fg-muted); font-size: var(--fs-13); border-bottom:1px solid rgba(0,0,0,0.1); padding:0.4rem 0.5rem; }
        .st td { border-bottom:1px solid rgba(0,0,0,0.05); padding:0.5rem; word-break: break-word; }
        .st td:not(:first-child), .st th:not(:first-child) { text-align:right; }
        .st__note { color: var(--fg-muted); font-size: 12px; margin: 0.75rem 0 0; }
        .st__empty { color: var(--fg-muted); font-size: var(--fs-13); }
      `}</style>
    </div>
  );
}

function Kpi({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="st__kpi">
      <span className="st__kpi-num">{num}</span>
      <span className="st__kpi-label">{label}</span>
    </div>
  );
}

function Table({ title, cols, rows, note }: { title: string; cols: string[]; rows: (string | number)[][]; note?: string }) {
  return (
    <section className="st__card">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="st__empty">Aún no hay datos.</p>
      ) : (
        <table>
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
      {note && <p className="st__note">{note}</p>}
    </section>
  );
}
