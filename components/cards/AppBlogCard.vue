<script setup>
  const props = defineProps({
    description: String,
    blogTitle: String,
    url: String,
    title: String,
    tags: Array,
    readTime: String,
    pubDate: String,
    coverImage: String
  });

  // Limit tags to maximum of 3
  const displayTags = computed(() => {
    return props.tags ? props.tags.slice(0, 3) : [];
  });

  const lastUpdateTime = computed(() => {
    const dateObj = new Date(props.pubDate);

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  });
</script>

<!-- Blog: Card -->
<template>
  <nuxt-link
    class="focus-visible:global-focus rounded-lg w-full p-0 overflow-hidden flex flex-col border-none bg-none bg-transparent dark:bg-transparent [&_img]:hover:scale-105"
    :to="url"
  >
    <!-- Blog Cover Image -->
    <div
      v-if="coverImage"
      class="flex items-center justify-center flex-shrink-0 w-full h-48 mr-1 overflow-hidden card-style rounded-xl"
    >
      <nuxt-img
        preload
        placeholder
        format="webp"
        height="500"
        :src="coverImage"
        :alt="`Cover Image for an Article Titled ${blogTitle}`"
        class="object-cover w-full h-auto text-center"
      />
    </div>
    <div class="flex flex-col justify-between flex-shrink-0 w-full p-2">
      <!-- Blog Tags -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Blog Title -->
      <h3 class="font-bold text-gray-900 dark:text-gray-100 mb-2">{{ blogTitle }}</h3>

      <!-- Publish Date and Read Time -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{{ lastUpdateTime }}</span>
        <span v-if="readTime" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{{ readTime }}</span>
      </div>
    </div>
  </nuxt-link>
</template>
