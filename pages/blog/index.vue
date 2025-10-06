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

    function handleTagChange(tagValue, event) {
      if (tagValue && !selectedTags.value.includes(tagValue)) {
        selectedTags.value.push(tagValue)
      }
      // Reset the dropdown to placeholder after selection
      if (event?.target) {
        event.target.value = ''
      }
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
      <!-- Search and Filters in same line -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Bar -->
        <div class="relative flex-1">
          <Icon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <!-- Tag Filter Dropdown -->
        <div class="min-w-48">
          <select
            @change="handleTagChange($event.target.value, $event)"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select Tag to Add</option>
            <option v-for="tag in allTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>

        <!-- Sort Dropdown -->
        <div class="min-w-48">
          <select
            v-model="sortOption"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Reset Button -->
        <button
          v-if="searchQuery || selectedTags.length > 0"
          @click="searchQuery = ''; selectedTags = []"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      <!-- Active Tags Display -->
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="inline-flex items-center px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
        >
          {{ tag }}
          <button
            @click="selectedTags.splice(selectedTags.indexOf(tag), 1)"
            class="ml-1 hover:text-sky-900 dark:hover:text-sky-100"
          >
            <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
          </button>
        </span>
      </div>
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
          :read-time="post.body ? `${estimateReadingTime(post.body)} min read` : null"
        />
      </template>
    </section>

    <!-- No Results Message -->
    <div v-if="!pending && sortedAndFilteredPosts.length === 0" class="text-center py-12">
      <Icon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No articles found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
      <button
        v-if="searchQuery || selectedTags.length"
        @click="searchQuery = ''; selectedTags = []"
        class="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
      >
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
        Clear Filters
      </button>
    </div>
  </article>
</template>
