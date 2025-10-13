<script setup>
const emit = defineEmits(['open-project']);

const { data: researchData } = await useAsyncData('research', () => queryContent('research').findOne());

const research = computed(() => researchData.value?.research || []);

// Lazy loading state
const displayCount = ref(6);
const itemsPerLoad = 3;

// Load more function
const loadMore = () => {
  displayCount.value += itemsPerLoad;
};

const getStatusColor = (status) => {
  const colors = {
    'Ongoing': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    'Review': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'Published': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'In Progress': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    'Completed': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
};

const getStatusText = (status) => {
  const statusMap = {
    'In Progress': 'Progress',
    'Ongoing': 'Ongoing',
    'Review': 'Review',
    'Published': 'Published',
    'Completed': 'Completed'
  };
  return statusMap[status] || status;
};

const handleProjectClick = (project) => {
  emit('open-project', project);
};

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('all');
const selectedDomain = ref('all');

// Display mode state
const displayMode = ref('list'); // 'list' or 'grid'

// Always show search bar
const showSearchBar = computed(() => true);

// Get unique domains from all research papers
const availableDomains = computed(() => {
  const domains = new Set();
  research.value.forEach(project => {
    if (project.topics) {
      project.topics.forEach(topic => domains.add(topic));
    }
  });
  return Array.from(domains).sort();
});

// Filter function for all projects
const filteredProjects = computed(() => {
  let filtered = research.value;

  // Apply search query filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(query) ||
      (project.contributors && project.contributors.some(c => c.toLowerCase().includes(query))) ||
      project.venue.toLowerCase().includes(query) ||
      (project.topics && project.topics.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Apply status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(project => project.status === selectedStatus.value);
  }

  // Apply domain filter
  if (selectedDomain.value !== 'all') {
    filtered = filtered.filter(project =>
      project.topics && project.topics.includes(selectedDomain.value)
    );
  }

  return filtered;
});

// Update displayed projects to use filtered results
const displayedProjects = computed(() =>
  filteredProjects.value.slice(0, displayCount.value)
);

// Update "has more" check to use filtered results
const hasMore = computed(() =>
  displayCount.value < filteredProjects.value.length
);

// Clear filters function
const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = 'all';
  selectedDomain.value = 'all';
};

// Grid view helper function for gradient colors
const getGradientColors = (topic) => {
  const topicGradients = {
    'Air Quality': { start: '#4DA0B0', end: '#3A7BD5' },
    'Remote Sensing': { start: '#3A7BD5', end: '#3A6073' },
    'Healthcare': { start: '#8E2DE2', end: '#4A00E0' },
    'Medical Imaging': { start: '#654ea3', end: '#eaafc8' },
    'AI': { start: '#3A1C71', end: '#D76D77' },
    'Machine Learning': { start: '#667eea', end: '#764ba2' },
    'Deep Learning': { start: '#f093fb', end: '#f5576c' },
    'Natural Language Processing': { start: '#4facfe', end: '#00f2fe' },
    'Computer Vision': { start: '#43e97b', end: '#38f9d7' },
    'Satellites Operations': { start: '#1A2980', end: '#26D0CE' },
    'Satellites Technology': { start: '#0f0c29', end: '#302b63' },
    'Space Policy': { start: '#000428', end: '#004e92' },
    'default': { start: '#0ea5e9', end: '#3b82f6' }
  };
  return topicGradients[topic] || topicGradients['default'];
};
</script>

