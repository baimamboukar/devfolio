<script setup>
import { format } from 'date-fns';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// Fetch all news data
const { data: newsData } = await useAsyncData('all-news', () =>
  queryContent('news').findOne()
);

// Group news by year
const groupedNews = computed(() => {
  if (!newsData.value?.updates) return {};

  const grouped = {};
  newsData.value.updates.forEach(update => {
    const year = new Date(update.date).getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(update);
  });

  // Sort years in descending order
  return Object.keys(grouped)
    .sort((a, b) => b - a)
    .reduce((obj, key) => {
      obj[key] = grouped[key];
      return obj;
    }, {});
});

// Format date to "January 15" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM d');
};

// Get icon based on update type
const getTypeIcon = (type) => {
  const icons = {
    publication: 'i-heroicons-document-text',
    conference: 'i-heroicons-microphone',
    award: 'i-heroicons-trophy',
    collaboration: 'i-heroicons-user-group',
    position: 'i-heroicons-academic-cap',
    certification: 'i-heroicons-shield-check',
    opensource: 'i-heroicons-code-bracket',
    talk: 'i-heroicons-presentation-chart-line'
  };
  return icons[type] || 'i-heroicons-information-circle';
};

// Get color for all update types - using consistent design system colors
const getTypeColor = () => {
  return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
};

// Selected filter
const selectedType = ref('all');

// Filter types - reduced to top 5 most useful
const filterTypes = [
  { value: 'all', label: 'All Updates' },
  { value: 'publication', label: 'Publications' },
  { value: 'conference', label: 'Conferences' },
  { value: 'opensource', label: 'Open Source' },
  { value: 'talk', label: 'Talks' }
];

// Filtered news
const filteredGroupedNews = computed(() => {
  if (selectedType.value === 'all') return groupedNews.value;

  const filtered = {};
  Object.keys(groupedNews.value).forEach(year => {
    const yearUpdates = groupedNews.value[year].filter(
      update => update.type === selectedType.value
    );
    if (yearUpdates.length > 0) {
      filtered[year] = yearUpdates;
    }
  });
  return filtered;
});
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    fullscreen
    :ui="{
      container: 'flex flex-col h-screen',
      overlay: { background: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm' },
      base: 'h-screen max-h-none w-screen max-w-none m-0 rounded-none'
    }"
  >
    <div class="h-full flex flex-col bg-white dark:bg-gray-900 relative overflow-hidden">
      <!-- Background Pattern - Elegant Dotted Grid -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Left Side: Subtle Dotted Grid -->
        <div class="absolute left-0 top-0 w-[20%] h-full">
          <div class="w-full h-full relative">
            <!-- Dotted Grid Pattern -->
            <div class="absolute inset-0" style="
              background-image: radial-gradient(circle, rgba(14, 165, 233, 0.15) 1px, transparent 1px);
              background-size: 24px 24px;
            "></div>
            <!-- Smooth Fade Overlay -->
            <div class="absolute inset-0 dark:hidden" style="
              background: linear-gradient(to right,
                transparent 0%,
                transparent 60%,
                rgba(255, 255, 255, 0.3) 80%,
                rgba(255, 255, 255, 0.7) 90%,
                white 100%
              );
            "></div>
            <div class="absolute inset-0 hidden dark:block" style="
              background: linear-gradient(to right,
                transparent 0%,
                transparent 60%,
                rgba(17, 24, 39, 0.3) 80%,
                rgba(17, 24, 39, 0.7) 90%,
                rgb(17, 24, 39) 100%
              );
            "></div>
          </div>
        </div>

        <!-- Right Side: Complementary Grid Lines -->
        <div class="absolute right-0 top-0 w-[20%] h-full">
          <div class="w-full h-full relative">
            <!-- Grid Lines Pattern -->
            <div class="absolute inset-0" style="
              background-image:
                linear-gradient(rgba(14, 165, 233, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
              background-size: 32px 32px;
            "></div>
            <!-- Smooth Fade Overlay -->
            <div class="absolute inset-0 dark:hidden" style="
              background: linear-gradient(to left,
                transparent 0%,
                transparent 60%,
                rgba(255, 255, 255, 0.3) 80%,
                rgba(255, 255, 255, 0.7) 90%,
                white 100%
              );
            "></div>
            <div class="absolute inset-0 hidden dark:block" style="
              background: linear-gradient(to left,
                transparent 0%,
                transparent 60%,
                rgba(17, 24, 39, 0.3) 80%,
                rgba(17, 24, 39, 0.7) 90%,
                rgb(17, 24, 39) 100%
              );
            "></div>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0 relative z-10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">All Updates & News</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              A comprehensive timeline of research, publications, and achievements
            </p>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="emit('update:modelValue', false)"
          />
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center gap-2 overflow-x-auto pb-2">
          <UButton
            v-for="filter in filterTypes"
            :key="filter.value"
            :color="selectedType === filter.value ? 'sky' : 'gray'"
            :variant="selectedType === filter.value ? 'soft' : 'ghost'"
            size="xs"
            @click="selectedType = filter.value"
          >
            {{ filter.label }}
          </UButton>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto relative z-10">
        <div class="max-w-4xl mx-auto px-6 py-8">
        <div v-if="Object.keys(filteredGroupedNews).length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No updates found for this filter</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Year Groups -->
          <div v-for="(updates, year) in filteredGroupedNews" :key="year">
            <!-- Year Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-900 z-10 pb-2">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {{ year }}
                </h3>
                <UBadge color="sky" variant="soft" size="xs">
                  {{ updates.length }} updates
                </UBadge>
              </div>
              <div class="h-px bg-gradient-to-r from-sky-400 via-sky-200 to-transparent mt-2" />
            </div>

            <!-- Updates for Year -->
            <div class="space-y-3 pl-4">
              <div
                v-for="(update, index) in updates"
                :key="index"
                class="group flex gap-4 items-start hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-all"
              >
                <!-- Icon -->
                <div
                  :class="getTypeColor()"
                  class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <UIcon :name="getTypeIcon(update.type)" class="w-5 h-5" />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <!-- Date and Title -->
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-500 transition-colors">
                      {{ update.title }}
                    </h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {{ formatDate(update.date) }}
                    </span>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ update.description }}
                  </p>

                  <!-- Tags and Link -->
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex flex-wrap gap-1">
                      <UBadge
                        v-for="tag in update.tags"
                        :key="tag"
                        color="gray"
                        variant="soft"
                        size="xs"
                      >
                        {{ tag }}
                      </UBadge>
                    </div>

                    <UButton
                      v-if="update.link && update.link !== '#'"
                      :to="update.link"
                      color="sky"
                      variant="link"
                      size="xs"
                      target="_blank"
                      external
                    >
                      View
                      <template #trailing>
                        <UIcon name="i-heroicons-arrow-up-right" />
                      </template>
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </UModal>
</template>