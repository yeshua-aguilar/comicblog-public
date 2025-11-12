import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { IBlogRepository } from '../../../application/ports';
import type { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '../../../domain/entities';

const POSTS_COLLECTION = 'blogs';
const DEFAULT_PAGE_SIZE = 9;

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
function toBlogPost(id: string, data: Record<string, any>): BlogPost {
  let date: string = new Date().toISOString().slice(0, 10);
  const rawDate = data.date ?? data.fecha ?? data.fecha_creacion ?? data.createdAt;
  if (rawDate && typeof rawDate.toDate === 'function') {
    date = rawDate.toDate().toISOString().slice(0, 10);
  } else if (typeof rawDate === 'string') {
    date = rawDate;
  }

  return {
    slug: id,
    title: String(data.title ?? data.titulo ?? 'Sin título'),
    author: String(data.author ?? data.autor ?? 'Anónimo'),
    date,
    tags: normalizeTags(data.tags),
    excerpt: String(data.excerpt ?? data.descripcion ?? ''),
    image: String(data.image ?? data.portada ?? ''),
    content: String(data.content ?? data.contenido ?? ''),
    comicPages: String(data.comicPages ?? '')
  };
}

/**
 * Adaptador Firebase para el repositorio de blogs
 * Implementa IBlogRepository
 */
export class FirebaseBlogRepository implements IBlogRepository {
  async getPostsPaginated(
    pageSize: number = DEFAULT_PAGE_SIZE,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      let q = query(
        postsRef,
        orderBy('fecha', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          postsRef,
          orderBy('fecha', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const posts: BlogPost[] = querySnapshot.docs.map(d => toBlogPost(d.id, d.data()));
      
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === pageSize;

      return { posts, lastDoc: newLastDoc, hasMore };
    } catch (error) {
      console.error('Error al obtener posts paginados:', error);
      return { posts: [], lastDoc: null, hasMore: false };
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const querySnapshot = await getDocs(postsRef);

      const posts: BlogPost[] = querySnapshot.docs.map(d => toBlogPost(d.id, d.data()));
      posts.sort((a, b) => b.date.localeCompare(a.date));

      return posts;
    } catch (error) {
      console.error('Error al obtener posts desde Firestore:', error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(db, POSTS_COLLECTION, slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return toBlogPost(docSnap.id, docSnap.data());
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener post por slug:', error);
      return null;
    }
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const q = query(postsRef, where('tags', 'array-contains', tag));
      const querySnapshot = await getDocs(q);
      
      const posts: BlogPost[] = querySnapshot.docs.map(d => toBlogPost(d.id, d.data()));
      posts.sort((a, b) => b.date.localeCompare(a.date));

      return posts;
    } catch (error) {
      console.error('Error al obtener posts por tag:', error);
      return [];
    }
  }

  async createPost(postData: CreateBlogPostData): Promise<string | null> {
    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const payload: Partial<BlogPost> & Record<string, unknown> = {
        titulo: postData.title,
        autor: postData.author,
        fecha: postData.date,
        tags: postData.tags,
        descripcion: postData.excerpt,
        portada: postData.image,
        contenido: postData.content,
        comicPages: postData.comicPages
      };

      const docRef = await addDoc(postsRef, payload);
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  }

  async createPostWithSlug(slug: string, postData: CreateBlogPostData): Promise<boolean> {
    try {
      const docRef = doc(db, POSTS_COLLECTION, slug);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        titulo: postData.title,
        autor: postData.author,
        fecha: postData.date,
        tags: postData.tags,
        descripcion: postData.excerpt,
        portada: postData.image,
        contenido: postData.content,
        comicPages: postData.comicPages
      };

      await setDoc(docRef, payload);
      return true;
    } catch (error) {
      console.error('Error creating post with slug:', error);
      return false;
    }
  }

  async updatePost(slug: string, postData: UpdateBlogPostData): Promise<boolean> {
    try {
      const docRef = doc(db, POSTS_COLLECTION, slug);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {};

      Object.keys(postData).forEach(key => {
        switch (key) {
          case 'title':
            if (postData.title !== undefined) {
              payload.titulo = postData.title;
            }
            break;
          case 'author':
            if (postData.author !== undefined) {
              payload.autor = postData.author;
            }
            break;
          case 'date':
            if (postData.date !== undefined) {
              payload.fecha = postData.date;
            }
            break;
          case 'tags':
            if (postData.tags !== undefined) {
              payload.tags = postData.tags;
            }
            break;
          case 'excerpt':
            if (postData.excerpt !== undefined) {
              payload.descripcion = postData.excerpt;
            }
            break;
          case 'image':
            if (postData.image !== undefined) {
              payload.portada = postData.image;
            }
            break;
          case 'content':
            if (postData.content !== undefined) {
              payload.contenido = postData.content;
            }
            break;
          case 'comicPages':
            if (postData.comicPages !== undefined) {
              payload.comicPages = postData.comicPages;
            }
            break;
        }
      });

      await updateDoc(docRef, payload);
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      return false;
    }
  }

  async deletePost(slug: string): Promise<boolean> {
    try {
      const docRef = doc(db, POSTS_COLLECTION, slug);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  async searchComics(_searchTerm: string, _maxResults: number = 20): Promise<BlogPost[]> {
    // Esta implementación se moverá al adaptador de manifiesto
    // ya que usa el cache del manifiesto
    return [];
  }

  async searchComicsByTag(_tag: string): Promise<BlogPost[]> {
    // Esta implementación se moverá al adaptador de manifiesto
    return [];
  }

  async getSearchSuggestions(_partialTerm: string, _maxSuggestions: number = 5): Promise<string[]> {
    // Esta implementación se moverá al adaptador de manifiesto
    return [];
  }
}
