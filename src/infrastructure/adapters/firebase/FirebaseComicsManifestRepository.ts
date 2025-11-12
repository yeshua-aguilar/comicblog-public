import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { IComicsManifestRepository } from '../../../application/ports';
import type { BlogPost, Genre } from '../../../domain/entities';
import type { IBlogRepository } from '../../../application/ports';

const CONTENT_COLLECTION = 'contenido';
const CONTENT_DOC_ID = 'xacHrp80QFdcaQZhehl4';
const GENRES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const COMICS_LIST_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache para géneros y cómics
let genresCache: { data: Genre[]; timestamp: number } | null = null;
let comicsListCache: { data: BlogPost[]; timestamp: number } | null = null;

/**
 * Normaliza los tags desde diferentes formatos a un array de strings
 */
function normalizeTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(tag => typeof tag === 'string' && tag.trim() !== '');
  }
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[{}]/g, '').trim();
    return cleaned ? cleaned.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
  }
  return [];
}

/**
 * Convierte datos de Firestore a formato BlogPost
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBlogPost(comicData: any): BlogPost {
  let date: string = new Date().toISOString().slice(0, 10);
  const rawDate = comicData.date ?? comicData.fecha ?? comicData.fecha_creacion ?? comicData.createdAt;
  if (rawDate && typeof rawDate.toDate === 'function') {
    date = rawDate.toDate().toISOString().slice(0, 10);
  } else if (typeof rawDate === 'string') {
    date = rawDate;
  }

  return {
    slug: comicData.slug,
    title: String(comicData.title ?? comicData.titulo ?? 'Sin título'),
    author: String(comicData.author ?? comicData.autor ?? 'Anónimo'),
    date,
    tags: normalizeTags(comicData.tags),
    excerpt: String(comicData.excerpt ?? comicData.descripcion ?? ''),
    image: String(comicData.image ?? comicData.portada ?? ''),
    content: String(comicData.content ?? comicData.contenido ?? ''),
    comicPages: String(comicData.comicPages ?? '')
  };
}

/**
 * Adaptador Firebase para el repositorio de manifiesto de cómics
 * Implementa IComicsManifestRepository
 */
export class FirebaseComicsManifestRepository implements IComicsManifestRepository {
  private blogRepository: IBlogRepository;

  constructor(blogRepository: IBlogRepository) {
    this.blogRepository = blogRepository;
  }

  async getComicsList(): Promise<BlogPost[]> {
    if (comicsListCache && (Date.now() - comicsListCache.timestamp) < COMICS_LIST_CACHE_DURATION) {
      return comicsListCache.data;
    }

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const comicsData = data.comics || [];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const posts: BlogPost[] = comicsData.map((comicData: any) => toBlogPost(comicData));
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        comicsListCache = {
          data: posts,
          timestamp: Date.now()
        };
        
        return posts;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener la lista de cómics desde el manifiesto:', error);
      return [];
    }
  }

  async getGenresWithCounts(): Promise<Genre[]> {
    if (genresCache && (Date.now() - genresCache.timestamp) < GENRES_CACHE_DURATION) {
      return genresCache.data;
    }

    try {
      const posts = await this.getComicsList();

      const genreMap = new Map<string, number>();
      
      posts.forEach(post => {
        const tags = normalizeTags(post.tags);
        tags.forEach(tag => {
          genreMap.set(tag, (genreMap.get(tag) || 0) + 1);
        });
      });

      const genresWithCounts: Genre[] = Array.from(genreMap.entries())
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count);

      genresCache = {
        data: genresWithCounts,
        timestamp: Date.now()
      };

      return genresWithCounts;
    } catch (error) {
      console.error('Error al obtener géneros desde el manifiesto:', error);
      return [];
    }
  }

  async updateManifest(): Promise<void> {
    try {
      const posts = await this.blogRepository.getAllPosts();
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await updateDoc(docRef, { comics: posts });
      this.invalidateComicsListCache();
    } catch (error) {
      console.error('Error al actualizar el manifiesto de cómics:', error);
    }
  }

  invalidateComicsListCache(): void {
    comicsListCache = null;
  }

  invalidateGenresCache(): void {
    genresCache = null;
  }

  /**
   * Busca comics de manera eficiente usando múltiples criterios
   */
  async searchComics(searchTerm: string, maxResults: number = 20): Promise<BlogPost[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    try {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const searchWords = searchTermLower.split(' ').filter(word => word.length > 1);
      
      const allComics = await this.getComicsList();
      
      const calculateRelevance = (post: BlogPost): number => {
        let score = 0;
        const titleLower = post.title.toLowerCase();
        const excerptLower = post.excerpt.toLowerCase();
        const tagsLower = post.tags.map(tag => tag.toLowerCase());
        const authorLower = post.author.toLowerCase();
        
        if (titleLower.includes(searchTermLower)) {
          score += 100;
        }
        
        searchWords.forEach(word => {
          if (titleLower.includes(word)) {
            score += 50;
          }
        });
        
        tagsLower.forEach(tag => {
          if (tag.includes(searchTermLower)) {
            score += 75;
          }
          searchWords.forEach(word => {
            if (tag.includes(word)) {
              score += 25;
            }
          });
        });
        
        if (excerptLower.includes(searchTermLower)) {
          score += 30;
        }
        searchWords.forEach(word => {
          if (excerptLower.includes(word)) {
            score += 15;
          }
        });
        
        if (authorLower.includes(searchTermLower)) {
          score += 20;
        }
        
        return score;
      };
      
      const scoredResults = allComics
        .map(post => ({ post, score: calculateRelevance(post) }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(result => result.post);
      
      return scoredResults;
    } catch (error) {
      console.error('Error searching comics:', error);
      return [];
    }
  }

  /**
   * Busca comics por tag específico de manera optimizada
   */
  async searchComicsByTag(tag: string): Promise<BlogPost[]> {
    if (!tag || tag.trim().length === 0) {
      return [];
    }

    try {
      const tagLower = tag.toLowerCase().trim();
      const allComics = await this.getComicsList();
      
      return allComics.filter(post => 
        post.tags.some(postTag => postTag.toLowerCase().includes(tagLower))
      );
    } catch (error) {
      console.error('Error searching comics by tag:', error);
      return [];
    }
  }

  /**
   * Obtiene sugerencias de búsqueda basadas en títulos y tags existentes
   */
  async getSearchSuggestions(partialTerm: string, maxSuggestions: number = 5): Promise<string[]> {
    if (!partialTerm || partialTerm.trim().length < 2) {
      return [];
    }

    try {
      const termLower = partialTerm.toLowerCase().trim();
      const allComics = await this.getComicsList();
      const suggestions = new Set<string>();
      
      allComics.forEach(post => {
        const titleLower = post.title.toLowerCase();
        if (titleLower.includes(termLower)) {
          suggestions.add(post.title);
        }
      });
      
      allComics.forEach(post => {
        post.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          if (tagLower.includes(termLower)) {
            suggestions.add(tag);
          }
        });
      });
      
      return Array.from(suggestions).slice(0, maxSuggestions);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
}
