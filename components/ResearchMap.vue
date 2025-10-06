<script setup>
// Define props to control display options
const props = defineProps({
  showExploringApplications: {
    type: Boolean,
    default: false
  }
});

const selectedDomain = ref(null);

const researchDomains = [
  {
    id: 'ml',
    title: 'Machine Learning',
    icon: 'heroicons:cpu-chip-20-solid',
    topics: ['Information Retrieval', 'Large Language Models', 'Efficient Deep Learning'],
    description: 'Advancing core ML techniques for scalable and efficient AI systems',
    gradient: 'bg-gradient-to-br from-sky-400 to-blue-500'
  },
  {
    id: 'neuro',
    title: 'AI for Neuroscience',
    icon: 'fa6-solid:brain',
    topics: ['Neural Signal Processing', 'Brain-Computer Interfaces', 'Cognitive Modeling'],
    description: 'Applying AI to understand and interface with neural systems',
    gradient: 'bg-gradient-to-br from-purple-400 to-indigo-500'
  },
  {
    id: 'space',
    title: 'AI for Space Systems & EO',
    icon: 'fa6-solid:satellite',
    topics: ['Spacecraft Telemetry', 'Anomaly Detection', 'Satellite Operations', 'Remote Sensing', 'Climate Monitoring', 'Socioeconomic Assessment'],
    description: 'Machine learning for spacecraft monitoring and Earth observation applications',
    gradient: 'bg-gradient-to-br from-indigo-400 to-blue-600'
  }
];

const handleDomainClick = (domain) => {
  selectedDomain.value = selectedDomain.value?.id === domain.id ? null : domain;
};
</script>

<template>
  <section class="mt-8">
    <h2 class="mb-4 text-xl font-semibold">Research Focus</h2>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      Exploring the intersection of machine learning theory and applied AI across multiple domains.
    </p>

    <!-- Minimal List Design -->
    <div class="space-y-3">
      <div
        v-for="domain in researchDomains"
        :key="domain.id"
        class="group"
      >
        <!-- Main Row -->
        <div
          @click="handleDomainClick(domain)"
          class="flex items-center cursor-pointer py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30">
            <Icon :name="domain.icon" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>

          <!-- Title & Description -->
          <div class="flex-1 ml-4">
            <h3 class="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              {{ domain.title }}
            </h3>
            <p class="text-sm text-zinc-600 dark:text-zinc-400">
              {{ domain.description }}
            </p>
          </div>

          <!-- Chevron -->
          <Icon
            name="heroicons:chevron-down-20-solid"
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="selectedDomain?.id === domain.id ? 'rotate-180 text-sky-500' : ''"
          />
        </div>

        <!-- Expanded Content -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="selectedDomain?.id === domain.id" class="ml-14 mb-3 mt-1">
            <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              {{ domain.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="topic in domain.topics"
                :key="topic"
                class="inline-flex items-center text-xs px-2.5 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-full"
              >
                {{ topic }}
              </span>
            </div>
          </div>
        </Transition>

        <!-- Divider -->
        <div v-if="domain.id !== researchDomains[researchDomains.length - 1].id" class="border-b border-gray-100 dark:border-zinc-800"></div>
      </div>
    </div>

    <!-- Also Exploring Applications (optional) -->
    <div v-if="showExploringApplications" class="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
      <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Also exploring applications in:</h3>
      <div class="flex flex-wrap gap-3">
        <div class="flex items-center text-sm px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
          <Icon name="heroicons:heart-20-solid" class="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          Healthcare Accessibility
        </div>
        <div class="flex items-center text-sm px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
          <Icon name="heroicons:beaker-20-solid" class="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          Scientific Computing
        </div>
        <div class="flex items-center text-sm px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
          <Icon name="heroicons:cog-6-tooth-20-solid" class="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
          Autonomous Systems
        </div>
      </div>
    </div>
  </section>
</template>