<template>
  <div class="space-y-8">
    <!-- AppDivider -->
    <AppDivider />

    <!-- Search and Filter Bar (appears when more than 4 papers) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showSearchBar" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <Icon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search papers by title, author, venue, or topic..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="In Progress">Progress</option>
            <option value="Review">Review</option>
            <option value="Published">Published</option>
            <option value="Completed">Completed</option>
          </select>

          <!-- Domain Filter -->
          <select
            v-model="selectedDomain"
            class="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Domains</option>
            <option v-for="domain in availableDomains" :key="domain" :value="domain">
              {{ domain }}
            </option>
          </select>

          <!-- Display Mode Toggle -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="displayMode = 'list'"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-all duration-200 flex items-center gap-1',
                displayMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400'
              ]"
            >
              <Icon name="i-heroicons-list-bullet" class="w-4 h-4" />
              List
            </button>
            <button
              @click="displayMode = 'grid'"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-all duration-200 flex items-center gap-1',
                displayMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400'
              ]"
            >
              <Icon name="i-heroicons-squares-2x2" class="w-4 h-4" />
              Grid
            </button>
          </div>

          <!-- Clear Filters Button -->
          <button
            v-if="searchQuery || selectedStatus !== 'all' || selectedDomain !== 'all'"
            @click="clearFilters"
            class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 flex items-center gap-1"
          >
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
            Clear
          </button>
        </div>

        <!-- Results Count -->
        <div v-if="searchQuery || selectedStatus !== 'all' || selectedDomain !== 'all'" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Found {{ filteredProjects.length }} papers
        </div>
      </div>
    </Transition>

    <!-- All Research Projects Section -->
    <div v-if="filteredProjects.length > 0">
      <!-- List View -->
      <div v-if="displayMode === 'list'" class="space-y-4">
        <TransitionGroup name="paper" tag="div" class="space-y-4">
          <div
            v-for="project in displayedProjects"
            :key="project.title"
            @click="handleProjectClick(project)"
            class="cursor-pointer group relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex gap-8">
              <!-- Image Space -->
              <div class="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="project.cover"
                  :src="project.cover"
                  :alt="project.title"
                  class="w-full h-full object-cover rounded-lg"
                />
                <UIcon v-else name="i-heroicons-document-text" class="w-10 h-10 text-gray-400" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Title -->
                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 leading-tight mb-2">
                  {{ project.title }}
                </h4>

                <!-- Authors -->
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span class="font-medium">Baimam Boukar JJ</span><span v-if="project.contributors">, {{ project.contributors.join(', ') }}</span>
                </p>

                <!-- Venue -->
                <p class="text-sm text-gray-500 dark:text-gray-500 mb-3">
                  {{ project.venue }}
                </p>

                <!-- Topics + Status -->
                <div class="flex flex-wrap gap-1.5">
                  <UBadge
                    v-for="topic in project.topics"
                    :key="topic"
                    color="sky"
                    variant="soft"
                    size="xs"
                  >
                    {{ topic }}
                  </UBadge>
                  <!-- Status badge -->
                  <UBadge
                    :class="getStatusColor(project.status)"
                    variant="soft"
                    size="xs"
                  >
                    {{ getStatusText(project.status) }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransitionGroup name="paper" tag="div" class="contents">
          <div
            v-for="project in displayedProjects"
            :key="project.title"
            @click="handleProjectClick(project)"
            class="group rounded-lg border border-gray-200 dark:border-gray-800 hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-all duration-300"
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
                <!-- Venue -->
                <div class="mb-2">
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ project.venue }}
                  </p>
                </div>

                <!-- Title -->
                <h3 class="text-sm font-medium line-clamp-2 group-hover:text-sky-500 transition-colors mb-3">
                  {{ project.title }}
                </h3>

                <!-- Topics + Status -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <UBadge
                    v-for="topic in project.topics.slice(0, 3)"
                    :key="topic"
                    color="sky"
                    variant="soft"
                    size="xs"
                  >
                    {{ topic }}
                  </UBadge>
                  <!-- Status badge -->
                  <UBadge
                    :class="getStatusColor(project.status)"
                    variant="soft"
                    size="xs"
                  >
                    {{ getStatusText(project.status) }}
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
        </TransitionGroup>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center mt-6">
        <button
          @click="loadMore"
          class="inline-flex items-center px-4 py-2 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg transition-colors duration-200"
        >
          <Icon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          Load {{ Math.min(itemsPerLoad, filteredProjects.length - displayCount) }} More
        </button>
      </div>
    </div>


    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">
        {{ (searchQuery || selectedStatus !== 'all' || selectedDomain !== 'all') ? 'No papers match your filters.' : 'No research projects found.' }}
      </p>
      <button
        v-if="searchQuery || selectedStatus !== 'all' || selectedDomain !== 'all'"
        @click="clearFilters"
        class="mt-2 text-sm text-sky-600 dark:text-sky-400 hover:underline"
      >
        Clear filters to show all papers
      </button>
    </div>
  </div>
</template>

<style scoped>
.paper-enter-active,
.paper-leave-active {
  transition: all 0.3s ease;
}

.paper-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.paper-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.paper-move {
  transition: transform 0.3s ease;
}
</style>