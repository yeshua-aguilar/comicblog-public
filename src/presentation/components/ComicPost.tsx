import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Contenido from '../views/contenido';
import { getPostBySlug, getComicsList, searchComics } from '../../infrastructure/services/blogService';
import type { BlogPost } from '../../domain/entities';

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



  const handleBlogClick = () => {
    navigate('/comics');
  };

  const loadMorePosts = async () => {
    // Función placeholder para futura implementación de paginación
  };

  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        // Usar la nueva función de búsqueda optimizada
        await searchComics(searchTerm.trim());
        navigate(`/comics?search=${encodeURIComponent(searchTerm)}`);
      } catch (error) {
        console.error('Error searching comics:', error);
        navigate(`/comics?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      navigate('/comics');
    }
  }, [navigate, searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    navigate('/comics');
  }, [navigate]);

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);



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
      onBlogClick={handleBlogClick}
      onLoadMorePosts={loadMorePosts}
      searchBarProps={{
        searchTerm: searchTerm,
        onSearchTermChange: handleSearchTermChange,
        onSubmit: handleSearchSubmit,
        onClear: clearSearch
      }}
    />
  );
}

export default ComicPost;