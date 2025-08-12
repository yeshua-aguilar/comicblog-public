import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/blogService';
import type { BlogPost } from '../types/blog';
import '../assets/css/genero.css';

function Genero() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const all = await getAllPosts();
        setPosts(all);
      } catch (e) {
        console.error('Error loading posts:', e);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const genresWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  // Improved Bootstrap color palette with gradients and better contrast
  const genreColors = [
    { bg: 'bg-primary', gradient: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', text: 'text-white' },
    { bg: 'bg-success', gradient: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', text: 'text-white' },
    { bg: 'bg-info', gradient: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)', text: 'text-white' },
    { bg: 'bg-warning', gradient: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', text: 'text-dark' },
    { bg: 'bg-danger', gradient: 'linear-gradient(135deg, #dc3545 0%, #bd2130 100%)', text: 'text-white' },
    { bg: 'bg-secondary', gradient: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)', text: 'text-white' },
    { bg: 'bg-dark', gradient: 'linear-gradient(135deg, #343a40 0%, #23272b 100%)', text: 'text-white' },
    { bg: 'bg-purple', gradient: 'linear-gradient(135deg, #6f42c1 0%, #59359a 100%)', text: 'text-white' },
    { bg: 'bg-indigo', gradient: 'linear-gradient(135deg, #6610f2 0%, #520dc2 100%)', text: 'text-white' },
    { bg: 'bg-pink', gradient: 'linear-gradient(135deg, #e83e8c 0%, #d91a72 100%)', text: 'text-white' },
    { bg: 'bg-teal', gradient: 'linear-gradient(135deg, #20c997 0%, #1aa179 100%)', text: 'text-white' },
    { bg: 'bg-orange', gradient: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)', text: 'text-white' }
  ];
  const getGenreColor = (i: number) => genreColors[i % genreColors.length];

  const goToGenre = (genre: string) => {
    navigate(`/comics?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-danger fs-2" to="/">
            ComicFlix
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/comics">Cómics</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/generos">Géneros</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-section position-relative">
        <div className="hero-banner d-flex align-items-center justify-content-center text-center">
          <div className="hero-content">
            <h1 className="display-3 fw-bold mb-3 text-white">Explora por Géneros</h1>
            <p className="lead text-white-50 mb-4 mx-auto">
              Descubre doujins organizados por géneros.

            </p>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="container-fluid px-4 py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center loading-spinner">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Cargando géneros...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <h2 className="text-white mb-3">Géneros Disponibles</h2>
                  <p className="text-muted">{genresWithCounts.length} géneros • {posts.length} posts totales</p>
                </div>

                <div className="row g-4">
                  {genresWithCounts.map(({ genre, count }, index) => {
                    const colorScheme = getGenreColor(index);
                    return (
                      <div key={genre} className="col-lg-3 col-md-4 col-sm-6">
                        <div
                          className="card h-100 border-0 shadow-lg position-relative overflow-hidden genre-card"
                          onClick={() => goToGenre(genre)}
                          style={{
                            background: colorScheme.gradient,
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                          }}
                        >
                          {/* Subtle pattern overlay */}
                          <div className="position-absolute w-100 h-100 genre-card-pattern"></div>

                          <div className="card-body d-flex flex-column justify-content-center text-center p-4 position-relative">
                            <h5 className={`card-title fw-bold mb-3 genre-card-title ${colorScheme.text}`}>
                              {genre}
                            </h5>
                            
                            <div className={`d-flex align-items-center justify-content-center small ${colorScheme.text === 'text-dark' ? 'text-black-50' : 'text-white-75'}`}>
                              <div className="badge rounded-pill px-3 py-2 genre-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="me-1 genre-icon">
                                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                </svg>
                                <span className="fw-semibold">{count} post{count !== 1 ? 's' : ''}</span>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {genresWithCounts.length === 0 && (
                  <div className="text-center py-5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-muted mb-3 empty-state-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <h4 className="text-muted">No hay géneros disponibles</h4>
                    <p className="text-muted">Aún no se han encontrado posts con géneros definidos.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-center py-4 mt-5">
        <div className="container">
          <p className="text-white mb-0">© 2025 ComicFlix. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Genero;