import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog';

const POSTS_COLLECTION = 'blogs';

// Configuración de paginación
const DEFAULT_PAGE_SIZE = 9; // Número de posts por página

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

// Función paginada para obtener posts (OPTIMIZADA para Firebase)
export const getPostsPaginated = async (
  pageSize: number = DEFAULT_PAGE_SIZE,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> => {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q = query(
      postsRef,
      orderBy('fecha', 'desc'), // Ordenar por fecha descendente
      limit(pageSize)
    );

    // Si hay un documento anterior, continuar desde ahí
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

    console.log(`Posts cargados: ${posts.length}, Hay más: ${hasMore}`);
    return { posts, lastDoc: newLastDoc, hasMore };
  } catch (error) {
    console.error('Error al obtener posts paginados:', error);
    return { posts: [], lastDoc: null, hasMore: false };
  }
};

// Cache para géneros (válido por 5 minutos)
let genresCache: { data: { genre: string; count: number }[]; timestamp: number } | null = null;
const GENRES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función OPTIMIZADA para obtener solo los géneros/tags (sin contenido completo)
// Esta función reduce significativamente el uso de ancho de banda y lecturas
// Incluye caché en memoria para evitar llamadas repetidas
export const getGenresWithCounts = async (): Promise<{ genre: string; count: number }[]> => {
  // Verificar si hay datos en caché válidos
  if (genresCache && (Date.now() - genresCache.timestamp) < GENRES_CACHE_DURATION) {
    console.log('getGenresWithCounts: Devolviendo géneros desde caché');
    return genresCache.data;
  }

  console.log('getGenresWithCounts: Obteniendo documentos y procesando solo tags para optimizar');
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    // Obtener todos los documentos pero procesar solo los tags
    const querySnapshot = await getDocs(postsRef);

    const genreMap = new Map<string, number>();
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      // Solo procesar el campo 'tags' para optimizar el procesamiento
      const tags = normalizeTags(data.tags);
      tags.forEach(tag => {
        genreMap.set(tag, (genreMap.get(tag) || 0) + 1);
      });
    });

    const genresWithCounts = Array.from(genreMap.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    // Guardar en caché
    genresCache = {
      data: genresWithCounts,
      timestamp: Date.now()
    };

    console.log(`Géneros procesados: ${genresWithCounts.length}, Total de documentos: ${querySnapshot.docs.length}`);
    return genresWithCounts;
  } catch (error) {
    console.error('Error al obtener géneros optimizado:', error);
    return [];
  }
};

// Función para invalidar el caché de géneros (llamar cuando se creen/actualicen/eliminen posts)
export const invalidateGenresCache = (): void => {
  genresCache = null;
  console.log('Cache de géneros invalidado');
};

// Función para obtener TODOS los posts (SOLO para casos específicos como genero.tsx)
// ⚠️ ADVERTENCIA: Esta función lee TODOS los documentos y puede ser costosa
export const getAllPosts = async (): Promise<BlogPost[]> => {
  console.log('⚠️ getAllPosts: Esta función lee TODOS los documentos y puede ser costosa');
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);

    const posts: BlogPost[] = querySnapshot.docs.map(d => toBlogPost(d.id, d.data()));
    posts.sort((a, b) => b.date.localeCompare(a.date));

    console.log(`Total de posts cargados desde Firestore: ${posts.length}`);
    return posts;
  } catch (error) {
    console.error('Error al obtener posts desde Firestore:', error);
    return [];
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
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
    // Invalidar caché de géneros ya que se agregó un nuevo post
    invalidateGenresCache();
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
    // Invalidar caché de géneros si se actualizaron los tags
    if (postData.tags !== undefined) {
      invalidateGenresCache();
    }
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
    // Invalidar caché de géneros ya que se eliminó un post
    invalidateGenresCache();
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
    // Invalidar caché de géneros ya que se creó un nuevo post
    invalidateGenresCache();
    console.log('Post created with custom slug:', slug);
    return true;
  } catch (error) {
    console.error('Error creating post with slug:', error);
    return false;
  }
};