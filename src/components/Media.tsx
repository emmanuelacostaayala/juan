export default function Media() {
    const videos = [
        {
            title: "Entrevista en Negocios TV: Larimar City & Resort",
            videoId: "W4VAGEWlZ9A",
            description: "Análisis sobre el desarrollo de Larimar City y el modelo de ciudad inteligente en el Caribe."
        },
        {
            title: "Estrategia y Crecimiento de CLERHP",
            videoId: "A9EF_qzw164",
            description: "Juan Andrés Romero desgrana el momento dulce de la compañía y proyectos futuros."
        }
    ];

    return (
        <section id="media" className="section-padding bg-secondary">
            <div className="container">
                <div className="section-header text-center mb-5 fade-in-up">
                    <h2 className="mb-2">Prensa y Entrevistas</h2>
                    <h3 className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem' }}>Autoridad y Visibilidad</h3>
                </div>

                <div className="media-grid fade-in-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {videos.map((video, index) => (
                        <div key={index} className="media-video-card" style={{ background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="video-info" style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{video.title}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
