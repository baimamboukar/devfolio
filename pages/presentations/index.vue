<script setup>
  definePageMeta({
    title: "Presentations",
    description: "Discover my different talks and interventions at Tech events",
  });

  // Fetch all presentations from YAML
  const { pending, data: presentationsData } = await useLazyAsyncData(
    "talks-yaml",
    () => queryContent("presentations").findOne()
  );

  // Sort by date descending
  const allPresentations = computed(() => {
    const list = presentationsData.value?.presentations || [];
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Search and Filter state
  const searchQuery = ref('');
  const selectedEvent = ref('all'); // previously community
  const selectedType = ref('all');  // previously category

  // Extract unique events and types
  const availableEvents = computed(() => {
    if (!allPresentations.value) return [];
    const events = new Set();
    allPresentations.value.forEach(p => {
      if (p.event) events.add(p.event);
    });
    return Array.from(events).sort();
  });

  const availableTypes = computed(() => {
    if (!allPresentations.value) return [];
    const types = new Set();
    allPresentations.value.forEach(p => {
      if (p.type) types.add(p.type);
    });
    return Array.from(types).sort();
  });

  // Filtered presentations
  const filteredPresentations = computed(() => {
    if (!allPresentations.value) return [];

    let filtered = allPresentations.value;

    // Search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.event.toLowerCase().includes(query)
      );
    }

    // Event filter
    if (selectedEvent.value !== 'all') {
      filtered = filtered.filter(p => p.event === selectedEvent.value);
    }

    // Type filter
    if (selectedType.value !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType.value);
    }

    return filtered;
  });

  // Pagination state
  const initialLoadCount = 6;
  const loadMoreCount = 6;
  const displayedCount = ref(initialLoadCount);

  // Reset displayed count when filters change
  watch([searchQuery, selectedEvent, selectedType], () => {
    displayedCount.value = initialLoadCount;
  });

  // Computed for displayed presentations
  const displayedPresentations = computed(() => {
    return filteredPresentations.value.slice(0, displayedCount.value);
  });

  // Check if there are more presentations to load
  const hasMorePresentations = computed(() => {
    return displayedCount.value < filteredPresentations.value.length;
  });

  // Remaining presentations count
  const remainingPresentationsCount = computed(() => {
    return filteredPresentations.value.length - displayedCount.value;
  });

  // Load more function
  const loadMore = () => {
    displayedCount.value += loadMoreCount;
  };

  // Reset filters
  const resetFilters = () => {
    searchQuery.value = '';
    selectedEvent.value = 'all';
    selectedType.value = 'all';
  };

  // Group presentations by year for dividers
  const presentationsWithDividers = computed(() => {
    const presentations = displayedPresentations.value;
    const result = [];
    let currentYear = null;

    presentations.forEach((presentation, index) => {
      const year = new Date(presentation.date).getFullYear();

      // Add year divider if it's a new year
      if (currentYear !== year) {
        if (index > 0) {
          result.push({ type: 'divider', year: currentYear });
        }
        currentYear = year;
      }

      result.push({ type: 'presentation', data: presentation });
    });

    return result;
  });
</script>

<!-- Projects Page -->
<template>
  <article>
    <h1 class="mb-4 text-3xl font-bold text-left">Presentations</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      I love sharing what I know with a broad and diverse audience at tech
      events.
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
            placeholder="Search presentations..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <!-- Community Filter -->
        <div class="min-w-48">
          <select
            v-model="selectedEvent"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Communities</option>
            <option v-for="event in availableEvents" :key="event" :value="event">
              {{ event }}
            </option>
          </select>
        </div>

        <!-- Category Filter -->
        <div class="min-w-48">
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Reset Button -->
        <button
          v-if="searchQuery || selectedEvent !== 'all' || selectedType !== 'all'"
          @click="resetFilters"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
    <!-- Presentations with Year Dividers -->
    <div class="mb-6">
      <template v-if="pending">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-auto gap-y-10">
          <app-project-skeleton
            v-for="skeletonId in generateKeys(6)"
            :key="skeletonId"
          />
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-auto gap-y-10">
          <template v-for="item in presentationsWithDividers" :key="item.type === 'divider' ? `divider-${item.year}` : item.data.title">
            <!-- Year Divider -->
            <div v-if="item.type === 'divider'" class="col-span-full">
              <app-divider class="my-8" />
            </div>

            <!-- Presentation Card -->
            <app-presentation-card
              v-else
              :cover="item.data.cover"
              :icon="item.data.type"
              :presentation-title="item.data.title"
              :presentation-community="item.data.event"
              :presentation-date="item.data.date"
              :presentation-url="item.data.slides || item.data.video || '#'"
            />
          </template>
        </div>
      </template>
    </div>

    <!-- Load More Button -->
    <div v-if="!pending && hasMorePresentations" class="text-center mt-6">
      <button
        @click="loadMore"
        class="inline-flex items-center px-4 py-2 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg transition-colors duration-200"
      >
        <Icon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Load {{ Math.min(remainingPresentationsCount, loadMoreCount) }} More
      </button>
    </div>

    <!-- No Results Message -->
    <div v-if="!pending && filteredPresentations.length === 0" class="text-center py-12">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No presentations found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
      <button
        v-if="searchQuery || selectedEvent !== 'all' || selectedType !== 'all'"
        @click="resetFilters"
        class="inline-flex items-center px-4 py-2 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg transition-colors duration-200"
      >
        Clear Filters
      </button>
    </div>
  </article>
</template>