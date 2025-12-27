import { parseISO } from 'date-fns';
import type { CollectionEntry } from 'astro:content';

/**
 * Filters posts to only include published posts (where published !== false)
 *
 * @param posts - Array of blog post entries
 * @returns Array of published posts only
 */
export function getPublishedPosts(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return posts.filter((post) => post.data.published !== false);
}

/**
 * Sorts posts by date in descending order (newest first)
 *
 * @param posts - Array of blog post entries
 * @returns New array sorted by date (newest first)
 */
export function sortPostsByDate(posts: CollectionEntry<'posts'>[]): CollectionEntry<'posts'>[] {
  return [...posts].sort(
    (a, b) => parseISO(b.data.date).getTime() - parseISO(a.data.date).getTime()
  );
}

/**
 * Filters to published posts and sorts by date (newest first)
 * Convenience function combining getPublishedPosts and sortPostsByDate
 *
 * @param posts - Array of blog post entries
 * @returns Array of published posts sorted by date (newest first)
 */
export function getPublishedPostsSorted(
  posts: CollectionEntry<'posts'>[]
): CollectionEntry<'posts'>[] {
  return sortPostsByDate(getPublishedPosts(posts));
}

/**
 * Filters posts by category
 *
 * @param posts - Array of blog post entries
 * @param category - Category name to filter by
 * @returns Array of posts in the specified category
 */
export function getPostsByCategory(
  posts: CollectionEntry<'posts'>[],
  category: string
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => post.data.categories?.includes(category));
}
