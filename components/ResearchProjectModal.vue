<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  project: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

// Status color mapping
const getStatusColor = (status) => {
  const colors = {
    'Ongoing': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    'Under Review': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'Published': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'In Progress': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    'Completed': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
};

const getProjectAbstract = (project) => {
  return project.abstract || `This research investigates ${project.topics?.join(', ') || 'advanced topics'} to address critical challenges in the field. The study focuses on developing innovative methodologies and frameworks that can be applied to real-world scenarios.`;
};

// Get project links from data
const getProjectLinks = (project) => {
  const links = [];

  if (project.paper_link && project.paper_link !== '#') {
    links.push({
      label: 'Paper',
      icon: 'i-heroicons-document-text',
      url: project.paper_link,
      description: 'Read the full paper'
    });
  }

  if (project.links?.preprint) {
    links.push({
      label: 'Preprint',
      icon: 'i-simple-icons-arxiv',
      url: project.links.preprint,
      description: 'ArXiv preprint version'
    });
  }

  if (project.links?.code) {
    links.push({
      label: 'Code',
      icon: 'i-simple-icons-github',
      url: project.links.code,
      description: 'GitHub repository'
    });
  }

  if (project.links?.data) {
    links.push({
      label: 'Data',
      icon: 'i-heroicons-table-cells',
      url: project.links.data,
      description: 'Dataset and materials'
    });
  }

  if (project.links?.slides) {
    links.push({
      label: 'Slides',
      icon: 'i-heroicons-presentation-chart-line',
      url: project.links.slides,
      description: 'Presentation slides'
    });
  }

  return links;
};
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    fullscreen
    :ui="{
      container: 'flex flex-col h-screen',
      overlay: { background: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm' },
      base: 'h-screen max-h-none w-screen max-w-none m-0 rounded-none'
    }"
  >
    <div class="h-full flex flex-col bg-white dark:bg-gray-900">
      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Research Project</h2>
            <UBadge
              :class="getStatusColor(project.status)"
              variant="soft"
              size="sm"
            >
              {{ project.status }}
            </UBadge>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-6 py-8">
          <!-- Project Title -->
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {{ project.title }}
          </h1>

          <!-- Project Meta Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Authors -->
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Authors
              </h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <span class="text-sm font-semibold text-sky-600 dark:text-sky-400">BB</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-gray-100">Baimam Boukar JJ</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Carnegie Mellon University Africa</p>
                  </div>
                </div>
                <div
                  v-for="contributor in project.contributors"
                  :key="contributor"
                  class="flex items-center gap-3"
                >
                  <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {{ contributor.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-gray-100">{{ contributor }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Co-author</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Details -->
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Venue
                </h3>
                <p class="text-gray-900 dark:text-gray-100">{{ project.venue }}</p>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Supervision
                </h3>
                <p class="text-gray-900 dark:text-gray-100">{{ project.supervision }}</p>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Research Topics
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="topic in project.topics"
                    :key="topic"
                    color="sky"
                    variant="soft"
                    size="sm"
                  >
                    {{ topic }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Abstract -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Abstract</h3>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ getProjectAbstract(project) }}
              </p>
            </div>
          </div>

          <!-- Links and Resources -->
          <div v-if="getProjectLinks(project).length > 0" class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <a
                v-for="link in getProjectLinks(project)"
                :key="link.label"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-200"
              >
                <div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                  <UIcon :name="link.icon" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100 group-hover:text-sky-500 transition-colors">
                    {{ link.label }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ link.description }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <!-- Key Findings (Mock Section) -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Contributions</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0"></div>
                <p class="text-gray-700 dark:text-gray-300">
                  Novel methodology for analyzing {{ project.topics?.[0]?.toLowerCase() || 'the problem domain' }}
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0"></div>
                <p class="text-gray-700 dark:text-gray-300">
                  Comprehensive evaluation on real-world datasets
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0"></div>
                <p class="text-gray-700 dark:text-gray-300">
                  Open-source implementation and reproducible results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>