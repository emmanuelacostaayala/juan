"use client";

import { useState } from "react";

export default function NewsletterBlock() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <section id="newsletter-block" className="section-padding" style={{ background: '#111', color: '#fff' }}>
            <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
                <div className="newsletter-widget fade-in-up">
                    <h2 className="mb-3" style={{ fontSize: '2.5rem' }}>Sé parte del futuro que estamos construyendo.</h2>
                    <p className="mb-5 text-secondary" style={{ color: '#ccc' }}>
                        Recibe reflexiones exclusivas sobre urbanismo, liderazgo y los avances de Larimar City.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="newsletter-elegant-form">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="elegant-input"
                            />
                            <button type="submit" className="btn btn-primary elegant-btn">
                                Suscribirme
                            </button>
                        </form>
                    ) : (
                        <div className="newsletter-success fade-in">
                            <h3>¡Gracias por unirte a nuestra visión!</h3>
                            <p style={{ color: '#aaa' }}>Pronto recibirás nuestras novedades en tu bandeja de entrada.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
