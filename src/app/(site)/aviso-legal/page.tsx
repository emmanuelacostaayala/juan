import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal del sitio web juanandresromero.es conforme a la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" lastUpdated="Abril de 2026">
      <p>
        El presente Aviso Legal regula el uso del sitio web{" "}
        <strong>juanandresromero.es</strong> (en adelante, &ldquo;el Sitio
        Web&rdquo;), del que es titular Juan Andrés Romero (en adelante,
        &ldquo;el Titular&rdquo;), en cumplimiento de la Ley 34/2002, de 11
        de julio, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE).
      </p>

      <h2>1. Datos identificativos</h2>
      <ul>
        <li><strong>Titular</strong>: Juan Andrés Romero</li>
        <li><strong>Correo electrónico</strong>: <a href="mailto:info@juanandresromero.es">info@juanandresromero.es</a></li>
        <li><strong>Sitio Web</strong>: juanandresromero.es</li>
      </ul>
      <p>
        Los datos fiscales y de contacto postal del Titular pueden solicitarse
        a través del correo electrónico facilitado.
      </p>

      <h2>2. Objeto</h2>
      <p>
        El Sitio Web tiene como finalidad presentar la trayectoria profesional
        del Titular, los proyectos en los que participa (incluyendo Larimar
        City &amp; Resort y CLERHP), así como facilitar canales de contacto y
        difusión de contenidos editoriales y audiovisuales.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y la navegación por el Sitio Web atribuyen al usuario la
        condición de tal e implican la aceptación plena de las presentes
        condiciones de uso. El usuario se compromete a:
      </p>
      <ul>
        <li>Hacer un uso lícito, diligente y conforme a la buena fe del Sitio Web.</li>
        <li>No realizar ninguna actuación que pueda dañar, sobrecargar, deteriorar o impedir el normal funcionamiento del Sitio Web.</li>
        <li>No utilizar el Sitio Web para transmitir, almacenar o difundir contenidos ilícitos, ofensivos o que vulneren derechos de terceros.</li>
      </ul>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del Sitio Web (textos, fotografías, gráficos,
        imágenes, marcas, logos y código fuente) son propiedad del Titular o
        de terceros que han autorizado su uso, y se encuentran protegidos por
        las normas nacionales e internacionales de propiedad intelectual e
        industrial.
      </p>
      <p>
        Queda prohibida la reproducción, distribución, comunicación pública,
        transformación o cualquier otra forma de explotación de los contenidos
        sin la autorización expresa y por escrito del Titular o, en su caso,
        del titular de los derechos correspondientes.
      </p>

      <h2>5. Enlaces a sitios de terceros</h2>
      <p>
        El Sitio Web puede contener enlaces a sitios web de terceros (por
        ejemplo, perfiles en redes sociales, plataformas de podcast o medios
        de comunicación). El Titular no asume responsabilidad alguna sobre el
        contenido, las políticas de privacidad o las condiciones de uso de
        dichos sitios.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        El Titular adopta medidas razonables para asegurar la disponibilidad y
        correcto funcionamiento del Sitio Web, así como la veracidad de la
        información publicada. No obstante, no garantiza la ausencia de
        interrupciones, errores o virus, ni se hace responsable de los daños
        que pudieran derivarse del uso del Sitio Web por parte del usuario.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        El Titular se reserva el derecho a modificar, actualizar o eliminar
        cualquier contenido del Sitio Web, así como las presentes condiciones
        de uso, sin necesidad de aviso previo, salvo cuando la normativa
        aplicable exija lo contrario.
      </p>

      <h2>8. Legislación aplicable y jurisdicción</h2>
      <p>
        Las presentes condiciones se regirán e interpretarán conforme a la
        legislación española. Para la resolución de cualquier controversia
        derivada del uso del Sitio Web, las partes se someten a la
        jurisdicción de los Juzgados y Tribunales del domicilio del usuario,
        cuando éste tenga la condición de consumidor, o del domicilio del
        Titular en los demás casos.
      </p>
    </LegalPage>
  );
}
