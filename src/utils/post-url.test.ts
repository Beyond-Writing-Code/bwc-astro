import { describe, it, expect } from 'vitest';
import { getPostUrl } from './post-url';
import type { CollectionEntry } from 'astro:content';

describe('getPostUrl', () => {
  it('generates correct URL for post', () => {
    const mockPost = {
      id: '2025/test-post.md',
      slug: '2025/test-post',
      data: {
        title: 'Test Post',
        date: '2025-01-15',
        excerpt: 'Test excerpt',
        published: true,
        categories: [],
        tags: [],
        comments: [],
      },
      collection: 'posts',
    } as Partial<CollectionEntry<'posts'>> as CollectionEntry<'posts'>;

    expect(getPostUrl(mockPost)).toBe('/2025/01/15/test-post');
  });

  it('handles nested slugs correctly', () => {
    const mockPost = {
      id: '2025/01/nested-post.md',
      slug: '2025/01/nested-post',
      data: {
        title: 'Nested Post',
        date: '2025-12-31',
        excerpt: 'Test',
        published: true,
        categories: [],
        tags: [],
        comments: [],
      },
      collection: 'posts',
    } as Partial<CollectionEntry<'posts'>> as CollectionEntry<'posts'>;

    expect(getPostUrl(mockPost)).toBe('/2025/12/31/nested-post');
  });

  it('handles single-digit months and days with leading zeros', () => {
    const mockPost = {
      id: '2025/early-year-post.md',
      slug: '2025/early-year-post',
      data: {
        title: 'Early Year Post',
        date: '2025-01-05',
        excerpt: 'Test',
        published: true,
        categories: [],
        tags: [],
        comments: [],
      },
      collection: 'posts',
    } as Partial<CollectionEntry<'posts'>> as CollectionEntry<'posts'>;

    expect(getPostUrl(mockPost)).toBe('/2025/01/05/early-year-post');
  });

  it('handles different date formats in the year', () => {
    const mockPost = {
      id: '2024/year-end-post.md',
      slug: '2024/year-end-post',
      data: {
        title: 'Year End Post',
        date: '2024-12-25',
        excerpt: 'Test',
        published: true,
        categories: [],
        tags: [],
        comments: [],
      },
      collection: 'posts',
    } as Partial<CollectionEntry<'posts'>> as CollectionEntry<'posts'>;

    expect(getPostUrl(mockPost)).toBe('/2024/12/25/year-end-post');
  });
});
