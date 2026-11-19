"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  publishNewsletter,
  saveWelcome,
  sendWelcomeToExisting,
  type PublishState,
  type WelcomeState,
  type WelcomeBroadcastState,
} from "@/app/actions/admin-newsletter";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { TEMPLATES, getTemplate } from "@/lib/newsletter-templates";
import { personalize } from "@/lib/personalize";

const initial: PublishState = { ok: false };
const initialWelcome: WelcomeState = { ok: false };
const initialBroadcast: WelcomeBroadcastState = { ok: false };

// Opción extra del desplegable «Plantilla»: no es una publicación, edita el
// correo automático que reciben los nuevos suscriptores.
const WELCOME_ID = "welcome";
const PREVIEW_PERSON = { name: "Marta", lastName: "García López" };
const WELCOME_DESC =
  "Se envía automáticamente a cada persona que se suscribe. Al guardar no se manda nada a nadie: solo cambia lo que recibirán los próximos suscriptores.";

type Post = {
  id: number;
  slug: string;
  title: string;
  sent_at: Date | null;
  recipients_count: number | null;
  created_at: Date;
};

export default function AdminDashboard({
  email,
  subscribers,
  posts,
  welcome,
  welcomeSentAt,
}: {
  email: string;
  subscribers: number;
  posts: Post[];
  welcome: { subject: string; body: string };
  welcomeSentAt: string | null;
}) {
  const [state, action, pending] = useActionState(publishNewsletter, initial);
  const [welcomeState, welcomeAction, welcomePending] = useActionState(
    saveWelcome,
    initialWelcome,
  );
  const [broadcastState, broadcastAction, broadcastPending] = useActionState(
    sendWelcomeToExisting,
    initialBroadcast,
  );
  const [confirmBroadcast, setConfirmBroadcast] = useState(false);
  const [templateId, setTemplateId] = useState("blank");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // Último texto guardado: el del servidor al cargar y, tras guardar, el del editor
  // (así el aviso de «cambios sin guardar» desaparece sin recargar la página).
  const [savedWelcome, setSavedWelcome] = useState(welcome);
  const lastSavedState = useRef(welcomeState);
  useEffect(() => {
    if (welcomeState !== lastSavedState.current) {
      lastSavedState.current = welcomeState;
      if (welcomeState.ok) setSavedWelcome({ subject: title.trim(), body: body.trim() });
    }
  }, [welcomeState, title, body]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploading, setUploading] = useState<"cover" | "inline" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const isWelcome = templateId === WELCOME_ID;
  // El botón de envío manda lo GUARDADO: si el editor tiene cambios, primero hay que guardar.
  const welcomeDirty =
    isWelcome && (title.trim() !== savedWelcome.subject || body.trim() !== savedWelcome.body);

  // Apply template content
  function applyTemplate(id: string) {
    setTemplateId(id);
    if (id === WELCOME_ID) {
      setTitle(savedWelcome.subject);
      setBody(savedWelcome.body);
      setCoverImageUrl("");
      return;
    }
    const tpl = getTemplate(id);
    setTitle(tpl.title);
    setBody(tpl.body);
  }

  // Debounced live preview
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch("/api/admin/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // En la bienvenida, la vista previa muestra un suscriptor de ejemplo.
          body: JSON.stringify(
            templateId === WELCOME_ID
              ? {
                  title: personalize(title, PREVIEW_PERSON),
                  body: personalize(body, PREVIEW_PERSON),
                  coverImageUrl,
                }
              : { title, body, coverImageUrl },
          ),
        });
        if (res.ok) {
          const j = await res.json();
          setPreviewHtml(j.html ?? "");
        }
      } finally {
        setPreviewLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [title, body, coverImageUrl, templateId]);

  async function uploadFile(file: File): Promise<string | null> {
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json();
    if (!res.ok) {
      setUploadError(j.error ?? "Error subiendo imagen.");
      return null;
    }
    return j.url as string;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading("cover");
    const url = await uploadFile(f);
    setUploading(null);
    e.target.value = "";
    if (url) setCoverImageUrl(url);
  }

  async function handleInlineUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading("inline");
    const url = await uploadFile(f);
    setUploading(null);
    e.target.value = "";
    if (!url) return;
    const ta = bodyRef.current;
    const md = `\n\n![${f.name.replace(/\.[^.]+$/, "")}](${url})\n\n`;
    if (ta) {
      const start = ta.selectionStart ?? body.length;
      const end = ta.selectionEnd ?? body.length;
      const next = body.slice(0, start) + md + body.slice(end);
      setBody(next);
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + md.length;
        ta.setSelectionRange(pos, pos);
      });
    } else {
      setBody((b) => b + md);
    }
  }

  return (
    <div className="admin">
      <header className="admin__top">
        <div>
          <p className="admin__hello">Sesión: <strong>{email}</strong></p>
          <h1 className="admin__title">Newsletter</h1>
        </div>
        <form action={logoutAdmin}>
          <button className="admin__logout" type="submit">Cerrar sesión</button>
        </form>
      </header>

      <section className="admin__stats">
        <div className="admin__stat">
          <span className="admin__stat-num">{subscribers}</span>
          <span className="admin__stat-label">Suscriptores activos</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-num">{posts.length}</span>
          <span className="admin__stat-label">Publicaciones totales</span>
        </div>
      </section>

      <section className="admin__compose">
        <div className="admin__compose-head">
          <h2 className="admin__h2">
            {isWelcome ? "Mensaje de bienvenida" : "Nueva publicación"}
          </h2>
          <label className="admin__tpl-select">
            <span>Plantilla</span>
            <select
              value={templateId}
              onChange={(e) => applyTemplate(e.target.value)}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
              <option value={WELCOME_ID}>Mensaje de bienvenida</option>
            </select>
          </label>
        </div>
        <p className="admin__tpl-desc">
          {isWelcome ? WELCOME_DESC : getTemplate(templateId).description}
        </p>

        <div className="admin__split">
          <form action={isWelcome ? welcomeAction : action} className="admin__form">
            <label className="admin__label">
              <span>{isWelcome ? "Asunto" : "Título"}</span>
              <input
                name="title"
                type="text"
                required
                maxLength={140}
                placeholder={isWelcome ? "Ej. Gracias por suscribirte" : "Ej. Avances · Trimestre Q1"}
                className="admin__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            {!isWelcome && (
            <div className="admin__label">
              <span>Imagen de portada <em className="admin__hint">(opcional, hasta 5 MB)</em></span>
              <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
              {coverImageUrl ? (
                <div className="admin__cover-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImageUrl} alt="Portada" className="admin__cover-thumb" />
                  <div className="admin__cover-actions">
                    <code className="admin__cover-url">{coverImageUrl.split("/").slice(-1)[0]}</code>
                    <button
                      type="button"
                      className="admin__link-btn"
                      onClick={() => setCoverImageUrl("")}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin__upload-row">
                  <label className="admin__file-btn">
                    {uploading === "cover" ? "Subiendo…" : "Subir portada"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      hidden
                      onChange={handleCoverUpload}
                      disabled={uploading !== null}
                    />
                  </label>
                </div>
              )}
            </div>
            )}

            <label className="admin__label">
              <span>
                Contenido <em className="admin__hint">(Markdown: ## títulos · **negrita** · *cursiva* · [enlace](url) · &gt; cita · - listas · ![alt](url) imagen)</em>
              </span>
              <textarea
                ref={bodyRef}
                name="body"
                required
                rows={20}
                placeholder="Escribe en Markdown..."
                className="admin__textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="admin__upload-row">
                <label className="admin__file-btn admin__file-btn--small">
                  {uploading === "inline" ? "Subiendo…" : "Insertar imagen en el cuerpo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    hidden
                    onChange={handleInlineUpload}
                    disabled={uploading !== null}
                  />
                </label>
              </div>
            </label>

            {uploadError && <p className="admin__error" role="alert">{uploadError}</p>}

            {isWelcome && (
              <p className="admin__hint">
                Escribe <code>{"{nombre}"}</code> o <code>{"{apellidos}"}</code> donde quieras los
                datos de cada suscriptor (p. ej. «Hola, {"{nombre}"}:»). La vista previa usa un
                ejemplo: {PREVIEW_PERSON.name} {PREVIEW_PERSON.lastName}. A quien no tenga nombre
                guardado le saldrá solo «Hola:».
              </p>
            )}

            {isWelcome ? (
              <>
                {welcomeState.error && (
                  <p className="admin__error" role="alert">{welcomeState.error}</p>
                )}
                {welcomeState.ok && (
                  <p className="admin__success" role="status">
                    Mensaje de bienvenida guardado. Lo recibirán los próximos suscriptores.
                  </p>
                )}
                <button type="submit" className="admin__submit" disabled={welcomePending}>
                  {welcomePending ? "Guardando…" : "Guardar mensaje de bienvenida"}
                </button>

                <div className="admin__broadcast">
                  <p className="admin__broadcast-title">Suscriptores actuales</p>
                  <p className="admin__broadcast-text">
                    Envía el mensaje de bienvenida guardado a los {subscribers} suscriptor
                    {subscribers === 1 ? "" : "es"} activos de ahora. No se guarda como publicación.
                  </p>
                  {welcomeSentAt && (
                    <p className="admin__broadcast-text">
                      Ya se envió a los suscriptores actuales el{" "}
                      {new Date(welcomeSentAt).toLocaleString("es-ES")}.
                    </p>
                  )}
                  {broadcastState.error && (
                    <p className="admin__error" role="alert">{broadcastState.error}</p>
                  )}
                  {broadcastState.ok && (
                    <p className="admin__success" role="status">
                      Mensaje de bienvenida enviado a {broadcastState.recipients} suscriptor(es).
                    </p>
                  )}
                  {welcomeDirty ? (
                    <p className="admin__broadcast-text">
                      Tienes cambios sin guardar: guarda el mensaje antes de enviarlo.
                    </p>
                  ) : confirmBroadcast ? (
                    <div className="admin__broadcast-row">
                      <button
                        type="submit"
                        formAction={broadcastAction}
                        formNoValidate
                        className="admin__submit"
                        disabled={broadcastPending}
                        onClick={() => {
                          // Se oculta la confirmación al terminar el envío.
                          setTimeout(() => setConfirmBroadcast(false), 0);
                        }}
                      >
                        {broadcastPending
                          ? "Enviando…"
                          : `Sí, enviar a ${subscribers} suscriptor${subscribers === 1 ? "" : "es"}`}
                      </button>
                      <button
                        type="button"
                        className="admin__link-btn admin__link-btn--muted"
                        onClick={() => setConfirmBroadcast(false)}
                        disabled={broadcastPending}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin__file-btn"
                      onClick={() => setConfirmBroadcast(true)}
                      disabled={broadcastPending || subscribers === 0}
                    >
                      {broadcastPending ? "Enviando…" : "Enviar a los suscriptores actuales"}
                    </button>
                  )}
                </div>
              </>
            ) : (
            <>
            <label className="admin__check">
              <input type="checkbox" name="send" defaultChecked />
              <span>Enviar por email a los suscriptores activos ahora</span>
            </label>

            {state.error && <p className="admin__error" role="alert">{state.error}</p>}
            {state.ok && (
              <p className="admin__success" role="status">
                {state.recipients
                  ? `Publicación creada y enviada a ${state.recipients} suscriptor(es).`
                  : "Publicación guardada como borrador."}
              </p>
            )}

            <button type="submit" className="admin__submit" disabled={pending}>
              {pending ? "Publicando…" : "Publicar"}
            </button>
            </>
            )}
          </form>

          <aside className="admin__preview">
            <div className="admin__preview-head">
              <span className="admin__preview-tag">Preview</span>
              {previewLoading && <span className="admin__preview-status">actualizando…</span>}
            </div>
            <iframe
              title="Preview del email"
              srcDoc={previewHtml}
              className="admin__preview-frame"
              sandbox=""
            />
          </aside>
        </div>
      </section>

      <section className="admin__posts">
        <h2 className="admin__h2">Publicaciones</h2>
        {posts.length === 0 ? (
          <p className="admin__empty">Aún no has publicado nada.</p>
        ) : (
          <ul className="admin__list">
            {posts.map((p) => (
              <li key={p.id} className="admin__item">
                <div>
                  <p className="admin__item-title">{p.title}</p>
                  <p className="admin__item-meta">
                    {p.sent_at
                      ? `Enviado · ${new Date(p.sent_at).toLocaleString("es-ES")} · ${p.recipients_count ?? 0} destinatarios`
                      : `Borrador · ${new Date(p.created_at).toLocaleString("es-ES")}`}
                  </p>
                </div>
                <span className={`admin__badge ${p.sent_at ? "is-sent" : "is-draft"}`}>
                  {p.sent_at ? "Enviado" : "Borrador"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <style jsx>{`
        .admin {
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem);
          color: var(--color-ink);
        }
        .admin__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .admin__hello {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          margin: 0 0 0.25rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__title {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-36), 5vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .admin__logout {
          background: transparent;
          border: 1px solid rgba(0,0,0,0.15);
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-sm);
          font-size: var(--fs-13);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 180ms var(--ease-out);
        }
        .admin__logout:hover { background: rgba(0,0,0,0.05); }
        .admin__stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .admin__stat {
          padding: 1.25rem 1.5rem;
          background: var(--color-cream);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .admin__stat-num {
          font-family: var(--font-display);
          font-size: var(--fs-44);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .admin__stat-label {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__h2 {
          font-family: var(--font-display);
          font-size: var(--fs-24);
          font-weight: 500;
          margin: 0 0 1rem;
        }
        .admin__compose {
          margin-bottom: 3rem;
        }
        .admin__compose-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
        }
        .admin__tpl-select {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .admin__tpl-select select {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: var(--fs-14);
          background: var(--color-white);
          color: var(--color-ink);
          min-width: 220px;
        }
        .admin__tpl-desc {
          margin: 0 0 1.5rem;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          font-style: italic;
        }
        .admin__split {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1000px) {
          .admin__split { grid-template-columns: 1fr; }
        }
        .admin__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin__label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .admin__hint {
          font-size: var(--fs-13);
          font-weight: 400;
          font-style: normal;
          color: var(--fg-muted);
          letter-spacing: 0;
          text-transform: none;
        }
        .admin__input,
        .admin__textarea {
          padding: 0.875rem 1rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: var(--fs-15);
          background: var(--color-white);
          color: var(--color-ink);
          outline: none;
          transition: border-color 180ms var(--ease-out);
        }
        .admin__textarea {
          resize: vertical;
          line-height: 1.55;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 14px;
          min-height: 360px;
        }
        .admin__input:focus,
        .admin__textarea:focus {
          border-color: var(--color-ink);
        }
        .admin__check {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          cursor: pointer;
        }
        .admin__error { color: #c0392b; font-size: var(--fs-13); margin: 0; }
        .admin__success { color: #14855e; font-size: var(--fs-13); margin: 0; }
        .admin__upload-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-top: 0.5rem;
        }
        .admin__file-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1rem;
          background: var(--color-cream);
          color: var(--color-ink);
          border-radius: var(--radius-sm);
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 180ms var(--ease-out);
          border: 1px solid rgba(0,0,0,0.08);
        }
        .admin__file-btn:hover { background: rgba(0,0,0,0.05); }
        .admin__file-btn--small { font-size: 11px; padding: 0.4rem 0.75rem; letter-spacing: 0.06em; }
        .admin__cover-row {
          display: flex;
          gap: 0.875rem;
          align-items: flex-start;
          padding: 0.75rem;
          background: var(--color-cream);
          border-radius: var(--radius-sm);
        }
        .admin__cover-thumb {
          width: 96px;
          height: 96px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .admin__cover-actions {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: var(--fs-13);
          flex: 1;
          min-width: 0;
        }
        .admin__cover-url {
          font-family: Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          color: var(--fg-muted);
          word-break: break-all;
        }
        .admin__link-btn {
          background: none;
          border: none;
          padding: 0;
          color: #c0392b;
          font-size: var(--fs-13);
          cursor: pointer;
          align-self: flex-start;
          text-decoration: underline;
        }
        .admin__submit {
          align-self: flex-start;
          padding: 1rem 2rem;
          background: var(--color-ink);
          color: var(--color-white);
          border-radius: var(--radius-sm);
          font-size: var(--fs-14);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__submit:disabled { opacity: 0.6; }
        .admin__broadcast {
          margin-top: 1rem;
          padding: 1.25rem;
          background: var(--color-cream);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          align-items: flex-start;
        }
        .admin__broadcast-title {
          margin: 0;
          font-size: var(--fs-13);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__broadcast-text {
          margin: 0;
          font-size: var(--fs-13);
          color: var(--fg-muted);
        }
        .admin__broadcast-row {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .admin__link-btn--muted { color: var(--fg-muted); align-self: center; }

        .admin__preview {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: sticky;
          top: 1rem;
          align-self: start;
        }
        .admin__preview-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin__preview-tag {
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .admin__preview-status {
          font-size: 11px;
          color: var(--fg-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__preview-frame {
          width: 100%;
          height: 640px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: var(--radius-md);
          background: #f6f4ef;
        }

        .admin__list { display: flex; flex-direction: column; gap: 0.5rem; }
        .admin__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: var(--radius-md);
          background: var(--color-white);
        }
        .admin__item-title { margin: 0; font-weight: 500; font-size: var(--fs-16); }
        .admin__item-meta {
          margin: 0.25rem 0 0;
          font-size: var(--fs-13);
          color: var(--fg-muted);
        }
        .admin__badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
        }
        .admin__badge.is-sent { background: #def4e8; color: #14855e; }
        .admin__badge.is-draft { background: #f1efeb; color: #888; }
        .admin__empty { color: var(--fg-muted); }
      `}</style>
    </div>
  );
}
