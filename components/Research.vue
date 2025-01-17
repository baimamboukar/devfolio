<script setup>
  const { data: researchData, pending } = await useAsyncData('research', () =>
    queryContent('research').findOne()
  );

  const statusColors = {
    'Ongoing': 'text-yellow-500',
    'Published': 'text-green-500',
    'Under Review': 'text-blue-500',
    'Completed': 'text-purple-500',
    'In Progress': 'text-orange-500'
  };

  const dummyAvatars = [
    { src: "https://github.com/benjamincanac.png", alt: "Benjamin Canac" },
    { src: "https://github.com/romhml.png", alt: "Romain Hamel" },
    { src: "https://github.com/noook.png", alt: "Neil Richter" }
  ];
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
          <!-- Cover Image -->
          <div class="h-48 overflow-hidden rounded-t-lg">
            <img
              :src="project.cover"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <!-- Title and Status in one line -->
            <div class="flex items-center justify-between mb-3">
              <h3
                class="text-base font-medium line-clamp-2 group-hover:text-blue-500 transition-colors flex-1"
              >
                {{ project.title }}
              </h3>
              <span
                :class="statusColors[project.status]"
                class="text-sm font-medium ml-4"
              >
                {{ project.status }}
              </span>
            </div>

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
              <!-- Venue -->
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ project.venue }}
              </p>

              <!-- Co-authors and View Paper in one line -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400"
                    >Co-authored with •●
                  </span>
                  <UAvatarGroup size="sm" :max="3">
                    <UAvatar
                      v-for="avatar in dummyAvatars"
                      :key="avatar.alt"
                      :src="avatar.src"
                      :alt="avatar.alt"
                    >
                      <template #hover>
                        <UTooltip :text="avatar.alt" />
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
