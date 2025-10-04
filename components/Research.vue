<script setup>
  const { data: researchData, pending } = await useAsyncData('research', () =>
    queryContent('research').findOne()
  );

  const statusColors = {
    'Ongoing': 'text-yellow-500',
    'Published': 'text-green-500',
    'Review': 'text-sky-500',
    'Completed': 'text-purple-500',
    'In Progress': 'text-orange-500'
  };

  // Function to generate consistent gradient colors based on topic
  const getGradientColors = (topic) => {
    // Map of predefined gradients by topic category
    const topicGradients = {
      // Air Quality & Environment related
      'Air Quality': { start: '#4DA0B0', end: '#3A7BD5' },
      'Remote Sensing': { start: '#3A7BD5', end: '#3A6073' },
      'Environment': { start: '#11998e', end: '#38ef7d' },

      // Healthcare related
      'Healthcare': { start: '#8E2DE2', end: '#4A00E0' },
      'Medical Imaging': { start: '#654ea3', end: '#eaafc8' },
      'AI': { start: '#3A1C71', end: '#D76D77' },

      // Space & Satellites related
      'Satellites Operations': { start: '#1A2980', end: '#26D0CE' },
      'Satellites Technology': { start: '#0f0c29', end: '#302b63' },
      'Space Policy': { start: '#000428', end: '#004e92' },
      'Aviation': { start: '#2c3e50', end: '#4ca1af' },
      'Contrails': { start: '#2193b0', end: '#6dd5ed' },

      // Politics & Governance
      'African Union': { start: '#FF512F', end: '#DD2476' },

      // Default fallback
      'default': { start: '#3A1C71', end: '#FFAF7B' }
    };

    // Return the gradient for the topic or default if not found
    return topicGradients[topic] || topicGradients['default'];
  };
</script>

<template>
  <section class="max-w-7xl mx-auto px-4">
    <!-- Loading Skeleton -->
    <template v-if="pending">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="aspect-[2/1] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
        />
      </div>
    </template>

    <!-- Research Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in researchData.research"
        :key="project.title"
        class="group rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all duration-300"
      >
        <div class="h-full flex flex-col">
          <!-- Modern Gradient Background Instead of Cover Image -->
          <div
            class="h-48 overflow-hidden rounded-t-lg relative flex items-center justify-center transition-all duration-300 group-hover:opacity-90"
            :style="{
              background: `linear-gradient(135deg, ${getGradientColors(project.topics[0]).start} 0%, ${getGradientColors(project.topics[0]).end} 100%)`
            }"
          >
            <div class="absolute inset-0 bg-black bg-opacity-10"></div>
            <!-- First letter of first two topics as a decorative element -->
            <div class="text-white text-opacity-20 font-light text-xl p-2">
              <!-- ransform -rotate-12 -->
              <!-- Causal Structure Analysis for Telemetry Anomaly Detection in
              Spacecraft Systems -->
              {{ project.title }}
              <!-- {{ project.topics[0]?.[0] || 'R'

              }}{{ project.topics[1]?.[0] || 'S' }} -->
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <!-- Conference/Venue and Status in one line -->
            <div class="flex items-center justify-between mb-2">
              <p
                class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[70%]"
              >
                {{ project.venue }}
              </p>
              <span
                :class="statusColors[project.status]"
                class="text-sm font-medium ml-4"
              >
                {{ project.status }}
              </span>
            </div>

            <!-- Title with more space -->
            <h3
              class="text-base font-medium line-clamp-2 group-hover:text-sky-500 transition-colors mb-3"
            >
              {{ project.title }}
            </h3>

            <!-- Topics -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <UBadge
                v-for="topic in project.topics"
                :key="topic"
                color="gray"
                variant="soft"
                size="xs"
              >
                {{ topic }}
              </UBadge>
            </div>

            <!-- Bottom Section -->
            <div class="mt-auto space-y-3">
              <!-- Co-authors and View Paper in one line -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400"
                    >Co-authored with •
                  </span>
                  <UAvatarGroup size="sm" :max="3">
                    <UAvatar
                      v-for="author in project.authors"
                      :key="author.name"
                      :src="author.avatar"
                      :alt="author.name"
                      class="cursor-pointer"
                      @click="() => window.open(author.link, '_blank')"
                    >
                      <template #hover>
                        <UTooltip :text="author.name" />
                      </template>
                    </UAvatar>
                  </UAvatarGroup>
                </div>

                <UButton
                  color="sky"
                  variant="ghost"
                  size="xs"
                  :to="project.paper_link"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Paper
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
