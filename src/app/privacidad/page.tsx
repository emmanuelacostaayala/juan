import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Política de Privacidad | Arq. Juan Andrés Romero"
};

export default function Privacidad() {
    return (
        <main className="main-content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <section className="section-padding bg-main" style={{ flexGrow: 1, marginTop: '80px' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 className="mb-5">Política de Privacidad</h1>

                    <div className="content-text" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        <h2>1. Información que Recopilamos</h2>
                        <p>
                            En el sitio web personal del <strong>Arq. Juan Andrés Romero</strong> recolectamos información personal única y exclusivamente cuando el usuario la proporciona voluntariamente a través del formulario de contacto integrado en el sitio. La información recopilada puede incluir nombre completo, dirección de correo electrónico y cualquier detalle adicional incluido en el mensaje.
                        </p>

                        <h2 className="mt-4">2. Uso de la Información</h2>
                        <p>
                            Los datos proporcionados se utilizan con la finalidad única de:
                        </p>
                        <ul>
                            <li>Responder a solicitudes de información, preguntas o propuestas enviadas por el usuario.</li>
                            <li>Establecer comunicación corporativa o alianzas estratégicas relacionadas con el Arq. Juan Andrés Romero, CLERHP Estructuras o Larimar City.</li>
                        </ul>

                        <h2 className="mt-4">3. Protección de Datos</h2>
                        <p>
                            Aplicamos prácticas y mecanismos de seguridad estándar en la industria para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. No comercializamos, alquilamos ni vendemos sus datos personales a terceros bajo ninguna circunstancia.
                        </p>

                        <h2 className="mt-4">4. Consentimiento</h2>
                        <p>
                            Al enviar información a través de los formularios disponibles en este sitio web, usted expresa su consentimiento directo para que sus datos sean tratados conforme a lo estipulado en esta Política de Privacidad.
                        </p>

                        <h2 className="mt-4">5. Contacto Legal</h2>
                        <p>
                            Si tiene alguna duda sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, puede contactarnos directamente a través de las vías expuestas en nuestra sección principal de contacto.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
