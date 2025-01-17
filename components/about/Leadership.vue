<script setup>
  // Define props for leadership data
  const props = defineProps({
    leadership: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-xl font-bold mb-6">Leadership</h2>
    <div class="space-y-6">
      <div
        v-for="(leader, index) in leadership"
        :key="leader.role"
        class="relative"
      >
        <!-- Dashed line connector -->
        <!-- <div
          v-if="index !== leadership.length - 1"
          class="absolute left-6 top-12 bottom-0 w-0.9 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
        /> -->
        <!-- Leadership Item -->
        <div class="flex items-center gap-4">
          <nuxt-img
            :src="leader.icon"
            :alt="leader.role"
            class="rounded-lg bg-white dark:bg-gray-800 p-1 h-12 w-12"
          />
          <div class="flex-1">
            <p class="text-lg">{{ leader.role }}</p>
            <p class="text-base text-gray-600 dark:text-gray-400">
              ICT University, Yaounde •●• {{leader.period}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
