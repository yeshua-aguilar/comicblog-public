import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '../types/blog';

interface BlogPostProps {
  post: BlogPost;
  onBackClick: () => void;
}

const BlogPostComponent: React.FC<BlogPostProps> = ({ post, onBackClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Estado para el carrusel de imágenes del cómic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Obtener las URLs de las páginas del cómic
  const getComicPageUrls = () => {
    if (!post.comicPages || !post.comicPages.trim()) return [];
    return post.comicPages
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
  };
  
  const comicPageUrls = getComicPageUrls();
  
  // Funciones para navegar en el carrusel
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % comicPageUrls.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + comicPageUrls.length) % comicPageUrls.length);
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Manejo de gestos táctiles
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && comicPageUrls.length > 1) {
      nextImage();
    }
    if (isRightSwipe && comicPageUrls.length > 1) {
      prevImage();
    }
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (comicPageUrls.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [comicPageUrls.length]);

  return (
    <div className="container-fluid px-4 py-4" style={{ marginTop: '76px' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          {/* Botón de regreso */}
          <button 
            className="btn btn-outline-light mb-4"
            onClick={onBackClick}
          >
            ← Volver al Blog
          </button>
          
          {/* Encabezado del post */}
          <div className="bg-dark p-4 rounded mb-4">
            <h1 className="text-white mb-3">{post.title}</h1>
            
            <div className="mb-3">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="badge bg-danger me-2 mb-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="d-flex justify-content-between align-items-center text-muted">
              <span>Por {post.author}</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
          
          {/* Imagen de portada más grande */}
          <div className="d-flex justify-content-center mb-4">
            {post.image ? (
              <img 
                src={post.image} 
                className="rounded" 
                alt={post.title}
                style={{
                  width: '400px',
                  height: '600px',
                  objectFit: 'cover',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : (
              <div 
                className="bg-dark rounded d-flex align-items-center justify-content-center text-muted"
                style={{
                  width: '400px',
                  height: '600px',
                  backgroundColor: '#6c757d',
                  fontSize: '1.2rem',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="text-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mb-3">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                  <div>Sin portada</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Carrusel de páginas del cómic */}
          {comicPageUrls.length > 0 && (
            <div className="mb-4 comic-carousel">
              <div 
                ref={carouselRef}
                className="position-relative"
                style={{ 
                  width: '100vw',
                  marginLeft: 'calc(-50vw + 50%)',
                  cursor: 'default'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img 
                  src={comicPageUrls[currentImageIndex]} 
                  alt={`Página ${currentImageIndex + 1}`}
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '95vh',
                    objectFit: 'contain',
                    backgroundColor: '#000',
                    transition: 'opacity 0.3s ease-in-out',
                    userSelect: 'none'
                  }}
                  draggable={false}
                />
                
                {/* Áreas de clic invisibles para navegación */}
                {comicPageUrls.length > 1 && (
                  <>
                    {/* Área izquierda para retroceder */}
                    <div 
                      className="position-absolute top-0 start-0 h-100 comic-nav-area"
                      style={{
                        width: '50%',
                        cursor: 'pointer',
                        zIndex: 10,
                        backgroundColor: 'transparent'
                      }}
                      onClick={prevImage}
                      title="Página anterior"
                    />
                    
                    {/* Área derecha para avanzar */}
                    <div 
                      className="position-absolute top-0 end-0 h-100 comic-nav-area"
                      style={{
                        width: '50%',
                        cursor: 'pointer',
                        zIndex: 10,
                        backgroundColor: 'transparent'
                      }}
                      onClick={nextImage}
                      title="Página siguiente"
                    />
                  </>
                )}
              </div>
              
              {/* Indicadores de página mejorados */}
              {comicPageUrls.length > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <div className="d-flex flex-wrap justify-content-center gap-2 comic-page-indicators" style={{ maxWidth: '90%' }}>
                    {comicPageUrls.map((_, index) => (
                      <button
                        key={index}
                        className={`btn position-relative overflow-hidden ${
                          index === currentImageIndex 
                            ? 'btn-danger shadow-lg' 
                            : 'btn-outline-light'
                        }`}
                        onClick={() => goToImage(index)}
                        style={{ 
                          width: '50px', 
                          height: '40px', 
                          fontSize: '0.9rem',
                          fontWeight: index === currentImageIndex ? 'bold' : 'normal',
                          border: index === currentImageIndex ? '2px solid #dc3545' : '1px solid #6c757d',
                          transition: 'all 0.3s ease',
                          transform: index === currentImageIndex ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {index + 1}
                        {index === currentImageIndex && (
                          <div 
                            className="position-absolute bottom-0 start-0"
                            style={{
                              width: '100%',
                              height: '3px',
                              backgroundColor: '#fff',
                              animation: 'pulse 2s infinite'
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Contador de páginas mejorado */}
              <div className="text-center mt-3">
                <div className="d-inline-flex align-items-center bg-dark bg-opacity-75 px-3 py-2 rounded-pill">
                  <small className="text-light fw-bold">
                    <span className="text-danger">{currentImageIndex + 1}</span>
                    <span className="mx-2 text-muted">de</span>
                    <span className="text-light">{comicPageUrls.length}</span>
                  </small>
                  {comicPageUrls.length > 1 && (
                    <small className="text-muted ms-3">
                      <i className="fas fa-hand-pointer me-1"></i>
                      Desliza o usa las flechas del teclado
                    </small>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Contenido del post */}
          <div className="bg-dark p-4 rounded">
            <div className="markdown-content text-white">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-white mb-4">{children}</h1>,
                  h2: ({children}) => <h2 className="text-white mb-3 mt-4">{children}</h2>,
                  h3: ({children}) => <h3 className="text-white mb-3 mt-3">{children}</h3>,
                  h4: ({children}) => <h4 className="text-white mb-2 mt-3">{children}</h4>,
                  p: ({children}) => <p className="text-light mb-3 lh-lg">{children}</p>,
                  ul: ({children}) => <ul className="text-light mb-3">{children}</ul>,
                  ol: ({children}) => <ol className="text-light mb-3">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  blockquote: ({children}) => (
                    <blockquote className="border-start border-danger border-3 ps-3 my-4 text-light fst-italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({children}) => (
                    <code className="bg-secondary text-light px-2 py-1 rounded">
                      {children}
                    </code>
                  ),
                  pre: ({children}) => (
                    <pre className="bg-secondary text-light p-3 rounded overflow-auto">
                      {children}
                    </pre>
                  ),
                  strong: ({children}) => <strong className="text-white fw-bold">{children}</strong>,
                  em: ({children}) => <em className="text-light fst-italic">{children}</em>,
                  hr: () => <hr className="border-secondary my-4" />,
                  a: ({href, children}) => (
                    <a href={href} className="text-danger text-decoration-none">
                      {children}
                    </a>
                  ),
                  img: ({src, alt}) => (
                    <div className="text-center my-4">
                      <img 
                        src={src} 
                        alt={alt || 'Página del cómic'}
                        className="img-fluid rounded"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    </div>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Botón de regreso al final */}
          <div className="text-center mt-4">
            <button 
              className="btn btn-danger"
              onClick={onBackClick}
            >
              ← Volver al Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostComponent;