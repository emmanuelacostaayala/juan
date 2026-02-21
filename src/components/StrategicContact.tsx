"use client";

import { useState } from "react";

export default function StrategicContact() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactType, setContactType] = useState("");

    const openContactModal = (type: string) => {
        setContactType(type);
        setIsModalOpen(true);
    };

    const closeContactModal = () => {
        setIsModalOpen(false);
        setContactType("");
    };

    return (
        <section id="contact" className="section-padding bg-secondary">
            <div className="container text-center">
                <h2 className="mb-5 fade-in-up">Contacto Estratégico</h2>

                <div className="contact-buttons-wrapper fade-in-up delay-1">
                    <button onClick={() => openContactModal("Prensa / Medios")} className="btn btn-outline contact-btn">
                        Contacto Prensa
                    </button>
                    <button onClick={() => openContactModal("Institucional")} className="btn btn-primary contact-btn">
                        Contacto Institucional
                    </button>
                    <button onClick={() => openContactModal("Colaboraciones")} className="btn btn-outline contact-btn">
                        Contacto para Colaboraciones
                    </button>
                </div>
            </div>

            {/* Modal de Contacto */}
            {isModalOpen && (
                <div className="contact-modal-overlay fade-in">
                    <div className="contact-modal-content slide-up">
                        <button className="contact-modal-close" onClick={closeContactModal}>&times;</button>
                        <h3 className="mb-3 text-gradient">Contacto {contactType}</h3>
                        <p className="mb-4 text-secondary">Por favor, completa los datos a continuación y nuestro equipo se pondrá en contacto a la brevedad.</p>

                        <form className="contact-modal-form" onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado con éxito"); closeContactModal(); }}>
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" required placeholder="Tu nombre..." />
                            </div>
                            <div className="form-group">
                                <label>Organización / Medio</label>
                                <input type="text" required placeholder="Tu organización..." />
                            </div>
                            <div className="form-group">
                                <label>Mensaje</label>
                                <textarea rows={4} required placeholder="Motivo de tu consulta..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full mt-3">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
