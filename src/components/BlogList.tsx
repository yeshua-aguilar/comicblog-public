import { useState, useMemo, type FC } from 'react';
import type { BlogPost } from '../types/blog';

interface BlogListProps {
  posts: BlogPost[];
  onPostClick: (slug: string) => void;
}

const BlogList: FC<BlogListProps> = ({ posts, onPostClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const postsPerPage = 20;

  // Calcular posts visibles
  const { visiblePosts, totalPages, totalPosts } = useMemo(() => {
    if (showAll) {
      return {
        visiblePosts: posts,
        totalPages: 1,
        totalPosts: posts.length
      };
    }

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    return {
      visiblePosts: posts.slice(startIndex, endIndex),
      totalPages: Math.ceil(posts.length / postsPerPage),
      totalPosts: posts.length
    };
  }, [posts, currentPage, showAll, postsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-12">
          {/* Header con controles */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 text-white">Blog de ComicFlix</h2>
              <small className="text-muted">
                {showAll 
                  ? `Mostrando todos los ${totalPosts} posts`
                  : `Mostrando ${visiblePosts.length} de ${totalPosts} posts (Página ${currentPage} de ${totalPages})`
                }
              </small>
            </div>
            <button 
              className={`btn ${showAll ? 'btn-outline-danger' : 'btn-danger'} btn-sm`}
              onClick={handleToggleShowAll}
            >
              {showAll ? 'Paginar' : 'Ver Todos'}
            </button>
          </div>

          {/* Grid de posts */}
          <div className="row">
            {visiblePosts.map((post) => (
              <div key={post.slug} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div 
                  className="card bg-dark border-0 h-100 blog-card shadow"
                  onClick={() => onPostClick(post.slug)}
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

          {/* Controles de paginación */}
          {!showAll && totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <nav aria-label="Navegación de páginas">
                <ul className="pagination pagination-sm">
                  {/* Botón anterior */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link bg-dark text-light border-secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                  </li>

                  {/* Números de página */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className={`page-link ${currentPage === pageNum ? 'bg-danger border-danger' : 'bg-dark text-light border-secondary'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  {/* Botón siguiente */}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link bg-dark text-light border-secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* Mostrar información adicional cuando se muestran todos */}
          {showAll && totalPosts > postsPerPage && (
            <div className="text-center mt-4">
              <small className="text-muted">
                Mostrando todos los {totalPosts} posts disponibles
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;