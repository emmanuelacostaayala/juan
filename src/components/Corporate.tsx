export default function Corporate() {
    return (
        <section id="corporate" className="section-padding bg-secondary">
            <div className="container">
                <div className="corporate-grid">
                    <div className="corporate-visuals fade-in-up">
                        <img
                            src="/img53.jpg"
                            alt="Visión CLERHP"
                            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="corporate-content text-left fade-in-up delay-1">
                        <h3 className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '1rem' }}>Propósito Corporativo</h3>
                        <img
                            src="/clerph.png"
                            alt="CLERHP Estructuras Logo"
                            style={{ height: '70px', objectFit: 'contain', marginBottom: '1.5rem' }}
                        />
                        <div className="corporate-text" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                            <p>
                                Al frente de <strong>CLERHP Estructuras</strong>, nuestro enfoque va más allá de la construcción técnica. Operamos bajo la premisa de la innovación constante y el liderazgo ético, formando equipos altamente capacitados que comparten nuestra visión.
                            </p>
                            <p>
                                Creemos en una rentabilidad cimentada en el valor real que aportamos. Nuestra expansión internacional y cotización en bolsa son solo el reflejo de una sólida historia de confianza, transparencia corporativa y el firme propósito de crear desarrollos que marcan la diferencia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
