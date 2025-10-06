<script setup>
// Define props for leadership data
const props = defineProps({
  leadership: {
    type: Array,
    required: true
  }
});

// Mock volunteering data - you can move this to about.yaml later
const volunteering = [
  {
    role: "Reviewer",
    organization: "Journal of Geophysical Research (JGR)",
    type: "Machine Learning and Code Review",
    period: "2024-Present",
    description: "Reviewing machine learning research papers and code implementations"
  }
  // Add more volunteering experiences here
];
</script>

<template>
  <section class="mb-12">
    <div class="space-y-6">
      <!-- Leadership Section -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Leadership Roles</h3>
        <div class="space-y-3">
          <div
            v-for="leader in leadership"
            :key="leader.role"
            class="flex items-center gap-3 py-2"
          >
            <img
              :src="leader.icon"
              :alt="leader.role"
              class="rounded-lg bg-white dark:bg-gray-800 p-1 h-10 w-10 object-contain shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {{ leader.role }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ leader.community }} • {{ leader.period }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- AppDivider -->
      <AppDivider />

      <!-- Volunteering & Service Section -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Volunteering & Service</h3>
        <div class="space-y-3">
          <div
            v-for="volunteer in volunteering"
            :key="volunteer.role + volunteer.organization"
            class="flex items-start gap-3 py-2"
          >
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon name="i-heroicons-academic-cap" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ volunteer.role }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {{ volunteer.organization }}
              </p>
              <p class="text-xs text-sky-600 dark:text-sky-400 mb-1">
                {{ volunteer.type }} • {{ volunteer.period }}
              </p>
              <p v-if="volunteer.description" class="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                {{ volunteer.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>