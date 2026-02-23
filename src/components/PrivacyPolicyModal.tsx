"use client";

import { useEffect } from "react";

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="contact-modal-overlay fade-in" onClick={handleOverlayClick} style={{ zIndex: 2000 }}>
            <div className="contact-modal-content slide-up" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <button className="contact-modal-close" onClick={onClose}>&times;</button>
                <h3 className="mb-4 text-gradient">Política de Privacidad</h3>

                <div className="content-text text-left text-secondary" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                    <h4 className="text-main mb-2">1. Información que Recopilamos</h4>
                    <p className="mb-4">
                        En el sitio web personal del <strong>Arq. Juan Andrés Romero</strong> recolectamos información personal única y exclusivamente cuando el usuario la proporciona voluntariamente a través del formulario de contacto integrado en el sitio. La información recopilada puede incluir nombre completo, dirección de correo electrónico y cualquier detalle adicional incluido en el mensaje.
                    </p>

                    <h4 className="text-main mb-2">2. Uso de la Información</h4>
                    <p>Los datos proporcionados se utilizan con la finalidad única de:</p>
                    <ul className="pl-5" style={{ listStyleType: 'disc', marginBottom: '2.5rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Responder a solicitudes de información, preguntas o propuestas enviadas por el usuario.</li>
                        <li>Establecer comunicación corporativa o alianzas estratégicas relacionadas con el Arq. Juan Andrés Romero, CLERHP Estructuras o Larimar City.</li>
                    </ul>

                    <h4 className="text-main mb-2">3. Protección de Datos</h4>
                    <p className="mb-4">
                        Aplicamos prácticas y mecanismos de seguridad estándar en la industria para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. No comercializamos, alquilamos ni vendemos sus datos personales a terceros bajo ninguna circunstancia.
                    </p>

                    <h4 className="text-main mb-2">4. Consentimiento</h4>
                    <p className="mb-4">
                        Al enviar información a través de los formularios disponibles en este sitio web, usted expresa su consentimiento directo para que sus datos sean tratados conforme a lo estipulado en esta Política de Privacidad.
                    </p>

                    <h4 className="text-main mb-2">5. Contacto Legal</h4>
                    <p>
                        Si tiene alguna duda sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, puede contactarnos directamente a través de las vías expuestas en nuestra sección principal de contacto.
                    </p>
                </div>
            </div>
        </div>
    );
}
