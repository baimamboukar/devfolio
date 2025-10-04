<script setup>
import { format } from 'date-fns';

const props = defineProps({
  limit: {
    type: Number,
    default: 4
  }
});

const emit = defineEmits(['showAll']);

// Fetch news data
const { data: newsData } = await useAsyncData('news', () =>
  queryContent('news').findOne()
);

// Get limited news items
const displayedNews = computed(() => {
  if (!newsData.value?.updates) return [];
  return newsData.value.updates.slice(0, props.limit);
});

// Format date to "Oct 12, 2024" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};
</script>

<template>
  <section class="mb-8">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Recent Updates</h2>

      <UButton
        v-if="newsData?.updates?.length > props.limit"
        color="sky"
        variant="ghost"
        size="xs"
        @click="emit('showAll')"
      >
        View All
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right" />
        </template>
      </UButton>
    </div>

    <!-- Compact News List -->
    <div class="space-y-3">
      <div
        v-for="(update, index) in displayedNews"
        :key="index"
        class="group flex gap-3 items-start cursor-pointer"
      >
        <!-- Bullet Point -->
        <div class="flex-shrink-0 pt-1.5">
          <div class="w-2 h-2 rounded-full bg-sky-500 group-hover:bg-sky-600 transition-colors"></div>
        </div>

        <!-- Text Content -->
        <div class="flex-1">
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <span class="text-gray-500 dark:text-gray-400 font-medium">
              {{ formatDate(update.date) }}
            </span>
            <span class="mx-2">•</span>
            <span class="group-hover:text-sky-500 transition-colors">
              {{ update.title }}
            </span>
          </p>
        </div>

        <!-- Optional Link Icon -->
        <UButton
          v-if="update.link && update.link !== '#'"
          :to="update.link"
          color="gray"
          variant="link"
          size="xs"
          target="_blank"
          external
          class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <UIcon name="i-heroicons-arrow-up-right" class="w-3 h-3" />
        </UButton>
      </div>
    </div>
  </section>
</template>

