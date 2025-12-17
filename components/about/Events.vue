<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  conferences: {
    type: Array,
    default: () => []
  },
  hackathons: {
    type: Array,
    default: () => []
  }
});

// Merge and sort events
const allEvents = computed(() => {
  const confs = props.conferences.map(c => ({ ...c, type: 'Conference', color: 'blue' }));
  const hacks = props.hackathons.map(h => ({ ...h, type: 'Hackathon', color: 'green' }));
  
  // Combine
  return [...confs, ...hacks].sort((a, b) => {
    // Simple date string comparison (assuming 'Month Year' format, this is rough sorting)
    // For better sorting, we'd need to parse dates. 
    // Given the display requirement, we'll just interleave or list them.
    // Let's list conferences then hackathons or just keep them as provided order if combined.
    // Actually, let's just return them combined.
    return 0; 
  });
});

// Gallery State
const isGalleryOpen = ref(false);
const selectedEvent = ref(null);

const openGallery = (event) => {
  selectedEvent.value = event;
  isGalleryOpen.value = true;
};
</script>

<template>
  <section class="mb-12">
    <!-- Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="event in allEvents" 
        :key="event.name + event.date" 
        class="group relative h-full cursor-pointer"
        @click="openGallery(event)"
      >
        <div class="h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
          
          <!-- Card Content -->
          <div class="p-6 flex flex-col h-full relative z-10">
            <!-- Header: Icon + Meta -->
            <div class="flex items-start gap-4 mb-3">
              <!-- Icon/Logo -->
              <div class="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-50 dark:bg-zinc-800 p-2 border border-gray-100 dark:border-zinc-700">
                <NuxtImg 
                  :src="event.icon" 
                  :alt="event.name"
                  width="64"
                  height="64"
                  format="webp"
                  loading="lazy"
                  class="w-full h-full object-contain rounded-md"
                />
              </div>
              
              <!-- Title & Date -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {{ event.name }}
                </h3>
                <div class="mt-1 flex flex-col text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ event.place }}</span>
                  <span>{{ event.date }}</span>
                </div>
              </div>
            </div>

            <!-- Description (if available) or Organizer -->
            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
              <p v-if="event.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ event.description }}
              </p>
              <p v-else-if="event.by" class="text-sm text-gray-600 dark:text-gray-400">
                Organized by <span class="font-medium">{{ event.by }}</span>
              </p>
            </div>
          </div>

          <!-- Hover Overlay & Action -->
          <div class="absolute inset-0 bg-gray-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
            <UButton
              color="sky"
              variant="ghost"
              class="shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:no-underline"
              @click.stop="openGallery(event)"
            >
              View Gallery
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Modal -->
    <AppGallery
      v-if="selectedEvent"
      v-model="isGalleryOpen"
      :title="selectedEvent.name"
      :description="`${selectedEvent.place} • ${selectedEvent.date}`"
      :highlight-image="selectedEvent.highlightImage || selectedEvent.icon"
      :images="selectedEvent.images || (selectedEvent.gallery ? selectedEvent.gallery : [])"
    />
  </section>
</template>
