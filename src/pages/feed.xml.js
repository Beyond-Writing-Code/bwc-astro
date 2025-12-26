import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { format, parseISO } from 'date-fns';

export async function GET(context) {
  const allPosts = await getCollection('posts');
  const publishedPosts = allPosts
    .filter((post) => post.data.published !== false)
    .sort((a, b) => parseISO(b.data.date).getTime() - parseISO(a.data.date).getTime());

  return rss({
    title: 'Beyond Writing Code',
    description:
      'Weekly reflections on human skills in tech, from developer to tech lead to architect. 25+ years of lessons on working better and happier.',
    site: context.site,
    items: await Promise.all(
      publishedPosts.map(async (post) => {
        const date = parseISO(post.data.date);
        const year = format(date, 'yyyy');
        const month = format(date, 'MM');
        const day = format(date, 'dd');
        const link = `/${year}/${month}/${day}/${post.slug}`;

        const { Content } = await post.render();

        return {
          title: post.data.title,
          pubDate: date,
          description: post.data.excerpt,
          link,
          categories: post.data.categories || [],
          content: await renderToString(Content),
        };
      })
    ),
    customData: `<language>en-us</language>`,
  });
}

async function renderToString(_Component) {
  return '';
}
