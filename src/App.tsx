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

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

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
              <div className="d-flex">
                <input 
                  className="form-control me-2 bg-dark text-white border-secondary" 
                  type="search" 
                  placeholder="Buscar en el blog..."
                />
                <button className="btn btn-outline-light" type="submit">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div style={{marginTop: '76px'}}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <BlogList posts={posts} onPostClick={handlePostClick} />
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
            <div className="d-flex">
              <input 
                className="form-control me-2 bg-dark text-white border-secondary" 
                type="search" 
                placeholder="Buscar cómics..."
              />
              <button className="btn btn-outline-light" type="submit">
                🔍
              </button>
            </div>
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
                <h1 className="display-4 fw-bold mb-3">{posts[0].title}</h1>
                <div className="mb-3">
                  <span className="badge bg-success me-2">Destacado</span>
                  <span className="text-muted me-2">{new Date(posts[0].date).getFullYear()}</span>
                  {posts[0].tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="badge bg-danger me-2">{tag}</span>
                  ))}
                </div>
                <p className="lead mb-4">
                  {posts[0].excerpt}
                </p>
                <div className="hero-buttons">
                  <button 
                    className="btn btn-light btn-lg me-3"
                    onClick={() => handlePostClick(posts[0].slug)}
                  >
                    📖 Leer Ahora
                  </button>
                  <button 
                    className="btn btn-secondary btn-lg"
                    onClick={() => handlePostClick(posts[0].slug)}
                  >
                    ℹ️ Más Información
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="display-4 fw-bold mb-3">ComicFlix Blog</h1>
                <div className="mb-3">
                  <span className="badge bg-success me-2">Bienvenido</span>
                </div>
                <p className="lead mb-4">
                  Descubre las mejores historias y análisis del mundo del cómic.
                </p>
                <div className="hero-buttons">
                  <button 
                    className="btn btn-light btn-lg me-3"
                    onClick={handleBlogClick}
                  >
                    📖 Ver Blog
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
            <h3 className="mb-3">Últimos Posts del Blog</h3>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{minHeight: '200px'}}>
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Cargando posts...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {posts.map((post) => (
                  <div key={post.slug} className="col-lg-4 col-md-6 mb-4">
                    <div 
                      className="card bg-dark border-0 h-100 blog-card"
                      onClick={() => handlePostClick(post.slug)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body p-4">
                        <h5 className="card-title text-white mb-3">{post.title}</h5>
                        <p className="card-text text-muted mb-3">{post.excerpt}</p>
                        
                        <div className="mb-3">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="badge bg-danger me-2 mb-1"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Por {post.author}
                          </small>
                          <small className="text-muted">
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                        
                        <div className="mt-3">
                          <span className="text-danger" style={{ fontSize: '0.9rem' }}>
                            Leer más →
                          </span>
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
