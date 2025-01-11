<script setup>
  // Define page metadata for SEO purposes

  definePageMeta({
    title: "About",
    description: "Learn more about Baimam Boukar, his interests, education, experience, and achievements.",
  });

  // Fetch the content data from the `about.yaml` file using Nuxt Content

  const { data } = await useAsyncData('about', () => queryContent('about').findOne());

  // Define tabs for navigation between sections like Research, Achievements, etc.

  const activeTab = ref('research'); // Default tab
  const tabs = [
    { name: 'research', label: 'Research', icon: 'i-heroicons-academic-cap' },
    { name: 'achievements', label: 'Achievements', icon: 'i-heroicons-trophy' },
    { name: 'community', label: 'Community', icon: 'i-heroicons-users' },
    { name: 'certifications', label: 'Certifications', icon: 'i-heroicons-document-check' },
    { name: 'conferences', label: 'Conferences', icon: 'i-heroicons-presentation-chart-bar' },
    { name: 'hackathons', label: 'Hackathons', icon: 'i-heroicons-command-line' },
  ];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Summary Section -->
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-6">Baimam Boukar</h1>
      <p class="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ data.overview }}
      </p>
      <UDivider class="my-8" />
    </section>

    <!-- Interests Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Interests</h2>
      <UPageGrid>
        <UPageCard
          v-for="interest in data.interests"
          description="Interest"
          :key="interest.name"
          :title="interest.name"
          :icon="interest.icon"
          class="cursor-pointer"
        />
      </UPageGrid>
    </section>

    <!-- Education Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Education</h2>
      <div class="space-y-8">
        <div
          v-for="(edu, index) in data.education"
          :key="index"
          class="relative"
        >
          <!-- Timeline dashed line - centered at 24px from left -->
          <div
            v-if="index !== data.education.length - 1"
            class="absolute left-12 top-24 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
          />

          <!-- Education Card with properly centered avatar -->
          <UCard class="ml-24">
            <template #header>
              <div class="flex items-center gap-6">
                <!-- Avatar container centered on dashed line -->
                <div
                  class="absolute -lef-10 bg-white dark:bg-gray-900 rounded-full p-1"
                  style="transform: translateX(-130%)"
                >
                  <UAvatar
                    :src="edu.icon"
                    :alt="edu.institution"
                    size="3xl"
                    class="border-1 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div>
                  <h3 class="text-xl font-semibold">{{ edu.degree }}</h3>
                  <p class="text-base text-gray-600 dark:text-gray-400">
                    {{ edu.institution }} ●•
                    <UBadge
                      color="niagara"
                      variant="soft"
                      size="lg"
                      >{{ edu.period }}</UBadge
                    >
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    {{ edu.specialization }}
                  </p>
                </div>
              </div>
            </template>
            <i
              >Intensive 24-month master degree program in Carnegie Mellon
              University's College of Engineering, CMU Africa.</i
            >
          </UCard>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">Professional Experience</h2>
      <div class="grid gap-8">
        <div v-for="(exp, index) in data.experience" :key="index">
          <UCard
            class="overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-300"
            :ui="{ body: { padding: 'p-0' } }"
          >
            <!-- Main Content -->
            <div class="p-6">
              <!-- Header with Logo and Title -->
              <div class="flex flex-col md:flex-row gap-6 items-start">
                <UAvatar
                  :src="exp.icon"
                  :alt="exp.company"
                  size="2xl"
                  class="rounded-lg bg-white dark:bg-gray-800 p-2"
                />
                <div class="flex-1">
                  <div
                    class="flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <h3
                        class="text-xl font-bold text-primary-600 dark:text-primary-400"
                      >
                        {{ exp.title }}
                      </h3>
                      <p class="text-lg font-medium">{{ exp.company }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-map-pin" class="text-gray-500" />
                      <span
                        class="text-gray-600 dark:text-gray-400"
                        >{{ exp.location }}</span
                      >
                    </div>
                  </div>
                  <UBadge color="gray" variant="soft" class="mt-2">
                    {{ exp.period }}
                  </UBadge>
                </div>
              </div>

              <!-- Expandable Responsibilities -->
              <UButton
                v-if="exp.responsibilities"
                color="gray"
                variant="ghost"
                class="mt-4 w-full justify-between group"
                @click="exp.isOpen = !exp.isOpen"
              >
                <span>Key Responsibilities</span>
                <UIcon
                  :name="exp.isOpen ? 'i-heroicons-minus-small' : 'i-heroicons-plus-small'"
                  class="transition-transform"
                />
              </UButton>
            </div>

            <!-- Responsibilities Section -->
            <UCollapse :model-value="exp.isOpen">
              <div class="px-6 pb-6 space-y-3">
                <div
                  v-for="(resp, rIndex) in exp.responsibilities"
                  :key="rIndex"
                  class="flex gap-3 items-start"
                >
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="flex-shrink-0 mt-1 text-primary-500"
                  />
                  <p class="text-gray-700 dark:text-gray-300">{{ resp }}</p>
                </div>
              </div>
            </UCollapse>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Tabbed Sections for Remaining Data -->
    <section class="mb-12">
      <!-- Horizontal navigation for tabs -->
      <UHorizontalNavigation v-model="activeTab" :items="tabs" />

      <!-- Dynamic content based on active tab -->
      <div v-if="activeTab === 'research'" class="grid gap-6">
        <!-- Research Section -->
        <UCard
          v-for="research in data.research"
          :key="research.title"
          class="hover:shadow-lg transition-shadow duration-200"
        >
          <template #header>
            <div class="flex gap-4">
              <!-- Research cover image -->
              <img
                :src="research.cover"
                :alt="research.title"
                class="w-24 h-24 object-cover rounded"
              />
              <!-- Research details -->
              <div>
                <h3 class="text-lg font-medium">{{ research.title }}</h3>
                <p class="text-sm text-gray-600">{{ research.supervision }}</p>
              </div>
            </div>
          </template>

          <!-- Topics and status badges -->
          <div class="space-y-2">
            <!-- Topics as badges -->
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="topic in research.topics"
                :key="topic"
                color="primary"
                variant="soft"
                >{{ topic }}</UBadge
              >
            </div>

            <!-- Status and paper link -->
            <div class="flex justify-between text-sm">
              <UBadge
                :color="{ Published: 'green', Ongoing: 'blue' }[research.status] || 'gray'"
                >{{ research.status }}</UBadge
              >
              <a
                v-if="research.paper_link"
                :href="research.paper_link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
                >View Paper</a
              >
            </div>
          </div>
        </UCard>
      </div>

      <!-- Achievements Tab -->
      <!-- Add similar logic for achievements, certifications, conferences, and hackathons here -->
    </section>
  </div>
</template>

<style scoped>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
