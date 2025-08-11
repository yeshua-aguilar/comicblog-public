import { useState, useEffect } from 'react';
import './App.css';
import BlogList from './components/BlogList';
import BlogPostComponent from './components/BlogPost';
import { getAllPosts, getPostBySlug } from './services/blogService';
import type { BlogPost } from './types/blog';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'post'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const handleBlogClick = () => {
    setCurrentView('blog');
  };

  const handlePostClick = async (slug: string) => {
    setLoading(true);
    try {
      const post = await getPostBySlug(slug);
      if (post) {
        setSelectedPost(post);
        setCurrentView('post');
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    setCurrentView('blog');
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
    setCurrentView('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'blog') {
      setCurrentView('blog');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (currentView === 'blog') {
    return (
      <div className="App bg-dark text-white">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold text-danger fs-2" href="#" onClick={handleBackToHome}>
              ComicFlix
            </a>
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
                  <a className="nav-link" href="#" onClick={handleBackToHome}>Inicio</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Cómics</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Géneros</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="#" onClick={handleBlogClick}>Blog</a>
                </li>
              </ul>
              <form className="d-flex position-relative" onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <input 
                    className="form-control bg-dark text-white border-secondary focus-ring-light" 
                    type="search" 
                    placeholder="Buscar en el blog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRight: 'none' }}
                  />
                  {searchTerm && (
                    <button 
                      type="button"
                      className="btn btn-dark border-secondary"
                      onClick={clearSearch}
                      style={{ borderLeft: 'none', borderRight: 'none' }}
                    >
                      ✕
                    </button>
                  )}
                  <button 
                    className="btn btn-outline-danger border-secondary d-flex align-items-center justify-content-center" 
                    type="submit"
                    style={{ borderLeft: 'none' }}
                    aria-label="Buscar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                    </svg>
                    <span className="visually-hidden">Buscar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </nav>

        <div style={{marginTop: '76px'}}>
          {/* Search Results Info */}
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
            <BlogList posts={filteredPosts} onPostClick={handlePostClick} />
          )}
        </div>

        {/* Footer */}
        <footer className="bg-black text-center py-4 mt-5">
          <div className="container">
            <p className="text-muted mb-0">
              © 2024 ComicFlix. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  if (currentView === 'post' && selectedPost) {
    return (
      <div className="App bg-dark text-white">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold text-danger fs-2" href="#" onClick={handleBackToHome}>
              ComicFlix
            </a>
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
                  <a className="nav-link" href="#" onClick={handleBackToHome}>Inicio</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Cómics</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Géneros</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="#" onClick={handleBlogClick}>Blog</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <BlogPostComponent post={selectedPost} onBackClick={handleBackToBlog} />

        {/* Footer */}
        <footer className="bg-black text-center py-4 mt-5">
          <div className="container">
            <p className="text-muted mb-0">
              © 2024 ComicFlix. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="App bg-dark text-white">
      {/* Header tipo Netflix */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-danger fs-2" href="#">
            ComicFlix
          </a>
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
                <a className="nav-link active" href="#">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Cómics</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Géneros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleBlogClick}>Blog</a>
              </li>
            </ul>
            <form className="d-flex position-relative" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input 
                  className="form-control bg-dark text-white border-secondary" 
                  type="search" 
                  placeholder="Buscar cómics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRight: 'none' }}
                />
                {searchTerm && (
                  <button 
                    type="button"
                    className="btn btn-dark border-secondary"
                    onClick={clearSearch}
                    style={{ borderLeft: 'none', borderRight: 'none' }}
                  >
                    ✕
                  </button>
                )}
                <button 
                  className="btn btn-outline-danger border-secondary d-flex align-items-center justify-content-center" 
                  type="submit"
                  style={{ borderLeft: 'none' }}
                  aria-label="Buscar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  </svg>
                  <span className="visually-hidden">Buscar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero Section tipo Netflix */}
      <div className="hero-section position-relative" style={{marginTop: '76px'}}>
        <div 
          className="hero-banner d-flex align-items-center justify-content-start"
          style={{
            backgroundImage: posts.length > 0 && posts[0].image 
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${posts[0].image})`
              : 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/placeholder-hero.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '70vh',
            paddingLeft: '4rem'
          }}
        >
          <div className="hero-content" style={{maxWidth: '500px'}}>
            {posts.length > 0 ? (
              <>
                <h1 className="display-4 fw-bold mb-3 text-shadow">{posts[0].title}</h1>
                <div className="mb-3">
                  <span className="badge bg-success me-2 px-3 py-2">
                    <i className="fas fa-star me-1"></i>Destacado
                  </span>
                  <span className="text-white me-2">{new Date(posts[0].date).getFullYear()}</span>
                  {posts[0].tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="badge bg-danger me-2 px-2 py-1">{tag}</span>
                  ))}
                </div>
                <p className="lead mb-4 text-shadow">
                  {posts[0].excerpt}
                </p>
                <div className="hero-buttons d-flex flex-wrap gap-3">
                  <button 
                    className="btn btn-light btn-lg d-flex align-items-center px-4 py-3 shadow-lg"
                    onClick={() => handlePostClick(posts[0].slug)}
                    style={{ 
                      fontWeight: '600',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                  >
                    Leer Ahora
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="display-4 fw-bold mb-3 text-shadow">El Mundo de One Piece: Una Aventura Épica</h1>
                <div className="mb-3">
                  <span className="badge bg-success me-2 px-3 py-2">Destacado</span>
                  <span className="badge bg-warning text-dark me-2">One Piece</span>
                  <span className="badge bg-info me-2">Manga</span>
                </div>
                <p className="lead mb-4 text-shadow">
                  Descubre por qué One Piece se ha convertido en uno de los mangas más populares de todos los tiempos.
                </p>
                <div className="hero-buttons d-flex flex-wrap gap-3">
                  <button 
                    className="btn btn-light btn-lg d-flex align-items-center px-4 py-3 shadow-lg"
                    onClick={handleBlogClick}
                    style={{ 
                      fontWeight: '600',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                  >
                    <span className="me-2" style={{ fontSize: '1.2rem' }}>📖</span>
                    Leer Ahora
                  </button>
                  <button 
                    className="btn btn-outline-light btn-lg d-flex align-items-center px-4 py-3 shadow"
                    onClick={handleBlogClick}
                    style={{ 
                      fontWeight: '600',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span className="me-2" style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    Más Información
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Posts del Blog */}
      <div className="container-fluid px-4 py-4">
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Últimos Posts del Blog</h3>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleBlogClick}
              >
                Ver todos →
              </button>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Cargando posts...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.slug} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div 
                      className="card bg-dark border-0 h-100 blog-card shadow"
                      onClick={() => handlePostClick(post.slug)}
                      style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                    >
                      {/* Imagen de portada o placeholder gris */}
                      {post.image ? (
                        <img 
                          src={post.image} 
                          className="card-img-top" 
                          alt={post.title}
                          style={{height: '420px', objectFit: 'cover', width: '100%'}}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center text-muted"
                          style={{
                            height: '420px',
                            backgroundColor: '#6c757d',
                            fontSize: '0.9rem',
                            width: '100%'
                          }}
                        >
                          <div className="text-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mb-2">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                            <div>Sin imagen</div>
                          </div>
                        </div>
                      )}

                      <div className="card-body p-2">
                        {/* Título */}
                        <h6 className="card-title text-white mb-1 fw-bold" style={{fontSize: '0.92rem', lineHeight: '1.25'}}>{post.title}</h6>
                        
                        {/* Categorías/Tags */}
                        <div className="mb-1">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <span 
                              key={index} 
                              className="badge bg-danger me-1 mb-1"
                              style={{ fontSize: '0.62rem', padding: '2px 6px' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-center py-4 mt-5">
        <div className="container">
          <p className="text-muted mb-0">
            © 2024 ComicFlix. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
