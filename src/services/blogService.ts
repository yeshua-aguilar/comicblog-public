import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog';

const POSTS_COLLECTION = 'blogs';

// Cache en memoria para getAllPosts
let postsCache: BlogPost[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let ongoingRequest: Promise<BlogPost[]> | null = null;

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
    content: String(data.content ?? data.contenido ?? '')
  };
}

export const invalidatePostsCache = () => {
  postsCache = null;
  cacheTimestamp = null;
  console.log('Cache de posts invalidada');
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const now = Date.now();
  if (postsCache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    console.log('getAllPosts: Devolviendo posts desde caché');
    return postsCache;
  }

  if (ongoingRequest) {
    console.log('getAllPosts: Solicitud ya en curso, devolviendo promesa existente');
    return ongoingRequest;
  }

  console.log('getAllPosts: Obteniendo posts desde Firestore');
  ongoingRequest = (async () => {
    try {
      const postsRef = collection(db, POSTS_COLLECTION);
      const querySnapshot = await getDocs(postsRef);

      const posts: BlogPost[] = querySnapshot.docs.map(d => toBlogPost(d.id, d.data()));
      posts.sort((a, b) => b.date.localeCompare(a.date));

      postsCache = posts;
      cacheTimestamp = now;
      console.log(`Total de posts cargados desde Firestore: ${posts.length}`);
      return posts;
    } catch (error) {
      console.error('Error al obtener posts desde Firestore:', error);
      return []; // Devuelve un array vacío en caso de error
    } finally {
      ongoingRequest = null; // Limpia la solicitud en curso
    }
  })();

  return ongoingRequest;
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Primero, intentar obtener del caché si existe
  if (postsCache) {
    const postFromCache = postsCache.find(p => p.slug === slug);
    if (postFromCache) {
      console.log(`getPostBySlug: Devolviendo post "${slug}" desde caché`);
      return postFromCache;
    }
  }

  console.log(`getPostBySlug: Obteniendo post "${slug}" desde Firestore`);
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return toBlogPost(docSnap.id, docSnap.data());
    } else {
      console.log('El documento no existe!');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener post por slug:', error);
    return null;
  }
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  console.log(`getPostsByTag: Buscando posts con el tag "${tag}" en Firestore`);
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

// Función para crear un nuevo post (escribe campos en inglés y español para compatibilidad)
export const createPost = async (postData: Omit<BlogPost, 'slug'>): Promise<string | null> => {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const payload: Partial<BlogPost> & Record<string, unknown> = {
      // en español (compatibilidad con documentos existentes)
      titulo: postData.title,
      autor: postData.author,
      fecha: postData.date,
      tags: postData.tags,
      descripcion: postData.excerpt,
      portada: postData.image,
      contenido: postData.content
    };

    const docRef = await addDoc(postsRef, payload);
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

// Función para actualizar un post existente (sincroniza claves en ambos idiomas)
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

    await updateDoc(docRef, payload);
    console.log('Post updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

// Función para eliminar un post
export const deletePost = async (slug: string): Promise<boolean> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    await deleteDoc(docRef);

    console.log('Post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

// Función para crear un nuevo post con un slug (ID) personalizado
export const createPostWithSlug = async (slug: string, postData: Omit<BlogPost, 'slug'>): Promise<boolean> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      // en español (compatibilidad con documentos existentes)
      titulo: postData.title,
      autor: postData.author,
      fecha: postData.date,
      tags: postData.tags,
      descripcion: postData.excerpt,
      portada: postData.image,
      contenido: postData.content
    };

    await setDoc(docRef, payload);
    console.log('Post created with custom slug:', slug);
    return true;
  } catch (error) {
    console.error('Error creating post with slug:', error);
    return false;
  }
};