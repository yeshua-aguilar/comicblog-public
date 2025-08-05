import { Comic } from '../types/Comic';

export const mockComics: Comic[] = [
  {
    id: '1',
    title: 'Spider-Man: Into the Spider-Verse',
    description: 'Miles Morales se convierte en Spider-Man y debe salvar el multiverso junto a otros Spider-People de diferentes dimensiones.',
    coverImage: '/placeholder-comic.svg',
    author: 'Brian Michael Bendis',
    genre: ['Superhéroes', 'Acción', 'Aventura'],
    publishDate: '2023-01-15',
    rating: 4.8,
    chapters: [
      {
        id: 'ch1-1',
        title: 'El Nuevo Spider-Man',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-01-15'
      }
    ],
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'Attack on Titan',
    description: 'La humanidad lucha por sobrevivir contra gigantes devoradores de humanos en un mundo post-apocalíptico.',
    coverImage: '/placeholder-comic.svg',
    author: 'Hajime Isayama',
    genre: ['Acción', 'Drama', 'Horror'],
    publishDate: '2023-02-10',
    rating: 4.9,
    chapters: [
      {
        id: 'ch2-1',
        title: 'El Día de la Caída',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-02-10'
      }
    ],
    featured: true,
    trending: true
  },
  {
    id: '3',
    title: 'One Piece',
    description: 'Monkey D. Luffy y su tripulación de piratas buscan el tesoro legendario conocido como One Piece.',
    coverImage: '/placeholder-comic.svg',
    author: 'Eiichiro Oda',
    genre: ['Aventura', 'Comedia', 'Acción'],
    publishDate: '2023-03-05',
    rating: 4.7,
    chapters: [
      {
        id: 'ch3-1',
        title: 'Romance Dawn',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-03-05'
      }
    ],
    featured: false,
    trending: true
  },
  {
    id: '4',
    title: 'Batman: The Dark Knight',
    description: 'Bruce Wayne lucha contra el crimen en Gotham City como el vigilante conocido como Batman.',
    coverImage: '/placeholder-comic.svg',
    author: 'Frank Miller',
    genre: ['Superhéroes', 'Thriller', 'Acción'],
    publishDate: '2023-01-20',
    rating: 4.6,
    chapters: [
      {
        id: 'ch4-1',
        title: 'El Regreso del Caballero Oscuro',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-01-20'
      }
    ],
    featured: true,
    trending: false
  },
  {
    id: '5',
    title: 'Demon Slayer',
    description: 'Tanjiro Kamado se convierte en cazador de demonios para salvar a su hermana convertida en demonio.',
    coverImage: '/placeholder-comic.svg',
    author: 'Koyoharu Gotouge',
    genre: ['Acción', 'Sobrenatural', 'Drama'],
    publishDate: '2023-02-28',
    rating: 4.8,
    chapters: [
      {
        id: 'ch5-1',
        title: 'Crueldad',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-02-28'
      }
    ],
    featured: false,
    trending: true
  },
  {
    id: '6',
    title: 'Wonder Woman',
    description: 'Diana Prince, princesa amazona, protege el mundo como Wonder Woman con sus poderes divinos.',
    coverImage: '/placeholder-comic.svg',
    author: 'Gail Simone',
    genre: ['Superhéroes', 'Fantasía', 'Acción'],
    publishDate: '2023-03-12',
    rating: 4.5,
    chapters: [
      {
        id: 'ch6-1',
        title: 'La Princesa Guerrera',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-03-12'
      }
    ],
    featured: true,
    trending: false
  },
  {
    id: '7',
    title: 'My Hero Academia',
    description: 'En un mundo donde casi todos tienen superpoderes, Izuku Midoriya lucha por convertirse en héroe.',
    coverImage: '/placeholder-comic.svg',
    author: 'Kohei Horikoshi',
    genre: ['Superhéroes', 'Escolar', 'Acción'],
    publishDate: '2023-04-01',
    rating: 4.7,
    chapters: [
      {
        id: 'ch7-1',
        title: 'Izuku Midoriya: Origen',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-04-01'
      }
    ],
    featured: false,
    trending: true
  },
  {
    id: '8',
    title: 'The Walking Dead',
    description: 'Un grupo de supervivientes lucha por mantenerse vivo en un mundo post-apocalíptico lleno de zombies.',
    coverImage: '/placeholder-comic.svg',
    author: 'Robert Kirkman',
    genre: ['Horror', 'Drama', 'Supervivencia'],
    publishDate: '2023-03-20',
    rating: 4.4,
    chapters: [
      {
        id: 'ch8-1',
        title: 'Días Pasados',
        number: 1,
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg'],
        publishDate: '2023-03-20'
      }
    ],
    featured: false,
    trending: false
  }
];