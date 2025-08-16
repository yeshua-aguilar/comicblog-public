import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog';

const POSTS_COLLECTION = 'blogs';
const CONTENT_COLLECTION = 'contenido';
const CONTENT_DOC_ID = 'xacHrp80QFdcaQZhehl4';
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
 * Obtiene posts de forma paginada desde Firestore
 */
export const getPostsPaginated = async (
  pageSize: number = DEFAULT_PAGE_SIZE,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> => {
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
};

// Cache para géneros y cómics
let genresCache: { data: { genre: string; count: number }[]; timestamp: number } | null = null;
let comicsListCache: { data: BlogPost[]; timestamp: number } | null = null;
const GENRES_CACHE_DURATION = 5 * 60 * 1000;
const COMICS_LIST_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Obtiene la lista de cómics desde el documento manifiesto
 */
export const getComicsList = async (): Promise<BlogPost[]> => {
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
      const posts: BlogPost[] = comicsData.map((comicData: any) => toBlogPost(comicData.slug, comicData));
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
};

/**
 * Invalida el cache de la lista de cómics
 */
export const invalidateComicsListCache = (): void => {
  comicsListCache = null;
};

/**
 * Obtiene géneros con conteo desde el manifiesto de cómics
 */
export const getGenresWithCounts = async (): Promise<{ genre: string; count: number }[]> => {
  if (genresCache && (Date.now() - genresCache.timestamp) < GENRES_CACHE_DURATION) {
    return genresCache.data;
  }
  try {
    const posts = await getComicsList(); 

    const genreMap = new Map<string, number>();
    
    posts.forEach(post => {
      const tags = normalizeTags(post.tags);
      tags.forEach(tag => {
        genreMap.set(tag, (genreMap.get(tag) || 0) + 1);
      });
    });

    const genresWithCounts = Array.from(genreMap.entries())
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
};

/**
 * Invalida el cache de géneros
 */
export const invalidateGenresCache = (): void => {
  genresCache = null;
};

/**
 * Obtiene todos los posts desde Firestore (uso limitado por costo)
 */
export const getAllPosts = async (): Promise<BlogPost[]> => {
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
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
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
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
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
};

/**
 * Actualiza el manifiesto de cómics en Firestore
 */
const updateComicsManifest = async (): Promise<void> => {
  try {
    const posts = await getAllPosts();
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    await updateDoc(docRef, { comics: posts });
    invalidateComicsListCache();
  } catch (error) {
    console.error('Error al actualizar el manifiesto de cómics:', error);
  }
};

/**
 * Crea un nuevo post en Firestore
 */
export const createPost = async (postData: Omit<BlogPost, 'slug'>): Promise<string | null> => {
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
    invalidateGenresCache();
    invalidateComicsListCache();
    await updateComicsManifest();
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

/**
 * Actualiza un post existente en Firestore
 */
export const updatePost = async (slug: string, postData: Partial<Omit<BlogPost, 'slug'>>): Promise<boolean> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {};

    if (postData.title !== undefined) {
      payload.titulo = postData.title;
    }
    if (postData.author !== undefined) {
      payload.autor = postData.author;
    }
    if (postData.date !== undefined) {
      payload.fecha = postData.date;
    }
    if (postData.tags !== undefined) {
      payload.tags = postData.tags;
    }
    if (postData.excerpt !== undefined) {
      payload.descripcion = postData.excerpt;
    }
    if (postData.image !== undefined) {
      payload.portada = postData.image;
    }
    if (postData.content !== undefined) {
      payload.contenido = postData.content;
    }
    if (postData.comicPages !== undefined) {
      payload.comicPages = postData.comicPages;
    }

    await updateDoc(docRef, payload);
    if (postData.tags !== undefined) {
      invalidateGenresCache();
    }
    invalidateComicsListCache();
    await updateComicsManifest();
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

/**
 * Elimina un post de Firestore
 */
export const deletePost = async (slug: string): Promise<boolean> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    await deleteDoc(docRef);
    invalidateGenresCache();
    invalidateComicsListCache();
    await updateComicsManifest();
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

/**
 * Crea un nuevo post con un slug personalizado
 */
export const createPostWithSlug = async (slug: string, postData: Omit<BlogPost, 'slug'>): Promise<boolean> => {
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
    invalidateGenresCache();
    invalidateComicsListCache();
    await updateComicsManifest();
    return true;
  } catch (error) {
    console.error('Error creating post with slug:', error);
    return false;
  }
};