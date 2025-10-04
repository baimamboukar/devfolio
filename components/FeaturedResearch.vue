<script setup>
const selectedProject = ref(null);
const isModalOpen = ref(false);

const { data: researchData } = await useAsyncData('research', () => queryContent('research').findOne());

const featuredResearch = computed(() =>
  (researchData.value?.research || []).filter(project => project.featured === true)
);

const statusColors = {
  'Ongoing': 'text-yellow-500',
  'Published': 'text-green-500',
  'Review': 'text-sky-500',
  'Completed': 'text-purple-500',
  'In Progress': 'text-orange-500'
};

const getGradientColors = (topic) => {
  const topicGradients = {
    'Air Quality': { start: '#4DA0B0', end: '#3A7BD5' },
    'Remote Sensing': { start: '#3A7BD5', end: '#3A6073' },
    'Healthcare': { start: '#8E2DE2', end: '#4A00E0' },
    'Medical Imaging': { start: '#654ea3', end: '#eaafc8' },
    'AI': { start: '#3A1C71', end: '#D76D77' },
    'Satellites Operations': { start: '#1A2980', end: '#26D0CE' },
    'Satellites Technology': { start: '#0f0c29', end: '#302b63' },
    'Space Policy': { start: '#000428', end: '#004e92' },
    'default': { start: '#3A1C71', end: '#FFAF7B' }
  };
  return topicGradients[topic] || topicGradients['default'];
};

const handleProjectClick = (project) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};
</script>

<template>
  <section class="mt-8">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Featured Research</h2>

      <UButton
        color="sky"
        variant="ghost"
        size="xs"
        to="/research"
      >
        View All
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right" />
        </template>
      </UButton>
    </div>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      Highlights from my research portfolio spanning remote sensing, AI for healthcare, and space systems.
    </p>

    <!-- Featured Research Grid using Research.vue structure -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in featuredResearch"
        :key="project.title"
        @click="handleProjectClick(project)"
        class="group rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all duration-300"
      >
        <div class="h-full flex flex-col">
          <!-- Gradient Background -->
          <div
            class="h-32 overflow-hidden rounded-t-lg relative flex items-center justify-center transition-all duration-300 group-hover:opacity-90"
            :style="{
              background: `linear-gradient(135deg, ${getGradientColors(project.topics[0]).start} 0%, ${getGradientColors(project.topics[0]).end} 100%)`
            }"
          >
            <div class="absolute inset-0 bg-black bg-opacity-10"></div>
            <div class="text-white text-opacity-20 font-light text-sm p-2 text-center">
              {{ project.title }}
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <!-- Venue and Status -->
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[70%]">
                {{ project.venue }}
              </p>
              <span :class="statusColors[project.status]" class="text-xs font-medium ml-4">
                {{ project.status }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-sm font-medium line-clamp-2 group-hover:text-sky-500 transition-colors mb-3">
              {{ project.title }}
            </h3>

            <!-- Topics -->
            <div class="flex flex-wrap gap-1 mb-4">
              <UBadge
                v-for="topic in project.topics.slice(0, 3)"
                :key="topic"
                color="gray"
                variant="soft"
                size="xs"
              >
                {{ topic }}
              </UBadge>
            </div>

            <!-- Co-authored with -->
            <div class="mt-auto">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Co-authored with {{ project.contributors?.join(', ') || 'team members' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <ResearchProjectModal
      v-model="isModalOpen"
      :project="selectedProject || {}"
    />
  </section>
</template>