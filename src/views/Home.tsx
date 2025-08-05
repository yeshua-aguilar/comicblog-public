import React, { useState } from 'react';
import styled from 'styled-components';
import { useComicController } from '../controllers/ComicController';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ComicRow from '../components/ComicRow';
import { Comic } from '../types/Comic';

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: var(--netflix-black);
`;

const MainContent = styled.main`
  padding-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: var(--netflix-white);
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: var(--netflix-white);
  text-align: center;
  padding: 2rem;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--netflix-red);
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--netflix-text-gray);
  max-width: 500px;
`;

const RetryButton = styled.button`
  background: var(--netflix-red);
  color: var(--netflix-white);
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--netflix-dark-red);
    transform: translateY(-2px);
  }
`;

const SectionSpacing = styled.div`
  margin-top: 2rem;
`;

const Home: React.FC = () => {
  const {
    comics,
    featuredComics,
    trendingComics,
    loading,
    error,
    searchQuery,
    currentFilter,
    actions
  } = useComicController();

  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  const handleSearch = (query: string) => {
    actions.searchComics(query);
  };

  const handleSelectComic = (comic: Comic) => {
    setSelectedComic(comic);
    // Aquí podrías navegar a una página de detalles del comic
    console.log('Comic seleccionado:', comic.title);
  };

  const handleRetry = () => {
    actions.clearError();
    actions.loadComics();
    actions.loadFeaturedComics();
    actions.loadTrendingComics();
  };

  // Filtrar comics por género para crear filas temáticas
  const getComicsByGenre = (genre: string) => {
    return comics.filter(comic => comic.genre.includes(genre)).slice(0, 10);
  };

  // Obtener comics recientes
  const getRecentComics = () => {
    return [...comics]
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 10);
  };

  // Obtener comics mejor valorados
  const getTopRatedComics = () => {
    return [...comics]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  if (loading && comics.length === 0) {
    return (
      <HomeContainer>
        <Header onSearch={handleSearch} searchQuery={searchQuery} />
        <LoadingContainer>
          <div className="loading"></div>
          <span style={{ marginLeft: '1rem' }}>Cargando comics...</span>
        </LoadingContainer>
      </HomeContainer>
    );
  }

  if (error && comics.length === 0) {
    return (
      <HomeContainer>
        <Header onSearch={handleSearch} searchQuery={searchQuery} />
        <ErrorContainer>
          <ErrorTitle>¡Oops! Algo salió mal</ErrorTitle>
          <ErrorMessage>
            No pudimos cargar los comics en este momento. 
            Por favor, verifica tu conexión e inténtalo de nuevo.
          </ErrorMessage>
          <RetryButton onClick={handleRetry}>
            Intentar de nuevo
          </RetryButton>
        </ErrorContainer>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <MainContent>
        {/* Hero Section - Solo se muestra si hay comics destacados y no hay búsqueda activa */}
        {featuredComics.length > 0 && !searchQuery && (
          <Hero 
            featuredComics={featuredComics} 
            onSelectComic={handleSelectComic}
          />
        )}
        
        <SectionSpacing>
          {/* Resultados de búsqueda */}
          {searchQuery && (
            <ComicRow
              title={`Resultados para "${searchQuery}"`}
              comics={comics}
              onSelectComic={handleSelectComic}
              size="medium"
            />
          )}
          
          {/* Comics trending - Solo se muestra si no hay búsqueda */}
          {!searchQuery && trendingComics.length > 0 && (
            <ComicRow
              title="Trending Ahora"
              comics={trendingComics}
              onSelectComic={handleSelectComic}
              size="large"
            />
          )}
          
          {/* Comics recientes */}
          {!searchQuery && getRecentComics().length > 0 && (
            <ComicRow
              title="Recién Agregados"
              comics={getRecentComics()}
              onSelectComic={handleSelectComic}
              size="medium"
            />
          )}
          
          {/* Comics mejor valorados */}
          {!searchQuery && getTopRatedComics().length > 0 && (
            <ComicRow
              title="Mejor Valorados"
              comics={getTopRatedComics()}
              onSelectComic={handleSelectComic}
              size="medium"
            />
          )}
          
          {/* Filas por género */}
          {!searchQuery && [
            'Superhéroes',
            'Acción',
            'Aventura',
            'Drama',
            'Horror',
            'Comedia',
            'Fantasía'
          ].map(genre => {
            const genreComics = getComicsByGenre(genre);
            return genreComics.length > 0 ? (
              <ComicRow
                key={genre}
                title={genre}
                comics={genreComics}
                onSelectComic={handleSelectComic}
                size="medium"
              />
            ) : null;
          })}
          
          {/* Todos los comics - Se muestra cuando no hay búsqueda y como fallback */}
          {!searchQuery && comics.length > 0 && (
            <ComicRow
              title="Todos los Comics"
              comics={comics}
              onSelectComic={handleSelectComic}
              size="small"
            />
          )}
          
          {/* Estado vacío para búsquedas sin resultados */}
          {searchQuery && comics.length === 0 && !loading && (
            <ErrorContainer>
              <ErrorTitle>No se encontraron resultados</ErrorTitle>
              <ErrorMessage>
                No encontramos ningún comic que coincida con tu búsqueda "{searchQuery}".
                Intenta con otros términos o explora nuestras categorías.
              </ErrorMessage>
              <RetryButton onClick={() => actions.searchComics('')}>
                Ver todos los comics
              </RetryButton>
            </ErrorContainer>
          )}
        </SectionSpacing>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;