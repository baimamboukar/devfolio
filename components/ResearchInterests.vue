<script setup>
const primaryInterests = [
  {
    name: "Foundation Models",
    icon: "i-heroicons-cpu-chip",
    description: "Understanding LLM limitations and developing improvements for information retrieval",
    pattern: "dots"
  },
  {
    name: "Information Retrieval",
    icon: "i-heroicons-magnifying-glass",
    description: "Novel retrieval methods using anomalous pattern detection in vector databases",
    pattern: "grid"
  },
  {
    name: "Earth Observation",
    icon: "i-heroicons-globe-americas",
    description: "ML applications for environmental monitoring and climate research",
    pattern: "waves"
  },
  {
    name: "Brain-Computer Interfaces",
    icon: "i-heroicons-bolt",
    description: "Zero-shot neural priors for cross-subject EEG decoding",
    pattern: "lines"
  }
];

const secondaryInterests = [
  { name: "Healthcare AI", icon: "i-heroicons-heart" },
  { name: "Space Systems", icon: "i-heroicons-rocket-launch" },
  { name: "Computational Psychiatry", icon: "i-heroicons-brain" },
  { name: "Computer Vision", icon: "i-heroicons-camera" },
  { name: "Anomaly Detection", icon: "i-heroicons-exclamation-triangle" }
];
</script>

<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Research Interests</h2>

    <!-- Primary Research Areas - Visual Cards -->
    <div class="mb-6">
      <p class="mb-4 text-zinc-700 dark:text-zinc-300">
        My research focuses on <span class="subtle-highlight">understanding and improving Foundation Models</span> and their applications:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="interest in primaryInterests"
          :key="interest.name"
          class="group relative overflow-hidden bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-5">
            <!-- Dots Pattern -->
            <div v-if="interest.pattern === 'dots'" class="w-full h-full bg-dots-sky"></div>
            <!-- Grid Pattern -->
            <div v-else-if="interest.pattern === 'grid'" class="w-full h-full bg-grid-sky"></div>
            <!-- Waves Pattern -->
            <div v-else-if="interest.pattern === 'waves'" class="w-full h-full bg-waves-sky"></div>
            <!-- Lines Pattern -->
            <div v-else-if="interest.pattern === 'lines'" class="w-full h-full bg-lines-sky"></div>
          </div>

          <!-- Content -->
          <div class="relative p-4 flex items-center gap-4">
            <!-- Icon Circle -->
            <div class="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors flex-shrink-0">
              <UIcon :name="interest.icon" class="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>

            <!-- Text Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-sky-500 transition-colors">
                {{ interest.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ interest.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Research Areas - Pills (Keep this design) -->
    <div>
      <p class="mb-3 text-zinc-700 dark:text-zinc-300">
        Also exploring applications in:
      </p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="interest in secondaryInterests"
          :key="interest.name"
          class="group inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-sm hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <UIcon :name="interest.icon" class="w-3 h-3" />
          <span>{{ interest.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* CSS Pattern Backgrounds */
.bg-dots-sky {
  background-image: radial-gradient(circle, rgb(14 165 233) 1px, transparent 1px);
  background-size: 15px 15px;
}

.bg-grid-sky {
  background-image:
    linear-gradient(rgb(14 165 233) 1px, transparent 1px),
    linear-gradient(90deg, rgb(14 165 233) 1px, transparent 1px);
  background-size: 15px 15px;
}

.bg-waves-sky {
  background-image: repeating-linear-gradient(
    45deg,
    rgb(14 165 233),
    rgb(14 165 233) 1px,
    transparent 1px,
    transparent 15px
  );
}

.bg-lines-sky {
  background-image: repeating-linear-gradient(
    0deg,
    rgb(14 165 233),
    rgb(14 165 233) 1px,
    transparent 1px,
    transparent 8px
  );
}
</style>