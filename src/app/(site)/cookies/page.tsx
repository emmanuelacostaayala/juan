import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies del sitio web juanandresromero.es: tipos, finalidades y opciones de configuración.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" lastUpdated="Abril de 2026">
      <p>
        Esta política describe el uso de cookies y otras tecnologías similares
        en el sitio web <strong>juanandresromero.es</strong>, conforme a lo
        establecido en el artículo 22.2 de la Ley 34/2002, de 11 de julio, de
        Servicios de la Sociedad de la Información y de Comercio Electrónico
        (LSSI-CE), y en la normativa de protección de datos vigente.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Una cookie es un pequeño fichero de texto que un sitio web almacena en
        el navegador del usuario al visitarlo. Las cookies permiten reconocer
        al usuario en sucesivas visitas, recordar sus preferencias y obtener
        información sobre el uso del sitio.
      </p>

      <h2>2. Tipos de cookies utilizadas</h2>

      <h3>Cookies técnicas (necesarias)</h3>
      <p>
        Permiten la navegación por el Sitio Web y el uso de las funcionalidades
        básicas (gestión de sesión, accesibilidad, seguridad). Son necesarias
        para el correcto funcionamiento y no requieren consentimiento previo.
      </p>

      <h3>Cookies de análisis</h3>
      <p>
        Permiten medir y analizar de forma anónima el comportamiento de los
        usuarios en el Sitio Web (páginas visitadas, tiempo de permanencia,
        origen del tráfico). El uso de estas cookies está condicionado al
        consentimiento del usuario.
      </p>

      <h3>Cookies de terceros</h3>
      <p>
        El Sitio Web incrusta contenidos de terceros (por ejemplo, reproductores
        de Spotify o YouTube) que pueden instalar sus propias cookies cuando se
        cargan. La gestión de estas cookies se rige por las políticas de
        privacidad de los respectivos proveedores:
      </p>
      <ul>
        <li><a href="https://www.spotify.com/legal/cookies-policy/" target="_blank" rel="noopener noreferrer">Política de cookies de Spotify</a></li>
        <li><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Política de cookies de Google / YouTube</a></li>
      </ul>

      <h2>3. Consentimiento</h2>
      <p>
        Al acceder por primera vez al Sitio Web, se informa al usuario sobre el
        uso de cookies y se solicita su consentimiento para aquellas que no
        sean estrictamente necesarias. El usuario puede aceptar, rechazar o
        configurar las cookies desde el banner de cookies o, en su caso, desde
        el panel de configuración disponible en el Sitio Web.
      </p>

      <h2>4. Cómo gestionar y desactivar cookies</h2>
      <p>
        El usuario puede revocar en cualquier momento el consentimiento
        prestado y eliminar las cookies almacenadas a través de la
        configuración de su navegador. A continuación se ofrecen enlaces a las
        instrucciones de los principales navegadores:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/proteccion-mejorada-contra-rastreo-firefox-escritorio" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>
        La desactivación de las cookies técnicas puede afectar al correcto
        funcionamiento del Sitio Web.
      </p>

      <h2>5. Modificaciones</h2>
      <p>
        Esta política de cookies puede modificarse en función de exigencias
        legislativas, reglamentarias, o con la finalidad de adaptar dicha
        política a las instrucciones dictadas por la Agencia Española de
        Protección de Datos. Se recomienda al usuario revisar esta página
        periódicamente.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier duda sobre el uso de cookies en el Sitio Web, el
        usuario puede dirigirse al correo{" "}
        <a href="mailto:info@juanandresromero.es">info@juanandresromero.es</a>.
      </p>
    </LegalPage>
  );
}
