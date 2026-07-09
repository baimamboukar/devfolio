<script setup>
const domains = [
  {
    name: "Mechanistic Interpretability",
    icon: "i-ph-microscope",
    description: "Understanding internal model representations, and studying why interpretability methods often fail to generalize."
  },
  {
    name: "Deceptive Alignment and Situational Awareness",
    icon: "i-heroicons-eye",
    description: "Detecting and analyzing deception, misalignment, and emergent behaviors inside large language models."
  },
  {
    name: "White-box Control",
    icon: "i-heroicons-adjustments-horizontal",
    description: "Building reliable activation-level tools — probes, steering, and patching — to monitor and control model behavior."
  },
  {
    name: "Science of Evals",
    icon: "i-heroicons-beaker",
    description: "Evaluation methodologies for emergent capabilities in LLMs, with norm-matched controls."
  }
];
</script>

<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Research Focus</h2>

    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="domain in domains"
          :key="domain.name"
          class="group relative overflow-hidden bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 cursor-pointer"
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
  color: rgb(var(--primary-500)); /* follows tweak-panel primary */
}

/* Fading Mask: Opaque on Right -> Transparent on Left */
.mask-radial-fade {
  mask-image: linear-gradient(to left, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 0%, transparent 100%);
}
</style>
