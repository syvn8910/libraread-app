import axios from 'axios';
import { API_URL } from '@/constants/config';
import { cleanText, toParagraphs } from '@/utils/text';

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export type Story = {
  id: number;
  title: string;
  authorId: number;
  author: string;
  genre: string;
  genres: string[];
  synopsis: string;
  coverUrl: string;
  reads: number;
  status: string;
};

export type Chapter = {
  id: number;
  storyId: number;
  number: number;
  title: string;
  paragraphs: string[];
};

export type Author = { id: number; name: string; bio: string; photo: string };

// The ONLY place that knows the raw keys with spaces
const normalizeStory = (s: any): Story => ({
  id: s.id,
  title: cleanText(s.title),
  authorId: s.author_id,
  author: s.author,
  genre: s.genre,
  genres: s.genre.split(',').map((g: string) => g.trim()),
  synopsis: cleanText(s.synopsis),
  coverUrl: s['Book Cover'],
  reads: s['Sample Read Counts'],
  status: s['Status'],
});

const normalizeChapter = (c: any): Chapter => ({
  id: c.chapter_id,
  storyId: c.story_id,
  number: c.chapter_number,
  title: cleanText(c.chapter_title),
  paragraphs: toParagraphs(c.chapter_content),
});

export const getStories = async (): Promise<Story[]> =>
  (await api.get('/stories')).data.map(normalizeStory);

export const getPopular = async (): Promise<Story[]> =>
  (await api.get('/stories/popular')).data.map(normalizeStory);

export const getStory = async (id: number): Promise<Story> =>
  normalizeStory((await api.get(`/stories/${id}`)).data);

// API returns ONE chapter object; we always return an array
export const getChapters = async (storyId: number): Promise<Chapter[]> => {
  const { data } = await api.get(`/stories/${storyId}/chapters`);
  return (Array.isArray(data) ? data : [data]).map(normalizeChapter);
};

export const getAuthors = async (): Promise<Author[]> =>
  (await api.get('/authors')).data.map((a: any) => ({ ...a, bio: cleanText(a.bio) }));

export const getAuthorStories = async (authorId: number): Promise<Story[]> =>
  (await api.get(`/authors/${authorId}/stories`)).data.map(normalizeStory);

export const getGenreStories = async (genre: string): Promise<Story[]> =>
  (await api.get(`/genres/${encodeURIComponent(genre)}/stories`)).data.map(normalizeStory);

export const formatReads = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;