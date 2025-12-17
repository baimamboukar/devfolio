<script setup>
const domains = [
  {
    name: "Foundation Models",
    icon: "i-heroicons-cpu-chip",
    description: "Understanding LLM limitations and developing improvements."
  },
  {
    name: "AI for Space Systems",
    icon: "i-simple-icons-spacex",
    description: "Autonomous operations, mission planning, and anomaly detection for spacecraft."
  },
  {
    name: "Information Retrieval",
    icon: "i-heroicons-magnifying-glass",
    description: "Advanced retrieval architectures and long-context execution."
  },
  {
    name: "Geospatial AI",
    icon: "i-heroicons-globe-americas",
    description: "Deep learning for Earth observation, remote sensing, and environmental monitoring."
  }
];
</script>

<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Research Domains</h2>

    <div class="mb-6">
      <!-- <p class="mb-4 text-zinc-700 dark:text-zinc-300">
        My research focuses on <span class="subtle-highlight">understanding and improving Foundation Models</span> and their applications in high-impact domains:
      </p> -->

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="domain in domains"
          :key="domain.name"
          class="group relative overflow-hidden bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300"
        >
          <!-- Background Pattern (Unified Fading Grid) -->
          <div class="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] pointer-events-none">
            <div class="w-full h-full bg-grid-sky mask-radial-fade"></div>
          </div>

          <!-- Content -->
          <div class="relative p-4 flex items-center gap-4">
            <!-- Icon Circle -->
            <div class="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors flex-shrink-0 z-10">
              <UIcon :name="domain.icon" class="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>

            <!-- Text Content -->
            <div class="flex-1 min-w-0 z-10">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-sky-500 transition-colors">
                {{ domain.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ domain.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Square Grid Pattern */
.bg-grid-sky {
  background-image:
    linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(90deg, currentColor 1px, transparent 1px);
  background-size: 12px 12px; /* Smaller squares */
  color: rgb(14 165 233); /* Sky-500 */
}

/* Fading Mask: Opaque on Right -> Transparent on Left */
.mask-radial-fade {
  mask-image: linear-gradient(to left, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 0%, transparent 100%);
}
</style>
