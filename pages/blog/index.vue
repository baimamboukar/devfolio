<script setup>
    definePageMeta({
      title: "Blog",
      description:
        "Discover my awesome contents about software development, philosophy, and more. I write about Go, AWS, Flutter, Nuxt, Machine Learning and other cool stuff.",
    });

    const searchQuery = ref('')
    const selectedTags = ref([])
    const sortOption = ref('newest')
    const sortOptions = [
      { label: 'Newest First', value: 'newest' },
      { label: 'Oldest First', value: 'oldest' },
      { label: 'A-Z', value: 'alpha' }
    ]

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
          _path: `/blog/${post.guid.split('/').pop()}`,
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

    const allTags = computed(() => {
    if (!posts.value) return [];

    return Object.entries(
      posts.value.flatMap(post => post.tags)
        .reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1; // Count occurrences
          return acc;
        }, {})
    )
      .sort(([, countA], [, countB]) => countB - countA) // Sort by count (descending)
      .slice(0, 16) // Take top 16
      .map(([tag]) => tag); // Extract tag names
  });


    const filteredPosts = computed(() => {
      if (!posts.value) return []
      return posts.value.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesTags = selectedTags.value.length === 0 ||
          selectedTags.value.some(tag => post.tags.includes(tag))
        return matchesSearch && matchesTags
      })
    })

    const sortedAndFilteredPosts = computed(() => {
      return [...filteredPosts.value].sort((a, b) => {
        switch (sortOption.value) {
          case 'oldest':
            return new Date(a.published_on) - new Date(b.published_on)
          case 'alpha':
            return a.title.localeCompare(b.title)
          default:
            return new Date(b.published_on) - new Date(a.published_on)
        }
      })
    })

    function estimateReadingTime(content) {
      const wordsPerMinute = 200
      const words = content.trim().split(/\s+/).length
      return Math.ceil(words / wordsPerMinute)
    }
</script>

<template>
  <article class="max-w-7xl mx-auto px-4">
    <h1 class="mb-4 text-3xl font-bold text-left">Blog</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      Discover my awesome contents about software development, philosophy, and
      more. I write about Go, AWS, Flutter, Nuxt, Google Cloud and other cool
      stuff.
    </p>

    <!-- Search and Filter Section -->
    <div class="mb-8 space-y-4">
      <div class="flex gap-4 flex-wrap">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search articles..."
          class="max-w-md"
        />
        <USelect v-model="sortOption" :options="sortOptions" class="w-40" />
      </div>

      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in allTags"
          :key="tag"
          :color="selectedTags.includes(tag) ? 'primary' : 'gray'"
          variant="soft"
          class="cursor-pointer"
          @click="selectedTags.includes(tag) 
            ? selectedTags.splice(selectedTags.indexOf(tag), 1)
            : selectedTags.push(tag)"
        >
          {{ tag }}
        </UBadge>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="selectedTags.length > 0" class="mb-4 flex gap-2 items-center">
      <span class="text-sm text-gray-500">Active filters:</span>
      <UButton size="xs" color="gray" variant="soft" @click="selectedTags = []">
        Clear all
      </UButton>
    </div>

    <!-- Posts Grid -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <template v-if="pending">
        <app-blog-skeleton
          v-for="skeleton in generateKeys(5)"
          :key="skeleton"
        />
      </template>
      <template v-else>
        <app-blog-card
          v-for="post in sortedAndFilteredPosts"
          :key="post._id"
          :tags="post.tags"
          :blog-title="post.title"
          :title="post.title"
          :url="post.link"
          :pub-date="post.published_on"
          :cover-image="post.cover_image"
        >
          <template #extra>
            <UBadge v-if="post.body" color="gray" variant="soft" class="ml-2">
              {{ estimateReadingTime(post.body) }} min read
            </UBadge>
          </template>
        </app-blog-card>
      </template>
    </section>

    <!-- No Results Message -->
    <div
      v-if="!pending && sortedAndFilteredPosts.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-heroicons-document-magnifying-glass"
        class="text-4xl mb-2"
      />
      <p class="text-gray-500">No articles found matching your criteria</p>
      <UButton
        v-if="searchQuery || selectedTags.length"
        color="gray"
        variant="soft"
        class="mt-4"
        @click="searchQuery = ''; selectedTags = []"
      >
        Clear filters
      </UButton>
    </div>
  </article>
</template>
