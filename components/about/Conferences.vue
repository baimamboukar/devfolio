<script setup>
  // Define props for conferences data
  const props = defineProps({
    conferences: {
      type: Array,
      required: true
    }
  });

  // State for modal control
  const isGalleryOpen = ref(false);
  const selectedConference = ref(null);

  // Handle view details click
  const openGallery = (conference) => {
    selectedConference.value = conference;
    isGalleryOpen.value = true;
  };
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Conferences</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="conf in conferences" :key="conf.name" class="relative group">
        <UCard
          class="overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 hover:from-blue-100 hover:to-gray-50 dark:hover:from-blue-900 dark:hover:to-gray-900 transition-all duration-300"
        >
          <!-- Top Section -->
          <div class="flex flex-col h-full">
            <!-- Logo and Main Content -->
            <div class="flex gap-4">
              <nuxt-img
                :src="conf.icon"
                :alt="conf.name"
                class="w-24 h-24 object-contain mb-4 mx-auto group-hover:scale-105 transition-transform duration-300 rounded-lg"
              />
              <div class="flex-1">
                <h3
                  class="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                >
                  {{ conf.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ conf.place }}, {{ conf.country }}
                </p>
                <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  {{ conf.date }}
                </p>
              </div>
            </div>
            <!-- Role -->
            <div class="mt-auto">
              <UChip
                label="Attendee"
                color="primary"
                variant="solid"
                class="text-lg"
              />
            </div>
          </div>
          <!-- Hover Overlay -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <UButton
              color="white"
              variant="ghost"
              size="sm"
              @click="openGallery(conf)"
            >
              View Details
            </UButton>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Gallery Modal -->
    <AppGallery
      v-if="selectedConference"
      v-model="isGalleryOpen"
      :title="selectedConference.name"
      :description="`${selectedConference.place}, ${selectedConference.country} - ${selectedConference.date}`"
      :highlight-image="selectedConference.highlightImage"
      :images="selectedConference.images"
    />
  </section>
</template>
