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

    <!-- Certifications Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">Certifications</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UCard
          v-for="cert in data.certifications"
          :key="cert.name"
          class="flex flex-col items-center p-4 hover:bg-gray-900/50 transition-colors duration-300"
        >
          <nuxt-img
            :src="cert.badge"
            :alt="cert.name"
            class="w-24 h-24 mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
          <h3 class="text-center font-medium">{{ cert.name }}</h3>
        </UCard>
      </div>
    </section>

    <section class="mb-12">
      <!-- Leadership Section -->
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-6">Leadership</h2>
        <div class="space-y-6">
          <div
            v-for="(leader, index) in data.leadership"
            :key="leader.role"
            class="relative"
          >
            <!-- Dashed line connector -->
            <div
              v-if="index !== data.leadership.length - 1"
              class="absolute left-6 top-12 bottom-0 w-0.9 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
            />

            <!-- Leadership Item -->
            <div class="flex items-center gap-4">
              <UAvatar
                :src="leader.icon"
                :alt="leader.role"
                size="md"
                class="rounded-lg bg-white dark:bg-gray-800 p-1"
              />
              <div class="flex-1">
                <p class="text-lg">{{ leader.role }}</p>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  ICT University, Yaounde •●• {{leader.period}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">Hackathons</h2>

      <div class="space-y-8">
        <div
          v-for="hackathon in data.hackathons"
          :key="hackathon.name"
          class="relative"
        >
          <!-- Dashed connector line -->
          <div
            v-if="index !== data.hackathons.length - 1"
            class="absolute left-16 top-28 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
          />

          <UCard class="bg-gray-50 dark:bg-gray-900/50">
            <div class="relative">
              <!-- Logo -->
              <UAvatar
                :src="hackathon.logo"
                :alt="hackathon.name"
                size="2xl"
                class="absolute left-4 top-4 rounded-lg bg-white dark:bg-gray-800 p-2"
              />

              <!-- Content -->
              <div class="ml-32 min-h-[160px]">
                <!-- Year badge in top-right -->
                <UBadge
                  color="green"
                  variant="subtle"
                  class="absolute top-4 right-4"
                >
                  {{ hackathon.date }}
                </UBadge>

                <div class="space-y-3 pt-4">
                  <h3 class="text-xl font-semibold">{{ hackathon.name }}</h3>

                  <div class="space-y-1 text-gray-600 dark:text-gray-400">
                    <p>Organized by {{ hackathon.organizer }}</p>
                    <p>{{ hackathon.timeframe }}</p>
                    <p>{{ hackathon.place }}</p>
                  </div>
                </div>

                <!-- View More button in bottom-right -->
                <UButton
                  color="primary"
                  variant="ghost"
                  size="sm"
                  class="absolute bottom-4 right-4"
                >
                  View Details
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">Conferences</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="conf in data.conferences"
          :key="conf.name"
          class="relative group"
        >
          <UCard
            class="overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900 hover:from-primary-100 hover:to-gray-50 dark:hover:from-primary-900 dark:hover:to-gray-900 transition-all duration-300"
          >
            <!-- Top Section -->
            <div class="flex flex-col h-full">
              <!-- Logo and Main Content -->
              <div class="flex gap-4 mb-4">
                <UAvatar
                  :src="conf.logo"
                  :alt="conf.name"
                  size="3xl"
                  class="rounded-lg bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700"
                />
                <div class="flex-1">
                  <h3
                    class="text-xl font-semibold text-gray-900 dark:text-white mb-1"
                  >
                    {{ conf.name }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ conf.place }}, {{ conf.country }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    {{ conf.date }}
                  </p>
                </div>
              </div>

              <!-- Role -->
              <div class="mt-auto">
                <UChip
                  label="Attendee"
                  color="primary"
                  variant="solid"
                  class="text-lg"
                />
              </div>
            </div>

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <UButton color="white" variant="ghost" size="sm">
                View Details
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
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
