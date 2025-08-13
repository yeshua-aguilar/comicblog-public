import React, { useState, useEffect } from 'react';
import { getAllPosts, createPost, updatePost, deletePost, createPostWithSlug, invalidatePostsCache } from '../../services/blogService';
import type { BlogPost } from '../../types/blog';
import '../../assets/css/dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface DashboardStats {
  totalBlogs: number;
  totalCategories: number;
  recentBlogs: number;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'stats' | 'create' | 'list'>('stats');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalBlogs: 0, totalCategories: 0, recentBlogs: 0 });
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: '',
    content: '',
    tags: '',
    excerpt: '',
    slug: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const allBlogs = await getAllPosts();
      setBlogs(allBlogs);
      
      const uniqueTags = new Set(allBlogs.flatMap(blog => blog.tags));
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 1);
      const recentBlogs = allBlogs.filter(blog => new Date(blog.date) > recentDate);
      
      setStats({
        totalBlogs: allBlogs.length,
        totalCategories: uniqueTags.size,
        recentBlogs: recentBlogs.length
      });
    } catch (error) {
      console.error('Error al cargar blogs:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title: formData.title,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      excerpt: formData.excerpt,
      image: formData.image,
      content: formData.content
    };

    try {
      if (editingBlog) {
        await updatePost(editingBlog.slug, postData);
        alert('Blog actualizado exitosamente');
      } else {
        if (formData.slug.trim()) {
          await createPostWithSlug(formData.slug.trim(), postData);
        } else {
          await createPost(postData);
        }
        alert('Blog creado exitosamente');
      }
      
      invalidatePostsCache(); // Invalidar caché
      resetForm();
      loadBlogs();
      setActiveSection('list');
    } catch (error) {
      console.error('Error al guardar el blog:', error);
      alert('Error al guardar el blog');
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      image: blog.image || '',
      content: blog.content,
      tags: blog.tags.join(', '),
      excerpt: blog.excerpt,
      slug: blog.slug
    });
    setActiveSection('create');
  };

  const handleDeleteBlog = async (slug: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este blog?')) {
      try {
        await deletePost(slug);
        invalidatePostsCache(); // Invalidar caché
        alert('Blog eliminado exitosamente');
        loadBlogs();
      } catch (error) {
        console.error('Error al eliminar el blog:', error);
        alert('Error al eliminar el blog');
      }
    }
  };



  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      image: '',
      content: '',
      tags: '',
      excerpt: '',
      slug: ''
    });
    setEditingBlog(null);
  };

  const renderStats = () => (
    <div className="dashboard-content">
      <h2 className="mb-4">Estadísticas del Blog</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card stats-card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="card-title">{stats.totalBlogs}</h3>
                  <p className="card-text">Total de Blogs</p>
                </div>
                <span className="display-4">📝</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card stats-card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="card-title">{stats.totalCategories}</h3>
                  <p className="card-text">Categorías</p>
                </div>
                <span className="display-4">🏷️</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card stats-card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="card-title">{stats.recentBlogs}</h3>
                  <p className="card-text">Blogs Recientes</p>
                </div>
                <span className="display-4">⏰</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Blogs Recientes</h5>
            </div>
            <div className="card-body">
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog.slug} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <h6 className="mb-1">{blog.title}</h6>
                    <small className="text-muted">Por {blog.author} - {blog.date}</small>
                  </div>
                  <span className="badge bg-secondary">{blog.tags.length} tags</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="dashboard-content">
      <h2 className="mb-4">{editingBlog ? 'Editar Blog' : 'Crear Nuevo Blog'}</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="title" className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="author" className="form-label">Autor</label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="slug" className="form-label">Slug (opcional al crear)</label>
                <input
                  type="text"
                  className="form-control"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="mi-slug-personalizado"
                  disabled={!!editingBlog}
                />
                <small className="text-muted">Si lo dejas vacío, se generará un ID automático.</small>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="image" className="form-label">URL de la Portada</label>
              <input
                type="url"
                className="form-control"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags (separados por comas)</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="tecnología, programación, react"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="excerpt" className="form-label">Extracto</label>
              <textarea
                className="form-control"
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Breve descripción del blog..."
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Contenido del Blog</label>
              <textarea
                className="form-control"
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Escribe el contenido del blog en formato Markdown..."
                required
              ></textarea>
            </div>
            
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingBlog ? 'Actualizar Blog' : 'Crear Blog'}
              </button>
              {editingBlog && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderBlogList = () => (
    <div className="dashboard-content">
      <h2 className="mb-4">Lista de Blogs</h2>
      <div className="card">
        <div className="card-header">
          <h5>Todos los Blogs</h5>
        </div>
        <div className="card-body">
          {blogs.map((blog) => (
            <div key={blog.slug} className="border-bottom py-3">
              <div className="row align-items-center">
                <div className="col-lg-4 col-md-4 col-12 mb-2 mb-md-0">
                  <h6 className="mb-1">{blog.title}</h6>
                  <small className="text-muted">{blog.excerpt}</small>
                </div>
                <div className="col-lg-2 col-md-2 col-6 mb-2 mb-lg-0">
                  <small className="text-muted">Por {blog.author}</small>
                </div>
                <div className="col-lg-2 col-md-2 col-6 mb-2 mb-lg-0">
                  <small className="text-muted">{new Date(blog.date).toLocaleDateString()}</small>
                </div>
                <div className="col-lg-2 col-md-2 col-12 mb-2 mb-lg-0">
                  <div className="d-flex flex-wrap gap-1">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="badge bg-danger">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-lg-2 col-md-2 col-12 d-flex justify-content-end gap-1 mt-2 mt-lg-0">
                   <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleEditBlog(blog)}
                      title="Editar blog"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteBlog(blog.slug)}
                      title="Eliminar blog"
                    >
                      🗑️
                    </button>
                 </div>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No hay blogs disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h4 className="text-white">Dashboard</h4>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className={`nav-link ${activeSection === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveSection('stats')}
              >
                <span className="me-2">📊</span>
                Estadísticas
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeSection === 'create' ? 'active' : ''}`}
                onClick={() => {setActiveSection('create'); resetForm();}}
              >
                <span className="me-2">➕</span>
                Crear Blog
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeSection === 'list' ? 'active' : ''}`}
                onClick={() => setActiveSection('list')}
              >
                <span className="me-2">📋</span>
                Lista de Blogs
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid">
          {activeSection === 'stats' && renderStats()}
          {activeSection === 'create' && renderCreateForm()}
          {activeSection === 'list' && renderBlogList()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;