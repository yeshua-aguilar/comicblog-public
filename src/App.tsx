import React from 'react';
import './App.css';

function App() {
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
                <a className="nav-link" href="#">Mi Lista</a>
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
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/placeholder-hero.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '70vh',
            paddingLeft: '4rem'
          }}
        >
          <div className="hero-content" style={{maxWidth: '500px'}}>
            <h1 className="display-4 fw-bold mb-3">One Piece</h1>
            <div className="mb-3">
              <span className="badge bg-success me-2">95% Match</span>
              <span className="text-muted me-2">2023</span>
              <span className="border border-secondary px-2 py-1 small">13+</span>
            </div>
            <p className="lead mb-4">
              Sigue las aventuras de Monkey D. Luffy y su tripulación de piratas 
              en busca del tesoro más grande del mundo, el One Piece.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-light btn-lg me-3">
                ▶️ Leer Ahora
              </button>
              <button className="btn btn-secondary btn-lg">
                ℹ️ Más Información
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de Cómics tipo Netflix */}
      <div className="container-fluid px-4 py-4">
        {/* Tendencias */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-3">Tendencias Ahora</h3>
            <div className="row">
              {[1,2,3,4,5,6].map(num => (
                <div key={num} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                  <div className="card bg-dark border-0 h-100 comic-card">
                    <img 
                      src="/placeholder-comic.svg" 
                      className="card-img-top" 
                      alt={`Comic ${num}`}
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-white mb-1">Comic Title {num}</h6>
                      <small className="text-muted">Autor {num}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Populares */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-3">Populares en ComicFlix</h3>
            <div className="row">
              {[1,2,3,4,5,6].map(num => (
                <div key={num} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                  <div className="card bg-dark border-0 h-100 comic-card">
                    <img 
                      src="/placeholder-comic.svg" 
                      className="card-img-top" 
                      alt={`Popular ${num}`}
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-white mb-1">Popular Comic {num}</h6>
                      <small className="text-muted">Autor Popular {num}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acción */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-3">Acción y Aventura</h3>
            <div className="row">
              {[1,2,3,4,5,6].map(num => (
                <div key={num} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                  <div className="card bg-dark border-0 h-100 comic-card">
                    <img 
                      src="/placeholder-comic.svg" 
                      className="card-img-top" 
                      alt={`Acción ${num}`}
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-white mb-1">Acción Comic {num}</h6>
                      <small className="text-muted">Autor Acción {num}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Romance */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="mb-3">Romance</h3>
            <div className="row">
              {[1,2,3,4,5,6].map(num => (
                <div key={num} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-3">
                  <div className="card bg-dark border-0 h-100 comic-card">
                    <img 
                      src="/placeholder-comic.svg" 
                      className="card-img-top" 
                      alt={`Romance ${num}`}
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-2">
                      <h6 className="card-title text-white mb-1">Romance Comic {num}</h6>
                      <small className="text-muted">Autor Romance {num}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
