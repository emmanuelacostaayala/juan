export default function HistoryTimeline() {
    const timelineEvents = [
        {
            year: "Crisis",
            title: "El Punto de Inflexión",
            description: "Momentos críticos que forjaron la resiliencia y sentaron las bases para una visión renovada del futuro."
        },
        {
            year: "Reconstrucción",
            title: "Cimientos Sólidos",
            description: "Rediseñando la estrategia corporativa desde la integridad y la innovación tras el aprendizaje."
        },
        {
            year: "CLERHP",
            title: "Expansión y Solidez",
            description: "Consolidación de CLERHP Estructuras como líder internacional, llevando excelencia técnica a nuevos mercados."
        },
        {
            year: "Larimar",
            title: "El Sueño Hecho Realidad",
            description: "Concepción y desarrollo de Larimar City, transformando el paisaje del Caribe con urbanismo sostenible."
        },
        {
            year: "Presente",
            title: "Legado en Construcción",
            description: "Liderando con propósito, expandiendo horizontes y dejando una huella perdurable en cada proyecto."
        }
    ];

    return (
        <section id="history" className="section-padding bg-secondary">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="fade-in-up">Historia Personal</h2>
                    <h3 className="text-secondary fade-in-up delay-1" style={{ fontStyle: 'italic', fontWeight: 'normal', marginTop: '1rem' }}>
                        “Donde otros vieron un final, yo encontré un comienzo.”
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
