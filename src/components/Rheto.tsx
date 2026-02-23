export default function Rheto() {
    return (
        <section id="rheto-arquitectos" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
                <div className="rheto-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '4rem',
                    alignItems: 'center',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <div className="rheto-content text-center fade-in-up">
                        <div className="rheto-logo-container mb-4">
                            {/* Diseño de Logo Tipográfico para Rheto Arquitectos */}
                            <h2 style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 300,
                                letterSpacing: '0.15em',
                                fontSize: 'min(3.5rem, 8vw)',
                                color: 'var(--text-main)',
                                textTransform: 'uppercase',
                                lineHeight: '1.2',
                                marginBottom: '1.5rem'
                            }}>
                                RHETO<span style={{
                                    fontWeight: 800,
                                    color: 'var(--accent-dark)',
                                    display: 'block',
                                    fontSize: '0.45em',
                                    letterSpacing: '0.4em',
                                    marginTop: '-0.3em',
                                    marginLeft: '0.4em'
                                }}>ARQUITECTOS</span>
                            </h2>
                        </div>

                        <div className="rheto-text" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                            <p className="mb-4">
                                Antes de consolidar el liderazgo internacional de CLERHP Estructuras en 2011, los cimientos de nuestra visión nacieron en <strong>Rheto Arquitectos</strong>. Fundado por Juan Andrés Romero, este estudio de arquitectura fue el crisol donde se forjó la filosofía que hoy rige todos nuestros megaproyectos.
                            </p>
                            <p className="mb-4" style={{ fontStyle: 'italic', borderLeft: '4px solid var(--accent-light)', paddingLeft: '1.5rem', margin: '2rem auto', maxWidth: '800px', textAlign: 'left', color: 'var(--text-main)' }}>
                                &ldquo;La arquitectura no es solo el diseño de espacios; es la ingeniería social del futuro. En Rheto aprendimos que para transformar ciudades, primero debemos entender el profundo impacto del diseño urbano en el desarrollo económico y la calidad de vida de sus comunidades.&rdquo;
                            </p>
                            <p>
                                Hoy en día, la esencia de Rheto Arquitectos sigue viva, aportando el rigor de diseño, la sensibilidad espacial y la innovación técnica que respaldan financieramente y operativamente a gigantes como <strong>Larimar City & Resort</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
