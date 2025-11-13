import { ValidationError } from '../errors';
import { Slug, Title, Author, Tag, PostDate, Excerpt } from '../value-objects';

/**
 * Interfaz simple para mantener compatibilidad
 */
export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  image?: string;
  comicPages?: string;
}

/**
 * Clase de entidad BlogPost con validaciones de dominio
 * Esta clase encapsula la lógica de negocio de un post
 */
export class BlogPostEntity {
  private readonly _slug: Slug;
  private _title: Title;
  private _author: Author;
  private _date: PostDate;
  private _tags: Tag[];
  private _excerpt: Excerpt;
  private _content: string;
  private _image?: string;
  private _comicPages?: string;

  private constructor(
    slug: Slug,
    title: Title,
    author: Author,
    date: PostDate,
    tags: Tag[],
    excerpt: Excerpt,
    content: string,
    image?: string,
    comicPages?: string
  ) {
    this._slug = slug;
    this._title = title;
    this._author = author;
    this._date = date;
    this._tags = tags;
    this._excerpt = excerpt;
    this._content = content;
    this._image = image;
    this._comicPages = comicPages;
  }

  /**
   * Crea una nueva entidad BlogPost validada
   */
  static create(data: {
    slug: string;
    title: string;
    author: string;
    date: string;
    tags: string[];
    excerpt: string;
    content: string;
    image?: string;
    comicPages?: string;
  }): BlogPostEntity {
    // Validar contenido
    if (!data.content || data.content.trim().length === 0) {
      throw new ValidationError('El contenido no puede estar vacío');
    }

    if (data.content.length > 100000) {
      throw new ValidationError('El contenido no puede exceder 100000 caracteres');
    }

    // Validar tags
    if (!data.tags || data.tags.length === 0) {
      throw new ValidationError('Debe haber al menos una etiqueta');
    }

    if (data.tags.length > 20) {
      throw new ValidationError('No puede haber más de 20 etiquetas');
    }

    // Validar imagen (URL)
    if (data.image && data.image.length > 0) {
      try {
        new URL(data.image);
      } catch {
        throw new ValidationError('La URL de la imagen no es válida');
      }
    }

    return new BlogPostEntity(
      Slug.create(data.slug),
      Title.create(data.title),
      Author.create(data.author),
      PostDate.create(data.date),
      data.tags.map(tag => Tag.create(tag)),
      Excerpt.create(data.excerpt),
      data.content.trim(),
      data.image,
      data.comicPages
    );
  }

  /**
   * Crea una entidad desde datos simples (DTO)
   */
  static fromPrimitive(data: BlogPost): BlogPostEntity {
    return BlogPostEntity.create(data);
  }

  /**
   * Convierte la entidad a formato simple (DTO)
   */
  toPrimitive(): BlogPost {
    return {
      slug: this._slug.getValue(),
      title: this._title.getValue(),
      author: this._author.getValue(),
      date: this._date.toISOString(),
      tags: this._tags.map(tag => tag.getValue()),
      excerpt: this._excerpt.getValue(),
      content: this._content,
      image: this._image,
      comicPages: this._comicPages,
    };
  }

  // Getters
  get slug(): string {
    return this._slug.getValue();
  }

  get title(): string {
    return this._title.getValue();
  }

  get author(): string {
    return this._author.getValue();
  }

  get date(): string {
    return this._date.toISOString();
  }

  get tags(): string[] {
    return this._tags.map(tag => tag.getValue());
  }

  get excerpt(): string {
    return this._excerpt.getValue();
  }

  get content(): string {
    return this._content;
  }

  get image(): string | undefined {
    return this._image;
  }

  get comicPages(): string | undefined {
    return this._comicPages;
  }

  // Métodos de negocio

  /**
   * Actualiza el título del post
   */
  updateTitle(newTitle: string): void {
    this._title = Title.create(newTitle);
  }

  /**
   * Actualiza el autor del post
   */
  updateAuthor(newAuthor: string): void {
    this._author = Author.create(newAuthor);
  }

  /**
   * Actualiza el contenido del post
   */
  updateContent(newContent: string): void {
    if (!newContent || newContent.trim().length === 0) {
      throw new ValidationError('El contenido no puede estar vacío');
    }
    if (newContent.length > 100000) {
      throw new ValidationError('El contenido no puede exceder 100000 caracteres');
    }
    this._content = newContent.trim();
  }

  /**
   * Actualiza el extracto del post
   */
  updateExcerpt(newExcerpt: string): void {
    this._excerpt = Excerpt.create(newExcerpt);
  }

  /**
   * Actualiza la fecha del post
   */
  updateDate(newDate: string): void {
    this._date = PostDate.create(newDate);
  }

  /**
   * Agrega una etiqueta al post
   */
  addTag(tag: string): void {
    const newTag = Tag.create(tag);
    
    // Verificar que no exista ya
    if (this._tags.some(t => t.equals(newTag))) {
      throw new ValidationError(`La etiqueta "${tag}" ya existe en este post`);
    }

    if (this._tags.length >= 20) {
      throw new ValidationError('No puede haber más de 20 etiquetas');
    }

    this._tags.push(newTag);
  }

  /**
   * Elimina una etiqueta del post
   */
  removeTag(tag: string): void {
    const tagToRemove = Tag.create(tag);
    this._tags = this._tags.filter(t => !t.equals(tagToRemove));

    if (this._tags.length === 0) {
      throw new ValidationError('Debe haber al menos una etiqueta');
    }
  }

  /**
   * Reemplaza todas las etiquetas
   */
  setTags(tags: string[]): void {
    if (!tags || tags.length === 0) {
      throw new ValidationError('Debe haber al menos una etiqueta');
    }
    if (tags.length > 20) {
      throw new ValidationError('No puede haber más de 20 etiquetas');
    }
    this._tags = tags.map(tag => Tag.create(tag));
  }

  /**
   * Actualiza la imagen del post
   */
  updateImage(newImage?: string): void {
    if (newImage && newImage.length > 0) {
      try {
        new URL(newImage);
      } catch {
        throw new ValidationError('La URL de la imagen no es válida');
      }
    }
    this._image = newImage;
  }

  /**
   * Actualiza las páginas del cómic
   */
  updateComicPages(newComicPages?: string): void {
    this._comicPages = newComicPages;
  }

  /**
   * Verifica si el post tiene una etiqueta específica
   */
  hasTag(tag: string): boolean {
    const searchTag = Tag.create(tag);
    return this._tags.some(t => t.equals(searchTag));
  }

  /**
   * Verifica si el post coincide con un término de búsqueda
   */
  matchesSearchTerm(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      this._title.getValue().toLowerCase().includes(term) ||
      this._excerpt.getValue().toLowerCase().includes(term) ||
      this._author.getValue().toLowerCase().includes(term) ||
      this._tags.some(tag => tag.getValue().toLowerCase().includes(term))
    );
  }
}

// Mantener tipos originales para compatibilidad
export type BlogPostData = BlogPost;
export type CreateBlogPostData = Omit<BlogPost, 'slug'>;
export type UpdateBlogPostData = Partial<Omit<BlogPost, 'slug'>>;
