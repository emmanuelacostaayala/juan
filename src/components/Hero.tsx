export default function Hero() {
    return (
        <section id="hero" className="hero-section bg-animated-gradient">
            <div className="container hero-content">
                <div className="brand-lockup fade-in-up delay-1">
                    <div className="brand-left">
                        <span className="brand-line-1">CONSTRUYENDO</span>
                        <span className="brand-line-2">FUTURO, CREANDO</span>
                        <span className="brand-line-3">LEGADO.</span>
                    </div>

                    <div className="brand-divider"></div>

                    <div className="brand-right">
                        <h1 className="hero-title-name">
                            JUAN ANDRÉS
                            <span className="brand-prefix slot-machine-container" style={{ marginRight: 0, marginLeft: '0.3em' }}>
                                <ul className="slot-machine-list">
                                    <li className="slot-accent">ARQ.</li>
                                    <li className="slot-accent">EMP.</li>
                                    <li className="slot-accent">CEO.</li>
                                    <li className="slot-accent">ARQ.</li>
                                </ul>
                            </span>
                            <br />ROMERO
                        </h1>
                    </div>
                </div>

                <div className="hero-actions fade-in-up delay-3 mt-5">
                    <a href="#about" className="btn btn-primary">Conoce mi visión &rarr;</a>
                </div>
            </div>
        </section>
    );
}
