<script setup>
definePageMeta({
  title: "Blog",
  description:
    "Discover my awesome contents about software development, philosophy, and more. I write about Go, AWS, Flutter, Nuxt, Google Cloud and other cool stuff.",
});

// Fetch all blog posts
const { pending, data: posts } = await useLazyAsyncData("all-posts", () =>
  queryContent("/blog").sort({ published_on: -1 }).find()
);
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
          :url="post._path"
          :pub-date="post.published_on"
          :cover-image="post.image"
        />
      </template>
    </section>
  </article>
</template>
