export default function Media() {
    const articles = [
        {
            title: "Visión Sostenible en Fitur",
            image: "[Imagen Fitur]",
            link: "#",
        },
        {
            title: "Entrevista en Negocios TV",
            image: "[Imagen Negocios TV]",
            link: "#",
        },
        {
            title: "CLERHP refuerza su liderazgo",
            image: "[Imagen Forbes / Prensa]",
            link: "https://larimarcity.com/noticias/clerhp-refuerza-su-liderazgo/",
        },
    ];

    return (
        <section id="media" className="section-padding bg-secondary">
            <div className="container">
                <div className="section-header text-center mb-5 fade-in-up">
                    <h2 className="mb-2">Prensa y Entrevistas</h2>
                    <h3 className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem' }}>Autoridad y Visibilidad</h3>
                </div>

                <div className="media-logos fade-in-up delay-1">
                    {articles.map((article, index) => (
                        <a key={index} href={article.link} className="media-logo-link" target="_blank" rel="noopener noreferrer">
                            <div className="media-logo-card">
                                <span>{article.image}</span>
                                <p className="media-logo-title">{article.title}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
