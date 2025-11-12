import React, { memo, useCallback } from 'react';
import '../assets/css/SearchBar.css';

export interface SearchBarProps {
  placeholder: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(({
  placeholder,
  searchTerm,
  onSearchTermChange,
  onSubmit,
  onClear
}) => {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchTermChange(value);
  }, [onSearchTermChange]);

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <div className="search-container">
        <input 
          className="search-input"
          type="text" 
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          autoComplete="off" // Desactivar autocompletado por si acaso
        />
        {searchTerm && (
          <button 
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
        <button 
          className="search-button"
          type="submit"
          aria-label="Buscar"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            fill="currentColor" 
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
          </svg>
        </button>
      </div>
    </form>
  );
});

export default SearchBar;