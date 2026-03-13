export default function HistoryTimeline() {
    const timelineEvents = [
        {
            year: "ETSAM",
            title: "Formación en Arquitectura",
            description: "Graduado en la Escuela Técnica Superior de Arquitectura de Madrid (ETSAM) y posterior formación en dirección empresarial con el Advanced Management Program de IE Business School."
        },
        {
            year: "Rheto",
            title: "Rheto Arquitectos",
            description: "Funda su propio estudio de arquitectura, Rheto Arquitectos, donde forja la filosofía de diseño y la sensibilidad espacial que definirán todos sus proyectos futuros."
        },
        {
            year: "2011",
            title: "Fundación de CLERHP",
            description: "Con 29 años, viaja a Latinoamérica y funda CLERHP Estructuras, integrando ingeniería estructural y construcción con enfoque internacional. Operaciones en España, Paraguay y Bolivia."
        },
        {
            year: "2016",
            title: "Salida a Bolsa",
            description: "CLERHP debuta en el MAB (hoy BME Growth), convirtiéndose en la única empresa de la Región de Murcia cotizada en este mercado. Finalista del Premio BMN Joven Empresario."
        },
        {
            year: "2021",
            title: "Larimar City & Resort",
            description: "Expansión a República Dominicana con el lanzamiento de Larimar City & Resort en Punta Cana: una inversión inicial de 600 millones de euros sobre 3.600.000 m²."
        },
        {
            year: "2025",
            title: "Inauguración Histórica",
            description: "Larimar City & Resort se inaugura como la primera smart city de República Dominicana. Más de 200 proyectos ejecutados en 5 países consolidan el legado de CLERHP."
        }
    ];

    return (
        <section id="history" className="section-padding bg-secondary">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="fade-in-up">Trayectoria</h2>
                    <h3 className="text-secondary fade-in-up delay-1" style={{ fontStyle: 'italic', fontWeight: 'normal', marginTop: '1rem' }}>
                        De Mazarrón al Caribe: arquitectura, ingeniería y liderazgo empresarial.
                    </h3>
                </div>

                <div className="timeline-container fade-in-up delay-2">
                    {timelineEvents.map((item, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <span className="timeline-year text-gradient">{item.year}</span>
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
