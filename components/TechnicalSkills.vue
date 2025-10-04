<script setup>
const skillCategories = [
  {
    category: "Languages",
    icon: "i-heroicons-code-bracket",
    skills: [
      { name: "Python", level: 90 },
      { name: "Go", level: 85 },
      { name: "JavaScript", level: 80 },
      { name: "Dart/Flutter", level: 88 }
    ]
  },
  {
    category: "ML & Data",
    icon: "i-heroicons-cpu-chip",
    skills: [
      { name: "PyTorch", level: 92 },
      { name: "TensorFlow", level: 85 },
      { name: "Google Earth Engine", level: 88 },
      { name: "Pandas/NumPy", level: 95 }
    ]
  },
  {
    category: "Cloud & DevOps",
    icon: "i-heroicons-cloud",
    skills: [
      { name: "AWS", level: 90 },
      { name: "Docker", level: 85 },
      { name: "Kubernetes", level: 75 },
      { name: "GitHub Actions", level: 88 }
    ]
  }
];
</script>

<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Technical Skills</h2>

    <p class="mb-4 text-zinc-700 dark:text-zinc-300">
      Tools and technologies I use for research and development
    </p>

    <!-- Skills Hexagon/Network Style -->
    <div class="space-y-6">
      <div
        v-for="category in skillCategories"
        :key="category.category"
        class="relative"
      >
        <!-- Category Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <UIcon :name="category.icon" class="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            {{ category.category }}
          </h3>
        </div>

        <!-- Skills Network -->
        <div class="relative bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-200">
          <!-- Connection Lines Background -->
          <div class="absolute inset-0 overflow-hidden rounded-lg">
            <svg class="w-full h-full opacity-10">
              <defs>
                <pattern :id="`dots-${category.category}`" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="rgb(14 165 233)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" :fill="`url(#dots-${category.category})`" />
            </svg>
          </div>

          <!-- Skills Grid -->
          <div class="relative grid grid-cols-2 gap-3">
            <div
              v-for="skill in category.skills"
              :key="skill.name"
              class="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-200"
            >
              <!-- Skill Name -->
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {{ skill.name }}
              </span>

              <!-- Skill Level Indicator -->
              <div class="flex items-center gap-1">
                <div class="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${skill.level}%` }"
                  />
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-1 min-w-[2rem]">
                  {{ skill.level }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AWS Certification Badge -->
    <div class="mt-6 inline-flex items-center gap-3 px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg">
      <div class="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
        <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-white" />
      </div>
      <div>
        <span class="text-sm font-semibold text-sky-700 dark:text-sky-300">2x AWS Certified</span>
        <p class="text-xs text-sky-600 dark:text-sky-400">Cloud Practitioner & Solutions Architect</p>
      </div>
    </div>
  </section>
</template>