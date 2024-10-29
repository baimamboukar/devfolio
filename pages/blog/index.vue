<script setup>
      definePageMeta({
        title: "Blog",
        description:
          "Discover my awesome contents about software development, philosophy, and more. I write about Go, AWS, Flutter, Nuxt, Machine Learning and other cool stuff.",
      });

    const { pending, data: posts } = await useLazyAsyncData("all-posts", async () => {
    const medium_feeds_url = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@baimamboukar";
    const response = await $fetch(medium_feeds_url);

    return response.items.map(post => {
      // Clean the HTML content
      const cleanContent = post.content
        .replace(/<figure>.*?<\/figure>/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\s*\n/g, '\n\n')

      // Extract first image from content
      const imgMatch = post.content.match(/<img.*?src="(.*?)"/)
      const coverImage = imgMatch ? imgMatch[1] : ''

      // Transform to match Nuxt Content's expected format
      return {
        _id: post.guid.split('/').pop(),
        _path: `/blog/${post.guid.split('/').pop()}`, // Add _path for routing
        title: post.title,
        link: post.link,
        description: post.description.replace(/<[^>]*>/g, '').trim(),
        tags: post.categories,
        image: coverImage,
        cover_image: coverImage,
        canonical_url: post.link,
        head: {
          meta: [
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Baimam Boukar JJ(@baimamboukar)' },
            { property: 'og:type', content: 'article' },
            { name: 'twitter:card', content: 'summary_large_image' }
          ]
        },
        published: true,
        published_on: post.pubDate.split(" ")[0],
        body: cleanContent
      }
    }).sort((a, b) => new Date(b.published_on) - new Date(a.published_on));
  });
</script>

<!-- Blog: Posts -->
<template>
  <article>
    <h1 class="mb-4 text-3xl font-bold text-left">Blog</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      Discover my awesome contents about software development, philosophy, and
      more. I write about Go, AWS, Flutter, Nuxt, Google Cloud and other cool
      stuff.
    </p>
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <template v-if="pending">
        <app-blog-skeleton
          v-for="skeleton in generateKeys(5)"
          :key="skeleton"
        />
      </template>
      <template v-else>
        <app-blog-card
          v-for="post in posts"
          :key="post._id"
          :tags="post.tags"
          :blog-title="post.title"
          :title="post.title"
          :url="post.link"
          :pub-date="post.published_on"
          :cover-image="post.cover_image"
        />
      </template>
    </section>
  </article>
</template>
