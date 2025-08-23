import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import type { SearchBarProps } from './SearchBar';

interface HeaderProps {
  onBlogClick: () => void;
  searchBarProps: Omit<SearchBarProps, 'placeholder'>;
}

/**
 * Componente Header reutilizable tipo Netflix
 * Contiene la navegación principal y la barra de búsqueda
 */
function Header({ onBlogClick, searchBarProps }: HeaderProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-danger fs-2" to="/">
          ComicFlix
        </Link>
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
              <Link className="nav-link active" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/comics" onClick={onBlogClick}>Cómics</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/generos">Géneros</Link>
            </li>
          </ul>
          <SearchBar placeholder="Buscar cómics..." {...searchBarProps} />
        </div>
      </div>
    </nav>
  );
}

export default Header;