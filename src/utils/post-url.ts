import { format, parseISO } from 'date-fns';
import type { CollectionEntry } from 'astro:content';

/**
 * Generates a URL for a blog post following the WordPress-compatible pattern:
 * /YYYY/MM/DD/slug
 *
 * @param post - Blog post entry from content collection
 * @returns URL string in format /YYYY/MM/DD/slug
 *
 * @example
 * ```ts
 * const url = getPostUrl(post);
 * // Returns: "/2025/01/15/my-post-title"
 * ```
 */
export function getPostUrl(post: CollectionEntry<'posts'>): string {
  const date = parseISO(post.data.date);
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  const day = format(date, 'dd');
  const slug = post.slug.split('/').pop();
  return `/${year}/${month}/${day}/${slug}`;
}
