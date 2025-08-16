import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Contenido from '../views/contenido';
import { getPostBySlug, getComicsList } from '../services/blogService';
import type { BlogPost } from '../types/blog';

/**
 * Componente para mostrar un post individual de cómic
 * Maneja la carga y visualización de un post específico basado en el slug de la URL
 */
function ComicPost() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        navigate('/comics');
        return;
      }

      setLoading(true);
      try {
        const post = await getPostBySlug(slug);
        if (post) {
          setSelectedPost(post);
        } else {
          navigate('/comics');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/comics');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const comics = await getComicsList();
        setPosts(comics);
        setFilteredPosts(comics);
      } catch (error) {
        console.error('Error loading comics:', error);
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

  const handlePostClick = (postSlug: string) => {
    navigate(`/comics/${postSlug}`);
  };

  const handleBackToBlog = () => {
    navigate('/comics');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBlogClick = () => {
    navigate('/comics');
  };

  const loadMorePosts = async () => {
    // Función placeholder para futura implementación de paginación
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/comics?search=${encodeURIComponent(searchTerm)}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    navigate('/comics');
  };

  const SearchBar = ({ placeholder }: { placeholder: string }) => (
    <form className="d-flex position-relative" onSubmit={handleSearchSubmit}>
      <div className="input-group">
        <input 
          className="form-control bg-dark text-white border-secondary" 
          type="search" 
          placeholder={placeholder}
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
  );

  if (loading) {
    return (
      <div className="bg-dark text-white d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Contenido
      currentView="post"
      selectedPost={selectedPost}
      filteredPosts={filteredPosts}
      loading={loading}
      searchTerm={searchTerm}
      hasMore={false}
      loadingMore={false}
      onPostClick={handlePostClick}
      onBackToBlog={handleBackToBlog}
      onBackToHome={handleBackToHome}
      onBlogClick={handleBlogClick}
      onLoadMorePosts={loadMorePosts}
      SearchBar={SearchBar}
    />
  );
}

export default ComicPost;