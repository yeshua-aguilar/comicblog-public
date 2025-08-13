import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog';

// Nombre de la colección en Firestore (ajustada para coincidir con tu BD)
const POSTS_COLLECTION = 'blogs';

// Utilidad: normaliza el campo tags que puede venir como array o string
function normalizeTags(raw: unknown): string[] {
  console.log('normalizeTags input:', raw, 'type:', typeof raw);
  
  if (!raw) {
    console.log('normalizeTags: no raw data, returning empty array');
    return [];
  }
  
  if (Array.isArray(raw)) {
    const result = raw.filter(tag => typeof tag === 'string' && tag.trim() !== '');
    console.log('normalizeTags: array input, result:', result);
    return result;
  }
  
  if (typeof raw === 'string') {
    // Manejar formato "{tag1,tag2,tag3}"
    const cleaned = raw.replace(/[{}]/g, '').trim();
    const result = cleaned ? cleaned.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    console.log('normalizeTags: string input, cleaned:', cleaned, 'result:', result);
    return result;
  }
  
  console.log('normalizeTags: unknown format, returning empty array');
  return [];
}

function toBlogPost(id: string, data: Record<string, Timestamp>): BlogPost {
  // Fecha: puede venir como string, Timestamp o no existir
  let date: string = '';
  const rawDate = data.date ?? data.fecha ?? data.fecha_creacion ?? data.createdAt;
  if (rawDate && typeof rawDate.toDate === 'function') {
    // Timestamp de Firestore
    date = rawDate.toDate().toISOString().slice(0, 10);
  } else if (typeof rawDate === 'string') {
    date = rawDate;
  } else {
    // fallback a hoy si no existe
    date = new Date().toISOString().slice(0, 10);
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

// Función para obtener todos los posts desde Firestore
export const getAllPosts = async (): Promise<BlogPost[]> => {
  console.log('getAllPosts called - fetching from Firestore');
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    // Si date no existe o no es homogéneo, evitamos fallar con orderBy. Cargamos todo y ordenamos en cliente.
    const querySnapshot = await getDocs(postsRef);

    const posts: BlogPost[] = [];
    querySnapshot.forEach((d) => {
      const rawData = d.data();
      console.log(`Processing document ${d.id}:`, rawData);
      const post = toBlogPost(d.id, rawData);
      console.log(`Processed post:`, post);
      posts.push(post);
    });

    // Orden descendente por fecha (YYYY-MM-DD)
    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    console.log(`Total posts loaded from Firestore: ${posts.length}`);
    return posts;
  } catch (error) {
    console.error('Error fetching posts from Firestore:', error);
    console.error('Error details:', error);
    return [];
  }
};

// Función para obtener un post específico por slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return toBlogPost(docSnap.id, docSnap.data());
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

// Función para obtener posts por tag (soporta tags guardados como string)
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);

    const posts: BlogPost[] = [];
    querySnapshot.forEach((d) => posts.push(toBlogPost(d.id, d.data())));

    const target = tag.toLowerCase();
    return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === target));
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
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