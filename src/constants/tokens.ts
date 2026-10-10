export const colors = {
  bg: '#14110F',
  surface: '#1E1A17',
  surface2: '#2A2420',
  text: '#F5EFE6',
  muted: '#A39A8E',
  accent: '#FF6B35',
  gold: '#E8B84B',
  border: '#332C27',
};

export const radius = { sm: 8, md: 14, lg: 22 };
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

const genreGradients: Record<string, [string, string]> = {
  'Fairy Tale': ['#7B2FF7', '#F107A3'],
  Fantasy: ['#1D976C', '#2C5364'],
  'Moral Story': ['#F2994A', '#B34700'],
  Tragedy: ['#8E0E00', '#1F1C18'],
  Romance: ['#EB3349', '#F45C43'],
  Satire: ['#396AFC', '#2948FF'],
  Comedy: ['#F7971E', '#C77700'],
  Adventure: ['#0F9B8E', '#134E5E'],
  Mystery: ['#42275A', '#734B6D'],
  'Animal Fiction': ['#56AB2F', '#2E6B1A'],
};

export const gradientFor = (genre: string): [string, string] => {
  const first = genre.split(',')[0].trim();
  return genreGradients[first] ?? ['#485563', '#29323C'];
};

export const readerThemes = {
  paper: { bg: '#FAF6EE', text: '#2B2622' },
  sepia: { bg: '#EAD9B8', text: '#40301C' },
  night: { bg: '#0E0C0A', text: '#D9D1C5' },
};