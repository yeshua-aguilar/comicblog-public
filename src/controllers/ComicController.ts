import { useState, useEffect, useCallback } from 'react';
import { Comic, ComicFilter } from '../types/Comic';
import { comicService } from '../services/ComicService';

export interface ComicControllerState {
  comics: Comic[];
  featuredComics: Comic[];
  trendingComics: Comic[];
  selectedComic: Comic | null;
  genres: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentFilter: ComicFilter;
}

export const useComicController = () => {
  const [state, setState] = useState<ComicControllerState>({
    comics: [],
    featuredComics: [],
    trendingComics: [],
    selectedComic: null,
    genres: [],
    loading: false,
    error: null,
    searchQuery: '',
    currentFilter: {}
  });

  // Cargar todos los comics
  const loadComics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await comicService.getAllComics();
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          comics: response.data, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message || 'Error al cargar comics', 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error inesperado al cargar comics', 
        loading: false 
      }));
    }
  }, []);

  // Cargar comics destacados
  const loadFeaturedComics = useCallback(async () => {
    try {
      const response = await comicService.getFeaturedComics();
      if (response.success) {
        setState(prev => ({ ...prev, featuredComics: response.data }));
      }
    } catch (error) {
      console.error('Error al cargar comics destacados:', error);
    }
  }, []);

  // Cargar comics trending
  const loadTrendingComics = useCallback(async () => {
    try {
      const response = await comicService.getTrendingComics();
      if (response.success) {
        setState(prev => ({ ...prev, trendingComics: response.data }));
      }
    } catch (error) {
      console.error('Error al cargar comics trending:', error);
    }
  }, []);

  // Cargar géneros
  const loadGenres = useCallback(async () => {
    try {
      const response = await comicService.getGenres();
      if (response.success) {
        setState(prev => ({ ...prev, genres: response.data }));
      }
    } catch (error) {
      console.error('Error al cargar géneros:', error);
    }
  }, []);

  // Obtener comic por ID
  const getComicById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await comicService.getComicById(id);
      if (response.success && response.data) {
        setState(prev => ({ 
          ...prev, 
          selectedComic: response.data, 
          loading: false 
        }));
        return response.data;
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message || 'Comic no encontrado', 
          loading: false 
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error al obtener el comic', 
        loading: false 
      }));
      return null;
    }
  }, []);

  // Buscar comics
  const searchComics = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, loading: true, error: null }));
    
    try {
      if (query.trim() === '') {
        await loadComics();
        return;
      }
      
      const response = await comicService.searchComics(query);
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          comics: response.data, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message || 'Error en la búsqueda', 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error inesperado en la búsqueda', 
        loading: false 
      }));
    }
  }, [loadComics]);

  // Filtrar comics
  const filterComics = useCallback(async (filter: ComicFilter) => {
    setState(prev => ({ ...prev, currentFilter: filter, loading: true, error: null }));
    
    try {
      const response = await comicService.filterComics(filter);
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          comics: response.data, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message || 'Error al filtrar comics', 
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error inesperado al filtrar comics', 
        loading: false 
      }));
    }
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, currentFilter: {}, searchQuery: '' }));
    loadComics();
  }, [loadComics]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Inicializar datos
  useEffect(() => {
    loadComics();
    loadFeaturedComics();
    loadTrendingComics();
    loadGenres();
  }, [loadComics, loadFeaturedComics, loadTrendingComics, loadGenres]);

  return {
    ...state,
    actions: {
      loadComics,
      loadFeaturedComics,
      loadTrendingComics,
      loadGenres,
      getComicById,
      searchComics,
      filterComics,
      clearFilters,
      clearError
    }
  };
};