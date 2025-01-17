<script setup>
  // Define props for achievements data
  const props = defineProps({
    achievements: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Achievements</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="achievement in achievements" :key="achievement.name" class="">
        <UCard
          class="bg-white dark:bg-gray-900/90 hover:bg-gray-50 dark:hover:bg-gray-800/90 transition-all duration-300 cursor-pointer group rounded-lg"
        >
          <div class="p-2 text-center rounded-lg">
            <!-- Achievement Icon/Image -->
            <nuxt-img
              :src="achievement.icon"
              :alt="achievement.name"
              class="w-15 h-15 object-cover mx-auto group-hover:scale-105 transition-transform duration-300 rounded-lg"
            />
            <!-- Achievement Details -->
            <div class="space-y-2 mt-2">
              <h3
                class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors text-ellipsis"
              >
                {{ achievement.name }}
              </h3>
              <div class="text-xs space-y-1">
                <p class="text-gray-500 dark:text-gray-400">
                  {{ achievement.place }}
                </p>
                <p class="text-gray-600 dark:text-gray-500 font-medium">
                  {{ achievement.date }}
                </p>
              </div>
              <!-- Gallery Indicator -->
              <div
                v-if="achievement.gallery?.length"
                class="flex justify-center gap-1 mt-2"
              >
                <div
                  v-for="(_, index) in achievement.gallery"
                  :key="index"
                  class="w-1 h-1 rounded-full bg-sky-500/50"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>
