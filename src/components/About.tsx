export default function About() {
    return (
        <section id="about" className="section-padding bg-secondary">
            <div className="container text-center" style={{ maxWidth: '1000px' }}>
                <h2 className="fade-in-up">Presentación</h2>
                <h3 className="text-gradient fade-in-up delay-1 mb-5">Visión e Integridad</h3>

                <div className="about-grid mt-5">
                    <div className="about-image-wrapper fade-in-up delay-2">
                        <img
                            src="/DSCF7081.jpg"
                            alt="Arq. Juan Andrés Romero"
                            style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="about-text-wrapper fade-in-up delay-3" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                            “Soy <strong>Juan Andrés Romero</strong>, presidente de CLERHP y creador de Larimar City.
                            Mi propósito es construir proyectos que transformen territorios y generen impacto real.
                            Lidero desde la integridad, la visión y la convicción de que los grandes sueños se construyen paso a paso, con valores y equipo.”
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
