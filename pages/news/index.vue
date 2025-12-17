<script setup>
import { format } from 'date-fns';

definePageMeta({
  title: "News & Updates",
  description: "A timeline of research, publications, awards, and community contributions.",
});

// Fetch all news data
const { data: newsData } = await useAsyncData('all-news-page', () =>
  queryContent('news').findOne()
);

// State
const selectedType = ref('all');
const searchQuery = ref('');

// Filter types
const filterTypes = [
  { value: 'all', label: 'All Updates' },
  { value: 'publication', label: 'Publications' },
  { value: 'conference', label: 'Conferences' },
  { value: 'opensource', label: 'Open Source' },
  { value: 'talk', label: 'Talks' },
  { value: 'award', label: 'Awards' }
];

// Helper: Format day
const formatDay = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'd'); // e.g., "15"
};

// Computed: Filtered & Grouped News (Year -> Month)
const filteredGroupedNews = computed(() => {
  if (!newsData.value?.updates) return {};

  const query = searchQuery.value.toLowerCase();
  
  // 1. Filter raw list first
  const filteredUpdates = newsData.value.updates.filter(update => {
    // Type Filter
    if (selectedType.value !== 'all' && update.type !== selectedType.value) return false;
    
    // Search Filter
    if (query) {
      const text = `${update.title} ${update.description}`.toLowerCase();
      if (!text.includes(query)) return false;
    }
    return true;
  });

  // 2. Group by Year -> Month
  const grouped = {};
  
  filteredUpdates.forEach(update => {
    const date = new Date(update.date);
    const year = date.getFullYear();
    const month = format(date, 'MMMM'); // Full month name "August"
    const monthIndex = date.getMonth(); // 0-11 for sorting

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][monthIndex]) {
      grouped[year][monthIndex] = {
        name: month,
        items: []
      };
    }
    grouped[year][monthIndex].items.push(update);
  });

  // 3. Sort Keys and Structure as Array (Years Desc -> Months Desc)
  const sortedArray = Object.keys(grouped)
    .sort((a, b) => b - a) // Years Descending
    .map(year => {
      const months = Object.keys(grouped[year])
        .sort((a, b) => b - a) // Months Descending
        .map(monthIndex => {
          const monthGroup = grouped[year][monthIndex];
          // Sort items by date descending
          monthGroup.items.sort((a, b) => new Date(b.date) - new Date(a.date));
          return monthGroup;
        });
      
      return { year, months };
    });

  return sortedArray;
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        News and Updates
      </h1>
      <!-- Controls: Search & Filter (Inline with Header) -->
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-lg mx-auto">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search..."
          color="gray"
          variant="outline"
          class="w-full"
          size="sm"
        />
        <div class="w-full sm:w-40">
          <USelectMenu
            v-model="selectedType"
            :options="filterTypes"
            value-attribute="value"
            option-attribute="label"
            color="gray"
            variant="outline"
            size="sm"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Timeline Content -->
    <div v-if="filteredGroupedNews.length === 0" class="text-center py-16">
      <p class="text-gray-500 dark:text-gray-400">No updates found.</p>
      <UButton 
        v-if="selectedType !== 'all' || searchQuery"
        variant="link" 
        color="sky" 
        class="mt-2"
        @click="{ selectedType = 'all'; searchQuery = ''; }"
      >
        Clear filters
      </UButton>
    </div>

    <div v-else class="space-y-12">
      <div v-for="group in filteredGroupedNews" :key="group.year" class="relative">
        
        <!-- Year Marker (Sticky) -->
        <div class="sticky top-4 z-10 mb-6">
          <span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-md text-sm font-bold shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
            {{ group.year }}
          </span>
        </div>

        <!-- Months List -->
        <div class="space-y-8 border-l border-gray-200 dark:border-gray-800 ml-4 pl-6 sm:ml-6 sm:pl-8">
          <div v-for="monthGroup in group.months" :key="monthGroup.name" class="relative">
            
            <!-- Month Label -->
            <h3 class="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-4 uppercase tracking-wide">
              {{ monthGroup.name }}
            </h3>

            <!-- Updates in Month -->
            <div class="space-y-6">
              <div
                v-for="(update, index) in monthGroup.items"
                :key="index"
                class="group relative"
              >
                <!-- Dot on Timeline -->
                <div class="absolute -left-[1.95rem] sm:-left-[2.45rem] top-1.5 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900 group-hover:bg-sky-500 transition-colors"></div>

                <!-- Content -->
                <div class="flex gap-4">
                  <!-- Date Number -->
                  <div class="flex-shrink-0 w-6 text-right">
                    <span class="text-sm font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                      {{ formatDay(update.date) }}
                    </span>
                  </div>

                  <div class="flex-1 pb-4 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                    <div class="flex items-baseline justify-between gap-4">
                      <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-sky-600 transition-colors">
                        <NuxtLink v-if="update.link && update.link !== '#'" :to="update.link" target="_blank" class="hover:underline">
                          {{ update.title }}
                        </NuxtLink>
                        <span v-else>{{ update.title }}</span>
                      </h4>
                      
                      <!-- Arrow Icon if Link exists -->
                      <NuxtLink 
                        v-if="update.link && update.link !== '#'"
                        :to="update.link"
                        target="_blank"
                        class="text-gray-400 hover:text-sky-500 transition-colors"
                      >
                        <UIcon name="i-heroicons-arrow-up-right" class="w-4 h-4" />
                      </NuxtLink>
                    </div>

                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {{ update.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>