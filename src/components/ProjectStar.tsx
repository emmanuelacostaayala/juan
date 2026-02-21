export default function ProjectStar() {
    return (
        <section id="larimar-city" className="section-padding">
            <div className="container">
                <div className="project-grid">
                    <div className="project-text fade-in-up">
                        <img
                            src="/larimarr.png"
                            alt="Larimar City Logo"
                            style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }}
                            className="fade-in-up"
                        />
                        <h3 className="text-secondary fade-in-up delay-1" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '0.5rem' }}>Proyecto Insignia</h3>
                        <h2 className="text-gradient fade-in-up delay-1" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Larimar City</h2>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
                            Larimar City es más que un proyecto. Es la visión de cómo debe ser una ciudad moderna: sostenible, integrada, viva y conectada con su territorio.
                        </p>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                            Un ecosistema diseñado para potenciar la calidad de vida, celebrar el entorno natural y redefinir el estándar de desarrollo urbano en el corazón del Caribe.
                        </p>
                        <a href="https://larimarcity.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
                            Descubre Larimar City &rarr;
                        </a>
                    </div>
                    <div className="project-visuals fade-in-up delay-1">
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '4/5',
                                borderRadius: '12px',
                                backgroundImage: "url('/larimar.jpeg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}
                            title="Larimar City Vision"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
