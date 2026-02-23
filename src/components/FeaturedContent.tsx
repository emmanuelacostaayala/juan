"use client";

import { useState } from "react";

export default function FeaturedContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "¿Cuál es la visión detrás de Larimar City?",
            answer: "Larimar City nace de la convergencia entre sostenibilidad, tecnología y calidad de vida. No solo buscamos construir viviendas, sino crear un ecosistema vibrante donde la naturaleza y la arquitectura dialoguen en perfecta armonía."
        },
        {
            question: "¿Cómo aborda CLERHP la innovación en la construcción?",
            answer: "En CLERHP innovamos desde la base de la ingeniería estructural, integrando metodologías eficientes, tecnología BIM y procesos orientados a optimizar tanto los recursos como el resultado final."
        },
        {
            question: "¿Qué papel juega la sostenibilidad en tus proyectos?",
            answer: "Es el eje central. Diseñamos pensando en el mañana, utilizando enfoques de eficiencia energética y respeto al entorno natural, como se evidencia claramente en nuestra integración con el farallón en Punta Cana."
        }
    ];

    return (
        <section id="featured-content" className="section-padding">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="fade-in-up">Reflexiones y Visión</h2>
                    <h3 className="text-gradient fade-in-up delay-1">Contenidos Destacados</h3>
                </div>

                <div className="featured-grid fade-in-up delay-2">
                    {/* Artículos / Reflexiones */}
                    <div className="featured-articles">
                        <div className="article-card">
                            <h4>Premio Internacional al Mejor Desarrollo Inmobiliario</h4>
                            <p>Entrevista con La Razón tras recibir el galardón en los Premios Construcción y Vivienda por la innovación en Larimar City & Resort.</p>
                            <a href="https://www.youtube.com/watch?v=kGgUvAUUcoE" target="_blank" rel="noopener noreferrer" className="btn-link">Ver entrevista &rarr;</a>
                        </div>
                        <div className="article-card">
                            <h4>Estrategia, Inversión y Modelos Sostenibles</h4>
                            <p>Análisis en Estrategias de Inversión sobre la expansión de CLERHP, rentabilidad y el impacto de los proyectos en el Caribe.</p>
                            <a href="https://www.estrategiasdeinversion.com/analisis/bolsa-y-mercados/el-experto-opina/clerhp-es-la-mejor-opcion-para-tener-exposicion-n-868221" target="_blank" rel="noopener noreferrer" className="btn-link">Leer artículo &rarr;</a>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="faq-section">
                        <h3 className="mb-4">Preguntas Frecuentes</h3>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openFaq === index ? "active" : ""}`}
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <div className="faq-question">
                                    <strong>{faq.question}</strong>
                                    <span className="faq-icon">{openFaq === index ? "−" : "+"}</span>
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
