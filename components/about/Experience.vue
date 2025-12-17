<script setup>
import { ref } from 'vue';

// Define props for experience data
const props = defineProps({
  experience: {
    type: Array,
    required: true
  }
});

// Modal state
const isModalOpen = ref(false);
const selectedExperience = ref(null);

const openModal = (exp) => {
  selectedExperience.value = exp;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedExperience.value = null;
};

// Extract skills from responsibilities (basic detection)
const extractSkills = (responsibilities) => {
  if (!responsibilities) return [];

  const skillKeywords = [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Flutter', 'Dart',
    'AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD', 'REST APIs', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'Machine Learning', 'AI', 'Data Science', 'Mobile Development', 'iOS', 'Android', 'Backend', 'Frontend',
    'DevOps', 'Cloud Computing', 'Microservices', 'API', 'Database', 'Git', 'Agile', 'Scrum'
  ];

  const skills = new Set();
  const text = responsibilities.join(' ');

  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  });

  return Array.from(skills).slice(0, 6); // Limit to 6 skills
};
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Professional Experience</h2>

    <div class="relative">
      <!-- Modern Fading Timeline -->
      <div class="absolute left-4 top-0 bottom-0 w-px">
        <!-- Base fading line -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:from-transparent dark:via-zinc-600 dark:to-transparent opacity-60" />
        <!-- Accent fading line -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400 to-transparent dark:from-transparent dark:via-sky-500 dark:to-transparent opacity-40" />
      </div>

      <!-- Experience Items -->
      <div class="space-y-8">
        <div
          v-for="(exp, index) in experience"
          :key="index"
          class="relative group"
        >
          <!-- Timeline Node -->
          <div class="absolute left-2.5 w-3 h-3 z-10 transition-all duration-300 group-hover:scale-125">
            <div class="w-full h-full bg-sky-500 dark:bg-sky-400 rounded-full shadow-lg" />
            <!-- Glow effect - only on first item (most recent) -->
            <div v-if="index === 0" class="absolute inset-0 bg-sky-400 dark:bg-sky-300 rounded-full animate-ping opacity-30" />
          </div>

          <!-- Content Card -->
          <div class="ml-12 transform transition-all duration-300 hover:translate-x-1">
            <div class="relative bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

              <!-- Background Pattern - Adjusted -->
              <div class="absolute inset-y-0 right-0 w-[40%] opacity-[0.46] dark:opacity-[0.3] pointer-events-none   z-0">
                <div
                  class="absolute inset-0"
                  style="
                    background-color: transparent;
                    background-image:
                      linear-gradient(90deg, transparent 31px, #0ea5e9 31px, #0ea5e9 33px, transparent 33px),
                      linear-gradient(0deg, transparent 31px, #0ea5e9 31px, #0ea5e9 33px, transparent 33px);
                    background-size: 32px 32px;
                    mask-image: linear-gradient(270deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 70%, transparent 100%);
                    -webkit-mask-image: linear-gradient(270deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 70%, transparent 100%);
                  "
                />
              </div>

              <!-- Header -->
              <div class="relative z-10 p-6 pb-4">
                <div class="flex items-stretch gap-6 min-h-[120px]">
                  <!-- Company Logo - Much Bigger -->
                  <div class="relative group/logo flex-shrink-0 flex items-center">
                    <div class="w-28 h-28 rounded-xl bg-white dark:bg-zinc-800 shadow-sm group-hover/logo:shadow-md transition-all duration-300 overflow-hidden">
                      <NuxtImg
                        :src="exp.icon"
                        :alt="exp.company"
                        width="112"
                        height="112"
                        format="webp"
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover/logo:scale-105"
                      />
                    </div>
                    <!-- Subtle glow effect on logo hover -->
                    <div class="absolute inset-0 bg-sky-400/10 dark:bg-sky-500/10 blur-lg rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  <!-- Job Details -->
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {{ exp.title }}
                    </h3>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {{ exp.company }}
                    </p>

                    <!-- Location and Period - Same Line -->
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span class="font-medium">{{ exp.location }}</span>
                      <span class="mx-2">・</span>
                      <span>{{ exp.period }}</span>
                    </div>

                    <!-- Skills/Tech Stack - Use tags if available, otherwise extract from responsibilities -->
                    <div v-if="exp.tags?.length > 0 || extractSkills(exp.responsibilities).length > 0" class="mt-auto">
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="tag in (exp.tags || extractSkills(exp.responsibilities))"
                          :key="tag"
                          class="px-2 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- View Details Button -->
                <button
                  v-if="exp.responsibilities && exp.responsibilities.length > 0"
                  @click="openModal(exp)"
                  class="w-full mt-4 p-3 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 group/btn"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      View Details
                    </span>
                    <Icon
                      name="i-heroicons-arrow-top-right-on-square"
                      class="w-4 h-4 text-gray-500 transition-transform duration-200 group-hover/btn:text-sky-500"
                    />
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="closeModal"
        >
          <div class="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
            <!-- Modal Header -->
            <div class="sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-700 p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- Company Logo -->
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 p-3 shadow-sm">
                    <NuxtImg
                      :src="selectedExperience?.icon"
                      :alt="selectedExperience?.company"
                      width="64"
                      height="64"
                      format="webp"
                      loading="lazy"
                      class="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  <!-- Title and Company -->
                  <div>
                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {{ selectedExperience?.title }}
                    </h2>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {{ selectedExperience?.company }}
                    </p>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span class="font-medium">{{ selectedExperience?.location }}</span>
                      <span class="mx-2">・</span>
                      <span>{{ selectedExperience?.period }}</span>
                    </div>
                  </div>
                </div>

                <!-- Close Button -->
                <button
                  @click="closeModal"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Icon name="i-heroicons-x-mark" class="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <!-- Skills/Tech Stack - Use tags if available, otherwise extract from responsibilities -->
              <div v-if="selectedExperience?.tags?.length > 0 || extractSkills(selectedExperience?.responsibilities).length > 0" class="mt-4">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in (selectedExperience?.tags || extractSkills(selectedExperience?.responsibilities))"
                    :key="tag"
                    class="px-3 py-1 text-sm font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Responsibilities and Achievements
              </h3>

              <div class="space-y-4">
                <div
                  v-for="(resp, rIndex) in selectedExperience?.responsibilities"
                  :key="rIndex"
                  class="flex gap-4 items-start group"
                >
                  <div class="w-2 h-2 rounded-full bg-sky-500 mt-3 flex-shrink-0 transition-all duration-200 group-hover:scale-125" />
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{{ resp }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .ml-12 {
    margin-left: 2.5rem;
  }

  .left-4 {
    left: 0.75rem;
  }

  .left-2 {
    left: 0.375rem;
  }

  /* Smaller logos on mobile */
  .w-28 {
    width: 5rem;
  }

  .h-28 {
    height: 5rem;
  }
}
</style>