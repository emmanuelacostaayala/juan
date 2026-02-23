"use client";

import { useState } from "react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

export default function Footer() {
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    return (
        <footer id="contact" className="site-footer bg-secondary">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2 className="footer-logo">
                            <span className="text-gradient">ARQ.</span> JUAN ANDRÉS ROMERO
                        </h2>
                        <p className="footer-slogan">Construyendo futuro, creando legado.</p>
                        <div className="social-links mt-3" style={{ display: 'flex', gap: '1rem' }}>
                            <a href="https://www.linkedin.com/in/juan-andres-romero-hernandez/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="https://www.instagram.com/juanandres_clerhp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h3>Contacto</h3>
                        <p className="mb-3 text-secondary">
                            Para inversores, alianzas institucionales o prensa.
                        </p>
                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <input type="text" placeholder="Nombre completo" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Correo electrónico" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Mensaje" rows={4} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="text-secondary text-sm text-center mt-5 pt-3 border-t" style={{ marginBottom: 0, paddingBottom: '2rem' }}>
                        &copy; {new Date().getFullYear()} Arq. Juan Andrés Romero. <button onClick={() => setIsPrivacyModalOpen(true)} style={{ textDecoration: 'underline', background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', font: 'inherit' }}>Política de Privacidad</button>. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            <PrivacyPolicyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </footer>
    );
}
