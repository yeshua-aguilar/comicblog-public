import { Comic, Chapter, ComicFilter, ApiResponse } from '../types/Comic';

export class ComicModel {
  private comics: Comic[] = [];

  constructor(initialComics: Comic[] = []) {
    this.comics = initialComics;
  }

  // Obtener todos los comics
  getAllComics(): Comic[] {
    return this.comics;
  }

  // Obtener comic por ID
  getComicById(id: string): Comic | undefined {
    return this.comics.find(comic => comic.id === id);
  }

  // Obtener comics destacados
  getFeaturedComics(): Comic[] {
    return this.comics.filter(comic => comic.featured);
  }

  // Obtener comics trending
  getTrendingComics(): Comic[] {
    return this.comics.filter(comic => comic.trending)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  // Filtrar comics
  filterComics(filter: ComicFilter): Comic[] {
    let filteredComics = [...this.comics];

    if (filter.genre) {
      filteredComics = filteredComics.filter(comic => 
        comic.genre.includes(filter.genre!)
      );
    }

    if (filter.author) {
      filteredComics = filteredComics.filter(comic => 
        comic.author.toLowerCase().includes(filter.author!.toLowerCase())
      );
    }

    if (filter.rating) {
      filteredComics = filteredComics.filter(comic => 
        comic.rating >= filter.rating!
      );
    }

    // Ordenar
    if (filter.sortBy) {
      filteredComics.sort((a, b) => {
        const order = filter.sortOrder === 'desc' ? -1 : 1;
        
        switch (filter.sortBy) {
          case 'title':
            return order * a.title.localeCompare(b.title);
          case 'rating':
            return order * (a.rating - b.rating);
          case 'publishDate':
            return order * (new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
          case 'trending':
            return order * ((a.trending ? 1 : 0) - (b.trending ? 1 : 0));
          default:
            return 0;
        }
      });
    }

    return filteredComics;
  }

  // Buscar comics por título
  searchComics(query: string): Comic[] {
    const searchTerm = query.toLowerCase();
    return this.comics.filter(comic => 
      comic.title.toLowerCase().includes(searchTerm) ||
      comic.description.toLowerCase().includes(searchTerm) ||
      comic.author.toLowerCase().includes(searchTerm)
    );
  }

  // Obtener géneros únicos
  getGenres(): string[] {
    const genres = new Set<string>();
    this.comics.forEach(comic => {
      comic.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }

  // Agregar comic
  addComic(comic: Comic): void {
    this.comics.push(comic);
  }

  // Actualizar comic
  updateComic(id: string, updates: Partial<Comic>): boolean {
    const index = this.comics.findIndex(comic => comic.id === id);
    if (index !== -1) {
      this.comics[index] = { ...this.comics[index], ...updates };
      return true;
    }
    return false;
  }

  // Eliminar comic
  deleteComic(id: string): boolean {
    const index = this.comics.findIndex(comic => comic.id === id);
    if (index !== -1) {
      this.comics.splice(index, 1);
      return true;
    }
    return false;
  }
}