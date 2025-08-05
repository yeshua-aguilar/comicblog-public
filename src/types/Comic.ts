export interface Chapter {
  id: string;
  title: string;
  number: number;
  pages: string[];
  publishDate: string;
}

export interface Comic {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  genre: string[];
  publishDate: string;
  rating: number;
  chapters: Chapter[];
  featured: boolean;
  trending: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  favoriteComics: string[];
  readingHistory: ReadingProgress[];
}

export interface ReadingProgress {
  comicId: string;
  chapterId: string;
  pageNumber: number;
  lastRead: string;
}

export interface ComicFilter {
  genre?: string;
  author?: string;
  status?: 'ongoing' | 'completed' | 'hiatus';
  rating?: number;
  publishedAfter?: Date;
  publishedBefore?: Date;
  sortBy?: 'title' | 'rating' | 'publishDate' | 'trending';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}