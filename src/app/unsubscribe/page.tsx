import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  searchParams: Promise<{ t?: string }>;
};

async function unsubscribeByToken(token: string): Promise<"ok" | "invalid" | "error"> {
  try {
    const result = await sql`
      UPDATE subscribers SET status = 'unsubscribed'
      WHERE unsubscribe_token = ${token}
      RETURNING id
    `;
    return result.length > 0 ? "ok" : "invalid";
  } catch (err) {
    console.error("[unsubscribe-page] error", err);
    return "error";
  }
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { t } = await searchParams;
  const status = t ? await unsubscribeByToken(t) : "invalid";

  return (
    <main className="unsub">
      <div className="unsub__card">
        {status === "ok" && (
          <>
            <h1 className="unsub__title">Hecho.</h1>
            <p className="unsub__text">
              Te hemos dado de baja de la newsletter. No volverás a recibir
              correos.
            </p>
          </>
        )}
        {status === "invalid" && (
          <>
            <h1 className="unsub__title">Enlace no válido.</h1>
            <p className="unsub__text">
              El enlace de baja ha caducado o no corresponde a ningún
              suscriptor. Si quieres dejar de recibir correos, escríbenos a{" "}
              <a href="mailto:info@juanandresromero.es">info@juanandresromero.es</a>.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="unsub__title">Algo falló.</h1>
            <p className="unsub__text">
              No hemos podido procesar la baja. Inténtalo de nuevo en un
              momento.
            </p>
          </>
        )}
        <Link href="/" className="unsub__back">← Volver al inicio</Link>
      </div>

      <style>{`
        .unsub {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          padding: 2rem 1rem;
        }
        .unsub__card {
          width: 100%;
          max-width: 480px;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
          text-align: center;
        }
        .unsub__title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 0.75rem;
          color: var(--color-ink);
        }
        .unsub__text {
          font-size: 1rem;
          line-height: 1.55;
          color: var(--fg-muted);
          margin: 0 0 1.5rem;
        }
        .unsub__back {
          display: inline-block;
          font-size: 0.85rem;
          color: var(--fg-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .unsub__back:hover { color: var(--color-ink); }
      `}</style>
    </main>
  );
}
