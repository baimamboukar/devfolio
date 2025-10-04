<script setup>
const emit = defineEmits(['open-project']);

const { data: researchData } = await useAsyncData('research', () => queryContent('research').findOne());

const research = computed(() => researchData.value?.research || []);

const workingPapers = computed(() =>
  research.value.filter(project =>
    project.status === 'Ongoing' || project.status === 'In Progress' || project.status === 'Under Review'
  )
);

const conferenceProceedings = computed(() =>
  research.value.filter(project =>
    project.status === 'Published' || project.status === 'Completed'
  )
);

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

const handleProjectClick = (project) => {
  emit('open-project', project);
};
</script>

<template>
  <div class="space-y-8">
    <!-- Working Papers Section -->
    <div v-if="workingPapers.length > 0">
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Working Papers</h3>
      <div class="space-y-4">
        <div
          v-for="project in workingPapers"
          :key="project.title"
          @click="handleProjectClick(project)"
          class="cursor-pointer group relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex gap-8">
            <!-- Image Space - Larger -->
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
                <!-- Status badge with different color -->
                <UBadge
                  :class="getStatusColor(project.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ project.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conference Proceedings Section -->
    <div v-if="conferenceProceedings.length > 0">
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Conference Proceedings</h3>
      <div class="space-y-4">
        <div
          v-for="project in conferenceProceedings"
          :key="project.title"
          @click="handleProjectClick(project)"
          class="cursor-pointer group relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex gap-8">
            <!-- Image Space - Larger -->
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
                <!-- Status badge with different color -->
                <UBadge
                  :class="getStatusColor(project.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ project.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="workingPapers.length === 0 && conferenceProceedings.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">No research projects found.</p>
    </div>
  </div>
</template>