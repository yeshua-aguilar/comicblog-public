import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Contenido from './contenido';
import Header from '../components/Header';
import { getComicsList, getPostBySlug, searchComics } from '../services/blogService';
import type { BlogPost } from '../types/blog';

/**
 * Componente principal de la página de inicio
 * Maneja múltiples vistas: home, blog y post individual
 */
function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'post'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    const loadPosts = async () => {
      if (slug) return;
      
      setLoading(true);
      try {
        const comics = await getComicsList();
        setPosts(comics);
        setFilteredPosts(comics);
        setHasMore(false);
      } catch (error) {
        console.error('Error loading comics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [slug]);
  
  useEffect(() => {
    const handleRouteChange = async () => {
      if (slug) {
        setLoading(true);
        try {
          const post = await getPostBySlug(slug);
          if (post) {
            setSelectedPost(post);
            setCurrentView('post');
          } else {
            navigate('/comics');
          }
        } catch (error) {
          console.error('Error loading post:', error);
          navigate('/comics');
        } finally {
          setLoading(false);
        }
      } else if (location.pathname.startsWith('/comics')) {
        setCurrentView('blog');
        setSelectedPost(null);
        if (posts.length === 0) {
          setLoading(true);
          try {
            const comics = await getComicsList();
            setPosts(comics);
            setFilteredPosts(comics);
            setHasMore(false);
          } catch (error) {
            console.error('Error loading comics:', error);
          } finally {
            setLoading(false);
          }
        }
        const params = new URLSearchParams(location.search);
        const genre = params.get('genre');
        const search = params.get('search');
        if (genre) setSearchTerm(genre);
        if (search) setSearchTerm(search);
      } else {
        setCurrentView('home');
        setSelectedPost(null);
        if (posts.length === 0) {
          setLoading(true);
          try {
            const comics = await getComicsList();
            setPosts(comics);
            setFilteredPosts(comics);
            setHasMore(false);
          } catch (error) {
            console.error('Error loading comics:', error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    handleRouteChange();
  }, [location.pathname, location.search, slug, navigate, posts.length]);

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
    navigate('/comics');
  };

  const loadMorePosts = async () => {
    // Función placeholder para futura implementación de paginación
  };

  const handlePostClick = async (postSlug: string) => {
    // Navegar a la URL específica del post
    navigate(`/comics/${postSlug}`);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    setCurrentView('blog');
    navigate('/comics');
  };



  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const searchResults = await searchComics(searchTerm.trim());
        setFilteredPosts(searchResults);
        if (currentView !== 'blog') {
          setCurrentView('blog');
        }
        navigate(`/comics?search=${encodeURIComponent(searchTerm)}`);
      } catch (error) {
        console.error('Error searching comics:', error);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    }
  }, [currentView, navigate, searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    navigate('/comics');
  }, [navigate]);

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const searchBarProps = {
    searchTerm,
    onSearchTermChange: handleSearchTermChange,
    onSubmit: handleSearchSubmit,
    onClear: clearSearch,
  };

  if (currentView === 'blog' || currentView === 'post') {
    return (
      <Contenido
        currentView={currentView}
        selectedPost={selectedPost}
        filteredPosts={filteredPosts}
        loading={loading}
        searchTerm={searchTerm}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onPostClick={handlePostClick}
        onBackToBlog={handleBackToBlog}
        onBlogClick={handleBlogClick}
        onLoadMorePosts={loadMorePosts}
        searchBarProps={searchBarProps}
      />
    );
  }

  return (
    <div className="bg-dark text-white">
      {/* Header componente */}
      <Header onBlogClick={handleBlogClick} searchBarProps={searchBarProps} />

      {/* Hero Section tipo Netflix */}
      <div className="hero-section position-relative" style={{marginTop: '76px'}}>
        <div 
          className="hero-banner d-flex align-items-center justify-content-start"
          style={{
            backgroundImage: loading 
              ? 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9))' 
              : (posts.length > 0 && posts[0].image 
                  ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${posts[0].image})`
                  : 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/placeholder-hero.svg)'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '70vh',
            paddingLeft: '4rem'
          }}
        >
          <div className="hero-content" style={{maxWidth: '80%'}}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100 h-100">
                <div className="spinner-border text-light" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : posts.length > 0 ? (
              <>
                <h1 className="display-4 fw-bold mb-3 text-shadow">
                  {posts[0].title.length > 60
                    ? posts[0].title.slice(0, 60) + '...'
                    : posts[0].title}
                </h1>
                <div className="mb-3">
                  <span className="badge bg-success me-2 px-3 py-2">
                    <i className="fas fa-star me-1"></i>Destacado
                  </span>
                  <span className="text-white me-2">{new Date(posts[0].date).getFullYear()}</span>
                  {Array.isArray(posts[0].tags)
                    ? posts[0].tags.map((tag, index) => (
                        <span key={index} className="badge bg-danger me-2 px-2 py-1">{tag}</span>
                      ))
                    : null}
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
                <h1 className="display-4 fw-bold mb-3 text-shadow">No hay publicaciones destacadas</h1>
                <p className="lead mb-4 text-shadow">
                  Vuelve más tarde para ver nuevo contenido.
                </p>
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
                {/* aqui es para mostrar cuantos comics en la pagina principal */}
                {posts.slice(0, 12).map((post) => (
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
                          {Array.isArray(post.tags)
                            ? post.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="badge bg-danger me-1 mb-1"
                                  style={{ fontSize: '0.62rem', padding: '2px 6px' }}
                                >
                                  {tag}
                                </span>
                              ))
                            : null}
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
          <p className="text-white mb-0">
            © 2025 ComicFlix. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;