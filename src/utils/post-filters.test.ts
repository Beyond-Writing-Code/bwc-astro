import { describe, it, expect } from 'vitest';
import {
  getPublishedPosts,
  sortPostsByDate,
  getPublishedPostsSorted,
  getPostsByCategory,
} from './post-filters';
import type { CollectionEntry } from 'astro:content';

const createMockPost = (
  slug: string,
  date: string,
  published = true,
  categories: string[] = []
): Partial<CollectionEntry<'posts'>> =>
  ({
    id: `${slug}.md`,
    slug,
    data: {
      title: `Post ${slug}`,
      date,
      excerpt: 'Test excerpt',
      published,
      categories,
      tags: [],
      comments: [],
    },
    collection: 'posts',
  }) as Partial<CollectionEntry<'posts'>>;

describe('getPublishedPosts', () => {
  it('filters out unpublished posts', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', true),
      createMockPost('post-2', '2025-01-02', false),
      createMockPost('post-3', '2025-01-03', true),
    ] as CollectionEntry<'posts'>[];

    const result = getPublishedPosts(posts);

    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('post-1');
    expect(result[1].slug).toBe('post-3');
  });

  it('includes posts where published is not explicitly set', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01'),
      createMockPost('post-2', '2025-01-02', false),
    ] as CollectionEntry<'posts'>[];

    const result = getPublishedPosts(posts);

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post-1');
  });

  it('returns empty array when no published posts', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', false),
      createMockPost('post-2', '2025-01-02', false),
    ] as CollectionEntry<'posts'>[];

    const result = getPublishedPosts(posts);

    expect(result).toHaveLength(0);
  });
});

describe('sortPostsByDate', () => {
  it('sorts posts by date in descending order (newest first)', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01'),
      createMockPost('post-2', '2025-03-15'),
      createMockPost('post-3', '2025-02-10'),
    ] as CollectionEntry<'posts'>[];

    const result = sortPostsByDate(posts);

    expect(result[0].slug).toBe('post-2'); // March 15
    expect(result[1].slug).toBe('post-3'); // Feb 10
    expect(result[2].slug).toBe('post-1'); // Jan 1
  });

  it('does not mutate original array', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01'),
      createMockPost('post-2', '2025-03-15'),
    ] as CollectionEntry<'posts'>[];

    const original = [...posts];
    sortPostsByDate(posts);

    expect(posts).toEqual(original);
  });
});

describe('getPublishedPostsSorted', () => {
  it('filters and sorts posts in one operation', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', true),
      createMockPost('post-2', '2025-03-15', false),
      createMockPost('post-3', '2025-02-10', true),
      createMockPost('post-4', '2025-04-01', false),
      createMockPost('post-5', '2025-05-20', true),
    ] as CollectionEntry<'posts'>[];

    const result = getPublishedPostsSorted(posts);

    expect(result).toHaveLength(3);
    expect(result[0].slug).toBe('post-5'); // May 20 (published)
    expect(result[1].slug).toBe('post-3'); // Feb 10 (published)
    expect(result[2].slug).toBe('post-1'); // Jan 1 (published)
  });
});

describe('getPostsByCategory', () => {
  it('filters posts by category', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', true, ['tech', 'career']),
      createMockPost('post-2', '2025-01-02', true, ['career']),
      createMockPost('post-3', '2025-01-03', true, ['tech']),
      createMockPost('post-4', '2025-01-04', true, ['life']),
    ] as CollectionEntry<'posts'>[];

    const result = getPostsByCategory(posts, 'tech');

    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('post-1');
    expect(result[1].slug).toBe('post-3');
  });

  it('returns empty array when no posts match category', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', true, ['tech']),
      createMockPost('post-2', '2025-01-02', true, ['career']),
    ] as CollectionEntry<'posts'>[];

    const result = getPostsByCategory(posts, 'nonexistent');

    expect(result).toHaveLength(0);
  });

  it('handles posts without categories', () => {
    const posts = [
      createMockPost('post-1', '2025-01-01', true, ['tech']),
      createMockPost('post-2', '2025-01-02', true),
    ] as CollectionEntry<'posts'>[];

    const result = getPostsByCategory(posts, 'tech');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('post-1');
  });
});
