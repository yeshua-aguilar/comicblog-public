import React from 'react';
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
          
          {/* Imagen o placeholder */}
          {post.image ? (
            <img 
              src={post.image} 
              className="img-fluid rounded mb-4" 
              alt={post.title}
              style={{height: '300px', width: '100%', objectFit: 'cover'}}
            />
          ) : (
            <div className="bg-dark rounded mb-4">
              <div 
                className="d-flex align-items-center justify-content-center text-muted"
                style={{
                  height: '300px',
                  backgroundColor: '#6c757d',
                  fontSize: '1.1rem'
                }}
              >
                Sin imagen
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