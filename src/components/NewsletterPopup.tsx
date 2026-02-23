"use client";

import { useState, useEffect } from "react";

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem("jar_newsletter_seen");
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("jar_newsletter_seen", "true");
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay fade-in" onClick={handleOverlayClick}>
            <div className="popup-content slide-up">
                <button className="popup-close" onClick={handleClose}>&times;</button>

                {!submitted ? (
                    <>
                        <h3 className="popup-title">Mantente al Día</h3>
                        <p className="popup-text">
                            Suscríbete para recibir noticias sobre los próximos avances de Larimar City y mis artículos sobre arquitectura y visión empresarial.
                        </p>
                        <form onSubmit={handleSubmit} className="popup-form">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="popup-input"
                            />
                            <button type="submit" className="btn btn-primary w-full mt-3">
                                Suscribirme
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="popup-success text-center py-5">
                        <div className="success-icon">✓</div>
                        <h3 className="mt-4">¡Gracias por suscribirte!</h3>
                        <p>Pronto recibirás nuestras novedades.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
