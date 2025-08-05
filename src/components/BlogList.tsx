import React from 'react';
import type { BlogPost } from '../types/blog';

interface BlogListProps {
  posts: BlogPost[];
  onPostClick: (slug: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ posts, onPostClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-white">Blog de ComicFlix</h2>
          <div className="row">
            {posts.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6 mb-4">
                <div 
                  className="card bg-dark border-0 h-100 blog-card"
                  onClick={() => onPostClick(post.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Imagen o placeholder */}
                  {post.image ? (
                    <img 
                      src={post.image} 
                      className="card-img-top" 
                      alt={post.title}
                      style={{height: '200px', objectFit: 'cover'}}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center text-muted"
                      style={{
                        height: '200px',
                        backgroundColor: '#6c757d',
                        fontSize: '0.9rem'
                      }}
                    >
                      Sin imagen
                    </div>
                  )}
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
                        {formatDate(post.date)}
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
        </div>
      </div>
    </div>
  );
};

export default BlogList;