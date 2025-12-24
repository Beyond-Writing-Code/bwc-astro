import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    originalDate: z.string().optional(),
    excerpt: z.string(),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    featuredImage: z.string().optional(),
    published: z.boolean().default(true),
    comments: z.array(z.object({
      author: z.string(),
      date: z.string(),
      content: z.string(),
    })).optional().default([]),
  }),
});

export const collections = { posts };
