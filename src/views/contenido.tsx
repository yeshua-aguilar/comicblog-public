import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList';
import BlogPostComponent from '../components/BlogPost';
import type { BlogPost } from '../types/blog';

/**
 * Props para el componente Contenido
 */
interface ContenidoProps {
  currentView: 'blog' | 'post';
  selectedPost: BlogPost | null;
  filteredPosts: BlogPost[];
  loading: boolean;
  searchTerm: string;
  hasMore: boolean;
  loadingMore: boolean;
  onPostClick: (postSlug: string) => void;
  onBackToBlog: () => void;
  onBackToHome: () => void;
  onBlogClick: () => void;
  onLoadMorePosts: () => void;
  SearchBar: React.ComponentType<{ placeholder: string }>;
}

/**
 * Componente que maneja la visualización de contenido
 * Puede mostrar tanto la lista de posts como posts individuales
 */

function Contenido({
  currentView,
  selectedPost,
  filteredPosts,
  loading,
  searchTerm,
  hasMore,
  loadingMore,
  onPostClick,
  onBackToBlog,
  onBackToHome,
  onBlogClick,
  onLoadMorePosts,
  SearchBar
}: ContenidoProps) {
  if (currentView === 'blog') {
    return (
      <div className="bg-dark text-white">
        <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold text-danger fs-2" to="/" onClick={onBackToHome}>
              ComicFlix
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={onBackToHome}>Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/comics" onClick={onBlogClick}>Cómics</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/generos">Géneros</Link>
                </li>
              </ul>
              <SearchBar placeholder="Buscar en el blog..." />
            </div>
          </div>
        </nav>

        <div style={{marginTop: '76px'}}>
          {searchTerm && (
            <div className="container-fluid px-4 pt-3">
              <div className="alert alert-info bg-dark border-secondary text-light">
                <small>
                  {filteredPosts.length > 0 
                    ? `${filteredPosts.length} resultado(s) para "${searchTerm}"`
                    : `No se encontraron resultados para "${searchTerm}"`
                  }
                </small>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <>
              <BlogList posts={filteredPosts} onPostClick={onPostClick} />
              
              {hasMore && !searchTerm && (
                <div className="container-fluid px-4 py-4">
                  <div className="text-center">
                    <button 
                      className="btn btn-outline-danger btn-lg"
                      onClick={onLoadMorePosts}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Cargando más...
                        </>
                      ) : (
                        'Ver más cómics'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="bg-black text-center py-4 mt-5">
          <div className="container">
            <p className="text-white mb-0">
              © 2025 ComicFlix. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  if (currentView === 'post' && selectedPost) {
    return (
      <div className="bg-dark text-white">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold text-danger fs-2" to="/" onClick={onBackToHome}>
              ComicFlix
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={onBackToHome}>Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/comics" onClick={onBlogClick}>Cómics</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/generos">Géneros</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <BlogPostComponent post={selectedPost} onBackClick={onBackToBlog} />

        <footer className="bg-black text-center py-4 mt-5">
          <div className="container">
            <p className="text-white mb-0">
              © 2025 ComicFlix. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}

export default Contenido;