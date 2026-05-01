import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad y tratamiento de datos personales de juanandresromero.es conforme al RGPD y la LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad" lastUpdated="Abril de 2026">
      <p>
        En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y
        del Consejo, de 27 de abril de 2016 (RGPD), y de la Ley Orgánica
        3/2018, de 5 de diciembre, de Protección de Datos Personales y
        garantía de los derechos digitales (LOPDGDD), se informa al usuario
        del tratamiento de los datos personales recogidos a través del sitio
        web <strong>juanandresromero.es</strong>.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos personales es{" "}
        <strong>Juan Andrés Romero</strong> (en adelante, &ldquo;el
        Titular&rdquo;).
      </p>
      <ul>
        <li>Correo electrónico de contacto: <a href="mailto:info@juanandresromero.es">info@juanandresromero.es</a></li>
        <li>Dirección postal: disponible bajo solicitud al correo anterior.</li>
      </ul>

      <h2>2. Datos que recopilamos</h2>
      <p>
        Recopilamos únicamente los datos personales que el usuario nos
        facilita voluntariamente a través de los formularios de contacto, la
        suscripción a la newsletter o cualquier otra comunicación dirigida al
        Titular. Estos datos pueden incluir:
      </p>
      <ul>
        <li>Nombre y apellidos.</li>
        <li>Dirección de correo electrónico.</li>
        <li>Teléfono (cuando se facilite voluntariamente).</li>
        <li>El contenido del mensaje o solicitud que envíe.</li>
      </ul>

      <h2>3. Finalidad del tratamiento</h2>
      <p>Los datos recogidos se tratan con las siguientes finalidades:</p>
      <ul>
        <li>Atender y gestionar las consultas, solicitudes o comunicaciones del usuario.</li>
        <li>Enviar comunicaciones informativas o newsletters cuando el usuario haya prestado su consentimiento expreso.</li>
        <li>Cumplir con las obligaciones legales aplicables.</li>
      </ul>

      <h2>4. Base legitimadora</h2>
      <p>
        La base legal para el tratamiento de los datos es el consentimiento
        del interesado, otorgado al cumplimentar voluntariamente cualquiera
        de los formularios o al suscribirse a la newsletter, así como el
        cumplimiento de obligaciones legales cuando proceda.
      </p>

      <h2>5. Conservación de los datos</h2>
      <p>
        Los datos personales se conservarán durante el tiempo necesario para
        cumplir con las finalidades para las que fueron recabados y, en su
        caso, durante los plazos legalmente exigibles. Una vez finalizada la
        relación, los datos serán bloqueados y suprimidos conforme a la
        normativa aplicable.
      </p>

      <h2>6. Destinatarios y cesiones</h2>
      <p>
        Los datos no serán cedidos a terceros salvo obligación legal. Para la
        prestación del servicio, podrán intervenir proveedores tecnológicos
        que actúan como encargados del tratamiento (alojamiento web,
        plataforma de envío de newsletters, herramientas analíticas), siempre
        bajo contrato y con las garantías adecuadas conforme al RGPD.
      </p>

      <h2>7. Derechos del usuario</h2>
      <p>
        El usuario podrá ejercer en cualquier momento los siguientes
        derechos:
      </p>
      <ul>
        <li><strong>Acceso</strong>: conocer qué datos personales se están tratando.</li>
        <li><strong>Rectificación</strong>: solicitar la modificación de datos inexactos o incompletos.</li>
        <li><strong>Supresión</strong>: solicitar la eliminación de los datos cuando ya no sean necesarios.</li>
        <li><strong>Limitación</strong>: solicitar la limitación del tratamiento en determinados supuestos.</li>
        <li><strong>Portabilidad</strong>: recibir los datos en un formato estructurado y de uso común.</li>
        <li><strong>Oposición</strong>: oponerse al tratamiento de los datos por motivos relacionados con su situación particular.</li>
        <li><strong>Retirar el consentimiento</strong> prestado en cualquier momento.</li>
      </ul>
      <p>
        Para ejercer estos derechos, el usuario puede dirigir una
        comunicación a <a href="mailto:info@juanandresromero.es">info@juanandresromero.es</a>{" "}
        indicando el derecho que desea ejercitar y acompañando, en su caso,
        copia de un documento que acredite su identidad.
      </p>

      <h2>8. Reclamación ante la autoridad de control</h2>
      <p>
        Si el usuario considera que el tratamiento de sus datos personales
        vulnera la normativa aplicable, puede presentar una reclamación ante
        la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>
        ).
      </p>

      <h2>9. Modificaciones</h2>
      <p>
        El Titular se reserva el derecho a modificar esta política para
        adaptarla a novedades legislativas, jurisprudenciales o de la
        práctica empresarial. En estos supuestos, se anunciarán los cambios
        en esta misma página con antelación razonable a su puesta en
        práctica.
      </p>
    </LegalPage>
  );
}
