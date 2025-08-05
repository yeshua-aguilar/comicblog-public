import { Comic, ComicFilter, ApiResponse } from '../types/Comic';
import { ComicModel } from '../models/ComicModel';
import { mockComics } from '../data/mockComics';

export class ComicService {
  private comicModel: ComicModel;

  constructor() {
    this.comicModel = new ComicModel(mockComics);
  }

  // Simular llamada a API para obtener todos los comics
  async getAllComics(): Promise<ApiResponse<Comic[]>> {
    try {
      // Simular delay de red
      await this.delay(500);
      
      const comics = this.comicModel.getAllComics();
      return {
        data: comics,
        success: true,
        message: 'Comics obtenidos exitosamente'
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error al obtener los comics'
      };
    }
  }

  // Obtener comic por ID
  async getComicById(id: string): Promise<ApiResponse<Comic | null>> {
    try {
      await this.delay(300);
      
      const comic = this.comicModel.getComicById(id);
      return {
        data: comic || null,
        success: !!comic,
        message: comic ? 'Comic encontrado' : 'Comic no encontrado'
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        message: 'Error al obtener el comic'
      };
    }
  }

  // Obtener comics destacados
  async getFeaturedComics(): Promise<ApiResponse<Comic[]>> {
    try {
      await this.delay(400);
      
      const comics = this.comicModel.getFeaturedComics();
      return {
        data: comics,
        success: true,
        message: 'Comics destacados obtenidos exitosamente'
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error al obtener comics destacados'
      };
    }
  }

  // Obtener comics trending
  async getTrendingComics(): Promise<ApiResponse<Comic[]>> {
    try {
      await this.delay(400);
      
      const comics = this.comicModel.getTrendingComics();
      return {
        data: comics,
        success: true,
        message: 'Comics trending obtenidos exitosamente'
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error al obtener comics trending'
      };
    }
  }

  // Filtrar comics
  async filterComics(filter: ComicFilter): Promise<ApiResponse<Comic[]>> {
    try {
      await this.delay(300);
      
      const comics = this.comicModel.filterComics(filter);
      return {
        data: comics,
        success: true,
        message: 'Comics filtrados exitosamente'
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error al filtrar comics'
      };
    }
  }

  // Buscar comics
  async searchComics(query: string): Promise<ApiResponse<Comic[]>> {
    try {
      await this.delay(300);
      
      const comics = this.comicModel.searchComics(query);
      return {
        data: comics,
        success: true,
        message: `Se encontraron ${comics.length} resultados`
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error en la búsqueda'
      };
    }
  }

  // Obtener géneros
  async getGenres(): Promise<ApiResponse<string[]>> {
    try {
      await this.delay(200);
      
      const genres = this.comicModel.getGenres();
      return {
        data: genres,
        success: true,
        message: 'Géneros obtenidos exitosamente'
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: 'Error al obtener géneros'
      };
    }
  }

  // Método auxiliar para simular delay de red
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton del servicio
export const comicService = new ComicService();