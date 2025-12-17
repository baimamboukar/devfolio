<script setup>
const props = defineProps({
  achievements: {
    type: Array,
    required: true,
  },
});

const expandedItem = ref(null);

const toggleExpanded = (index) => {
  expandedItem.value = expandedItem.value === index ? null : index;
};
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(achievement, index) in achievements"
      :key="index"
      class="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden transition-all duration-200"
      :class="expandedItem === index ? 'bg-gray-50 dark:bg-zinc-800/50' : ''"
    >
      <!-- Collapsed View -->
      <div
        @click="toggleExpanded(index)"
        class="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <!-- Achievement Image/Icon -->
        <div class="flex-shrink-0">
          <NuxtImg
            v-if="achievement.icon && (achievement.icon.startsWith('http') || achievement.icon.startsWith('/'))"
            :src="achievement.icon"
            :alt="achievement.title || achievement.name"
            width="48"
            height="48"
            format="webp"
            loading="lazy"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <NuxtImg
            v-else-if="achievement.image"
            :src="achievement.image"
            :alt="achievement.title || achievement.name"
            width="48"
            height="48"
            format="webp"
            loading="lazy"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div
            v-else-if="achievement.icon && !achievement.icon.startsWith('http') && !achievement.icon.startsWith('/')"
            class="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center"
          >
            <Icon :name="achievement.icon" class="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div
            v-else
            class="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center"
          >
            <Icon name="i-heroicons-trophy" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <!-- Title and Brief Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            {{ achievement.title || achievement.name }}
          </h4>
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span v-if="achievement.organization">{{ achievement.organization }}</span>
            <span v-if="achievement.place">{{ achievement.place }}</span>
            <span v-if="achievement.year || achievement.date" class="text-xs">{{ achievement.year || achievement.date }}</span>
          </div>
        </div>

        <!-- Expand/Collapse Icon -->
        <Icon
          name="heroicons:chevron-down-20-solid"
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="expandedItem === index ? 'rotate-180' : ''"
        />
      </div>

      <!-- Expanded Details -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="expandedItem === index" class="px-4 pb-4 ml-16">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {{ achievement.description }}
          </p>

          <!-- Additional Details -->
          <div v-if="achievement.details" class="space-y-2">
            <div v-for="(detail, idx) in achievement.details" :key="idx" class="flex items-start">
              <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ detail }}</span>
            </div>
          </div>

          <!-- Link if available -->
          <div v-if="achievement.link" class="mt-3">
            <a
              :href="achievement.link"
              target="_blank"
              class="inline-flex items-center text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
            >
              View Details
              <Icon name="i-heroicons-arrow-up-right" class="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>