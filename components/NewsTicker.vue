<script setup>
import { format } from 'date-fns';

// Fetch the news document
const { data: newsDoc } = await useAsyncData('news-ticker', () =>
  queryContent('news').findOne()
);

// Process news items
const items = computed(() => {
  const updates = newsDoc.value?.updates || [];
  if (updates.length === 0) return [];

  // Sort by date descending and take top 5
  return [...updates]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const currentIndex = ref(0);
let intervalId = null;

const startInterval = () => {
  intervalId = setInterval(() => {
    if (items.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % items.value.length;
    }
  }, 5000);
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const setIndex = (index) => {
  currentIndex.value = index;
  // Reset timer on manual interaction
  if (intervalId) clearInterval(intervalId);
  startInterval();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM d, yyyy');
};
</script>

<template>
  <div v-if="items.length > 0" class="relative overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50 dark:from-zinc-800 dark:to-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 flex items-center justify-between gap-4">
    
    <!-- Label -->
    <div class="flex-shrink-0 flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 tracking-wider">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
      </span>
      Recent updates
    </div>

    <!-- Content Slider -->
    <div class="flex-1 min-w-0 flex items-center justify-between gap-4">
       <!-- Animated Text -->
       <div class="flex-1 min-w-0 relative h-6 overflow-hidden">
          <transition 
            enter-active-class="transition duration-300 ease-out absolute inset-0"
            enter-from-class="translate-y-full opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-300 ease-in absolute inset-0"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-full opacity-0"
          >
            <div :key="currentIndex" class="absolute inset-0 flex items-center w-full">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                 <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
                   {{ formatDate(items[currentIndex].date) }}
                 </span>
                 {{ items[currentIndex].title }}
              </p>
            </div>
          </transition>
       </div>

       <!-- Dot Indicators -->
       <div class="hidden sm:flex space-x-1 flex-shrink-0">
          <button
            v-for="(_, index) in items"
            :key="index"
            @click="setIndex(index)"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-sky-500 w-4' : 'bg-gray-300 dark:bg-gray-600 w-1.5 hover:bg-gray-400'"
            :aria-label="'Go to update ' + (index + 1)"
          />
       </div>
    </div>

    <!-- Action -->
    <NuxtLink 
      to="/news"
      class="flex-shrink-0 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
    >
      See All
    </NuxtLink>

  </div>
</template>